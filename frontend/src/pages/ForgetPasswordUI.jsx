import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import PopUpMessage from '../components/PopUpMessage';
import api from '../api';

const ForgetPasswordUI = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

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
      console.log('Error during forget password', error);
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default ForgetPasswordUI;

