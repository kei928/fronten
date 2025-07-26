// src/lib/axios.ts

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});


// APIリクエストを送信する前に毎回実行される処理
axiosInstance.interceptors.request.use(
  (config) => {
    // ブラウザのlocalStorageからアクセストークンを取得
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // トークンがあれば、リクエストのヘッダーに'Authorization'として添付する
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default axiosInstance;