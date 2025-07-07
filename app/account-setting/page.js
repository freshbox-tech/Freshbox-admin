// app/account-settings/page.js
"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Paper,
  Box,
  Typography,
  Alert,
  Divider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonIcon from "@mui/icons-material/Person";
import ApiServices from "@/lib/ApiServices";
import { useAuth } from "@/contexts/AuthContext";

export default function AccountSettingsPage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [resetStep, setResetStep] = useState(1);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    try {
      const res = await ApiServices.updateUser({
        name,
        email,
      });
      console.log(res);
      if (res.data.success) {
        setError("");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        setSuccess("Profile updated successfully!");
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordChangeSubmit = async (event) => {
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
          setNewPassword("");
          setChangePassword("");
          setResetCode("");
          setChangePassword(false);
          setResetStep(1);
          setSuccess("Password reset successfully!");
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
          width: "40%",
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
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Account Settings
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
              {success}
            </Alert>
          )}

          {!changePassword ? (
            <Box
              component="form"
              onSubmit={handleProfileUpdate}
              sx={{ mt: 3, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Update Profile
              </Button>

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                onClick={() => setChangePassword(true)}
                sx={{ mt: 1, mb: 2 }}
                startIcon={<LockOutlinedIcon />}
              >
                Change Password
              </Button>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handlePasswordChangeSubmit}
              sx={{ mt: 3, width: "100%" }}
            >
              {resetStep === 1 && (
                <>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Please enter your current password to continue.
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    id="currentPassword"
                    autoFocus
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
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
                  ? "Continue"
                  : resetStep === 2
                  ? "Verify Code"
                  : "Change Password"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setChangePassword(false);
                  setResetStep(1);
                  setError("");
                }}
                sx={{ mt: 1 }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
