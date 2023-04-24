// KanbanBoard.js
import React, { useState, useEffect, } from "react";
import { useParams } from 'react-router-dom';
import { useDrop } from "react-dnd";
import { useDrag } from "react-dnd";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import { findIndex } from "lodash";
import { Button } from "@material-ui/core";
import { Menu, MenuItem } from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import CircularProgress from '@mui/material/CircularProgress';


const TaskList = ({ list, moveTask, taskLists, setTaskLists, saveData }) => {
  // 拖拽组件
  const { id } = useParams();
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
        saveData();
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // 判定弹窗是否打开
  const [open, setOpen] = React.useState(false);
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
              testcase: TestID,
            },
          ],
        };
      } else {
        return item;
      }
    });

    setTaskLists(updatedData);
    setNewEvent("");
    saveData(); // 调用 saveData 函数
    // console.log(taskLists);
  };
  const [newEvent, setNewEvent] = useState("");
  const [TestID, setTestID] = useState("");
  const updateTaskText = (taskId, newText) => {
    setTaskLists((prevTaskLists) =>
      prevTaskLists.map((list) => ({
        ...list,
        tasks: list.tasks.map((task) =>
          task.id === taskId ? { ...task, text: newText } : task
        ),
      }))
    );
    saveData();
  };

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
        <Typography variant="h6" component="div">
          {list.name}
        </Typography>
        <Box>
          {list.tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              taskLists={taskLists}
              setTaskLists={setTaskLists}
              updateTaskText={updateTaskText}
              saveData={saveData}
            />
          ))}
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add Issue
          </Button>
        </Box>

        <Dialog
          open={open}
          TransitionComponent={Slide}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            Add a new issue
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Issue name"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Related test case"
              value={TestID}
              onChange={(e) => setTestID(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
          </DialogContent>
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

const Task = ({ task, taskLists, setTaskLists, updateTaskText, saveData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  useEffect(() => { }, [isEditing]);
  useEffect(() => {
    console.log(taskLists);
  }, [taskLists]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    const updatedTaskLists = taskLists.map((list) => {
      return {
        ...list,
        tasks: list.tasks.filter((t) => t.id !== task.id),
      };
    });
    setTaskLists(updatedTaskLists);
    handleClose();
    saveData();
  };

  const handleTextChange = (e) => {
    setEditedText(e.target.value);
  };

  const saveEditedText = () => {
    console.log("Save edited text");
    updateTaskText(task.id, editedText);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      saveEditedText();
    }
  };

  const handleEdit = (event) => {
    event.stopPropagation(); // 阻止事件继续传播
    setIsEditing(true);
  };
  return (
    <div>
      <Card
        ref={drag}
        sx={{
          margin: 1,
          backgroundColor: isDragging ? "lightgrey" : "white",
        }}
      >
        {isEditing ? (
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <TextField
                  value={editedText}
                  onChange={handleTextChange}
                  onKeyPress={handleKeyPress}
                  // onBlur={handleBlur}
                  autoFocus
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
              </Grid>
            </Grid>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
              <MenuItem onClick={(event) => handleEdit(event)}>Edit</MenuItem>
              <MenuItem component={Link} to={`/testReport/${task.id}`}>
                View Test Results
              </MenuItem>
            </Menu>
          </CardContent>
        ) : (
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <Box component="span">{task.text}</Box>
              </Grid>

              <Grid item xs={4}>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
              </Grid>
            </Grid>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
              <MenuItem onClick={(event) => handleEdit(event)}>Edit</MenuItem>
              <MenuItem component={Link} to={`/testReport/${task.id}`}>
                View Test Results
              </MenuItem>
            </Menu>
          </CardContent>
        )}
      </Card>
    </div>
  );
};


const KanbanBoard = () => {
  const [taskLists, setTaskLists] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  }, [taskLists]);

  useEffect(() => {
    const fetchTaskLists = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_BASE_URL + '/tasklists/' + id);
        console.log("Fetching task lists!");
        console.log("Team ID:", id);
        console.log("API Base URL:", API_BASE_URL);
        console.log("Response:", response.data);
        setTaskLists(response.data)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching task lists:', error);
        setLoading(false);
      }
    };

    fetchTaskLists();
  }, [id]);

  const saveData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(API_BASE_URL + "/saveTask", {
        taskLists: taskLists.map(({ id, name, tasks }) => ({ name, tasks })),
        team_id: id,
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Error saving task data");
      }
    } catch (error) {
      console.error("Failed to save task data:", error);
      setLoading(false);
    }
  };

  // 判定弹窗是否打开
  const [open, setOpen] = React.useState(false);

  const handleAddTaskList = () => {
    const newTaskList = [
      ...taskLists,
      { id: uuidv4(), name: NewTask, tasks: [] },
    ];
    setTaskLists(newTaskList);
    setNewTask("");
    setOpen(false);
    saveData();
  };
  const [NewTask, setNewTask] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setNewTask("");
  };

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
    setOpen(false);
    saveData();
  };

  const taskListWidth = 300; // 设置每个任务列表的宽度
  const totalWidth = taskLists.length * taskListWidth; // 计算所有任务列表的总宽度
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
    {loading && (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          background: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <CircularProgress />
      </div>
    )}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{
          borderRadius: "20px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          fontWeight: 600,
          textTransform: "none",
          ":active": {
            boxShadow: "none",
            transform: "translateY(1px)",
          },
        }}
        onClick={handleClickOpen}
        style={{ position: "fixed", top: "10vh", left: "40vh", width: "200px" }} // 设置样式
      >
        Add a task list
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Slide}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        sx={{ "& .MuiDialogTitle-root": { paddingBottom: 0 } }}
      >
        <DialogTitle id="alert-dialog-slide-title">
          Add a new task list
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Task list name"
            value={NewTask}
            onChange={(e) => setNewTask(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddTaskList} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {taskLists.length === 0 ? (
        <Empty />
      ) : (
        <div style={{ padding: "5vh", width: totalWidth }}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
            marginTop={4}
          >
            {taskLists.map((list) => (
              <TaskList
                id={id}
                key={list.id}
                list={list}
                moveTask={moveTask}
                taskLists={taskLists}
                setTaskLists={setTaskLists}
                saveData={saveData}
              />
            ))}
          </Box>
        </div>
      )}
    </div>
  );
};

const Empty = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>No content</h2>
      <p>Please add a task list to get started with Kanban</p>
    </div>
  );
};


export default KanbanBoard;
