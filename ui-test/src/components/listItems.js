import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import ErrorIcon from '@mui/icons-material/Error';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@material-ui/icons/People';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

export const MainListItems = ({ id }) => {
  const token = Cookies.get('token');
  console.log("MainListItems", id);
  useEffect(() => {
  }, [token]);

  return (
    <div>
      <ListItem button component={Link} to="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      {token && (
        <ListItem button component={Link} to={`/userCenter/${id}`}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="User Center" />
        </ListItem>
      )}
    </div>
  );
};

export function SecondaryListItems({ id }) {
  return (
    <div>
      <ListItem button component={Link} to="/">
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Return" />
      </ListItem>

      <ListItem button component={Link} to={`/group/${id}`}>
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary="Group Overview" />
      </ListItem>

      <ListItem button component={Link} to={`/script/${id}`}>
        <ListItemIcon>
          <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary="Test Case Management" />
      </ListItem>

      <ListItem button component={Link} to={`/issue/${id}`}>
        <ListItemIcon>
          <ErrorIcon />
        </ListItemIcon>
        <ListItemText primary="Issue Management" />
      </ListItem>

      <ListItem button component={Link} to={`/team/${id}`}>
        <ListItemIcon>
        <SupervisorAccountIcon />
        </ListItemIcon>
        <ListItemText primary="Team Management" />
      </ListItem>
    </div>
  )

};