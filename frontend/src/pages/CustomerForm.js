import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomer, createCustomer, updateCustomer } from '../services/api';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import '../styles/Form.css';

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await getCustomer(id);
      setFormData(response.data.data);
    } catch (error) {
      toast.error('Error fetching customer');
      navigate('/customers');
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await updateCustomer(id, formData);
        toast.success('Customer updated successfully');
      } else {
        await createCustomer(formData);
        toast.success('Customer created successfully');
      }
      navigate('/customers');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving customer');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>{isEdit ? 'Edit Customer' : 'Add New Customer'}</h1>
        <button onClick={() => navigate('/customers')} className="btn btn-secondary">
          Back to Customers
        </button>
      </div>

      <form onSubmit={onSubmit} className="form">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label>Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={onChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update Customer' : 'Create Customer'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/customers')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;