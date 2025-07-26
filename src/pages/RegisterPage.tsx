// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import type { FormEvent } from 'react';
import axiosInstance from '../lib/axios';


const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // バックエンドのユーザー登録APIにリクエスト
      await axiosInstance.post('/api/register/', {
        username,
        password,
      });

      // 登録成功後、ログインページにリダイレクト
      alert('ユーザー登録が成功しました。ログインしてください。');
      window.location.href = '/login';
      // navigate('/login'); // ルーター導入後に使用

    } catch (err: any) {
      if (err.response && err.response.data.username) {
        setError(err.response.data.username[0]);
      } else {
        setError('ユーザー登録に失敗しました。');
      }
      console.error('登録失敗:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>新規登録</h1>
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
        <button type="submit">登録</button>
      </form>
      <p>
        すでにアカウントをお持ちですか？ <a href="/login">ログイン</a>
      </p>
    </div>
  );
};

export default RegisterPage;