import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import PopUpMessage from '../components/PopUpMessage';
import api from '../api';

const PasswordResetUI = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const {token} = useParams()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newPassword);
    console.log(token);
    try {
      const response = await api.post('/api/password_reset/confirm/', {
        password: newPassword,
        token: token
    });
      if (response.status == 200) {
        setMessage('Success! Redirecting you...');
        navigate('/');
      }

    } catch (error) {
      console.log('Error during forget password', error);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <h3>Password must be at least 8 characters long, and cannot be too common.</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="newPassword"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <br/>
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default PasswordResetUI;

