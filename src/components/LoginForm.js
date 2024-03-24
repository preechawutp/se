import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithRedirect, getRedirectResult } from "firebase/auth";
import logo from "../assets/logo.png";
import "../assets/LoginForm.css";
import { useNavigate } from 'react-router-dom';
import { auth, provider } from "../firebase";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirectLogin = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result.user) {
          navigate('/');
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    handleRedirectLogin();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error(error.message);
    }
  };

  const GoogleLogin = async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="containerlogin">
      <div className="login-form">
        <div className='headerlogin'>
          <img src={logo} alt="Logo" />
          <p className="mt-3">ระบบจัดตารางสอน</p>
        </div>
        <div className="form-group-login">
          <label>บัญชี</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group-login">
          <label>รหัสผ่าน</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btnlogin mt-3" onClick={handleLogin}>Login</button>
        <div>
          <button className="btn2 mt-3" onClick={GoogleLogin}>Sign in with Google</button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
