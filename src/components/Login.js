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
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock, Email } from "@mui/icons-material";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token); // Guardar el token
      onLogin(); // Notificar que el usuario ha iniciado sesión
      navigate("/dashboard"); // Redirigir al dashboard
    } catch (err) {
      setError("Credenciales inválidas. Por favor, intenta de nuevo.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Iniciar Sesión
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Accede a tu cuenta para continuar
          </Typography>
        </Box>

        {/* Mostrar alerta en caso de error */}
        {error && (
          <Box mb={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <Box mb={3}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Password */}
          <Box mb={3}>
            <TextField
              label="Contraseña"
              variant="outlined"
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Botón de Login */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
          >
            Iniciar Sesión
          </Button>
        </form>

        {/* Redirección al Registro */}
        <Box textAlign="center" mt={3}>
          <Typography variant="body2">
            ¿No tienes una cuenta?{" "}
            <Button variant="text" color="primary" onClick={() => navigate("/register")}>
              Regístrate aquí
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
