import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { findIndex } from "lodash";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@mui/material/TextField";
import Slide from "@material-ui/core/Slide";
import Task from "./Task";


const TaskList = ({ list, moveTask, taskLists, setTaskLists, saveData }) => {
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
        setTestID("");
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


export default TaskList;