import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers, deleteCustomer } from '../services/api';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import '../styles/Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm]);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers(currentPage, 10, searchTerm);
      setCustomers(response.data.data);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      toast.error('Error fetching customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        toast.error('Error deleting customer');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomers();
  };

  if (loading) return <Spinner />;

  return (
    <div className="customers-container">
      <div className="page-header">
        <h1>Customers</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Add New Customer
        </Link>
      </div>

      <div className="search-box">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="customers-list">
        {customers.length === 0 ? (
          <div className="empty-state">
            <p>No customers found. <Link to="/customers/new">Add your first customer</Link></p>
          </div>
        ) : (
          <>
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || '-'}</td>
                    <td>{customer.company || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/customers/${customer._id}`} className="btn btn-sm btn-info">
                          View
                        </Link>
                        <Link to={`/customers/${customer._id}/edit`} className="btn btn-sm btn-warning">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(customer._id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Customers;