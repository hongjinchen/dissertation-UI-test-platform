import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { API_BASE_URL } from '../config';
import axios from 'axios';
import EmptyPlaceholder from './EmptyPlaceholder';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: 200,
    flexGrow: 1,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  typeText: {
    overflow: "hidden", // 隐藏溢出的文本
    textOverflow: "ellipsis", // 文本溢出时显示省略号
    whiteSpace: "nowrap", // 不换行
  },
}));


const KanbanPreview = ({ data, id }) => {
  const classes = useStyles();
  const [taskLists, setTaskLists] = useState([]);

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const response = await axios.get(API_BASE_URL + '/tasklists/' + id);
        setTaskLists(response.data)
      } catch (error) {
        console.error('Error fetching task lists:', error);
      }
    };

    fetchTaskLists();
  }, [id]);
  return (
    <div>
      {taskLists.length === 0 ? (
        <EmptyPlaceholder text="The current team has no issues that need to be addressed." />
      ) : (
        <Grid container spacing={3}>
          {taskLists.map((item) => (
            <Grid item key={item.id}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h2"
                    className={classes.typeText}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Count: {item.tasks.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default KanbanPreview;
