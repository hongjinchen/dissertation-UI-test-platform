import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

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
import { registerUser } from '../api';

const Register = () => {
  const navigate = useNavigate();


  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateInput = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
    };

    // 验证用户名长度
    if (values.username.length > 20) {
      newErrors.username = "User name length cannot exceed 20 characters";
    }

    // 验证邮箱格式
    const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
    if (!emailPattern.test(values.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // 验证密码组成
    const passwordPattern = /^(?=.*[a-z])(?=.*\d)[a-z\d]{6,}$/;
    if (!passwordPattern.test(values.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter and one number";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };


  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });

    // Reset errors[prop] when the input is empty
    if (event.target.value === "") {
      setErrors({ ...errors, [prop]: "" });
    } else {
      // Validate input values and update errors state
      const newErrors = { ...errors };

      if (prop === "username" && event.target.value.length > 20) {
        newErrors.username = "User name length cannot exceed 20 characters";
      } else {
        newErrors.username = "";
      }

      if (prop === "email") {
        const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
        if (!emailPattern.test(event.target.value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          newErrors.email = "";
        }
      }

      if (prop === "password") {
        const passwordPattern = /^(?=.*[a-z])(?=.*\d)[a-z\d]{6,}$/;
        if (!passwordPattern.test(event.target.value)) {
          newErrors.password = "Password must contain at least one lowercase letter and one number";
        } else {
          newErrors.password = "";
        }
      }
      if (prop === "confirmPassword") {
        if (event.target.value !== values.password) {
          newErrors.confirmPassword = "Password does not match";
        } else {
          const passwordPattern = /^(?=.*[a-z])(?=.*\d)[a-z\d]{6,}$/;
          newErrors.confirmPassword = "";
          if (!passwordPattern.test(event.target.value)) {
            newErrors.confirmPassword = "Password must contain at least one lowercase letter and one number";
          } else {
            newErrors.confirmPassword = "";
          }
        }
      }
      setErrors(newErrors);
    }
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

  const handleSubmit = async () => {
    if (validateInput()) {
      const status = await registerUser(
        values.username,
        values.email,
        values.password
      );
      if (status === "success") {
        navigate(-1);
      } else {
        alert(status);
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" style={{ marginBottom: "1rem" }}>
        Register
      </Typography>
      <TextField
        label="username"
        variant="outlined"
        value={values.username}
        onChange={handleChange("username")}
        fullWidth
        style={{ marginBottom: "1rem" }}
        error={!!errors.username}
        helperText={errors.username}
      />
      <TextField
        label="Email"
        variant="outlined"
        value={values.email}
        onChange={handleChange("email")}
        fullWidth
        style={{ marginBottom: "1rem" }}
        error={!!errors.email}
        helperText={errors.email}
      />
      <FormControl
        variant="outlined"
        fullWidth
        style={{ marginBottom: "1rem" }}
        error={!!errors.password}
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
        <FormHelperText>{errors.password}</FormHelperText>
      </FormControl>
      <FormControl
        variant="outlined"
        fullWidth
        style={{ marginBottom: "1rem" }}
        error={!!errors.confirmPassword}
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
          <FormHelperText>{errors.confirmPassword}</FormHelperText>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        style={{ marginBottom: "1rem" }}
        disabled={Object.values(errors).some((error) => error)}
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
