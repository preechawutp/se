import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithRedirect, getRedirectResult } from "firebase/auth";
import logo from "../assets/logo.png";
import "../assets/LoginForm.css";
import "../assets/Navbar.css";
import { useNavigate } from 'react-router-dom';
import { auth, provider } from "../firebase";
import Alert from 'react-bootstrap/Alert';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

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
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError('อีเมล์หรือรหัสผ่านไม่ถูกต้อง');
      setTimeout(() => {
        setError(null);
      }, 4000);
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

  const guestnavigate = () => {
    navigate('/show-schedule');
  }

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
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

          <button className="btnlogin mt-3 mb-2" onClick={handleLogin}>เข้าสู่ระบบ</button>
          <div class="or-divider"><span>or</span></div>
          <button className="btn2 mt-3" onClick={GoogleLogin}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
              width="26" height="22"
              viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg> เข้าสู่ระบบด้วย Google</button>
          <button className="btn2 mt-2" onClick={guestnavigate}><i class="fa-solid fa-user"></i> เข้าสู่ระบบด้วย Guest</button>
          <button className="btn2 mt-2" onClick={handleAutoLogin}>ห้ามกด</button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
