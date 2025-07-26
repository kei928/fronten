// src/pages/ArticleListPage.tsx

import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import axiosInstance from '../lib/axios';


interface Tag {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
  url: string;
  memo: string | null;
  is_read: boolean;
  tags: Tag[]; // 記事が持つタグの配列
}


const ArticleListPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);


  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [allTags, setAllTags] = useState<Tag[]>([]); // DBに登録されている全タグのリスト
  const [selectedTags, setSelectedTags] = useState<number[]>([]); // フォームで選択されたタグのIDリスト
  const [newTagName, setNewTagName] = useState(''); // 新しく作成するタグの名前



  const fetchData = async () => {
    try {
      // APIから記事一覧とタグ一覧を同時に取得
      const [articlesResponse, tagsResponse] = await Promise.all([
        axiosInstance.get('/api/articles/'),
        axiosInstance.get('/api/tags/'),
      ]);
      setArticles(articlesResponse.data);
      setAllTags(tagsResponse.data);
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      alert('タグ名を入力してください。');
      return;
    }
    try {
      const response = await axiosInstance.post('/api/tags/', { name: newTagName });
      // タグリストを更新し、新しく作成したタグを選択状態にする
      setAllTags([...allTags, response.data]);
      setSelectedTags([...selectedTags, response.data.id]);
      setNewTagName(''); // 入力欄をクリア
    } catch (error) {
      console.error('タグの作成に失敗しました:', error);
      alert('タグの作成に失敗しました。');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/articles/', {
        url: url,
        title: title,
        memo: memo,
        tag_ids: selectedTags, // 選択されたタグのIDリストを送信
      });
      fetchData(); // 記事とタグを再取得
      // フォームをリセット
      setUrl('');
      setTitle('');
      setMemo('');
      setSelectedTags([]);
    } catch (error) {
      console.error('記事の登録に失敗しました:', error);
      alert('記事の登録に失敗しました。');
    }
  };


  const handleDelete = async (id: number) => {
    if (window.confirm('この記事を本当に削除しますか？')) {
      try {
        await axiosInstance.delete(`/api/articles/${id}/`);
        fetchData();
      } catch (error) {
        console.error('記事の削除に失敗しました:', error);
        alert('記事の削除に失敗しました。');
      }
    }
  };

  const handleToggleReadStatus = async (article: Article) => {
    try {
      await axiosInstance.patch(`/api/articles/${article.id}/`, {
        is_read: !article.is_read,
      });
      fetchData();
    } catch (error) {
      console.error('既読状態の更新に失敗しました:', error);
      alert('既読状態の更新に失敗しました。');
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>あとで読むリスト</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>新しい記事を登録</h2>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>URL:</label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required style={{ width: '300px', padding: '8px' }}/>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>タイトル:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '300px', padding: '8px' }}/>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>メモ:</label>
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)} style={{ width: '300px', padding: '8px' }}/>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>タグ:</label>
          <div>
            {allTags.map((tag) => (
              <label key={tag.id} style={{ marginRight: '10px' }}>
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTags([...selectedTags, tag.id]);
                    } else {
                      setSelectedTags(selectedTags.filter((id) => id !== tag.id));
                    }
                  }}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>新しいタグを作成:</label>
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
          />
          <button type="button" onClick={handleCreateTag}>タグ作成</button>
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
              
            
              <div style={{ margin: '5px 0' }}>
                {article.tags.map(tag => (
                  <span key={tag.id} style={{ background: '#eee', padding: '2px 5px', borderRadius: '3px', marginRight: '5px', fontSize: '0.9em' }}>
                    {tag.name}
                  </span>
                ))}
              </div>


              <button onClick={() => handleToggleReadStatus(article)}>
                {article.is_read ? '未読に戻す' : '既読にする'}
              </button>
              <button onClick={() => handleDelete(article.id)} style={{ marginLeft: '8px' }}>
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArticleListPage;