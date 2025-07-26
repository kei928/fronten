// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom'; // RoutesとRouteをインポート
import Navbar from './components/Navbar';
import ArticleListPage from './pages/ArticleListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '20px' }}>
        {/* URLに応じて表示するコンポーネントを切り替える設定 */}
        <Routes>
          <Route path="/" element={<ArticleListPage />} />
          <Route path="/articles" element={<ArticleListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;