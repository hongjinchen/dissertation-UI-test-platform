import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Button,
  Typography,
} from "@material-ui/core";
import ListItemIcon from "@mui/material/ListItemIcon";
import SendIcon from "@mui/icons-material/Send";
import EmptyPlaceholder from "../components/EmptyPlaceholder";
import { searchTestReport } from "../api";

export default function ReportPage(props) {
  const { scriptId } = useParams();
  const [report, setReport] = useState([]);
  const [noReportFound, setNoReportFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (scriptId) {
      const data = { TestCaseid: scriptId };
      const fetchReports = async () => {
        try {
          const response = await searchTestReport(data);
          if (response.status === "success") {
            setReport(response.results);
            setNoReportFound(false);
          } else {
            setNoReportFound(true);
          }
        } catch (error) {
          if (error.response.status === 404) {
            setNoReportFound(true);
          } else {
            alert(error.response.data.status);
          }
        }
      };
      fetchReports();
    }
  }, [scriptId]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Grid container justify="center" alignItems="center" style={{ minHeight: '70vh' }}>
      <Grid item xs={10} md={6}>
        <Paper elevation={3} style={{ padding: '24px' }}>
          <Button variant="outlined" color="primary" onClick={handleBack} style={{ marginBottom: '16px' }}>
            Back
          </Button>
          {noReportFound ? (
            <Typography variant="h6" align="center" style={{ margin: "16px" }}>
              <EmptyPlaceholder text="This test case has no corresponding report." />
            </Typography>
          ) : (
            <div>
              <Typography variant="h6" align="center" gutterBottom>
                Select related report
              </Typography>
              <List>
                {report.map((item) => (
                  <ListItem
                    button
                    component={Link}
                    to={`/testReport/${item.id}`}
                    key={item.id}
                  >
                    <ListItemIcon>
                      <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary={item.test_event_name} />
                  </ListItem>
                ))}
              </List>
            </div>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
