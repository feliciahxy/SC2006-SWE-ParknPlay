import { useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';

const ForgetPasswordUI = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/password_reset/', {
        email: email
    });
      if (response) {
        setMessage('Please check your email!');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Extract password errors, if present
        setErrors(error.response.data.email || []);
      } else {
          setMessage('An unexpected error occurred.');
      }
      console.log('Error during password reset', error);
      }
  };

  return (
    <div>
      <Sidebar />
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br/>
        <button type="submit">Send Reset Link</button>
      </form>
      <p>{message}</p>
      <p>{errors}</p>
    </div>
  );
};

export default ForgetPasswordUI;

