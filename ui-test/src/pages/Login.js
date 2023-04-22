import React, { useState } from 'react';
import { Button, TextField, Grid, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import { loginUser } from '../api';
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
  
    const handleLogin = (e) => {
      e.preventDefault();
      loginUser(identifier, password);
      // console.log(`Logging in with identifier: ${identifier} and password: ${password}`);
      // 在这里实现登录逻辑（例如调用后端 API）
    };
  
    return (
        <Container maxWidth="xs">
          <Typography variant="h4" align="center">
            Login
          </Typography>
          <form onSubmit={handleLogin} className={classes.container}>
            <Grid container direction="column">
              <TextField
                label="username or Email"
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
              <Button type="submit" variant="contained" color="primary" className={classes.button}>
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
        </Container>
      );
    }
  