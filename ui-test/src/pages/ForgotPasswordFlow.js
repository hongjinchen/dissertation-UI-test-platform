import React, { useState } from "react";
import { TextField, Button, Container } from "@mui/material";

const ForgotPassword = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    setStep(1);
    // 在这里发送邮件并等待两秒钟
    setTimeout(() => {
      console.log("邮件已发送");
    }, 2000);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    // 在这里验证验证码是否正确
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    // 在这里处理新密码的逻辑
    console.log("新密码已设置");
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
            Send Code
          </Button>
        </Container>
      )}
      {step === 1 && (
        <Container maxWidth="sm">
          <h2>Enter Code</h2>
          <TextField
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCodeSubmit}
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
