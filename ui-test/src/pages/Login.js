import React, { useState } from 'react';
import { Button, TextField, Grid, Typography, Container, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import Cookies from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  textField: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function Login() {
  const classes = useStyles();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await loginUser(identifier, password);
    const status = result.status;
    if (status === "success") {
      console.log("Login success");
      Cookies.set('userId', result.userId);
      navigate('/');
    } else {
      setSnackMessage("Please check if your email and password are correct");
      setSnackOpen(true);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center">
        Login
      </Typography>
      <form onSubmit={handleLogin} className={classes.container}>
        <Grid container direction="column">
          <TextField
            label="Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className={classes.textField}
          />
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={classes.textField}
          />
          <Button onClick={handleLogin} variant="contained" color="primary" className={classes.button}>
            Login
          </Button>
          <Button variant="outlined" className={classes.button} component={Link} to="/register">
            Register
          </Button>
          <Button variant="outlined" className={classes.button} component={Link} to="/forgotPassword">
            Forgot Password
          </Button>
          <Button variant="outlined" className={classes.button} component={Link} to="/">
            Back
          </Button>
        </Grid>
      </form>

      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert onClose={() => setSnackOpen(false)} severity="error">
          {snackMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
