import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Link } from "react-router-dom";

const Register = () => {
  const [values, setValues] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = () => {
    // Add your registration logic here
    console.log("Submit button clicked");
  };

  const handleBack = () => {
    // Add your back button logic here
    console.log("Back button clicked");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" style={{ marginBottom: "1rem" }}>
        Register
      </Typography>
      <TextField
        label="Nickname"
        variant="outlined"
        value={values.nickname}
        onChange={handleChange("nickname")}
        fullWidth
        style={{ marginBottom: "1rem" }}
      />
      <TextField
        label="Email"
        variant="outlined"
        value={values.email}
        onChange={handleChange("email")}
        fullWidth
        style={{ marginBottom: "1rem" }}
      />
      <FormControl
        variant="outlined"
        fullWidth
        style={{ marginBottom: "1rem" }}
      >
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={values.showPassword ? "text" : "password"}
          value={values.password}
          onChange={handleChange("password")}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {values.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
      <FormControl
        variant="outlined"
        fullWidth
        style={{ marginBottom: "1rem" }}
      >
        <InputLabel htmlFor="outlined-adornment-confirm-password">
          Confirm Password
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-confirm-password"
          type={values.showConfirmPassword ? "text" : "password"}
          value={values.confirmPassword}
          onChange={handleChange("confirmPassword")}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {values.showConfirmPassword ? (
                  <Visibility />
                ) : (
                  <VisibilityOff />
                )}
              </IconButton>
            </InputAdornment>
          }
          label="Confirm Password"
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        style={{ marginBottom: "1rem" }}
      >
        Submit
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleBack}
        fullWidth
        component={Link}
        to="/login"
      >
        Back
      </Button>
    </Container>
  );
};

export default Register;
