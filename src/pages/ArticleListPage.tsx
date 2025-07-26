// src/pages/ArticleListPage.tsx

import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import axiosInstance from '../lib/axios';
import {
  Container, Box, Typography, TextField, Button, List, ListItem,
  ListItemText, IconButton, Checkbox, FormControlLabel, FormGroup,
  Paper, Chip, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';


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

  return(
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          あとで読むリスト
        </Typography>

        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6">新しい記事をクリップ</Typography>
          <TextField label="URL" type="url" value={url} onChange={(e) => setUrl(e.target.value)} required fullWidth margin="normal" size="small" />
          <TextField label="タイトル" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth margin="normal" size="small" />
          <TextField label="メモ" multiline rows={2} value={memo} onChange={(e) => setMemo(e.target.value)} fullWidth margin="normal" size="small" />

          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" gutterBottom>タグを選択</Typography>
            <FormGroup row>
              {allTags.map((tag) => (
                <FormControlLabel
                  key={tag.id}
                  control={<Checkbox checked={selectedTags.includes(tag.id)} onChange={(e) => {
                    if (e.target.checked) { setSelectedTags([...selectedTags, tag.id]); }
                    else { setSelectedTags(selectedTags.filter((id) => id !== tag.id)); }
                  }} />}
                  label={tag.name}
                />
              ))}
            </FormGroup>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField label="新しいタグを作成" size="small" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} />
            <Button onClick={handleCreateTag} variant="outlined" sx={{ ml: 1 }}>作成</Button>
          </Box>

          <Button type="submit" variant="contained" color="primary">記事を登録</Button>
        </Paper>

        <Typography variant="h5" component="h2" gutterBottom>
          保存した記事
        </Typography>
        {articles.length === 0 ? (
          <Typography>記事がまだ登録されていません。</Typography>
        ) : (
          <List>
            {articles.map((article) => (
              <ListItem key={article.id} divider sx={{ opacity: article.is_read ? 0.6 : 1, py: 2 }}>
                <IconButton onClick={() => handleToggleReadStatus(article)} edge="start" sx={{ mr: 1 }} title={article.is_read ? '未読に戻す' : '既読にする'}>
                  {article.is_read ? <CheckCircleOutlineIcon color="primary" /> : <RadioButtonUncheckedIcon />}
                </IconButton>
                <ListItemText
                  primary={<a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }}>{article.title}</a>}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.secondary">{article.memo}</Typography>
                      <Box sx={{ mt: 1 }}>
                        {article.tags.map(tag => <Chip key={tag.id} label={tag.name} size="small" sx={{ mr: 0.5 }} />)}
                      </Box>
                    </>
                  }
                />
                <IconButton onClick={() => handleDelete(article.id)} edge="end" aria-label="delete" title="削除">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default ArticleListPage;