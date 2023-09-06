import React from 'react';
import {
  Typography,
  Divider,
  Button
} from '@material-ui/core';
import './Tutorial1.css';
function goBack() {
  window.history.back();
}
function UIliciousTutorial() {
  return (
    <div className="responsive-container">
      <Button variant="contained" onClick={goBack} color="primary">
        Come back
      </Button>
      <Typography variant="h4" style={{ marginTop: '16px', marginBottom: '16px' }}>
        GWT UI Testing Platform Tutorial
      </Typography>

      <Typography variant="h6" gutterBottom>
        What is GWT UI Testing Platform?
      </Typography>
      <Typography paragraph>
        GWT UI Testing Platform is a simple tool for automating interactions with web applications.
      </Typography>
      <Typography paragraph>
        Use it to test your web applications to make sure that your users aren't running into unexpected errors in critical user flows like when they are registering for an account or checking out their order.
      </Typography>

      <Divider />

      <Typography variant="h6" gutterBottom>
        Do I need to know how to code?
      </Typography>
      <Typography paragraph>
        No, not at all! In this platform, you only need to drag and drop modules to create your own test cases!
      </Typography>
    </div>
  );
}

export default UIliciousTutorial;
