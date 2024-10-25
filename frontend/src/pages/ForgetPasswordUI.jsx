// import React from 'react';

// const ForgetPasswordUI = () => {
//     return (
//         <div>
//             {/* Your content here (currently blank) */}
//         </div>
//     );
// };

// export default ForgetPasswordUI;

import { useState } from 'react';

const ForgetPasswordUI = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/password_reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Password reset email sent!');
      } else {
        setMessage('Failed to send reset email.');
      }
    } catch (error) {
      setMessage('Error occurred. Try again.');
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

