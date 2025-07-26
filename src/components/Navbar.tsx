// src/components/Navbar.tsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    // ▼▼▼ ここのスタイルを変更します ▼▼▼
    <header style={{ 
      background: '#f5f5f5', // 明るいグレーに変更
      color: '#333',         // 文字色を黒に変更
      padding: '10px 20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderBottom: '1px solid #ddd' // 下に境界線を追加
    }}>
      <Link to="/" style={{ color: '#333', textDecoration: 'none', fontSize: '1.2em' }}>
        あとで読むアプリ
      </Link>
      <nav>
        {isLoggedIn ? (
          <button onClick={handleLogout}>
            ログアウト
          </button>
        ) : (
          <>
            <Link to="/login" style={{ color: '#333', marginRight: '15px' }}>ログイン</Link>
            <Link to="/register" style={{ color: '#333' }}>新規登録</Link>
          </>
        )}
      </nav>
    </header>
    // ▲▲▲ ここまで変更 ▲▲▲
  );
};

export default Navbar;