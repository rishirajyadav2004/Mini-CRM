import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await register({ name, email, password });
    
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create Your Account</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              name="password2"
              value={password2}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;