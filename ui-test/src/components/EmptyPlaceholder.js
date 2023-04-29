import React from 'react';

import {
  makeStyles,
} from '@material-ui/core/styles';
import { Box,Typography } from '@material-ui/core';

import InboxIcon from '@material-ui/icons/Inbox';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    textAlign: 'center',
  },
  icon: {
    fontSize: theme.spacing(20),
    marginBottom: theme.spacing(2),
    color: 'lightgrey', // 设置图标颜色为浅灰色
  },
  text: {
    color: 'lightgrey', // 设置文字颜色为浅灰色
  },
}));

const EmptyPlaceholder = ({ text = 'No content to display.' }) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <InboxIcon className={classes.icon} />
      <Typography variant="h6">{text}</Typography>
    </Box>
  );
};

export default EmptyPlaceholder;
