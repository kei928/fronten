// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import type { FormEvent } from 'react';
import axiosInstance from '../lib/axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // FastAPIのOAuth2PasswordRequestFormはURLエンコード形式を期待するため、
      // FormDataを使ってデータを準備します。
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      // バックエンドのトークン発行APIにリクエスト
      const response = await axiosInstance.post('/api/token', formData);

      // localStorageにトークンを保存
      localStorage.setItem('access_token', response.data.access_token);

      // ログイン成功後、記事一覧ページ（ルート）にリダイレクト
      window.location.href = '/';

    } catch (err) {
      setError('ユーザー名またはパスワードが違います。');
      console.error('ログイン失敗:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ユーザー名:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>パスワード:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">ログイン</button>
      </form>
      <p>
        アカウントをお持ちでないですか？ <a href="/register">新規登録</a>
      </p>
    </div>
  );
};

export default LoginPage;