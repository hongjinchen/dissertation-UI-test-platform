// React相关
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// 实用工具库
import clsx from "clsx";
// Material UI组件库
import {
  makeStyles,
  Container,
  Grid,
  Paper,
} from "../components/muiComponents";
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
}));

function GroupPage() {
  const classes = useStyles();
  const [members, setMembers] = useState([]);
  const { id } = useParams(); // 获取路由参数

  useEffect(() => {
    const fetchMembersList = async () => {
      const response =await fetchMembers(id);
      console.log("fetchMembers",response);
      setMembers(response.data.members);
    };
    fetchMembersList();
  }, [id]);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
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
      type:  'Longer Event Type Name Example 2',
      count: 8,
    },
];
  return (
    <div className={classes.root}>
      <Navigation   title="My Group" id="id"/>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {/* graph component */}
          <Grid container spacing={3}>

            {/* <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
              </Paper>
            </Grid> */}

            {/* kanban component */}
            <Grid item xs={6}  component={Link} to={`/issue/${id}`} className={classes.noUnderline}>
              <Paper className={classes.kanban}>
                <Title color="darkgrey">Kanban</Title>
              <KanbanPreview data={KanbanData} id={id}/>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.member}>
              <Title>Group Members</Title>
              <MemberList data={members} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

export default withAuth(GroupPage); // 导出经过 withAuth 高阶组件包装的组件