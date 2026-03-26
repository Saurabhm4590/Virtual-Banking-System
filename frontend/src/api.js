import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Optionally attach auth token here if we upgrade to JWT in the future.
// For basic flow, we will manage the logged-in user explicitly.
export default api;
