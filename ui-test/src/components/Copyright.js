// Copyright.jsx
import React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <MuiLink color="inherit" href="https://mui.com/">
        GWT UI Testing Platform
      </MuiLink>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default Copyright;
