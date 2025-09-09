import React, { useState } from 'react';
import { createLead } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/Form.css';

const LeadForm = ({ customerId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'New',
    value: ''
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createLead(customerId, {
        ...formData,
        value: parseFloat(formData.value) || 0
      });
      toast.success('Lead created successfully');
      onSuccess();
      setFormData({
        title: '',
        description: '',
        status: 'New',
        value: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lead-form-container">
      <h3>Add New Lead</h3>
      <form onSubmit={onSubmit} className="form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={onChange}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div className="form-group">
          <label>Value ($)</label>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={onChange}
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Lead'}
          </button>
          <button type="button" onClick={onSuccess} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;