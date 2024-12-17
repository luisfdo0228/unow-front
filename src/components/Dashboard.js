import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService";
import {
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Modal,
  Box,
  TablePagination,
  IconButton,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

const Dashboard = ({ onLogout }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [positions, setPositions] = useState([]); // Almacena las posiciones como strings
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    position: "",
    email: "",
    birthDate: "",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchEmployees();
    fetchPositions();
  }, []);

  const fetchEmployees = async () => {
    const response = await getEmployees();
    setEmployees(response.data);
    setFilteredEmployees(response.data);
  };

  const fetchPositions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/positions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Almacenamos las posiciones directamente
      setPositions(response.data);
    } catch (error) {
      console.error("Error al cargar posiciones:", error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = employees.filter((emp) =>
      emp.firstName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const openModal = (employee = null) => {
    setEditingEmployee(employee);
    setErrors({});
    setApiError("");
    setForm(
      employee || {
        firstName: "",
        lastName: "",
        position: "",
        email: "",
        birthDate: "",
      }
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingEmployee(null);
    setErrors({});
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "El nombre es obligatorio.";
    if (!form.lastName.trim()) newErrors.lastName = "El apellido es obligatorio.";
    if (!form.position) newErrors.position = "La posición es obligatoria.";
    if (!form.email.trim()) newErrors.email = "El email es obligatorio.";
    if (!form.birthDate.trim()) newErrors.birthDate = "La fecha de nacimiento es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, form);
      } else {
        await createEmployee(form);
      }
      fetchEmployees();
      closeModal();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setApiError("El email ya existe. Por favor, usa otro email.");
      } else {
        setApiError("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
    }
  };

  const handleDelete = async (id) => {
    await deleteEmployee(id);
    fetchEmployees();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
        <Typography variant="h4">Gestión de Empleados</Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => openModal()}>
          Nuevo Empleado
        </Button>
        <Button variant="outlined" color="secondary" onClick={onLogout}>
          Cerrar Sesión
        </Button>
      </Box>

      <TextField
        label="Buscar por nombre"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={handleSearch}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Posición</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.id}</TableCell>
                <TableCell>{emp.firstName}</TableCell>
                <TableCell>{emp.lastName}</TableCell>
                <TableCell>{emp.position}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => openModal(emp)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(emp.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Modal */}
      <Modal open={modalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editingEmployee ? "Editar Empleado" : "Nuevo Empleado"}
          </Typography>
          {apiError && <Alert severity="error">{apiError}</Alert>}
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Apellido"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <FormControl fullWidth margin="normal" error={!!errors.position}>
            <InputLabel>Posición</InputLabel>
            <Select
              value={form.position}
              name="position"
              onChange={handleChange}
            >
              {positions.map((pos, index) => (
                <MenuItem key={index} value={pos}>
                  {pos}
                </MenuItem>
              ))}
            </Select>
            {errors.position && (
              <Typography variant="caption" color="error">
                {errors.position}
              </Typography>
            )}
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Fecha de Nacimiento"
            name="birthDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.birthDate}
            onChange={handleChange}
            error={!!errors.birthDate}
            helperText={errors.birthDate}
          />
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Guardar
            </Button>
            <Button variant="outlined" color="secondary" onClick={closeModal}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Dashboard;
