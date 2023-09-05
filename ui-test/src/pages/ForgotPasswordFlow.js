import React, { useState } from "react";
import { TextField, Button, Container } from "@mui/material";
import { checkEmailExistence,updatePassword } from "../api";

const ForgotPassword = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(""); 

  const handleSubmitEmail = async (e) => {
    const result = await checkEmailExistence(email);
    if (result && result.status === 'success') {
      setStep(1); // Directly go to reset password step if email exists
    } else {
      setMessage(result || "Mailbox input error, can't change password");
    }
  };

  const handleNewPasswordSubmit = async (e) => {
    const updateResult = await updatePassword(email, newPassword);
    if (updateResult && updateResult.status === 'success') {
        setMessage("Password updated successfully!");
        // You can also reset the form or navigate the user to another page if needed.
    } else {
        setMessage(updateResult || "Error updating password");
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
            Check Email Address
          </Button>
          {message && <div>{message}</div>}
        </Container>
      )}
      {step === 1 && (
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
            disabled={newPassword !== confirmPassword}
          >
            Finish
          </Button>
        </Container>
      )}
    </div>
  );
};

export default ForgotPassword;
