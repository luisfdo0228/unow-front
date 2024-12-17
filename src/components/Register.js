import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar,
  Paper,
} from "@mui/material";
import { AccountCircle, Lock } from "@mui/icons-material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      await axios.post("http://localhost:8000/api/register", {
        email,
        password,
      });
      setSuccess("¡Registro exitoso! Redirigiendo al login...");
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/"); // Redirigir al login
      }, 2000);
    } catch (err) {
      setError("Error: El email ya existe o los datos no son válidos.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Registro de Usuario
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            ¡Crea tu cuenta para acceder a la plataforma!
          </Typography>
        </Box>

        <form onSubmit={handleRegister}>
          <Box display="flex" alignItems="flex-end" mb={3}>
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>

          <Box display="flex" alignItems="flex-end" mb={3}>
            <Lock sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
          >
            Registrarse
          </Button>
        </form>

        {success && (
          <Box mt={3}>
            <Alert severity="success">{success}</Alert>
          </Box>
        )}
        {error && (
          <Box mt={3}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <Box textAlign="center" mt={3}>
          <Button variant="text" onClick={() => navigate("/")}>
            ¿Ya tienes una cuenta? Inicia sesión
          </Button>
        </Box>
      </Paper>

      {/* Snackbar para mensajes globales */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
