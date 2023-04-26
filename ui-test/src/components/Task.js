import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Box
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";

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
  
  export default Task;