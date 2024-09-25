'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { IntlProvider, FormattedMessage, useIntl } from 'react-intl'
import {
	Box,
	TextField,
	Button,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Card,
	CardContent,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Fab,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Chip,
	OutlinedInput,
	Grid,
	Divider,
	AppBar,
	Toolbar,
	Checkbox,
	FormControlLabel,
	CssBaseline,
	useMediaQuery,
	ThemeProvider,
	createTheme,
	Switch,
	Tabs,
	Tab,
	Slide,
	CircularProgress,
	Snackbar,
	Alert,
	Typography,
	Avatar,
	Container,
	Paper,
	Tooltip,
	Badge,
	LinearProgress,
	Link
} from '@mui/material'
import { styled } from '@mui/system'
import {
	LocationOn,
	Add,
	Remove,
	Phone,
	WhatsApp,
	Person,
	Category,
	Language,
	Brightness4,
	Brightness7,
	Search,
	FilterList,
	Close,
	VolunteerActivism,
	SupportAgent,
	Check,
	AccessTime,
	Refresh,
	Info,
	Star,
	StarBorder
} from '@mui/icons-material'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

import enMessages from '../locales/en.json'
import arMessages from '../locales/ar.json'

// Initialize Supabase client
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL || '',
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const categories = [
	{ en: 'Clothes', ar: 'ملابس' },
	{ en: 'Food', ar: 'طعام' },
	{ en: 'Medicine', ar: 'دواء' },
	{ en: 'Sleeping Tools', ar: 'أدوات النوم' },
	{ en: 'Shoes', ar: 'أحذية' },
	{ en: 'Toys for Kids', ar: 'ألعاب للأطفال' },
	{ en: 'Electronics', ar: 'إلكترونيات' },
	{ en: 'Other', ar: 'أخرى' }
]

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

// Styled components
const FullScreenContainer = styled(Box)({
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column'
})

const GlassCard = styled(Card)(({ theme }) => ({
	background:
		theme.palette.mode === 'light'
			? 'rgba(255, 255, 255, 0.7)'
			: 'rgba(18, 18, 18, 0.8)',
	backdropFilter: 'blur(10px)',
	borderRadius: theme.shape.borderRadius,
	boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
	transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
	'&:hover': {
		transform: 'translateY(-5px)',
		boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
	}
}))

const StyledFab = styled(Fab)(({ theme }) => ({
	position: 'fixed',
	bottom: theme.spacing(4),
	right: theme.spacing(4),
	zIndex: theme.zIndex.drawer + 2,
	background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
	'&:hover': {
		background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE73 90%)'
	}
}))

const ParallaxBackground = styled(Box)({
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	zIndex: -1
})

const StyledLink = styled(Link)(({ theme }) => ({
	color:
		theme.palette.mode === 'light'
			? theme.palette.primary.main
			: theme.palette.primary.light,
	'&:hover': {
		color: theme.palette.secondary.main
	}
}))

const AidPost = ({
	id,
	first_name,
	last_name,
	phone_number,
	location,
	created_at,
	category,
	item_description,
	is_providing,
	is_redeemed,
	is_anonymous,
	onRedeem
}) => {
	const [expanded, setExpanded] = useState(false)
	const intl = useIntl()
	let items = JSON.parse(item_description)

	const formatDate = dateString => {
		const date = new Date(dateString)
		return intl.formatDate(date, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		})
	}

	const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
		location
	)}`

	const translatedCategory = categories.find(
		cat => cat.en === category || cat.ar === category
	)
	const displayCategory = translatedCategory
		? intl.locale === 'en'
			? translatedCategory.en
			: translatedCategory.ar
		: category

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -50 }}
			transition={{ duration: 0.5 }}
			className='mb-5'>
			<GlassCard>
				<CardContent>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Box
								display='flex'
								justifyContent='space-between'
								alignItems='center'>
								<Typography variant='h5' component='div'>
									{is_anonymous
										? intl.formatMessage({ id: 'anonymous' })
										: `${first_name} ${last_name}`}
								</Typography>
								<Chip
									label={intl.formatMessage({
										id: is_providing ? 'providingAid' : 'requestingAid'
									})}
									color={is_providing ? 'success' : 'primary'}
									icon={
										is_providing ? (
											<VolunteerActivism className='' />
										) : (
											<SupportAgent />
										)
									}
									className='px-3'
								/>
							</Box>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Box display='flex' alignItems='center'>
								<Person sx={{ mr: 1 }} />
								<Typography variant='body2'>{phone_number}</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Box display='flex' alignItems='center'>
								<LocationOn sx={{ mr: 1 }} />
								<Typography variant='body2'>{location}</Typography>
							</Box>
						</Grid>
						<Grid item xs={12}>
							<Typography color='text.secondary' variant='body2'>
								{intl.formatMessage({ id: 'postedOn' })}:{' '}
								{formatDate(created_at)}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid item xs={12}>
							<Box display='flex' alignItems='center'>
								<Category sx={{ mr: 1 }} className='mx-2' />
								<Typography variant='body1'>
									<strong>{intl.formatMessage({ id: 'category' })}:</strong>{' '}
									{displayCategory}
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12}>
							<Typography variant='body1'>
								<strong>{intl.formatMessage({ id: 'items' })}:</strong>
							</Typography>
							<List dense>
								{items
									.slice(0, expanded ? items.length : 3)
									.map((item, index) => (
										<ListItem key={index}>
											<ListItemText
												primary={`${item.name}: ${item.quantity}`}
											/>
										</ListItem>
									))}
							</List>
							{items.length > 3 && (
								<Button onClick={() => setExpanded(!expanded)}>
									{expanded
										? intl.formatMessage({ id: 'showLess' })
										: intl.formatMessage({
												id: 'showMore',
												values: { count: items.length - 3 }
										  })}
								</Button>
							)}
						</Grid>
						<Grid item xs={12}>
							<Box sx={{ width: '100%', height: '200px', mb: 2 }}>
								<iframe
									width='100%'
									height='100%'
									style={{ border: 0, borderRadius: '4px' }}
									loading='lazy'
									allowFullScreen
									src={googleMapsUrl}></iframe>
							</Box>
						</Grid>
						<Grid item xs={12}>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									mt: 2
								}}>
								<Button
									variant='contained'
									color='primary'
									startIcon={<Phone className='mx-2' />}
									href={`tel:${phone_number}`}>
									{intl.formatMessage({ id: 'callUs' })}
								</Button>
								<Button
									variant='contained'
									color='success'
									startIcon={<WhatsApp className='mx-2' />}
									href={`https://wa.me/${phone_number}`}
									target='_blank'
									rel='noopener noreferrer'>
									WhatsApp
								</Button>
							</Box>
						</Grid>
					</Grid>
				</CardContent>
			</GlassCard>
		</motion.div>
	)
}

const PostForm = ({ onSubmit, onClose, isProviding }) => {
	const intl = useIntl()
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		phoneNumber: '',
		location: '',
		category: '',
		otherCategory: '',
		items: [{ name: '', quantity: 1 }],
		isAnonymous: false
	})

	useEffect(() => {
		const script = document.createElement('script')
		script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
		script.async = true
		document.body.appendChild(script)

		script.onload = () => {
			const input = document.getElementById('location-input')
			if (
				input &&
				window.google &&
				window.google.maps &&
				window.google.maps.places
			) {
				new window.google.maps.places.Autocomplete(input)
			}
		}

		return () => {
			document.body.removeChild(script)
		}
	}, [])

	const handleSubmit = async e => {
		e.preventDefault()

		if (
			formData.items.length === 0 ||
			formData.items.some(item => item.name.trim() === '')
		) {
			alert(intl.formatMessage({ id: 'addItemAlert' }))
			return
		}

		await onSubmit({ ...formData, isProviding })
		onClose()
	}

	const handleChange = e => {
		const { name, value, type, checked } = e.target
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}))
	}

	const addItem = () => {
		setFormData(prev => ({
			...prev,
			items: [...prev.items, { name: '', quantity: 1 }]
		}))
	}

	const removeItem = index => {
		setFormData(prev => ({
			...prev,
			items: prev.items.filter((_, i) => i !== index)
		}))
	}

	const updateItem = (index, field, value) => {
		setFormData(prev => ({
			...prev,
			items: prev.items.map((item, i) =>
				i === index ? { ...item, [field]: value } : item
			)
		}))
	}

	return (
		<form onSubmit={handleSubmit}>
			{!formData.isAnonymous && (
				<>
					<TextField
						fullWidth
						margin='normal'
						name='firstName'
						label={intl.formatMessage({ id: 'firstName' })}
						value={formData.firstName}
						onChange={handleChange}
						required={!formData.isAnonymous}
					/>
					<TextField
						fullWidth
						margin='normal'
						name='lastName'
						label={intl.formatMessage({ id: 'lastName' })}
						value={formData.lastName}
						onChange={handleChange}
						required={!formData.isAnonymous}
					/>
				</>
			)}
			<TextField
				fullWidth
				margin='normal'
				name='phoneNumber'
				label={intl.formatMessage({ id: 'phoneNumber' })}
				value={formData.phoneNumber}
				onChange={handleChange}
				required
			/>
			<TextField
				fullWidth
				margin='normal'
				name='location'
				label={intl.formatMessage({ id: 'location' })}
				id='location-input'
				value={formData.location}
				onChange={handleChange}
				required
			/>
			<FormControl fullWidth margin='normal'>
				<InputLabel>{intl.formatMessage({ id: 'category' })}</InputLabel>
				<Select
					name='category'
					value={formData.category}
					onChange={handleChange}
					required>
					{categories.map(category => (
						<MenuItem key={category.en} value={category.en}>
							{intl.locale === 'en' ? category.en : category.ar}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			{formData.category === 'Other' && (
				<TextField
					fullWidth
					margin='normal'
					name='otherCategory'
					label={intl.formatMessage({ id: 'otherCategory' })}
					value={formData.otherCategory}
					onChange={handleChange}
					required
				/>
			)}
			{formData.category && (
				<>
					<Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
						{intl.formatMessage({ id: 'items' })}
					</Typography>
					<List>
						{formData.items.map((item, index) => (
							<ListItem key={index}>
								<TextField
									label={intl.formatMessage({ id: 'itemName' })}
									value={item.name}
									onChange={e => updateItem(index, 'name', e.target.value)}
									required
									sx={{ mr: 2 }}
								/>
								<TextField
									label={intl.formatMessage({ id: 'quantity' })}
									type='number'
									value={item.quantity}
									onChange={e =>
										updateItem(index, 'quantity', parseInt(e.target.value))
									}
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
						{intl.formatMessage({ id: 'addItem' })}
					</Button>
				</>
			)}
			<FormControlLabel
				control={
					<Checkbox
						checked={formData.isAnonymous}
						onChange={handleChange}
						name='isAnonymous'
					/>
				}
				label={intl.formatMessage({ id: 'postAnonymously' })}
			/>
			<DialogActions>
				<Button onClick={onClose}>
					{intl.formatMessage({ id: 'cancel' })}
				</Button>
				<Button type='submit' variant='contained' color='primary'>
					{intl.formatMessage({ id: 'submit' })}
				</Button>
			</DialogActions>
		</form>
	)
}

const LebanonAidWebsite = () => {
	const [posts, setPosts] = useState([])
	const [tabValue, setTabValue] = useState(0)
	const [openDialog, setOpenDialog] = useState(false)
	const [filters, setFilters] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [language, setLanguage] = useState('en')
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
	const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light')
	const [loading, setLoading] = useState(true)
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'info'
	})
	const [stats, setStats] = useState({ total: 0})

	const theme = useMemo(
		() =>
			createTheme({
				typography: {
					fontFamily: 'var(--font-roboto), Arial, sans-serif'
				},
				palette: {
					mode,
					primary: {
						main: '#2196f3'
					},
					secondary: {
						main: '#f50057'
					},
					background: {
						default: mode === 'light' ? '#f0f2f5' : '#121212',
						paper: mode === 'light' ? '#ffffff' : '#1e1e1e'
					}
				},
				shape: {
					borderRadius: 12
				},
				components: {
					MuiButton: {
						styleOverrides: {
							root: {
								borderRadius: 20,
								textTransform: 'none'
							}
						}
					},
					MuiCard: {
						styleOverrides: {
							root: {
								borderRadius: 16
							}
						}
					}
				},
				direction: language === 'ar' ? 'rtl' : 'ltr'
			}),
		[mode, language]
	)

	const intl = useIntl()

	useEffect(() => {
		fetchPosts()
		fetchStats()
	}, [])

	const fetchPosts = async () => {
		setLoading(true)
		const { data, error } = await supabase
			.from('aid_posts')
			.select('*')
			.eq('is_approved', true)
			.order('created_at', { ascending: false })

		if (error) {
			console.error('Error fetching posts:', error)
			setSnackbar({
				open: true,
				message: intl.formatMessage({ id: 'errorFetchingPosts' }),
				severity: 'error'
			})
		} else if (data) {
			setPosts(data)
		}
		setLoading(false)
	}

	const fetchStats = async () => {
		const { data, error } = await supabase
			.from('aid_posts')
			.select('id, is_redeemed')
			.eq('is_approved', true)

		if (error) {
			console.error('Error fetching stats:', error)
		} else if (data) {
			const total = data.length
			const redeemed = data.filter(post => post.is_redeemed).length
			setStats({ total, redeemed })
		}
	}

	const handleSubmit = async formData => {
		setLoading(true)
		const { error } = await supabase.from('aid_posts').insert([
			{
				first_name: formData.isAnonymous ? 'Anonymous' : formData.firstName,
				last_name: formData.isAnonymous ? '' : formData.lastName,
				phone_number: formData.phoneNumber,
				location: formData.location,
				category:
					formData.category === 'Other'
						? formData.otherCategory
						: formData.category,
				item_description: JSON.stringify(formData.items),
				is_providing: formData.isProviding,
				is_anonymous: formData.isAnonymous,
				is_approved: false,
				is_redeemed: false
			}
		])

		if (error) {
			console.error('Error submitting post:', error)
			setSnackbar({
				open: true,
				message: intl.formatMessage({ id: 'errorSubmittingPost' }),
				severity: 'error'
			})
		} else {
			// Send email notification
			try {
				const response = await fetch('/api/notify-new-post', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(formData)
				})

				if (!response.ok) {
					console.error('Failed to send email notification')
				}
			} catch (emailError) {
				console.error('Error sending email notification:', emailError)
			}

			setSnackbar({
				open: true,
				message: intl.formatMessage({ id: 'postSubmittedForApproval' }),
				severity: 'success'
			})
		}
		setLoading(false)
	}

  
	const handleRedeem = async postId => {
		const { error } = await supabase
			.from('aid_posts')
			.update({ is_redeemed: true })
			.eq('id', postId)

		if (error) {
			console.error('Error redeeming post:', error)
			setSnackbar({
				open: true,
				message: intl.formatMessage({ id: 'errorRedeemingPost' }),
				severity: 'error'
			})
		} else {
			fetchPosts()
			fetchStats()
			setSnackbar({
				open: true,
				message: intl.formatMessage({ id: 'postRedeemedSuccessfully' }),
				severity: 'success'
			})
		}
	}

	const filteredPosts = posts.filter(post => {
		const matchesFilter =
			filters.length === 0 || filters.includes(post.category)
		const matchesSearch =
			searchTerm === '' ||
			JSON.parse(post.item_description).some(item =>
				item.name.toLowerCase().includes(searchTerm.toLowerCase())
			)
		return (
			(tabValue === 0 ? post.is_providing : !post.is_providing) &&
			matchesFilter &&
			matchesSearch
		)
	})

	const handleFilterChange = event => {
		setFilters(event.target.value)
	}

	const toggleLanguage = () => {
		setLanguage(lang => (lang === 'en' ? 'ar' : 'en'))
	}

	const toggleColorMode = () => {
		setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))
	}

	return (
		<IntlProvider
			messages={language === 'en' ? enMessages : arMessages}
			locale={language}
			defaultLocale='en'>
			<ThemeProvider theme={theme}>
				<CssBaseline />

				<FullScreenContainer dir={language === 'ar' ? 'rtl' : 'ltr'}>
					<ParallaxBackground>
						<Box
							sx={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								background:
									theme.palette.mode === 'light'
										? 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)'
										: 'linear-gradient(120deg, #4a4a4a 0%, #2b2b2b 100%)'
							}}
						/>
						<Box
							sx={{
								position: 'absolute',
								top: '20%',
								left: '10%',
								width: '300px',
								height: '300px',
								background:
									'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
								borderRadius: '50%'
							}}
						/>
					</ParallaxBackground>

					<AppBar position='fixed' color='transparent' elevation={0}>
						<Toolbar>
							<Image
								src='/flag.png'
								alt='Lebanese Flag'
								width={40}
								height={40}
								style={{ marginRight: '16px' }}
								className='mx-2'
							/>
							<Typography
								variant='h6'
								color='inherit'
								noWrap
								sx={{ flexGrow: 1 }}>
								<FormattedMessage id='appTitle' />
							</Typography>
							<IconButton onClick={toggleLanguage} color='inherit'>
								<Language />
							</IconButton>
							<IconButton onClick={toggleColorMode} color='inherit'>
								{mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
							</IconButton>
						</Toolbar>
					</AppBar>

					<Container maxWidth='lg' sx={{ mt: 10, mb: 4 }}>
						<Box sx={{ my: 4 }}>
							<Typography
								variant='h2'
								align='center'
								gutterBottom
								className='gradient-text'>
								<FormattedMessage id='welcomeMessage' />
							</Typography>
							<Typography
								variant='h5'
								align='center'
								color='textSecondary'
								paragraph>
								<FormattedMessage id='sitePurpose' />
							</Typography>
						</Box>


						<Tabs
							value={tabValue}
							onChange={(_, newValue) => setTabValue(newValue)}
							sx={{ mb: 4 }}
							variant='fullWidth'
							indicatorColor='secondary'
							textColor='secondary'
							centered>
							<Tab
								label={<FormattedMessage id='provideAid' />}
								icon={<VolunteerActivism className='mx-2' />}
								iconPosition='start'
							/>
							<Tab
								label={<FormattedMessage id='requestAid' />}
								icon={<SupportAgent className='mx-2' />}
								iconPosition='start'
							/>
						</Tabs>

						<Box mb={2}>
							<TextField
								fullWidth
								variant='outlined'
								label={<FormattedMessage id='searchItems' />}
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								InputProps={{
									startAdornment: <Search color='action' />,
									endAdornment: searchTerm && (
										<IconButton onClick={() => setSearchTerm('')} edge='end'>
											<Close />
										</IconButton>
									)
								}}
							/>
						</Box>

						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel id='category-filter-label'>
								<FormattedMessage id='filterCategories' />
							</InputLabel>
							<Select
								labelId='category-filter-label'
								multiple
								value={filters}
								onChange={handleFilterChange}
								input={
									<OutlinedInput
										label={<FormattedMessage id='filterCategories' />}
									/>
								}
								renderValue={selected => (
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
										{selected.map(value => {
											const category = categories.find(
												cat => cat.en === value || cat.ar === value
											)
											const displayValue = category
												? language === 'en'
													? category.en
													: category.ar
												: value
											return (
												<Chip
													key={value}
													label={displayValue}
													onDelete={() => {
														setFilters(filters.filter(f => f !== value))
													}}
													color='primary'
													variant='outlined'
												/>
											)
										})}
									</Box>
								)}
								MenuProps={{
									PaperProps: {
										style: {
											maxHeight: 48 * 4.5 + 8,
											width: 250
										}
									}
								}}>
								{categories.map(category => (
									<MenuItem key={category.en} value={category.en}>
										<Checkbox checked={filters.indexOf(category.en) > -1} />
										<ListItemText
											primary={language === 'en' ? category.en : category.ar}
										/>
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<Box>
							<Typography variant='h5' gutterBottom>
								<FormattedMessage
									id={tabValue === 0 ? 'availableAid' : 'aidRequests'}
								/>
							</Typography>
							{loading ? (
								<Box display='flex' justifyContent='center' my={4}>
									<CircularProgress />
								</Box>
							) : filteredPosts.length > 0 ? (
								<AnimatePresence>
									{filteredPosts.map(post => (
										<motion.div
											key={post.id}
											initial={{ opacity: 0, y: 50 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -50 }}
											transition={{ duration: 0.5 }}>
											<AidPost {...post} onRedeem={handleRedeem} />
										</motion.div>
									))}
								</AnimatePresence>
							) : (
								<Typography variant='body1' align='center' sx={{ mt: 4 }}>
									<FormattedMessage id='noPostsFound' />
								</Typography>
							)}
						</Box>
					</Container>

					<Box
						component='footer'
						sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto' }}>
						<Container maxWidth='lg'>
							<Grid
								container
								spacing={4}
								justifyContent='space-evenly'
								alignItems='center'>
								<Grid item xs={12} sm={6} md={3}>
									<Box
										display='flex'
										justifyContent='center'
										alignItems='center'>
										<Image
											src='/qwerty-logo.png'
											alt='qwerty Logo'
											width={100}
											height={100}
										/>
									</Box>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant='h6' color='text.primary' gutterBottom>
										<FormattedMessage id='aboutUs' />
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										<FormattedMessage id='aboutUsDescription' />
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant='h6' color='text.primary' gutterBottom>
										<FormattedMessage id='contact' />
									</Typography>
									<Button
										variant='outlined'
										color='primary'
										startIcon={<Phone className='mx-2' />}
										href='tel:+96170994315'
										sx={{ mb: 1, mr: 1 }}>
										<FormattedMessage id='callUs' />
									</Button>
									<Button
										variant='outlined'
										color='success'
										startIcon={<WhatsApp className='mx-2' />}
										href='https://wa.me/96170994315'
										target='_blank'
										rel='noopener noreferrer'
										sx={{ mb: 1 }}>
										WhatsApp
									</Button>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Typography variant='h6' color='text.primary' gutterBottom>
									</Typography>
									<Box>
										<StyledLink
											href='https://notqwerty.com'
											target='_blank'
											rel='noopener noreferrer'>
											Website
										</StyledLink>
									</Box>
									<Box>
										<StyledLink
											href='https://www.instagram.com/notqwerty.co/'
											target='_blank'
											rel='noopener noreferrer'>
											Instagram
										</StyledLink>
									</Box>
									<Box>
										<StyledLink
											href='https://www.linkedin.com/company/qwerty-com/posts/?feedView=all'
											target='_blank'
											rel='noopener noreferrer'>
											LinkedIn
										</StyledLink>
									</Box>
								</Grid>
							</Grid>
							<Box mt={5}>
								<Typography
									variant='body2'
									color='text.secondary'
									align='center'>
									{'Copyright © '}
									<Link color='inherit' href='https://www.notqwerty.com/'>
										QWERTY
									</Link>{' '}
									{new Date().getFullYear()}
									{'.'}
								</Typography>
							</Box>
						</Container>
					</Box>

					<StyledFab
						color='secondary'
						aria-label={tabValue === 0 ? 'provide aid' : 'request aid'}
						onClick={() => setOpenDialog(true)}>
						<Add />
					</StyledFab>

					<Dialog
						open={openDialog}
						onClose={() => setOpenDialog(false)}
						fullWidth
						maxWidth='sm'
						TransitionComponent={Slide}
						TransitionProps={{ direction: 'up' }}>
						<DialogTitle>
							<FormattedMessage
								id={tabValue === 0 ? 'provideAid' : 'requestAid'}
							/>
						</DialogTitle>
						<DialogContent>
							<PostForm
								onSubmit={handleSubmit}
								onClose={() => setOpenDialog(false)}
								isProviding={tabValue === 0}
							/>
						</DialogContent>
					</Dialog>
				</FullScreenContainer>

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
			</ThemeProvider>
		</IntlProvider>
	)
}

export default LebanonAidWebsite