'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
	Container,
	Typography,
	Button,
	TextField,
	Box,
	Card,
	CardContent,
	List,
	ListItem,
	ListItemText,
	Divider,
	Checkbox,
	FormControlLabel,
	IconButton,
	CircularProgress,
	AppBar,
	Toolbar,
	CssBaseline,
	ThemeProvider,
	createTheme,
	Grid,
	Paper,
	Tooltip,
	Snackbar,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Chip,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Fab,
	OutlinedInput
} from '@mui/material'
import {
	Refresh as RefreshIcon,
	Delete as DeleteIcon,
	CheckCircle as ApproveIcon,
	Cancel as DisapproveIcon,
	Visibility as ViewIcon,
	Search as SearchIcon,
	ExitToApp as LogoutIcon
} from '@mui/icons-material'
import Image from 'next/image'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL || '',
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const theme = createTheme({
	palette: {
		primary: {
			main: '#1976d2'
		},
		secondary: {
			main: '#dc004e'
		},
		background: {
			default: '#ffffff',
			paper: '#f5f5f5'
		},
		text: {
			primary: '#000000',
			secondary: '#666666'
		}
	},
	typography: {
		fontFamily: 'Roboto, Arial, sans-serif'
	},
	shape: {
		borderRadius: 8
	},
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
					transition: 'box-shadow 0.3s ease-in-out',
					'&:hover': {
						boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
					}
				}
			}
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none'
				}
			}
		}
	}
})

const categories = [
	'Clothes',
	'Food',
	'Medicine',
	'Sleeping Tools',
	'Shoes',
	'Toys for Kids',
	'Electronics',
	'Other'
]

const AdminPage = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [posts, setPosts] = useState([])
	const [showUnapprovedOnly, setShowUnapprovedOnly] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedCategories, setSelectedCategories] = useState([])
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'info'
	})
	const [viewDialogOpen, setViewDialogOpen] = useState(false)
	const [selectedPost, setSelectedPost] = useState(null)
	const [stats, setStats] = useState({ total: 0, approved: 0, unapproved: 0 })

	useEffect(() => {
		if (isAuthenticated) {
			fetchPosts()
			fetchStats()
		}
	}, [isAuthenticated, showUnapprovedOnly])

	const fetchPosts = async () => {
		setIsLoading(true)
		let query = supabase
			.from('aid_posts')
			.select('*')
			.order('created_at', { ascending: false })

		if (showUnapprovedOnly) {
			query = query.eq('is_approved', false)
		}

		const { data, error } = await query

		if (error) {
			console.error('Error fetching posts:', error)
			setSnackbar({
				open: true,
				message: 'Error fetching posts. Please try again.',
				severity: 'error'
			})
		} else if (data) {
			setPosts(data)
		}
		setIsLoading(false)
	}

	const fetchStats = async () => {
		const { data, error } = await supabase
			.from('aid_posts')
			.select('id, is_approved')

		if (error) {
			console.error('Error fetching stats:', error)
		} else if (data) {
			const total = data.length
			const approved = data.filter(post => post.is_approved).length
			setStats({ total, approved, unapproved: total - approved })
		}
	}

	const handleLogin = e => {
		e.preventDefault()
		const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME
		const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

		if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
			setIsAuthenticated(true)
			setSnackbar({
				open: true,
				message: 'Login successful',
				severity: 'success'
			})
		} else {
			setSnackbar({
				open: true,
				message: 'Invalid credentials',
				severity: 'error'
			})
		}
	}

	const handleLogout = () => {
		setIsAuthenticated(false)
		setUsername('')
		setPassword('')
	}

	const handleApprove = async postId => {
		const { error } = await supabase
			.from('aid_posts')
			.update({ is_approved: true })
			.eq('id', postId)

		if (error) {
			console.error('Error approving post:', error)
			setSnackbar({
				open: true,
				message: 'Error approving post. Please try again.',
				severity: 'error'
			})
		} else {
			fetchPosts()
			fetchStats()
			setSnackbar({
				open: true,
				message: 'Post approved successfully',
				severity: 'success'
			})
		}
	}

	const handleDisapprove = async postId => {
		const { error } = await supabase
			.from('aid_posts')
			.update({ is_approved: false })
			.eq('id', postId)

		if (error) {
			console.error('Error disapproving post:', error)
			setSnackbar({
				open: true,
				message: 'Error disapproving post. Please try again.',
				severity: 'error'
			})
		} else {
			fetchPosts()
			fetchStats()
			setSnackbar({
				open: true,
				message: 'Post disapproved successfully',
				severity: 'success'
			})
		}
	}

	const handleDelete = async postId => {
		const { error } = await supabase.from('aid_posts').delete().eq('id', postId)

		if (error) {
			console.error('Error deleting post:', error)
			setSnackbar({
				open: true,
				message: 'Error deleting post. Please try again.',
				severity: 'error'
			})
		} else {
			fetchPosts()
			fetchStats()
			setSnackbar({
				open: true,
				message: 'Post deleted successfully',
				severity: 'success'
			})
		}
	}

	const handleRefresh = () => {
		fetchPosts()
		fetchStats()
	}

	const handleShowUnapprovedToggle = event => {
		setShowUnapprovedOnly(event.target.checked)
	}

	const handleSearch = event => {
		setSearchTerm(event.target.value)
	}

	const handleCategoryChange = event => {
		setSelectedCategories(event.target.value)
	}

	const handleViewPost = post => {
		setSelectedPost(post)
		setViewDialogOpen(true)
	}

	const filteredPosts = posts.filter(post => {
		const matchesSearch =
			post.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.category.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesCategory =
			selectedCategories.length === 0 ||
			selectedCategories.includes(post.category)
		return matchesSearch && matchesCategory
	})

	if (!isAuthenticated) {
		return (
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Container maxWidth='sm'>
					<Box mt={4} textAlign='center'>
						<Image src='/logo.png' alt='Logo' width={100} height={100} />
						<Typography variant='h4' gutterBottom>
							Admin Login
						</Typography>
						<form onSubmit={handleLogin}>
							<TextField
								fullWidth
								margin='normal'
								label='Username'
								value={username}
								onChange={e => setUsername(e.target.value)}
								required
							/>
							<TextField
								fullWidth
								margin='normal'
								label='Password'
								type='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
							/>
							<Button
								type='submit'
								variant='contained'
								color='primary'
								fullWidth
								sx={{ mt: 2 }}>
								Login
							</Button>
						</form>
					</Box>
				</Container>
			</ThemeProvider>
		)
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position='static' sx={{ backgroundColor: '#1976d2' }}>
					<Toolbar>
						<Typography
							variant='h6'
							component='div'
							sx={{ flexGrow: 1, color: '#ffffff' }}>
							Admin Dashboard
						</Typography>
						<Button
							color='inherit'
							onClick={handleLogout}
							startIcon={<LogoutIcon />}>
							Logout
						</Button>
					</Toolbar>
				</AppBar>
			</Box>
			<Container maxWidth='lg'>
				<Box mt={4}>
					<Grid container spacing={3}>
						<Grid item xs={12} md={4}>
							<Paper
								elevation={3}
								sx={{
									p: 2,
									display: 'flex',
									flexDirection: 'column',
									height: 140,
									backgroundColor: '#ffffff'
								}}>
								<Typography variant='h6' gutterBottom component='div'>
									Total Posts
								</Typography>
								<Typography component='p' variant='h4' color='primary'>
									{stats.total}
								</Typography>
							</Paper>
						</Grid>
						<Grid item xs={12} md={4}>
							<Paper
								elevation={3}
								sx={{
									p: 2,
									display: 'flex',
									flexDirection: 'column',
									height: 140,
									backgroundColor: '#ffffff'
								}}>
								<Typography variant='h6' gutterBottom component='div'>
									Approved Posts
								</Typography>
								<Typography component='p' variant='h4' color='success.main'>
									{stats.approved}
								</Typography>
							</Paper>
						</Grid>
						<Grid item xs={12} md={4}>
							<Paper
								elevation={3}
								sx={{
									p: 2,
									display: 'flex',
									flexDirection: 'column',
									height: 140,
									backgroundColor: '#ffffff'
								}}>
								<Typography variant='h6' gutterBottom component='div'>
									Unapproved Posts
								</Typography>
								<Typography component='p' variant='h4' color='error.main'>
									{stats.unapproved}
								</Typography>
							</Paper>
						</Grid>
					</Grid>
					<Box my={4}>
						<Grid
							container
							spacing={2}
							alignItems='center'
							className='bg-white rounded-lg pb-4 container mx-auto'>
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									variant='outlined'
									label='Search'
									value={searchTerm}
									onChange={handleSearch}
									InputProps={{
										startAdornment: <SearchIcon color='action' />
									}}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<FormControl fullWidth variant='outlined'>
									<InputLabel>Filter Categories</InputLabel>
									<Select
										multiple
										value={selectedCategories}
										onChange={handleCategoryChange}
										input={<OutlinedInput label='Filter Categories' />}
										renderValue={selected => (
											<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
												{selected.map(value => (
													<Chip key={value} label={value} />
												))}
											</Box>
										)}>
										{categories.map(category => (
											<MenuItem key={category} value={category}>
												<Checkbox
													checked={selectedCategories.indexOf(category) > -1}
												/>
												<ListItemText primary={category} />
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={4}>
								<FormControlLabel
									control={
										<Checkbox
											checked={showUnapprovedOnly}
											onChange={handleShowUnapprovedToggle}
											color='primary'
										/>
									}
									label='Show Unapproved Only'
									className='text-gray-500'
								/>
							</Grid>
						</Grid>
					</Box>
					{isLoading ? (
						<Box display='flex' justifyContent='center'>
							<CircularProgress />
						</Box>
					) : (
						<List>
							{filteredPosts.map(post => (
								<React.Fragment key={post.id}>
									<ListItem disablePadding>
										<Card
											sx={{ width: '100%', mb: 2, backgroundColor: '#ffffff' }}>
											<CardContent>
												<Grid container spacing={2} alignItems='center'>
													<Grid item xs={12} sm={6}>
														<Typography variant='h6' color='primary'>
															{post.first_name} {post.last_name}
														</Typography>
														<Typography color='text.secondary'>
															Phone: {post.phone_number}
														</Typography>
														<Typography color='text.secondary'>
															Location: {post.location}
														</Typography>
													</Grid>
													<Grid item xs={12} sm={6}>
														<Typography color='text.secondary'>
															Category: {post.category}
														</Typography>
														<Typography color='text.secondary'>
															Type:{' '}
															{post.is_providing
																? 'Providing Aid'
																: 'Requesting Aid'}
														</Typography>
														<Typography color='text.secondary'>
															Status:{' '}
															{post.is_approved ? (
																<Chip
																	label='Approved'
																	color='success'
																	size='small'
																/>
															) : (
																<Chip
																	label='Unapproved'
																	color='warning'
																	size='small'
																/>
															)}
														</Typography>
													</Grid>
													<Grid item xs={12}>
														<Box
															sx={{
																display: 'flex',
																justifyContent: 'flex-end',
																mt: 2
															}}>
															<Tooltip title='View Details'>
																<IconButton
																	onClick={() => handleViewPost(post)}
																	color='primary'>
																	<ViewIcon />
																</IconButton>
															</Tooltip>
															{post.is_approved ? (
																<Tooltip title='Disapprove'>
																	<IconButton
																		onClick={() => handleDisapprove(post.id)}
																		color='warning'>
																		<DisapproveIcon />
																	</IconButton>
																</Tooltip>
															) : (
																<Tooltip title='Approve'>
																	<IconButton
																		onClick={() => handleApprove(post.id)}
																		color='success'>
																		<ApproveIcon />
																	</IconButton>
																</Tooltip>
															)}
															<Tooltip title='Delete'>
																<IconButton
																	onClick={() => handleDelete(post.id)}
																	color='error'>
																	<DeleteIcon />
																</IconButton>
															</Tooltip>
														</Box>
													</Grid>
												</Grid>
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

			<Dialog
				open={viewDialogOpen}
				onClose={() => setViewDialogOpen(false)}
				maxWidth='md'
				fullWidth>
				<DialogTitle sx={{ backgroundColor: '#f5f5f5', color: '#000000' }}>
					Post Details
				</DialogTitle>
				<DialogContent sx={{ backgroundColor: '#ffffff', color: '#000000' }}>
					{selectedPost && (
						<Grid container spacing={2} sx={{ mt: 1 }}>
							<Grid item xs={12} sm={6}>
								<Typography variant='h6' color='primary'>
									{selectedPost.first_name} {selectedPost.last_name}
								</Typography>
								<Typography>
									<strong>Phone:</strong> {selectedPost.phone_number}
								</Typography>
								<Typography>
									<strong>Location:</strong> {selectedPost.location}
								</Typography>
								<Typography>
									<strong>Category:</strong> {selectedPost.category}
								</Typography>
								<Typography>
									<strong>Type:</strong>{' '}
									{selectedPost.is_providing
										? 'Providing Aid'
										: 'Requesting Aid'}
								</Typography>
								<Typography>
									<strong>Status:</strong>{' '}
									{selectedPost.is_approved ? (
										<Chip label='Approved' color='success' size='small' />
									) : (
										<Chip label='Unapproved' color='warning' size='small' />
									)}
								</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography variant='h6' color='primary'>
									Items
								</Typography>
								<List>
									{JSON.parse(selectedPost.item_description).map(
										(item, index) => (
											<ListItem key={index}>
												<Typography>
													{item.name}: {item.quantity}
												</Typography>
											</ListItem>
										)
									)}
								</List>
							</Grid>
						</Grid>
					)}
				</DialogContent>
				<DialogActions sx={{ backgroundColor: '#f5f5f5' }}>
					<Button onClick={() => setViewDialogOpen(false)} color='primary'>
						Close
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
				<Alert
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					severity={snackbar.severity}
					sx={{ width: '100%' }}>
					{snackbar.message}
				</Alert>
			</Snackbar>

			<Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
				<Tooltip title='Refresh'>
					<Fab
						color='primary'
						onClick={handleRefresh}
						sx={{ backgroundColor: '#1976d2', color: '#ffffff' }}>
						<RefreshIcon />
					</Fab>
				</Tooltip>
			</Box>
		</ThemeProvider>
	)
}

export default AdminPage
