// src/pages/ArticleListPage.tsx

import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import axiosInstance from '../lib/axios';

// Articleデータの型定義に is_read を追加
interface Article {
  id: number;
  title: string;
  url: string;
  memo: string | null;
  is_read: boolean; // 既読かどうかの状態
}

const ArticleListPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');

  const fetchArticles = async () => {
    try {
      const response = await axiosInstance.get('/api/articles/');
      setArticles(response.data);
    } catch (error) {
      console.error('記事の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/articles/', {
        url: url,
        title: title,
        memo: memo,
      });
      fetchArticles();
      setUrl('');
      setTitle('');
      setMemo('');
    } catch (error) {
      console.error('記事の登録に失敗しました:', error);
      alert('記事の登録に失敗しました。');
    }
  };

  // --- ▼▼▼ ここから削除と既読更新の関数を追加 ▼▼▼ ---
  const handleDelete = async (id: number) => {
    if (window.confirm('この記事を本当に削除しますか？')) {
      try {
        // バックエンドのAPIに、指定したIDの記事を削除するようリクエスト
        await axiosInstance.delete(`/api/articles/${id}/`);
        fetchArticles(); // 削除後にリストを再取得
      } catch (error) {
        console.error('記事の削除に失敗しました:', error);
        alert('記事の削除に失敗しました。');
      }
    }
  };

  const handleToggleReadStatus = async (article: Article) => {
    try {
      // is_readの状態を現在の反対の値で更新するようリクエスト
      await axiosInstance.patch(`/api/articles/${article.id}/`, {
        is_read: !article.is_read,
      });
      fetchArticles(); // 更新後にリストを再取得
    } catch (error) {
      console.error('既読状態の更新に失敗しました:', error);
      alert('既読状態の更新に失敗しました。');
    }
  };
  // --- ▲▲▲ ここまで追加 ▲▲▲ ---

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>あとで読むリスト</h1>

      {/* 登録フォームの部分は変更なし */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>新しい記事を登録</h2>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>URL:</label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required style={{ width: '300px', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>タイトル:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '300px', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>メモ:</label>
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)} style={{ width: '300px', padding: '8px' }} />
        </div>
        <button type="submit">記事を登録</button>
      </form>

      <h2>保存した記事一覧</h2>
      {articles.length === 0 ? (
        <p>記事がまだ登録されていません。</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {articles.map((article) => (
            <li key={article.id} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
              {/* ▼▼▼ 表示部分を修正 ▼▼▼ */}
              <div>
                <span style={{ marginRight: '8px', fontWeight: 'bold' }}>
                  {article.is_read ? '[読了]' : '[未読]'}
                </span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '1.2em', color: '#007bff', textDecoration: article.is_read ? 'line-through' : 'none' }}
                >
                  {article.title}
                </a>
              </div>
              <p style={{ margin: '5px 0', color: '#555' }}>{article.memo}</p>
              
              <button onClick={() => handleToggleReadStatus(article)}>
                {article.is_read ? '未読に戻す' : '既読にする'}
              </button>
              <button onClick={() => handleDelete(article.id)} style={{ marginLeft: '8px' }}>
                削除
              </button>
              {/* ▲▲▲ ここまで修正 ▲▲▲ */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArticleListPage;