import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomer, deleteLead } from '../services/api';
import LeadForm from '../components/LeadForm';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import '../styles/CustomerDetail.css';

const CustomerDetail = () => {
  const [customer, setCustomer] = useState(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await getCustomer(id);
      setCustomer(response.data.data);
    } catch (error) {
      toast.error('Error fetching customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(leadId);
        toast.success('Lead deleted successfully');
        fetchCustomer(); // Refresh customer data
      } catch (error) {
        toast.error('Error deleting lead');
      }
    }
  };

  if (loading) return <Spinner />;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="customer-detail-container">
      <div className="customer-header">
        <div>
          <h1>{customer.name}</h1>
          <p>{customer.company}</p>
        </div>
        <div className="customer-actions">
          <Link to={`/customers/${id}/edit`} className="btn btn-warning">
            Edit Customer
          </Link>
          <button onClick={() => setShowLeadForm(!showLeadForm)} className="btn btn-primary">
            {showLeadForm ? 'Cancel' : 'Add Lead'}
          </button>
        </div>
      </div>

      <div className="customer-info">
        <div className="info-item">
          <strong>Email:</strong> {customer.email}
        </div>
        <div className="info-item">
          <strong>Phone:</strong> {customer.phone || 'Not provided'}
        </div>
        <div className="info-item">
          <strong>Created:</strong> {new Date(customer.createdAt).toLocaleDateString()}
        </div>
      </div>

      {showLeadForm && (
        <LeadForm 
          customerId={id} 
          onSuccess={() => {
            setShowLeadForm(false);
            fetchCustomer();
          }} 
        />
      )}

      <div className="leads-section">
        <h2>Leads</h2>
        {customer.leads && customer.leads.length > 0 ? (
          <div className="leads-grid">
            {customer.leads.map((lead) => (
              <div key={lead._id} className="lead-card">
                <div className="lead-header">
                  <h3>{lead.title}</h3>
                  <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                    {lead.status}
                  </span>
                </div>
                <p>{lead.description}</p>
                <div className="lead-details">
                  <div className="lead-value">Value: ${lead.value || 0}</div>
                  <div className="lead-date">
                    Created: {new Date(lead.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="lead-actions">
                  <button
                    onClick={() => handleDeleteLead(lead._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No leads found for this customer.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;