import React from "react";
import {
  makeStyles,
  Paper,
  Grid,
  Typography,
  Button,
} from "../components/muiComponents";

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
    justifyContent: "space-between",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    backgroundColor: "#333",
    color: "#fff",
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
}));

export default function CenteredGrid() {
  const classes = useStyles();
  const tutorial = [
    {
      name: "Tutorial 1",
      area: "E-commerce",
      url: "https://www.example.com/tutorial1",
    },
    {
      name: "Tutorial 2",
      area: "E-commerce",
      url: "https://www.example.com/tutorial2",
    },
    {
      name: "Tutorial 3",
      area: "E-commerce",
      url: "https://www.example.com/tutorial3",
    },
  ];
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5">Tutorials</Typography>
        </Grid>
        {tutorial.map((tutorial, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper className={classes.paper}>
              <div>
                <Typography
                  variant="h6"
                  align="left"
                  className={classes.tutorialName}
                >
                  {tutorial.name}
                </Typography>
                <Typography
                  variant="body1"
                  align="left"
                  className={classes.tutorialArea}
                >
                  {tutorial.area}
                </Typography>
              </div>
              <a href={tutorial.url} className={classes.tutorialLink}>
                <Button variant="contained" color="primary">
                  View Tutorial
                </Button>
              </a>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
