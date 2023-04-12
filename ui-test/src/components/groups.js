import React from "react";
import {
  makeStyles,
  Paper,
  Grid,
  Button,
  Typography,
} from "../components/muiComponents";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
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
    color: theme.palette.primary.main,
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
          <Paper
            className={classes.paper}
            style={{ backgroundColor: "#ffcc33" }}
          >
            <AddIcon />
            <Button variant="contained" color="primary">
              Create a new group
            </Button>
          </Paper>
        </Grid>

        {groups.map((group, index) => (
          <Grid item xs={3} key={index}>
            <Paper
              className={classes.paper}
              style={{ backgroundColor: "#4CAF50" }}
            >
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

              {/* <a href="#" className={classes.groupLink}> */}
                <Button variant="outlined" color="primary"  component={Link} to="/group">
                  View Group
                </Button>
              {/* </a> */}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
