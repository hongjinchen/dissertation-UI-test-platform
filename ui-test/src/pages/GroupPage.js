import React from "react";
import clsx from "clsx";
import {
  makeStyles,
  Container,
  Grid,
  Paper,
} from "../components/muiComponents";
import Navigation from "../components/SubNavigation";
import KanbanPreview from "../components/overview";
import MemberList from "../components/MemberList";
import Title from '../Title';
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
}));

export default function Dashboard() {
  const classes = useStyles();

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
const MemberData = [
  {
    id: 1,
    avatar:
      "https://th.bing.com/th/id/OIP.y29pBmWKpVvCF24R8OtWWAHaHU?pid=ImgDet&rs=1",
    name: "Elizabeth",
    responsibility: "manager",
  },
  {
    id: 2,
    avatar:
      "https://th.bing.com/th/id/OIP.y29pBmWKpVvCF24R8OtWWAHaHU?pid=ImgDet&rs=1",
    name: "Patricia",
    responsibility: "tester",
  },
  {
    id: 3,
    avatar:
      "https://th.bing.com/th/id/OIP.y29pBmWKpVvCF24R8OtWWAHaHU?pid=ImgDet&rs=1",
    name: "David",
    responsibility: "tester",
  },
  {
    id: 4,
    avatar:
      "https://th.bing.com/th/id/OIP.y29pBmWKpVvCF24R8OtWWAHaHU?pid=ImgDet&rs=1",
    name: "Linda",
    responsibility: "developer",
  },
  {
    id: 5,
    avatar:
      "https://th.bing.com/th/id/OIP.y29pBmWKpVvCF24R8OtWWAHaHU?pid=ImgDet&rs=1",
    name: "Thomas",
    responsibility: "developer",
  },
];
  return (
    <div className={classes.root}>
      <Navigation   title="My Group"/>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {/* graph component */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                {/* <Chart /> */}
              </Paper>
            </Grid>

            {/* kanban component */}
            <Grid item xs={6}>
              <Paper className={classes.kanban}>
                <Title>Kanban</Title>
              <KanbanPreview data={KanbanData} />
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.member}>
              <Title>Group Members</Title>
                <MemberList data={MemberData} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
