import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import KanbanBoard from "../components/KanbanBoard";
import { Container } from "../components/muiComponents";
import Navigation from "../components/SubNavigation";
import { makeStyles } from "@material-ui/core/styles";

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
  SearchfixedHeight: {
    height: "20hv",
  },
}));

function IssueManagement() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Navigation title="Issue management" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Container>
            <DndProvider backend={HTML5Backend}>
              <KanbanBoard />
            </DndProvider>
          </Container>
        </Container>
      </main>
    </div>
  );
}

export default IssueManagement;
