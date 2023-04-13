import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import ListItemIcon from "@mui/material/ListItemIcon";
import SendIcon from "@mui/icons-material/Send";
import { blue } from "@material-ui/core/colors";
import { Link } from "react-router-dom";

const report = [
  { id: 1, name: "user login test case" },
  { id: 2, name: "user logout test case" },
];
const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

function ReportDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Select related report</DialogTitle>
      <List>
        {report.map((item) => (
          <ListItem
            button
            component={Link} to={`/testReport/${item.id}`}
            key={item.id}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

ReportDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function SelectReport({ id }) {
  const [open, setOpen] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState(report[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedReport(value);
  };

  return (
    <div>
      <br />
      <Button
        variant="contained"
        style={{ marginRight: "10px" }}
        onClick={handleClickOpen}
      >
        View report
      </Button>
      <ReportDialog
        selectedValue={selectedReport}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
