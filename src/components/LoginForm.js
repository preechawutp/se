import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithRedirect, getRedirectResult } from "firebase/auth";
import logo from "../assets/logo.png";
import "../assets/LoginForm.css";
import "../assets/Navbar.css";
import { NavLink, useNavigate } from 'react-router-dom';
import { auth, provider } from "../firebase";
import { Alert } from 'react-bootstrap';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // เพิ่ม state เก็บข้อผิดพลาด

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
      setError(null); // รีเซ็ตข้อผิดพลาดทุกครั้งที่มีการล็อกอินใหม่
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError(error.message); // เซ็ตข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
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

  const handleAutoLogin = async () => {
    try {
      const autoEmail = 'test@se.com';
      const autoPassword = '123456';
      await signInWithEmailAndPassword(auth, autoEmail, autoPassword);
      navigate('/');
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
        <div className="form-group-login mb-2">
          <label>บัญชี</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group-login mb-2">
          <label>รหัสผ่าน</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
        {error && <Alert variant="danger" className="mt-3">อีเมล์หรือรหัสผ่านไม่ถูกต้อง</Alert>}
          <button className="btnlogin mt-3 mb-2" onClick={handleLogin}>Sign in</button>

          <hr />
          <button className="btn2 mt-3" onClick={GoogleLogin}>Sign in with Google</button>
          <button className="btn btn-danger" onClick={handleAutoLogin}>Fast</button>
          
        </div>
      </div>
      <div className='d-flex justify-content-end'>
      
        <button className="btnGuest m-4" ><NavLink to="/show-schedule">Guest</NavLink></button>
      </div>
    </div>
  );
};

export default LoginForm;
