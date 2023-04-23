import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@material-ui/core";
import CalendarHeatmap from "react-calendar-heatmap";
import Navigation from "../components/navigation";

import "react-calendar-heatmap/dist/styles.css";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Cookies from 'js-cookie';
import { fetchUserData, updateUserInfo, updateUserPassword, updateEmail } from '../api';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },

  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: "20vh",
  },
}));
function UserCenter() {
  // user information
  const [username, setNickname] = useState("");
  const [email, setEmail] = useState("");

  const [avatar, setAvatar] = useState("https://via.placeholder.com/150");
  // control the dialogs
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUpdateEmail, setShowUpdateEmail] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isOwner, setIsOwner] = useState(true);

  // 在useState声明部分下方添加表单状态
  const [form, setForm] = useState({
    username: '',
    personalIntroduction: '',
  });
  // 更新handleSave函数以调用updateUserInfo
  const handleSave = async () => {
    const updatedData = await updateUserInfo(Cookies.get('userId'), form.username, form.personalIntroduction);

    if (updatedData) {
      setNickname(updatedData.username);
      // 更新其他需要的数据，例如个人简介
      setShowEditInfo(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }
    const response = await updateUserPassword(Cookies.get('userId'), oldPassword, newPassword);
    console.log(response);
    if (response.status === "success") {
      alert("Password changed successfully");
      setShowChangePassword(false);
    } else {
      alert(response.error);
    }
  };

  const handleUpdateEmail = async () => {
    const newEmail = document.getElementById('new-email').value;
    const response = await updateEmail(Cookies.get('userId'), newEmail);

    if (response.status === 'success') {
      alert('Email updated successfully');
      setShowUpdateEmail(false);
    } else {
      alert(response.message);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token')
    setIsLoggedIn(false);
    setTimeout(() => {
      window.location.href = "/"
    }, 2000)
  };

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUserData(Cookies.get('userId'));

      if (userData) {
        setNickname(userData.username);
        setEmail(userData.email);
        setAvatar(userData.avatar);
      }
    };

    getUserData();
  }, [showEditInfo, showUpdateEmail]); // 添加空数组以确保仅在组件挂载时运行

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  if (!isLoggedIn) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#DCA690",
          color: "#ffffff",
          fontSize: "2rem",
          zIndex: 9999,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span role="img" aria-label="wave">
            👋
          </span>{" "}
          You have logged out.
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Navigation title="User Center" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* User information display */}

            <Grid item xs={12} sm={6}>
              <Paper className={fixedHeightPaper}>
                <Typography variant="h6">My information</Typography>
                <Box display="flex" alignItems="center">
                  <Avatar src={avatar} />
                  <Box ml={2}>
                    <Typography>username: {username}</Typography>
                    <Typography>Email: {email}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Edit information */}
            {isOwner && (
              <Grid item xs={12} sm={6}>
                <List aria-label="main mailbox folders">
                  <ListItem button onClick={() => setShowEditInfo(true)}>
                    <ListItemText primary="Edit personal information" />
                  </ListItem>
                  <ListItem button onClick={() => setShowChangePassword(true)}>
                    <ListItemText primary="Change password" />
                  </ListItem>
                  <ListItem button onClick={() => setShowUpdateEmail(true)}>
                    <ListItemText primary="Manage email" />
                  </ListItem>
                  <ListItem button onClick={handleLogout}>
                    <ListItemText primary="Log out" />
                  </ListItem>
                </List>
              </Grid>
            )}

            {/* Contribution Graph */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h6">Contribution Graph</Typography>
                <CalendarHeatmap
                  startDate={new Date("2022-01-01")}
                  endDate={new Date("2022-12-31")}
                  values={[
                    { date: "2022-01-01", count: 12 },
                    { date: "2022-01-02", count: 5 },
                    { date: "2022-01-03", count: 8 },
                    // ...
                  ]}
                  classForValue={(value) => {
                    if (!value) {
                      return "color-empty";
                    }
                    return `color-github-${Math.min(value.count, 4) + 1}`;
                  }}
                  tooltipDataAttrs={(value) => {
                    return {
                      "data-tip": `${value.date} has ${value.count} contributions`,
                    };
                  }}
                  showWeekdayLabels
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Corresponding modification pop-ups */}
          <Dialog open={showEditInfo} onClose={() => setShowEditInfo(false)}>
            <DialogTitle>Edit personal information</DialogTitle>
            <DialogContent>
              <form>
                {/* // 更新文本字段以使用表单状态 */}
                <TextField
                  label="username"
                  placeholder="New username"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                <TextField
                  label="Personal introduction"
                  placeholder="This is a simple personal introduction"
                  fullWidth
                  margin="normal"
                  multiline
                  onChange={(e) => setForm({ ...form, personalIntroduction: e.target.value })}
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSave} color="primary">
                Save
              </Button>
              <Button onClick={() => setShowEditInfo(false)} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={showChangePassword}
            onClose={() => setShowChangePassword(false)}
          >
            <DialogTitle>Change password</DialogTitle>
            <DialogContent>
              <form>
                <TextField
                  label="Old password"
                  type="password"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <TextField
                  label="New password"
                  type="password"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  label="Confirm new password"
                  type="password"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleChangePassword} color="primary">
                Change password
              </Button>
              <Button
                onClick={() => setShowChangePassword(false)}
                color="secondary"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={showUpdateEmail}
            onClose={() => setShowUpdateEmail(false)}
          >
            <DialogTitle>Manage email</DialogTitle>
            <DialogContent>
              <form>
                <TextField
                  id="new-email"
                  label="New email address"
                  fullWidth
                  margin="normal"
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdateEmail} color="primary">
                Update email
              </Button>
              <Button
                onClick={() => setShowUpdateEmail(false)}
                color="secondary"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </main>
    </div>
  );
}

export default UserCenter;
