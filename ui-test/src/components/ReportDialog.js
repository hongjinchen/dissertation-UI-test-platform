import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  Dialog,
} from "@material-ui/core";

import ListItemIcon from "@mui/material/ListItemIcon";
import SendIcon from "@mui/icons-material/Send";

import EmptyPlaceholder from "../components/EmptyPlaceholder";
import { searchTestReport } from "../api";

export default function ReportDialog(props) {
  const { onClose, selectedValue, open, id } = props;
  const [report, setReport] = useState([]);
  const [noReportFound, setNoReportFound] = useState(false);

  useEffect(() => {
    if (id) {
      const data = { TestCaseid: id };
      const fetchReports = async () => {
        try {
          const response = await searchTestReport(data);
          if (response.status === "success") {
            setReport(response.results);
            setNoReportFound(false);
            console.log(report);
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
  }, [id]);

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >

      {noReportFound ? (
        <div style={{ margin: "16px" }}>
          <EmptyPlaceholder text=" This test case has no corresponding report." />
        </div>

      ) : (
        <div>
          <DialogTitle id="simple-dialog-title">Select related report</DialogTitle>
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
    </Dialog>
  );
}