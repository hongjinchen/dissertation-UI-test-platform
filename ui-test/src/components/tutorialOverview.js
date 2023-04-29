import React from "react";
import {
  makeStyles,
  Paper,
  Grid,
  Typography,
  Button,
} from "../components/muiComponents";
import { TextField } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
  gridContainer: {
    height: "auto", // 使高度自适应内容
    overflowY: "auto", // 如果内容超出最大高度，则显示滚动条
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center", // 垂直居中对齐
    width: "100%",
  },
  formContainer: {
    minWidth: 0, // 为了防止表单元素挤压其他内容
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
      <Grid container spacing={3} className={classes.gridContainer}>
        <Grid item xs={12} className={classes.header}>
          <Typography variant="h5">Tutorials</Typography>
          <form className={classes.formContainer} noValidate autoComplete="off">
            <TextField
              id="standard-basic"
              label="Search"
              placeholder="Enter the name of group"
            />
          </form>
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
