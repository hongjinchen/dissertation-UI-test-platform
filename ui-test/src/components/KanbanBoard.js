// KanbanBoard.js
import React, { useState,useEffect } from "react";
// import TaskList from './TaskList';
// import Task from "./Task";
import { useDrop } from "react-dnd";
import { useDrag } from "react-dnd";
import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { findIndex } from "lodash";
import { Button } from "@material-ui/core";

function generateData(listCount, taskCount) {
  const data = [];

  for (let i = 1; i <= listCount; i++) {
    const list = {
      id: i,
      name: `List ${i}`,
      tasks: [],
    };

    for (let j = 1; j <= taskCount; j++) {
      const task = {
        id: j + (i - 1) * taskCount,
        text: `Task ${j} of List ${i}`,
      };
      list.tasks.push(task);
    }

    data.push(list);
  }

  return data;
}

const data = generateData(4, 3);

const TaskList = ({ list, moveTask, taskLists, setTaskLists }) => {
  // 拖拽组件
  const [{ isOver }, drop] = useDrop({
    accept: "task",
    drop: (item) => moveTask(item.id, list.id),
    hover: (item, monitor) => {
      const draggedTaskId = item.id;
      if (list.id !== item.listId) {
        return;
      }

      const hoveredIndex = findIndex(list.tasks, { id: draggedTaskId });
      const draggingIndex = monitor.getClientOffset().y;

      if (hoveredIndex !== draggingIndex) {
        const newTaskLists = [...taskLists];
        const task = newTaskLists
          .find((l) => l.id === list.id)
          .tasks.splice(hoveredIndex, 1)[0];
        newTaskLists
          .find((l) => l.id === list.id)
          .tasks.splice(draggingIndex, 0, task);
        setTaskLists(newTaskLists);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // 判定弹窗是否打开
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    console.log(taskLists);
  }, [taskLists]);
  const handleClickOpen = () => {
    setOpen(true);
    console.log(list);
  };
  const handleClose = () => {
    setOpen(false);
    setNewEvent("");
  };

  const saveInput = () => {
    setOpen(false);
    const updatedData = taskLists.map((item) => {
      if (item.id === list.id) {
        return {
          ...item,
          tasks: [
            ...item.tasks,
            {
              id: item.tasks.length + 1,
              text: newEvent,
            },
          ],
        };
      } else {
        return item;
      }
    });
  
    setTaskLists(updatedData);
    setNewEvent("");
    console.log(taskLists);
  };
  const [newEvent, setNewEvent] = useState("");
  return (
    <Card
      ref={drop}
      sx={{
        minWidth: 275,
        margin: 2,
        backgroundColor: isOver ? "lightgrey" : "white",
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {list.name}
        </Typography>
        <Box>
          {list.tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </Box>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add Issue
        </Button>
        <Dialog
          open={open}
          TransitionComponent={Slide}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Add a new event"}
          </DialogTitle>
          <TextField
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            required
          ></TextField>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={saveInput} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const Task = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div>
      <Card
        ref={drag}
        sx={{
          margin: 1,
          backgroundColor: isDragging ? "lightgrey" : "white",
        }}
      >
        <CardContent>
          <Box component="span">{task.text}</Box>
        </CardContent>
      </Card>
    </div>
  );
};

const KanbanBoard = () => {
  const [taskLists, setTaskLists] = useState(data);

  const moveTask = (taskId, newListId) => {
    const newTaskLists = [...taskLists];
    let task;
    newTaskLists.forEach((list) => {
      const taskIndex = list.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        task = list.tasks.splice(taskIndex, 1)[0];
      }
    });
    newTaskLists.find((list) => list.id === newListId).tasks.push(task);
    setTaskLists(newTaskLists);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-around"
      marginTop={4}
    >
      {taskLists.map((list) => (
        <TaskList
          key={list.id}
          list={list}
          moveTask={moveTask}
          taskLists={taskLists}
          setTaskLists={setTaskLists}
        />
      ))}
    </Box>
  );
};

export default KanbanBoard;
