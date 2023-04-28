import React, { useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import GroupIcon from '@material-ui/icons/Group';
import DescriptionIcon from '@material-ui/icons/Description';
import ErrorIcon from '@material-ui/icons/Error';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

export const MainListItems = ({ id }) => {
  const token = Cookies.get('token');
  console.log("MainListItems", id);
  useEffect(() => {
    //需要监控 token 是否为空
    // console.log("Token changed:", token);
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
    </div>
  )

};