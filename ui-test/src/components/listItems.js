import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link } from "react-router-dom";

export const mainListItems = (
  <div>
      <ListItem button component={Link} to="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>

      <ListItem button component={Link} to="/userCenter">
        <ListItemIcon>
        <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="User Center" />
      </ListItem>
  </div>
);


export const secondaryListItems = (
  <div>
    <ListItem button component={Link} to="/">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Return" />
    </ListItem>

    <ListItem button  component={Link} to="/group">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Statistics" />
    </ListItem>

    <ListItem button  component={Link} to="/script">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Script Management" />
    </ListItem>

    <ListItem button  component={Link} to="/issue">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Issue management" />
    </ListItem>
  </div>
);