import React, { useState } from "react";
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import  { randomColor }  from "../theme/RamdomColor";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: 200,
    flexGrow: 1,
    // backgroundColor: randomColor(),
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  typeText: {
    overflow: "hidden", // 隐藏溢出的文本
    textOverflow: "ellipsis", // 文本溢出时显示省略号
    whiteSpace: "nowrap", // 不换行
  },
}));


const KanbanPreview = ({ data }) => {
  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={3}>
        {data.map((item) => (
          <Grid item key={item.id}>
            <Card className={classes.card}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  className={classes.typeText}
                >
                  {item.type}
                </Typography>
                <Typography variant="body2" component="p">
                  Count: {item.count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default KanbanPreview;
