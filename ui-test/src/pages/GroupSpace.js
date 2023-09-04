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
import { useNavigate } from 'react-router-dom';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
        GWT UI Testing Platform
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
    overflow: "visible",
    flexDirection: "column",
    height: "auto",
  },

  fixedHeight: {
    height: "auto",
    maxHeight: "55vh",
    overflowY: "auto",
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const navigate = useNavigate();

  const handleBoxClick = () => {
    navigate('/login');
  };

  return (
    <div className={classes.root}>
      <Navigation title="Dashboard" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={clsx(classes.paper, classes.fixedHeight)}>
                {Cookies.get("token") ? (
                  <Groups />
                ) : (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    onClick={handleBoxClick}
                    style={{ cursor: 'pointer' }}  // Optional: Change cursor on hover for better UX
                  >
                    <Typography variant="h5" align="center" style={{ marginBottom: '10px' }}>
                      Please login to view groups
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

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
