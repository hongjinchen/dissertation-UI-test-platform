import React from "react";
import {
  makeStyles,
  Paper,
  Grid,
  Typography,
  Button,
} from "../components/muiComponents";
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflowX: 'auto',
    maxHeight: '160px',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    backgroundColor: theme.palette.secondary.main,
  },
  tutorialName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  tutorialArea: {
    fontSize: "1rem",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  tutorialLink: {
    color: "#fff",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  gridContainer: {
    height: "auto", 
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  formContainer: {
    minWidth: 0,
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();
  const tutorial = [
    {
      name: "HTML Basics",
      area: "Basics instructions",
      path: "/tutorial3",
    },
    {
      name: "Locator Selection",
      area: "Website instructions",
      path: "/tutorial1",
    },
    {
      name: "User Behavior Guide",
      area: "Website instructions",
      path: "/tutorial2",
    },
    {
      name: "GWT UI Testing Platform Introduction",
      area: "Website instructions",
      path: "/tutorial4",
    },
  ];

  return (
    <div className={classes.root}>
    <Grid container spacing={3} className={classes.gridContainer}>
      {tutorial.map((tutorial, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper className={classes.paper}>
            <Typography className={classes.tutorialName}>
              {tutorial.name}
            </Typography>
            <Typography className={classes.tutorialArea}>
              {tutorial.area}
            </Typography>
            <Link to={tutorial.path} className={classes.tutorialLink}>
              <Button 
                variant="contained" 
                color="primary"
                className={classes.tutorialButton}
              >
                View Tutorial
              </Button>
            </Link>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </div>
  );
}
