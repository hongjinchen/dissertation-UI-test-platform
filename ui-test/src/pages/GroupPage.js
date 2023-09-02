// React相关
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Copyright from '../components/Copyright';

// Material UI组件库
import {
  makeStyles,
} from "../components/muiComponents";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Box
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
// 自定义React组件
import Navigation from "../components/SubNavigation";
import KanbanPreview from "../components/overview";
import MemberList from "../components/MemberList";
import Title from "../Title";
// API调用
import { fetchMembers } from "../api";
// 路由相关
import { Link } from "react-router-dom";
// 高阶组件
import withAuth from "../withAuth";

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
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  kanban: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "50vh",
    alignItems: "center",
    flexGrow: 1
  },
  member: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    alignItems: "center",
    height: "50vh",

  },
  fixedHeight: {
    height: "20vh",
  },
  noUnderline: {
    textDecoration: 'none',
  },
  buttonLabel: {
    marginLeft: theme.spacing(1),
    fontSize: '1.25rem',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1, 3),
    textTransform: 'none',
  },
  centeredGrid: {
    marginTop: theme.spacing(8),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

function GroupPage() {
  const classes = useStyles();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchMembersList = async () => {
      try {
        const response = await fetchMembers(id);
        setMembers(response.data.members);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);  // 确保在数据加载完毕后，设置loading为false
      }
    };
    fetchMembersList();
  }, [id]);

  // const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const KanbanData = [
    {
      id: 1,
      type: "To Do",
      count: 5,
    },
    {
      id: 2,
      type: "In Progress",
      count: 3,
    },
    {
      id: 3,
      type: "Completed",
      count: 8,
    },
    {
      id: 4,
      type: 'Long Event Type Name Example 1',
      count: 8,
    },
    {
      id: 5,
      type: 'Longer Event Type Name Example 2',
      count: 8,
    },
  ];
  return (
    <div className={classes.root}>
      <Navigation title="My Group" id="id" />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {loading ? (
            // 显示加载指示器
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
              <CircularProgress />
            </div>
          ) : (
            // 实际的内容（当数据加载完毕时显示）
            <>
              <Grid container spacing={3}>
              <Grid item xs={12} md={6} component={Link} to={`/issue/${id}`} className={classes.noUnderline}>
                  <Paper className={classes.kanban}>
                    <Title color="darkgrey">Kanban</Title>
                    <KanbanPreview data={KanbanData} id={id} />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper className={classes.member}>
                    <Title>Group Members</Title>
                    <MemberList data={members} />
                  </Paper>
                </Grid>
              </Grid>

              <Grid item xs={12} className={classes.centeredGrid}>
                <Button
                  variant="contained" color="primary"
                  component={Link}
                  to={`/testCase/${id}`}
                  className={classes.button}
                  startIcon={<AddIcon />}
                >
                  <span className={classes.buttonLabel}>Create a new test case</span>
                </Button>
              </Grid>
            </>
          )}
        </Container>
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>

    </div>
  );
}

export default withAuth(GroupPage);