import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import api from '../api';

const PasswordResetUI = () => {
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState('');
  const [isPasswordConfirming, setIsPasswordConfirming] = useState(false);
  const {token} = useParams()
  const navigate = useNavigate();

  const isPasswordMatch = newPassword === newConfirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      if (error.response && error.response.status === 400) {
        // Extract password errors, if present
        setErrors(error.response.data.password || []);
      } else {
          setMessage('An unexpected error occurred.');
      }
      console.log('Error during password reset', error);
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
        <input
          type="newConfirmPassword"
          placeholder="Confirm your new password again"
          value={newConfirmPassword}
          onChange={(e) => {
            setNewConfirmPassword(e.target.value);
            setIsPasswordConfirming(true);
          }}
        />
        <br/>
        <button disabled={!isPasswordMatch}>Submit</button>
        {isPasswordConfirming && !isPasswordMatch && <p>Passwords do not match</p>}
      </form>
      <p>{message}</p>
      <p>{errors}</p>
    </div>
  );
};

export default PasswordResetUI;