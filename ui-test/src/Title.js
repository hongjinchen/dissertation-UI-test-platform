import React from 'react';
import Typography from '@material-ui/core/Typography';

const Title = ({ children, color }) => {

  return (
    <Typography
      component="h2"
      variant="h5"
      color="inherit"
      noWrap
      style={{ color: color }}
    >
      {children}
    </Typography>
  );
};

export default Title;