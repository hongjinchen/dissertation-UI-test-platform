import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Paper,
  Grid,
  Button,
  Typography,
  Box,
} from "../components/muiComponents";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CreatGroup from "./CreatGroup";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
  },
  groupName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  groupTime: {
    fontSize: "1rem",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  groupLink: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  textFieldContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();
  const groups = [
    { name: "Group 1", time: "2023-04-05 10:00:00", testCaseNumber: 5 },
    { name: "Group 2", time: "2023-04-05 12:00:00", testCaseNumber: 3 },
    { name: "Group 3", time: "2023-04-05 14:00:00", testCaseNumber: 7 },
  ];
  // useEffect(() => {}, [groups]);
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5">Group Space</Typography>
        </Grid>
        <Grid item xs={12} className={classes.textFieldContainer}>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="standard-basic"
              label="Search"
              placeholder="Enter the name of group"
            />
          </form>
        </Grid>

        <Grid item xs={3}>
          <CreatGroup></CreatGroup>
        </Grid>

        {groups.map((group, index) => (
          <Grid item xs={3} key={index}>
            <Paper className={classes.paper}>
              <div>
                <Typography
                  variant="h6"
                  align="left"
                  className={classes.groupName}
                >
                  {group.name}
                </Typography>
                <Typography
                  variant="body1"
                  align="left"
                  className={classes.groupTime}
                >
                  {group.time}
                </Typography>
              </div>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/group"
              >
                View
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
