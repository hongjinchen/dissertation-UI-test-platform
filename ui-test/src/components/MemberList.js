import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Link,
  ButtonBase,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  listItemLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  typeText: {
    overflow: "hidden", // 隐藏溢出的文本
    textOverflow: "ellipsis", // 文本溢出时显示省略号
    whiteSpace: "nowrap", // 不换行
  },
  listItemButton: {
    width: '100%',
    display: 'block',
    textAlign: 'inherit',
  },
}));


export default function MemberList({ data }) {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {data.map((member) => (
        <Link
          key={member.user_id}
          component={RouterLink}
          to={`/userCenter/${member.user_id}`}
          className={classes.listItemLink}
        >
          <ButtonBase className={classes.listItemButton}>
            <ListItem divider>
              <ListItemAvatar>
                <Avatar src={member.avatar_link} />
              </ListItemAvatar>
              <ListItemText primary={member.username} secondary={member.role} />
            </ListItem>
          </ButtonBase>
        </Link>
      ))}
    </List>
  );
}
