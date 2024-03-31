import React, { useState } from 'react';
import { TextField, Button, Container, Snackbar } from '@mui/material';
import { API_BASE_URL, axiosInstance } from "../config";

const ForgotPassword = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(''); // Used for the verification code
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setOpenSnackbar(true);
  };

  const handleSubmitEmail = async () => {
    try {
      const result = await axiosInstance.post(`${API_BASE_URL}/check-email`, { email });
      if (result.data.status === 'success') {
        setStep(1);
        showMessage("A verification code has been sent to your email.");
      } else {
        showMessage(result.data.message || "Mailbox input error, can't change password");
      }
    } catch (error) {
      showMessage("Error sending verification code");
      console.error('Error:', error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const result = await axiosInstance.post(`${API_BASE_URL}/verify-code`, { email, code });
      if (result.data.status === 'success') {
        setStep(2);
        showMessage("");
      } else {
        showMessage(result.data.message || "Verification failed, incorrect code.");
      }
    } catch (error) {
      showMessage("Error verifying code");
      console.error('Error:', error);
    }
  };

  const handleNewPasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      showMessage("Passwords do not match.");
      return;
    }
    try {
      const updateResult = await axiosInstance.post(`${API_BASE_URL}/update-password`, { email, newPassword });
      if (updateResult.data.status === 'success') {
        showMessage("Password updated successfully!");
        setStep(0); // Optionally, redirect the user or reset the form
      } else {
        showMessage(updateResult.data.message || "Error updating password");
      }
    } catch (error) {
      showMessage("Failed to update password");
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {step === 0 && (
        <Container maxWidth="sm">
          <h2>Forgot Password</h2>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitEmail}
            fullWidth
          >
            Send Verification Code
          </Button>
        </Container>
      )}
      {step === 1 && (
        <Container maxWidth="sm">
          <h2>Verify Your Email</h2>
          <TextField
            label="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleVerifyCode}
            fullWidth
          >
            Verify Code
          </Button>
        </Container>
      )}
      {step === 2 && (
        <Container maxWidth="sm">
          <h2>Reset Password</h2>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewPasswordSubmit}
            fullWidth
            disabled={!newPassword || newPassword !== confirmPassword}
          >
            Update Password
          </Button>
        </Container>
      )}
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </div>
  );
};

export default ForgotPassword;
