import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeadsByStatus } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Spinner from '../components/Spinner';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [leadsData, setLeadsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        const statuses = ['New', 'Contacted', 'Converted', 'Lost'];
        const leadsByStatus = {};
        let totalLeads = 0;
        
        for (const status of statuses) {
          const response = await getLeadsByStatus(status);
          leadsByStatus[status] = response.data.data;
          totalLeads += response.data.data.length;
        }
        
        setLeadsData(leadsByStatus);
        setHasData(totalLeads > 0);
      } catch (error) {
        console.error('Error fetching leads data:', error);
        // Set sample data for demonstration
        setLeadsData({
          New: [{ value: 1000 }, { value: 1500 }],
          Contacted: [{ value: 2500 }, { value: 1800 }],
          Converted: [{ value: 5000 }, { value: 3200 }],
          Lost: [{ value: 800 }]
        });
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadsData();
  }, []);

  const chartData = Object.entries(leadsData).map(([status, leads]) => ({
    name: status,
    value: leads.length,
    totalValue: leads.reduce((sum, lead) => sum + (lead.value || 0), 0)
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) return <Spinner />;

  return (
    <div className="dashboard-container">
      <h1>CRM Dashboard</h1>
      
      <div className="stats-grid">
        {chartData.map((item, index) => (
          <div key={index} className="stat-card">
            <h3>{item.name} Leads</h3>
            <p className="stat-number">{item.value}</p>
            <p className="stat-value">${item.totalValue.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {hasData ? (
        <>
          <div className="charts-container">
            <div className="chart">
              <h3>Leads by Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart">
              <h3>Lead Value by Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Total Value']} />
                  <Legend />
                  <Bar dataKey="totalValue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h3>Welcome to Your CRM Dashboard!</h3>
          <p>Get started by adding customers and leads to see analytics and insights.</p>
          <Link to="/customers/new" className="btn btn-primary">
            Add Your First Customer
          </Link>
        </div>
      )}

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/customers/new" className="btn btn-primary">
            Add New Customer
          </Link>
          <Link to="/customers" className="btn btn-secondary">
            View All Customers
          </Link>
          <Link to="/customers" className="btn btn-success">
            Manage Leads
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;