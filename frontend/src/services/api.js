import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Customers API
export const getCustomers = (page = 1, limit = 10, search = '') => {
  return axios.get(`${API_URL}/customers?page=${page}&limit=${limit}&search=${search}`);
};

export const getCustomer = (id) => {
  return axios.get(`${API_URL}/customers/${id}`);
};

export const createCustomer = (customerData) => {
  return axios.post(`${API_URL}/customers`, customerData);
};

export const updateCustomer = (id, customerData) => {
  return axios.put(`${API_URL}/customers/${id}`, customerData);
};

export const deleteCustomer = (id) => {
  return axios.delete(`${API_URL}/customers/${id}`);
};

// Leads API
export const getLeads = (customerId) => {
  return axios.get(`${API_URL}/customers/${customerId}/leads`);
};

export const getLead = (id) => {
  return axios.get(`${API_URL}/leads/${id}`);
};

export const createLead = (customerId, leadData) => {
  return axios.post(`${API_URL}/customers/${customerId}/leads`, leadData);
};

export const updateLead = (id, leadData) => {
  return axios.put(`${API_URL}/leads/${id}`, leadData);
};

export const deleteLead = (id) => {
  return axios.delete(`${API_URL}/leads/${id}`);
};

export const getLeadsByStatus = (status) => {
  return axios.get(`${API_URL}/leads/status/${status}`);
};