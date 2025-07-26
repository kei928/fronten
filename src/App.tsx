// src/App.tsx

import React from 'react';
import Navbar from './components/Navbar';
import ArticleListPage from './pages/ArticleListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  let pageContent;

  // 現在のURLパスに応じて、表示するコンポーネントを決定
  switch (window.location.pathname) {
    case '/login':
      pageContent = <LoginPage />;
      break;
    case '/register':
      pageContent = <RegisterPage />;
      break;
    default: // それ以外のURLはすべて記事一覧ページを表示
      pageContent = <ArticleListPage />;
      break;
  }

  return (
    <div>
      <Navbar />
      <main style={{ padding: '20px' }}>
        {pageContent}
      </main>
    </div>
  );
}

export default App;