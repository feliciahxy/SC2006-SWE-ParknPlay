// src/pages/ChangePasswordUI.jsx

import React, { useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import Sidebar from '../components/Sidebar'; // Import the Sidebar

const ChangePasswordUI = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const response = await api.post(
        '/api/change-password/',
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setError('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || 'An error occurred');
      } else {
        setError('Network error. Please try again.');
      }
      setMessage('');
    }
  };

  return (
    <div style={{ display: 'flex' }}> {/* Added flex layout to include Sidebar */}
      <Sidebar /> {/* Include Sidebar */}
      <div className="change-password" style={{ marginLeft: '220px', padding: '20px', width: '100%' }}> {/* Adjust margin for the sidebar */}
        <h2>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div>
            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Change Password</button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ChangePasswordUI;
