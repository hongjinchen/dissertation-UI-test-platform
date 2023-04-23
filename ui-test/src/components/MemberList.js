import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  typeText: {
    overflow: "hidden", // 隐藏溢出的文本
    textOverflow: "ellipsis", // 文本溢出时显示省略号
    whiteSpace: "nowrap", // 不换行
  },
}));


export default function MemberList({ data }) {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      
      {data.map((member) => (
        <ListItem divider>
          <ListItemAvatar>
            <Avatar src={member.avatar_link} />
          </ListItemAvatar>
          <ListItemText
            primary={member.username}
            secondary={member.role}
          />
        </ListItem>
      ))}
    </List>
  );
}
