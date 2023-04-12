import React, { useState } from "react";
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
  const [nickname, setNickname] = useState("John Doe");
  const [email, setEmail] = useState("zhangsan@example.com");

  const [avatar, setAvatar] = useState("https://via.placeholder.com/150");
  // control the dialogs
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUpdateEmail, setShowUpdateEmail] = useState(false);

  const handleSave = () => {
    // Handle saving user info
    setShowEditInfo(false);
  };

  const handleChangePassword = () => {
    // Handle changing password
    setShowChangePassword(false);
  };

  const handleUpdateEmail = () => {
    // Handle updating email
    setShowUpdateEmail(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  if (!isLoggedIn) {
    return (
      <Container>
        <Typography variant="h4">您已登出。</Typography>
      </Container>
    );
  }

  return (
    <div className={classes.root}>
      <Navigation title="User Center" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* 用户信息展示页面 */}
            <Grid item xs={12} sm={6}>
              <Paper className={fixedHeightPaper}>
                <Typography variant="h6">My information</Typography>
                <Box display="flex" alignItems="center">
                  <Avatar src={avatar} />
                  <Box ml={2}>
                    <Typography>昵称：{nickname}</Typography>
                    <Typography>邮箱：{email}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* 修改信息 */}
            <Grid item xs={12} sm={6}>
              <List aria-label="main mailbox folders">
                <ListItem button onClick={() => setShowEditInfo(true)}>
                  <ListItemText primary="修改个人信息" />
                </ListItem>
                <ListItem button onClick={() => setShowChangePassword(true)}>
                  <ListItemText primary="修改密码" />
                </ListItem>
                <ListItem button onClick={() => setShowUpdateEmail(true)}>
                  <ListItemText primary="邮箱管理" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="退出登录" />
                </ListItem>
              </List>
            </Grid>

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
          {/* 相应的修改页面弹窗 */}
          <Dialog open={showEditInfo} onClose={() => setShowEditInfo(false)}>
            <DialogTitle>修改个人信息</DialogTitle>
            <DialogContent>
              <form>
                <TextField
                  label="昵称"
                  defaultValue="张三"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="个人简介"
                  defaultValue="这是个人简介"
                  fullWidth
                  margin="normal"
                  multiline
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSave} color="primary">
                保存
              </Button>
              <Button onClick={() => setShowEditInfo(false)} color="secondary">
                取消
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={showChangePassword}
            onClose={() => setShowChangePassword(false)}
          >
            <DialogTitle>修改密码</DialogTitle>
            <DialogContent>
              <form>
                <TextField
                  label="旧密码"
                  type="password"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="新密码"
                  type="password"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="确认新密码"
                  type="password"
                  fullWidth
                  margin="normal"
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleChangePassword} color="primary">
                更改密码
              </Button>
              <Button
                onClick={() => setShowChangePassword(false)}
                color="secondary"
              >
                取消
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={showUpdateEmail}
            onClose={() => setShowUpdateEmail(false)}
          >
            <DialogTitle>邮箱管理</DialogTitle>
            <DialogContent>
              <form>
                <TextField label="新邮箱地址" fullWidth margin="normal" />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdateEmail} color="primary">
                更新邮箱
              </Button>
              <Button
                onClick={() => setShowUpdateEmail(false)}
                color="secondary"
              >
                取消
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </main>
    </div>
  );
}

export default UserCenter;
