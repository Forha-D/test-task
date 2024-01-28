import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google'; 


const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5005/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin();
        console.log(email, password);
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const responseGoogle = async (response) => {
    if (response.error) {
      console.error('Google login failed:', response.error);
      return;
    }
  
    console.log('Google response:', response);
  
    try {
      const serverResponse = await fetch('http://localhost:5005/auth/google/callback', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${response.accessToken}`, // Include Google access token
        },
      });
  
      console.log('Server Response Status:', serverResponse.status);
  
      const serverData = await serverResponse.json();
  
      if (serverResponse.ok) {
        // Handle successful login (maybe redirect the user to a dashboard)
        onLogin();
        navigate('/');
      } else {
        console.error('Server error:', serverData.message);
      }
    } catch (error) {
      console.error('Error sending Google login data to the server:', error);
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Login</button>
        <GoogleOAuthProvider clientId="490322289333-2126pakku83bsagl3a0t70hlbg20iu8k.apps.googleusercontent.com" >
         <GoogleLogin
         
         onSuccess={(credentialResponse)=>{
        console.log(credentialResponse)
        responseGoogle(credentialResponse); 
        onLogin();
        navigate('/');

        }}
        onError={()=> {

          console.log('Login Failed')
        }}
   
        /> 
         </GoogleOAuthProvider>
      </form>

      <p>
        Please <a href="/">test</a>
      </p>
    </div>
  );
};

export default Login;
