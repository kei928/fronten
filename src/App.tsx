// src/App.tsx

import React from 'react';
import Navbar from './components/Navbar'; // 作成したNavbarをインポート
import ArticleListPage from './pages/ArticleListPage'; // ページ本体をインポート

function App() {
  // ここでページの出し分けを行う（将来的にルーティングライブラリを導入）
  // 今は仮にArticleListPageだけを表示
  let pageContent = <ArticleListPage />;
  if (window.location.pathname === '/login') {
    // pageContent = <LoginPage />; // LoginPageを後で作成
  } else if (window.location.pathname === '/register') {
    // pageContent = <RegisterPage />; // RegisterPageを後で作成
  }

  return (
    <div>
      <Navbar />
      <main>
        {/* ここに各ページの内容が表示される */}
        {pageContent} 
      </main>
    </div>
  );
}

export default App;