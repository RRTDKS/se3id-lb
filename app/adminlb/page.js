'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Container, Typography, Button, TextField, Box, Card, CardContent,
  List, ListItem, ListItemText, Divider, Checkbox, FormControlLabel,
  IconButton, CircularProgress
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
  const [showUnapprovedOnly, setShowUnapprovedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    setIsLoading(true);
    let query = supabase
      .from('aid_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (showUnapprovedOnly) {
      query = query.eq('is_approved', false);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching posts:', error);
    } else if (data) {
      setPosts(data);
    }
    setIsLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleApprove = async (postId) => {
    const { error } = await supabase
      .from('aid_posts')
      .update({ is_approved: true })
      .eq('id', postId);

    if (error) {
      console.error('Error approving post:', error);
    } else {
      fetchPosts();
    }
  };

  const handleDisapprove = async (postId) => {
    const { error } = await supabase
      .from('aid_posts')
      .update({ is_approved: false })
      .eq('id', postId);

    if (error) {
      console.error('Error disapproving post:', error);
    } else {
      fetchPosts();
    }
  };

  const handleDelete = async (postId) => {
    const { error } = await supabase
      .from('aid_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error);
    } else {
      fetchPosts();
    }
  };

  const handleRefresh = () => {
    fetchPosts();
  };

  const handleShowUnapprovedToggle = (event) => {
    setShowUnapprovedOnly(event.target.checked);
    fetchPosts();
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>Admin Login</Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
          </form>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showUnapprovedOnly}
                onChange={handleShowUnapprovedToggle}
              />
            }
            label="Show All"
          />
          <IconButton onClick={handleRefresh} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Box>
        {isLoading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {posts.map((post) => (
              <React.Fragment key={post.id}>
                <ListItem>
                  <Card sx={{ width: '100%' }}>
                    <CardContent>
                      <Typography variant="h6">{post.first_name} {post.last_name}</Typography>
                      <Typography color="textSecondary">Phone: {post.phone_number}</Typography>
                      <Typography color="textSecondary">Location: {post.location}</Typography>
                      <Typography color="textSecondary">Category: {post.category}</Typography>
                      <Typography color="textSecondary">
                        Items: {JSON.parse(post.item_description).map(item => `${item.name} (${item.quantity})`).join(', ')}
                      </Typography>
                      <Typography color="textSecondary">
                        {post.is_providing ? 'Providing Aid' : 'Requesting Aid'}
                      </Typography>
                      
                      {post.is_approved ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDisapprove(post.id)}
                          sx={{ mt: 2, mr: 2 }}
                        >
                          Disapprove
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleApprove(post.id)}
                          sx={{ mt: 2, mr: 2 }}
                        >
                          Approve
                        </Button>
                      )}
                      
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(post.id)}
                        sx={{ mt: 2 }}
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default AdminPage;