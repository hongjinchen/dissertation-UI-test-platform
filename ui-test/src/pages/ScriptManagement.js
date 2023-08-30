import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from 'react-router-dom';
import clsx from "clsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Grid,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  TablePagination,
  Button,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { Link } from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';

import Navigation from "../components/SubNavigation";
import EmptyPlaceholder from "../components/EmptyPlaceholder";
import axios from "axios";
import { API_BASE_URL } from "../config";
import ReportDialog from "../components/ReportDialog";
import { fetchScripts } from '../api';
// import
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
  centeredGrid: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1, 3),
    textTransform: 'none',
  },
  buttonLabel: {
    marginLeft: theme.spacing(1),
    fontSize: '1.25rem',
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
}));

export default function ScriptManagement() {
  const classes = useStyles();
  const SearchfixedHeightPaper = clsx(classes.paper, classes.SearchfixedHeight);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const [idSearch, setIdSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [creatorSearch, setCreatorSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const { id } = useParams(); // 获取路由参数

  const [scriptList, setScriptList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchScripts(id);
        setScriptList(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching scripts:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleIdSearch = (e) => {
    setIdSearch(e.target.value);
  };

  const handleNameSearch = (e) => {
    setNameSearch(e.target.value);
  };

  const handleCreatorSearch = (e) => {
    setCreatorSearch(e.target.value);
  };

  const handleStateFilter = (e) => {
    setStateFilter(e.target.value);
  };

  const filteredScriptList = scriptList.filter(
    (script) =>
      (idSearch ? script.id.toString().includes(idSearch) : true) &&
      (nameSearch
        ? script.name.toLowerCase().includes(nameSearch.toLowerCase())
        : true) &&
      (creatorSearch
        ? script.Creator.toLowerCase().includes(creatorSearch.toLowerCase())
        : true) &&
      (stateFilter ? script.State === stateFilter : true)
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 选择报告
  const [open, setOpen] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedReport(value);
  };

  return (
    <div className={classes.root}>
      <Navigation title="Script management" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Search Part */}
            <Grid item xs={12}>
              <Paper className={SearchfixedHeightPaper}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    padding: "16px",
                  }}
                >
                  <TextField
                    label="Search ID"
                    value={idSearch}
                    onChange={handleIdSearch}
                    style={{ minWidth: "100px" }}
                  />
                  <TextField
                    label="Search Name"
                    value={nameSearch}
                    onChange={handleNameSearch}
                    style={{ minWidth: "100px" }}
                  />
                  <TextField
                    label="Search Creator"
                    value={creatorSearch}
                    onChange={handleCreatorSearch}
                    style={{ minWidth: "100px" }}
                  />
                  <FormControl style={{ minWidth: "100px" }}>
                    <InputLabel>Status Filter</InputLabel>
                    <Select value={stateFilter} onChange={handleStateFilter}>
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      <MenuItem value="finished">Finished</MenuItem>
                      <MenuItem value="in progress">In Progress</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Paper>
            </Grid>
            {/* Create a new test case part */}
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
            {/* List Part */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                {loading && <LinearProgress />}
                {!loading && filteredScriptList.length > 0 && (
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Time</TableCell>
                        <TableCell align="center">Label</TableCell>
                        <TableCell align="center">State</TableCell>
                        <TableCell align="center">Creator</TableCell>
                        <TableCell align="center">Operation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredScriptList
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((script) => (
                          <TableRow key={script.id}>
                            <TableCell align="center">{script.id}</TableCell>
                            <TableCell align="center">{script.name}</TableCell>
                            <TableCell align="center">{script.created_at}</TableCell>
                            <TableCell align="center">{script.label}</TableCell>
                            <TableCell align="center">{script.state}</TableCell>
                            <TableCell align="center">
                              {script.created_by}
                            </TableCell>
                            <TableCell align="center">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {/* <SelectReport id={script.id}></SelectReport> */}
                                <Button
                                  variant="contained"
                                  style={{ marginRight: "10px" }}
                                  onClick={handleClickOpen}
                                >
                                  View report
                                </Button>
                                <ReportDialog
                                  selectedValue={selectedReport}
                                  id={script.id}
                                  open={open}
                                  onClose={handleClose}
                                />
                                <Button variant="contained" color="primary" component={Link}  to={`/testCase/${id}/${script.id}`}>
                                  View script
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
                {!loading && filteredScriptList.length === 0 && (
                  <EmptyPlaceholder text=" No scripts found. Please adjust your search and filter criteria." />
                )}
                {!loading && (
                  <TablePagination
                    component="div"
                    count={filteredScriptList.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
