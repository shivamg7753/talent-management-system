import React, { useState } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Paper, 
  Tabs, 
  Tab, 
  Alert, 
  Typography,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { apiPost } from "../../lib/api";

export default function AuthForm() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const endpoint = tab === 0 ? "/api/auth/login" : "/api/auth/register";
      await apiPost(endpoint, { email, password });
      setMessage(tab === 0 ? "Login successful!" : "Registration successful!");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setTab(0);
    setEmail("demo@demo.com");
    setPassword("demopassword");
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await apiPost("/api/auth/login", {
        email: "demo@demo.com",
        password: "demopassword",
      });
      setMessage("Demo login successful!");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto' }} elevation={3}>
      <Typography variant="h5" align="center" gutterBottom>
        {tab === 0 ? "Welcome Back" : "Create Account"}
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
        {tab === 0 ? "Sign in to your account" : "Join our talent management platform"}
      </Typography>
      
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
          variant="outlined"
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          size="large"
        >
          {loading ? "Processing..." : tab === 0 ? "Sign In" : "Create Account"}
        </Button>
        {tab === 0 && (
          <Button
            variant="outlined"
            fullWidth
            disabled={loading}
            sx={{ mb: 2 }}
            onClick={handleDemoLogin}
          >
            Try Demo Account
          </Button>
        )}
        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Paper>
  );
}
