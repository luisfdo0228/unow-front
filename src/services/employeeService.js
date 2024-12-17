import axios from "axios";

const API_URL = "http://localhost:8000/api/employees";
const TOKEN = localStorage.getItem("token"); // Recupera el token del localStorage

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

export const getEmployees = async () => {
  console.log('HOLAAAA TESTING');
  console.log(headers.Authorization);
  console.log('HOLAAAA TESTING');
  return await axios.get(API_URL, { headers });
};

export const createEmployee = async (data) => {
  return await axios.post(API_URL, data, { headers });
};

export const updateEmployee = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data, { headers });
};

export const deleteEmployee = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, { headers });
};
