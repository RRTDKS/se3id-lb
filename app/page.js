'use client'

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { 
  Container, Typography, Tabs, Tab, Box, TextField, 
  Button, Select, MenuItem, InputLabel, FormControl, 
  Card, CardContent, IconButton, List, ListItem, ListItemText,
  Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, OutlinedInput, Grid, Divider, AppBar, Toolbar,
  Checkbox, FormControlLabel
} from '@mui/material';
import { LocationOn, Add, Remove, Phone, WhatsApp, Person, Category, Language } from '@mui/icons-material';
import Image from 'next/image';

import enMessages from '../locales/en.json';
import arMessages from '../locales/ar.json';

// Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const categories = [
  "Clothes",
  "Food",
  "Medicine",
  "Sleeping Tools",
  "Shoes",
  "Toys for Kids",
  "Electronics",
  "Other"
];

// Use Google Maps API key from environment variable
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const AidPost = ({ 
  first_name, 
  last_name, 
  phone_number, 
  location, 
  created_at, 
  category, 
  item_description, 
}) => {
  let items;
  
  try {
    items = JSON.parse(item_description);
    if (!Array.isArray(items)) {
      items = [{ name: item_description, quantity: 1 }];
    }
  }
   catch  {
    items = item_description.split(',').map(item => ({ name: item.trim(), quantity: 1 }));
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location)}`;

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" component="div" gutterBottom>
              {first_name} {last_name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <Person sx={{ mr: 1 }} />
              <Typography variant="body2">{phone_number}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <LocationOn sx={{ mr: 1 }} />
              <Typography variant="body2">{location}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography color="text.secondary" variant="body2">
              Posted on: {formatDate(created_at)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Category sx={{ mr: 1 }} />
              <Typography variant="body1"><strong>Category:</strong> {category}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1"><strong>Items:</strong></Typography>
            <List dense>
              {items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${item.name}: ${item.quantity}`} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ width: '100%', height: '200px', mb: 2 }}>
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={googleMapsUrl}
              ></iframe>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Phone />}
                href={`tel:${phone_number}`}
              >
                Call
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsApp />}
                href={`https://wa.me/${phone_number}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const PostForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    location: '',
    category: '',
    otherCategory: '',
    items: [],
    isAnonymous: false
  });


  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const input = document.getElementById('location-input');
      if (input && window.google && window.google.maps && window.google.maps.places) {
        new window.google.maps.places.Autocomplete(input);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {!formData.isAnonymous && (
        <>
          <TextField
            fullWidth
            margin="normal"
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required={!formData.isAnonymous}
          />
          <TextField
            fullWidth
            margin="normal"
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required={!formData.isAnonymous}
          />
        </>
      )}
      <TextField
        fullWidth
        margin="normal"
        name="phoneNumber"
        label="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        name="location"
        label="Location"
        id="location-input"
        value={formData.location}
        onChange={handleChange}
        required
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>{category}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {formData.category === 'Other' && (
        <TextField
          fullWidth
          margin="normal"
          name="otherCategory"
          label="Specify other category"
          value={formData.otherCategory}
          onChange={handleChange}
          required
        />
      )}
      {formData.category && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Items
          </Typography>
          <List>
            {formData.items.map((item, index) => (
              <ListItem key={index}>
                <TextField
                  label="Item Name"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  required
                  sx={{ mr: 2 }}
                />
                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                  required
                  sx={{ width: '100px', mr: 2 }}
                />
                <IconButton onClick={() => removeItem(index)}>
                  <Remove />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Button startIcon={<Add />} onClick={addItem} sx={{ mt: 1 }}>
            Add Item
          </Button>
        </>
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.isAnonymous}
            onChange={handleChange}
            name="isAnonymous"
          />
        }
        label="Post Anonymously"
      />
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </form>
  );
};


const LebanonAidWebsite = () => {
  const [posts, setPosts] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('aid_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching posts:', error);
    } else if (data) {
      setPosts(data);
    }
  };

  const handleSubmit = async (formData) => {
    const { error } = await supabase
      .from('aid_posts')
      .insert([
        {
          first_name: formData.isAnonymous ? 'Anonymous' : formData.firstName,
          last_name: formData.isAnonymous ? '' : formData.lastName,
          phone_number: formData.phoneNumber,
          location: formData.location,
          category: formData.category === 'Other' ? formData.otherCategory : formData.category,
          item_description: JSON.stringify(formData.items),
          is_providing: tabValue === 0,
          is_anonymous: formData.isAnonymous
        }
      ]);
    
    if (error) {
      console.error('Error submitting post:', error);
    } else {
      fetchPosts();
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesFilter = filters.length === 0 || filters.includes(post.category);
    const matchesSearch = searchTerm === '' || 
      JSON.parse(post.item_description).some((item) => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return (tabValue === 0 ? post.is_providing : !post.is_providing) && matchesFilter && matchesSearch;
  });

  const handleFilterChange = (event) => {
    setFilters(event.target.value);
  };

  const toggleLanguage = () => {
    setLanguage(lang => lang === 'en' ? 'ar' : 'en');
  };

  return (
    <IntlProvider messages={language === 'en' ? enMessages : arMessages} locale={language} defaultLocale="en">
      <Box display="flex" flexDirection="column" minHeight="100vh" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Image src="/flag.png" alt="Lebanese Flag" width={40} height={40} style={{ marginRight: '16px' }} />
            <Typography variant="h6" color="inherit" noWrap>
              <FormattedMessage id="appTitle" />
            </Typography>
            <Box flexGrow={1} />
            <IconButton onClick={toggleLanguage} color="inherit">
              <Language />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ flexGrow: 1, my: 4 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 4 }}>
            <Tab label={<FormattedMessage id="provideAid" />} />
            <Tab label={<FormattedMessage id="requestAid" />} />
          </Tabs>
          <Box mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              label={<FormattedMessage id="searchItems" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="category-filter-label">
                <FormattedMessage id="filterCategories" />
              </InputLabel>
              <Select
                labelId="category-filter-label"
                multiple
                value={filters}
                onChange={handleFilterChange}
                input={<OutlinedInput label={<FormattedMessage id="filterCategories" />} />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Typography variant="h5" gutterBottom>
                <FormattedMessage id={tabValue === 0 ? "availableAid" : "aidRequests"} />
              </Typography>
              {filteredPosts.map((post) => (
                <AidPost 
                  key={post.id} 
                  {...post}
                />
              ))}
              </Box>
            <Fab 
              color="primary" 
              aria-label={tabValue === 0 ? "provide aid" : "request aid"}
              style={{ position: 'fixed', bottom: 20, right: 20 }}
              onClick={() => setOpenDialog(true)}
            >
              <Add />
            </Fab>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitle>
                <FormattedMessage id={tabValue === 0 ? "provideAid" : "requestAid"} />
              </DialogTitle>
              <DialogContent>
                <PostForm 
                  onSubmit={handleSubmit}
                  onClose={() => setOpenDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </Container>
          <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 3, mt: 4 }}>
            <Container maxWidth="lg">
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Image src="/image.png" alt="Company Logo" width={40} height={40} />
                </Grid>
                <Grid item>
                  <Button
                    color="inherit"
                    startIcon={<Phone />}
                    href="tel:+96170994315"
                    sx={{ mr: 2 }}
                  >
                    <FormattedMessage id="callUs" />
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={<WhatsApp />}
                    href="https://wa.me/96170994315"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
      </IntlProvider>
    );
  };
  
  export default LebanonAidWebsite;