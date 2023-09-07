// React相关
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
// Material UI组件库
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
  DialogContentText,
  CircularProgress
} from "@material-ui/core";
// 第三方React组件库
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

// 自定义React组件
import Navigation from "../components/navigation";
// 样式相关库
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
// Cookies库
import Cookies from 'js-cookie';
// API调用
import { fetchUserData, updateUserInfo, updateUserPassword, updateEmail, fetchUserContributions } from '../api';

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
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoAvatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    boxShadow: theme.shadows[3],
  },
  infoBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function UserCenter() {
  const { id } = useParams();
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

  const [errorDialog, setErrorDialog] = useState({
    open: false,
    message: ''
  });

  const [isLoading, setIsLoading] = useState(true);

  // user contribution
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  const [contributions, setContributions] = useState([]);
  useEffect(() => {
    const getUserContributions = async () => {
      setIsLoading(true);
      const contributionData = await fetchUserContributions(id);
      console.log("contributionData",contributionData)
      if (contributionData) {
        setContributions(contributionData);
      }
      setIsLoading(false);
    };

    getUserContributions();
  }, [id]);

  useEffect(() => {
    const getUserData = async () => {
      setIsLoading(true);
      const userData = await fetchUserData(id);
      if (userData) {
        setNickname(userData.username);
        setEmail(userData.email);
        setAvatar(userData.avatar);
      }
      setIsLoading(false);
    };

    setIsOwner(id === Cookies.get('userId'));
    getUserData();
  }, [showEditInfo, showUpdateEmail, id]);

  // 在useState声明部分下方添加表单状态
  const [form, setForm] = useState({
    username: '',
  });
  
  // 更新handleSave函数以调用updateUserInfo
  const handleSave = async () => {
    const updatedData = await updateUserInfo(Cookies.get('userId'), form.username);

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

    if (response.status === "success") {
      alert("Password changed successfully");
      setShowChangePassword(false);
    } else {
      // 打开错误信息Dialog
      setErrorDialog({
        open: true,
        message: response.error || 'Unknown error occurred'
      });
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
  // 检查isLoading状态，如果是true就返回加载指示器
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  // 数据加载完成后返回用户中心的主要内容
  return (
    <div className={classes.root}>
      <Navigation title="User Center" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* User information display */}
            <Grid item xs={12} sm={12} md={isOwner ? 6 : 12}>
              <Paper className={fixedHeightPaper}>
                <Box className={classes.infoContainer}>
                  <Avatar src={avatar} className={classes.infoAvatar} />
                  <Box ml={2} className={classes.infoBox}>
                    <Typography>username: {username}</Typography>
                    <Typography>Email: {email}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Edit information */}
            {isOwner && (
                    <Grid item xs={12} sm={12} md={6}>
                <List aria-label="main mailbox folders">
                  <ListItem button onClick={() => setShowEditInfo(true)}>
                    <ListItemText primary="Edit user name" />
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
            <Grid item xs={12} sm={12} md={12}>
              <Paper className={classes.paper}>
                <Typography variant="h6">Contribution Graph</Typography>
                <CalendarHeatmap
                  startDate={startDate}
                  endDate={endDate}
                  values={contributions}
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
            <DialogTitle>Edit user name</DialogTitle>
            <DialogContent>
              <form>
                <TextField
                  label="username"
                  placeholder="New username"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
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

          <Dialog
            open={errorDialog.open}
            onClose={() => setErrorDialog({ open: false, message: '' })}
          >
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {errorDialog.message}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setErrorDialog({ open: false, message: '' })}
                color="secondary"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </main>
    </div>
  );
}

export default UserCenter;
