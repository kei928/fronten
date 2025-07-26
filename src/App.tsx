// src/App.tsx

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Navbar from './components/Navbar';
import ArticleListPage from './pages/ArticleListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css'; // スタイルを適用するためのCSSファイル

// ライトテーマを定義
const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  let pageContent;

  switch (window.location.pathname) {
    case '/login':
      pageContent = <LoginPage />;
      break;
    case '/register':
      pageContent = <RegisterPage />;
      break;
    default:
      pageContent = <ArticleListPage />;
      break;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* これが背景色などを整えてくれます */}
      <Navbar />
      <main>
        {pageContent}
      </main>
    </ThemeProvider>
  );
}

export default App;