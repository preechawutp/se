import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword,signOut,GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import logo from "../assets/logo.png";
import "../assets/LoginForm.css";
import { useNavigate } from 'react-router-dom';
import { auth,provider } from "../firebase";





const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();
 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setDisplayName(user.displayName || user.email);
      } else {
        setIsLoggedIn(false);
        setDisplayName('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setIsLoggedIn(true);
        setDisplayName(user.displayName || user.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
      
        if (errorCode === 'auth/wrong-password') {
          alert('รหัสผ่านไม่ถูกต้อง');
        } else {
          alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        }
      });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
        setIsLoggedIn(true);
        setDisplayName(user.displayName || user.email);
        navigate('/');
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
      });
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setIsLoggedIn(false);
      setDisplayName('');
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <div className="containerlogin">
      <div className="login-form">

            <div className='headerlogin'>
              <img src={logo} alt="Logo"/>
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
              <button className="btn2 mt-3" onClick={handleGoogleLogin}>Sign in with Google</button>
            </div>
      </div>
    </div>
  );
};

export default LoginForm;