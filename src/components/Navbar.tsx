// src/components/Navbar.tsx

import React, { useEffect, useState } from 'react';
// import { AppBar, Toolbar, Typography, Button } from '@mui/material'; // Material-UIを使う場合
// import { Link, useNavigate } from 'react-router-dom'; // React Routerを使う場合

const Navbar = () => {
  // const navigate = useNavigate(); // React Router
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    // ページをリロードしてログイン状態を反映
    window.location.href = '/login';
  };

  return (
    <header style={{ background: '#333', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <a href="/articles" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em' }}>
        あとで読むアプリ
      </a>
      <nav>
        {isLoggedIn ? (
          <button onClick={handleLogout}>
            ログアウト
          </button>
        ) : (
          <>
            <a href="/login" style={{ color: 'white', marginRight: '15px' }}>ログイン</a>
            <a href="/register" style={{ color: 'white' }}>新規登録</a>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;