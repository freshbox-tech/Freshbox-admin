// app/page.js (Login Page) --updated the Login to login page (dir rename)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "@/contexts/AuthContext";
import ApiServices from "@/lib/ApiServices";

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await ApiServices.login({ email, password });
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        router.push("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();

    if (resetStep === 1) {
      try {
        const res = await ApiServices.sendCode({ email });
        if (res.data.success) {
          setError("");
          setResetStep(2);
        } else {
          setError("Email not found. Please try again.");
        }
      } catch (error) {
        console.log(error);
        setError("An error occurred. Please try again.");
      }
    } else if (resetStep === 2) {
      try {
        const res = await ApiServices.confirmCode({
          email,
          code: resetCode,
        });
        if (res.data.success) {
          setError("");
          setResetStep(3);
        } else {
          setError("Invalid reset code");
        }
      } catch (error) {
        console.log(error);
        setError("An error occurred. Please try again.");
      }
    } else if (resetStep === 3) {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      try {
        const res = await ApiServices.changePasword({
          email,
  
          newPassword,
        });
        if (res.data.success) {
          setError("");
          setForgotPassword(false);
             setNewPassword("");
      
          setResetCode("");
          setResetStep(1);
          alert("Password reset successfully!");
        } else {
          setError("Failed to reset password. Please try again.");
        }
      } catch (error) {
        console.log(error);
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <>


      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          p: 2,
        }}
      >
        <Box
          sx={{
            width: "35%",
            p: { xs: 3, sm: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {forgotPassword ? "Reset Password" : "FreshBox Admin"}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                {error}
              </Alert>
            )}

            {!forgotPassword ? (
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3, width: "100%" }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Box sx={{ textAlign: "right" }}>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={() => setForgotPassword(true)}
                  >
                    Forgot password?
                  </Link>
                </Box>
              </Box>
            ) : (
              <Box
                component="form"
                noValidate
                onSubmit={handleForgotPasswordSubmit}
                sx={{ mt: 3, width: "100%" }}
              >
                {resetStep === 1 && (
                  <>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Enter your email address and we'll send you a code to
                      reset your password.
                    </Typography>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </>
                )}

                {resetStep === 2 && (
                  <>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      We've sent a 6-digit code to your email. Please enter it
                      below.
                    </Typography>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="code"
                      label="Verification Code"
                      name="code"
                      autoFocus
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                    />
                  </>
                )}

                {resetStep === 3 && (
                  <>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Please enter your new password.
                    </Typography>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="newPassword"
                      label="New Password"
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm New Password"
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {resetStep === 1
                    ? "Send Code"
                    : resetStep === 2
                    ? "Verify Code"
                    : "Reset Password"}
                </Button>

                <Box sx={{ textAlign: "right" }}>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={() => {
                      setForgotPassword(false);
                      setResetStep(1);
                      setError("");
                    }}
                  >
                    Back to login
                  </Link>
                </Box>
              </Box>
            )}

            <Box mt={5} width="100%" textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {"© "}
                FreshBox Laundry {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
