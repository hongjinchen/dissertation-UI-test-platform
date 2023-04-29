// React相关
import React from "react";
// 实用工具库
import clsx from "clsx";
// Material UI组件库
import {
  makeStyles,
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Link as MuiLink,
} from "../components/muiComponents";
// Cookies库
import Cookies from 'js-cookie';
// 自定义React组件
import Groups from "../components/groups";
import Tutorial from "../components/tutorialOverview";
import Navigation from "../components/navigation";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <MuiLink color="inherit" href="https://mui.com/">
        My Website
      </MuiLink>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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
  tutorial: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "visible", // 修改此行，以便容器高度可以根据内容自动调整
    flexDirection: "column",
    height: "auto", // 使高度自适应内容
    // maxHeight: "50vh", // 设置最大高度
    // overflowY: "auto", // 如果内容超出最大高度，则显示滚动条
  },
  fixedHeight: {
    height: "auto", // 使高度自适应内容
    maxHeight: "55vh", // 设置最大高度
    overflowY: "auto", // 如果内容超出最大高度，则显示滚动条
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      {/* <CssBaseline /> */}
      <Navigation title="Dashboard" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>

          {/* Group component */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                {Cookies.get("token") ? (
                  <Groups />
                ) : (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                  >
                    <Typography variant="h5" align="center" style={{ marginBottom: '10px' }}>
                      Please login to view groups
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Tutorial component */}
            <Grid item xs={12} style={{ height: "fit-content" }}>
              <Paper className={classes.tutorial}>
                <Tutorial />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
