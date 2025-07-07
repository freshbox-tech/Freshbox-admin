'use client'
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Tabs,
  Tab,
  InputAdornment,
  FormControlLabel,
  Switch,
  Alert,
  Tooltip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as CouponIcon,
  Discount as DiscountIcon,
  Event as EventIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  QrCode as CodeIcon,
  AttachMoney as MoneyIcon,
  ShoppingBag as BagIcon,
  Percent as PercentIcon,
  ContentCopy as CopyIcon,
  FilterList as FilterIcon,
  Info as InfoIcon
} from '@mui/icons-material';


// Dummy data for promotions
const initialPromotions = [
  {
    id: 1,
    name: 'New User Welcome',
    code: 'WELCOME25',
    type: 'percentage',
    value: 25,
    minOrderValue: 30,
    maxDiscount: 50,
    description: 'Welcome discount for new users',
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    isActive: true,
    usageLimit: 1,
    usageCount: 127,
    applicableServices: ['All'],
    eligibleUsers: 'new',
    eligiblePlans: ['All'],
    createdAt: '2024-12-15',
    updatedAt: '2025-01-10'
  },
  {
    id: 2,
    name: 'Summer Special',
    code: 'SUMMER15',
    type: 'percentage',
    value: 15,
    minOrderValue: 50,
    maxDiscount: 30,
    description: 'Summer season discount',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    isActive: true,
    usageLimit: 5,
    usageCount: 0,
    applicableServices: ['Wash & Fold', 'Dry Cleaning'],
    eligibleUsers: 'all',
    eligiblePlans: ['All'],
    createdAt: '2025-02-15',
    updatedAt: '2025-02-15'
  },
  {
    id: 3,
    name: 'Premium Member Exclusive',
    code: 'PREMIUM20',
    type: 'percentage',
    value: 20,
    minOrderValue: 0,
    maxDiscount: null,
    description: 'Exclusive discount for Premium plan members',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    isActive: true,
    usageLimit: null,
    usageCount: 286,
    applicableServices: ['All'],
    eligibleUsers: 'all',
    eligiblePlans: ['Premium'],
    createdAt: '2024-11-20',
    updatedAt: '2025-01-05'
  },
  {
    id: 4,
    name: 'Bulk Order Discount',
    code: 'BULK10',
    type: 'fixed',
    value: 10,
    minOrderValue: 100,
    maxDiscount: null,
    description: 'Fixed discount for large orders',
    startDate: '2025-01-15',
    endDate: '2025-12-31',
    isActive: true,
    usageLimit: null,
    usageCount: 73,
    applicableServices: ['Wash & Fold', 'Bedding & Linens'],
    eligibleUsers: 'all',
    eligiblePlans: ['All'],
    createdAt: '2025-01-10',
    updatedAt: '2025-01-15'
  },
  {
    id: 5,
    name: 'First-time Dry Cleaning',
    code: 'DRYCLEAN5',
    type: 'fixed',
    value: 5,
    minOrderValue: 25,
    maxDiscount: null,
    description: 'Discount for first-time dry cleaning users',
    startDate: '2025-02-01',
    endDate: '2025-05-31',
    isActive: true,
    usageLimit: 1,
    usageCount: 45,
    applicableServices: ['Dry Cleaning'],
    eligibleUsers: 'all',
    eligiblePlans: ['All'],
    createdAt: '2025-01-20',
    updatedAt: '2025-01-25'
  },
  {
    id: 6,
    name: 'Weekend Special',
    code: 'WEEKEND10',
    type: 'percentage',
    value: 10,
    minOrderValue: 20,
    maxDiscount: 15,
    description: 'Weekend orders discount',
    startDate: '2024-12-01',
    endDate: '2025-03-31',
    isActive: false,
    usageLimit: 10,
    usageCount: 156,
    applicableServices: ['All'],
    eligibleUsers: 'all',
    eligiblePlans: ['All'],
    createdAt: '2024-11-25',
    updatedAt: '2025-01-05'
  }
];

// Dummy service data for reference
const services = [
  'Wash & Fold',
  'Dry Cleaning',
  'Ironing & Pressing',
  'Bedding & Linens',
  'Stain Removal'
];

// Membership plans
const membershipPlans = [
  'Basic',
  'Premium',
  'Enterprise'
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    // Simulate fetching promotions from API
    setPromotions(initialPromotions);
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleAddPromotion = () => {
    setSelectedPromotion({
      id: null,
      name: '',
      code: '',
      type: 'percentage',
      value: 0,
      minOrderValue: 0,
      maxDiscount: null,
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
      isActive: true,
      usageLimit: null,
      usageCount: 0,
      applicableServices: ['All'],
      eligibleUsers: 'all',
      eligiblePlans: ['All'],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    });
    setValidationErrors({});
    setOpenDialog(true);
  };

  const handleEditPromotion = (promotion) => {
    setSelectedPromotion({...promotion});
    setValidationErrors({});
    setOpenDialog(true);
  };

  const handleDeletePromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPromotion(null);
    setValidationErrors({});
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedPromotion(null);
  };

  const validatePromotion = (promotion) => {
    const errors = {};
    if (!promotion.name.trim()) errors.name = 'Name is required';
    if (!promotion.code.trim()) errors.code = 'Code is required';
    else if (!/^[A-Z0-9]+$/.test(promotion.code)) errors.code = 'Code must contain only uppercase letters and numbers';
    if (promotion.value <= 0) errors.value = 'Value must be greater than 0';
    if (promotion.minOrderValue < 0) errors.minOrderValue = 'Minimum order value cannot be negative';
    if (promotion.maxDiscount !== null && promotion.maxDiscount <= 0) errors.maxDiscount = 'Maximum discount must be greater than 0';
    if (!promotion.startDate) errors.startDate = 'Start date is required';
    if (!promotion.endDate) errors.endDate = 'End date is required';
    if (new Date(promotion.startDate) > new Date(promotion.endDate)) errors.endDate = 'End date must be after start date';
    if (promotion.usageLimit !== null && promotion.usageLimit <= 0) errors.usageLimit = 'Usage limit must be greater than 0';
    
    return errors;
  };

  const handleSavePromotion = () => {
    const errors = validatePromotion(selectedPromotion);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (selectedPromotion.id) {
      // Update existing promotion
      setPromotions(promotions.map(p => 
        p.id === selectedPromotion.id ? 
        { ...selectedPromotion, updatedAt: new Date().toISOString().split('T')[0] } : 
        p
      ));
    } else {
      // Add new promotion
      const newPromotion = {
        ...selectedPromotion,
        id: Math.max(...promotions.map(p => p.id)) + 1,
        usageCount: 0,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setPromotions([...promotions, newPromotion]);
    }
    
    setOpenDialog(false);
    setSelectedPromotion(null);
    setValidationErrors({});
  };

  const handleConfirmDelete = () => {
    setPromotions(promotions.filter(p => p.id !== selectedPromotion.id));
    setOpenDeleteDialog(false);
    setSelectedPromotion(null);
  };

  const handleToggleActive = (id) => {
    setPromotions(promotions.map(promo => 
      promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
    ));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };

  // Filter promotions
  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = 
      promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && promotion.isActive) || 
      (statusFilter === 'inactive' && !promotion.isActive) ||
      (statusFilter === 'upcoming' && new Date(promotion.startDate) > new Date()) ||
      (statusFilter === 'expired' && new Date(promotion.endDate) < new Date());
    
    const matchesType = 
      typeFilter === 'all' || 
      promotion.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Active promotions (for first tab)
  const activePromotions = filteredPromotions.filter(
    promotion => promotion.isActive && 
    new Date(promotion.startDate) <= new Date() && 
    new Date(promotion.endDate) >= new Date()
  );

  // Upcoming promotions (for first tab)
  const upcomingPromotions = filteredPromotions.filter(
    promotion => promotion.isActive && new Date(promotion.startDate) > new Date()
  );

  // Expired promotions (for first tab)
  const expiredPromotions = filteredPromotions.filter(
    promotion => !promotion.isActive || new Date(promotion.endDate) < new Date()
  );

  // Calculate usage percentage
  const getUsagePercentage = (promo) => {
    if (!promo.usageLimit) return 0; // Unlimited usage
    return (promo.usageCount / promo.usageLimit) * 100;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
         <Box sx={{ mb: 4 }}>
       <Typography variant="h4"  color="text.secondary" component="h1" gutterBottom>
       Development in Progress
       </Typography>
    
     </Box>
    </>
//     <>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Discounts & Promotions
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           Manage discount codes and promotional offers
//         </Typography>
//       </Box>

//       <Box sx={{ mb: 3 }}>
//         <Tabs value={currentTab} onChange={handleTabChange} aria-label="promotion tabs">
//           <Tab label="Overview" />
//           <Tab label="All Promotions" />
//         </Tabs>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <TextField
//             placeholder="Search promotions..."
//             size="small"
//             value={searchTerm}
//             onChange={handleSearch}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <FilterIcon />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ width: 250 }}
//           />
//           <FormControl size="small" sx={{ minWidth: 150 }}>
//             <InputLabel id="status-filter-label">Status</InputLabel>
//             <Select
//               labelId="status-filter-label"
//               value={statusFilter}
//               label="Status"
//               onChange={handleStatusFilterChange}
//             >
//               <MenuItem value="all">All Statuses</MenuItem>
//               <MenuItem value="active">Active</MenuItem>
//               <MenuItem value="inactive">Inactive</MenuItem>
//               <MenuItem value="upcoming">Upcoming</MenuItem>
//               <MenuItem value="expired">Expired</MenuItem>
//             </Select>
//           </FormControl>
//           <FormControl size="small" sx={{ minWidth: 150 }}>
//             <InputLabel id="type-filter-label">Type</InputLabel>
//             <Select
//               labelId="type-filter-label"
//               value={typeFilter}
//               label="Type"
//               onChange={handleTypeFilterChange}
//             >
//               <MenuItem value="all">All Types</MenuItem>
//               <MenuItem value="percentage">Percentage</MenuItem>
//               <MenuItem value="fixed">Fixed Amount</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={handleAddPromotion}
//         >
//           Add New Promotion
//         </Button>
//       </Box>

//       {/* Overview Tab */}
//       {currentTab === 0 && (
//         <>
//           <Grid container spacing={3} sx={{ mb: 4 }}>
//             <Grid item xs={12} md={4}>
//               <Card>
//                 <CardContent>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                     <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
//                       <CheckIcon />
//                     </Avatar>
//                     <Typography variant="h6">
//                       Active Promotions
//                     </Typography>
//                   </Box>
//                   <Typography variant="h3" component="div" gutterBottom>
//                     {activePromotions.length}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Currently running promotional offers
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Card>
//                 <CardContent>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                     <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
//                       <EventIcon />
//                     </Avatar>
//                     <Typography variant="h6">
//                       Upcoming Promotions
//                     </Typography>
//                   </Box>
//                   <Typography variant="h3" component="div" gutterBottom>
//                     {upcomingPromotions.length}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Scheduled future promotional offers
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Card>
//                 <CardContent>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                     <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
//                       <CloseIcon />
//                     </Avatar>
//                     <Typography variant="h6">
//                       Expired Promotions
//                     </Typography>
//                   </Box>
//                   <Typography variant="h3" component="div" gutterBottom>
//                     {expiredPromotions.length}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Past promotional offers
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>

//           {/* Active Promotions */}
//           <Typography variant="h6" gutterBottom>
//             Active Promotions
//           </Typography>
//           <Grid container spacing={3} sx={{ mb: 4 }}>
//             {activePromotions.length > 0 ? (
//               activePromotions.map((promo) => (
//                 <Grid item key={promo.id} xs={12} sm={6} md={4}>
//                   <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//                     <CardContent sx={{ flexGrow: 1 }}>
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                         <Typography variant="h6" component="div">
//                           {promo.name}
//                         </Typography>
//                         <Chip
//                           label={promo.type === 'percentage' ? `${promo.value}%` : `${promo.value}`}
//                           color={promo.type === 'percentage' ? 'primary' : 'secondary'}
//                           size="small"
//                         />
//                       </Box>
                      
//                       <Chip
//                         label={promo.code}
//                         icon={<CodeIcon />}
//                         variant="outlined"
//                         sx={{ mb: 2 }}
//                       />
                      
//                       <Typography variant="body2" color="text.secondary" paragraph>
//                         {promo.description}
//                       </Typography>
                      
//                       <Divider sx={{ my: 1 }} />
                      
//                       <Grid container spacing={1} sx={{ mb: 1 }}>
//                         <Grid item xs={6}>
//                           <Typography variant="caption" color="text.secondary">
//                             Start Date
//                           </Typography>
//                           <Typography variant="body2">
//                             {formatDate(promo.startDate)}
//                           </Typography>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Typography variant="caption" color="text.secondary">
//                             End Date
//                           </Typography>
//                           <Typography variant="body2">
//                             {formatDate(promo.endDate)}
//                           </Typography>
//                         </Grid>
//                       </Grid>
                      
//                       {promo.usageLimit && (
//                         <Box sx={{ mt: 2 }}>
//                           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
//                             <Typography variant="body2">
//                               Usage: {promo.usageCount}/{promo.usageLimit}
//                             </Typography>
//                             <Typography variant="body2">
//                               {Math.min(100, Math.round(getUsagePercentage(promo)))}%
//                             </Typography>
//                           </Box>
//                           <LinearProgress
//                             variant="determinate"
//                             value={Math.min(100, getUsagePercentage(promo))}
//                             color={getUsagePercentage(promo) > 80 ? 'error' : 'primary'}
//                           />
//                         </Box>
//                       )}
//                     </CardContent>
//                     <Divider />
//                     <CardActions>
//                       <Button 
//                         size="small" 
//                         startIcon={<EditIcon />}
//                         onClick={() => handleEditPromotion(promo)}
//                       >
//                         Edit
//                       </Button>
//                       <Button 
//                         size="small" 
//                         color="error"
//                         startIcon={<DeleteIcon />}
//                         onClick={() => handleDeletePromotion(promo)}
//                       >
//                         Delete
//                       </Button>
//                     </CardActions>
//                   </Card>
//                 </Grid>
//               ))
//             ) : (
//               <Grid item xs={12}>
//                 <Paper sx={{ p: 3, textAlign: 'center' }}>
//                   <Typography variant="body1" color="text.secondary">
//                     No active promotions found.
//                   </Typography>
//                 </Paper>
//               </Grid>
//             )}
//           </Grid>

//           {/* Upcoming Promotions */}
//           {upcomingPromotions.length > 0 && (
//             <>
//               <Typography variant="h6" gutterBottom>
//                 Upcoming Promotions
//               </Typography>
//               <TableContainer component={Paper} sx={{ mb: 4 }}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Code</TableCell>
//                       <TableCell>Value</TableCell>
//                       <TableCell>Duration</TableCell>
//                       <TableCell>Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {upcomingPromotions.map((promo) => (
//                       <TableRow key={promo.id} hover>
//                         <TableCell>
//                           <Typography variant="body2" fontWeight="medium">
//                             {promo.name}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             {promo.description}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Chip label={promo.code} size="small" />
//                         </TableCell>
//                         <TableCell>
//                           {promo.type === 'percentage' ? `${promo.value}%` : `${promo.value}`}
//                         </TableCell>
//                         <TableCell>
//                           {formatDate(promo.startDate)} — {formatDate(promo.endDate)}
//                         </TableCell>
//                         <TableCell>
//                           <IconButton 
//                             size="small" 
//                             color="primary"
//                             onClick={() => handleEditPromotion(promo)}
//                           >
//                             <EditIcon />
//                           </IconButton>
//                           <IconButton 
//                             size="small" 
//                             color="error"
//                             onClick={() => handleDeletePromotion(promo)}
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </>
//           )}
//         </>
//       )}

//       {/* All Promotions Tab */}
//       {currentTab === 1 && (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Code</TableCell>
//                 <TableCell>Value</TableCell>
//                 <TableCell>Duration</TableCell>
//                 <TableCell>Eligibility</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Usage</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredPromotions.length > 0 ? (
//                 filteredPromotions.map((promo) => {
//                   const isActive = promo.isActive && new Date(promo.startDate) <= new Date() && new Date(promo.endDate) >= new Date();
//                   const isUpcoming = promo.isActive && new Date(promo.startDate) > new Date();
//                   const isExpired = !promo.isActive || new Date(promo.endDate) < new Date();
                  
//                   return (
//                     <TableRow key={promo.id} hover>
//                       <TableCell>
//                         <Typography variant="body2" fontWeight="medium">
//                           {promo.name}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           {promo.description}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip label={promo.code} size="small" />
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={promo.type === 'percentage' ? `${promo.value}%` : `${promo.value}`}
//                           color={promo.type === 'percentage' ? 'primary' : 'secondary'}
//                           size="small"
//                         />
//                         {promo.minOrderValue > 0 && (
//                           <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
//                             Min. Order: ${promo.minOrderValue}
//                           </Typography>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {formatDate(promo.startDate)}
//                         </Typography>
//                         <Typography variant="body2">
//                           to {formatDate(promo.endDate)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Stack direction="column" spacing={0.5}>
//                           <Chip 
//                             label={promo.eligibleUsers === 'new' ? 'New Users' : 'All Users'} 
//                             size="small"
//                             variant="outlined"
//                             icon={<PersonIcon fontSize="small" />}
//                           />
//                           {promo.eligiblePlans.includes('All') ? (
//                             <Chip 
//                               label="All Plans" 
//                               size="small"
//                               variant="outlined"
//                               icon={<CategoryIcon fontSize="small" />}
//                             />
//                           ) : (
//                             <Tooltip title={promo.eligiblePlans.join(', ')}>
//                               <Chip 
//                                 label={`${promo.eligiblePlans.length} Plans`} 
//                                 size="small"
//                                 variant="outlined"
//                                 icon={<CategoryIcon fontSize="small" />}
//                               />
//                             </Tooltip>
//                           )}
//                           {promo.applicableServices.includes('All') ? (
//                             <Chip 
//                               label="All Services" 
//                               size="small"
//                               variant="outlined"
//                               icon={<BagIcon fontSize="small" />}
//                             />
//                           ) : (
//                             <Tooltip title={promo.applicableServices.join(', ')}>
//                               <Chip 
//                                 label={`${promo.applicableServices.length} Services`} 
//                                 size="small"
//                                 variant="outlined"
//                                 icon={<BagIcon fontSize="small" />}
//                               />
//                             </Tooltip>
//                           )}
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Chip 
//                           label={
//                             isActive ? 'Active' : 
//                             isUpcoming ? 'Upcoming' : 
//                             'Expired'
//                           } 
//                           color={
//                             isActive ? 'success' : 
//                             isUpcoming ? 'info' : 
//                             'default'
//                           } 
//                           size="small"
//                         />
//                         <FormControlLabel
//                           control={
//                             <Switch 
//                               size="small"
//                               checked={promo.isActive}
//                               onChange={() => handleToggleActive(promo.id)}
//                             />
//                           }
//                           label=""
//                         />
//                       </TableCell>
//                       <TableCell>
//                         {promo.usageLimit ? (
//                           <Typography variant="body2">
//                             {promo.usageCount}/{promo.usageLimit}
//                             <LinearProgress
//                               variant="determinate"
//                               value={Math.min(100, getUsagePercentage(promo))}
//                               color={getUsagePercentage(promo) > 80 ? 'error' : 'primary'}
//                               sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
//                             />
//                           </Typography>
//                         ) : (
//                           <Typography variant="body2">
//                             {promo.usageCount}/∞
//                           </Typography>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <IconButton 
//                           size="small" 
//                           color="primary"
//                           onClick={() => handleEditPromotion(promo)}
//                         >
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton 
//                           size="small" 
//                           color="error"
//                           onClick={() => handleDeletePromotion(promo)}
//                         >
//                           <DeleteIcon />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={8} align="center">
//                     No promotions found matching your criteria.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* Add/Edit Promotion Dialog */}
//       <Dialog 
//         open={openDialog} 
//         onClose={handleCloseDialog}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           {selectedPromotion?.id ? 'Edit Promotion' : 'Add New Promotion'}
//         </DialogTitle>
//         <DialogContent dividers>
//           {selectedPromotion && (
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Promotion Name"
//                   fullWidth
//                   value={selectedPromotion.name}
//                   onChange={(e) => setSelectedPromotion({...selectedPromotion, name: e.target.value})}
//                   required
//                   error={!!validationErrors.name}
//                   helperText={validationErrors.name}
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Promotion Code"
//                   fullWidth
//                   value={selectedPromotion.code}
//                   onChange={(e) => setSelectedPromotion({...selectedPromotion, code: e.target.value.toUpperCase()})}
//                   required
//                   error={!!validationErrors.code}
//                   helperText={validationErrors.code || 'Uppercase letters and numbers only'}
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel id="promotion-type-label">Discount Type</InputLabel>
//                   <Select
//                     labelId="promotion-type-label"
//                     value={selectedPromotion.type}
//                     label="Discount Type"
//                     onChange={(e) => setSelectedPromotion({...selectedPromotion, type: e.target.value})}
//                   >
//                     <MenuItem value="percentage">Percentage</MenuItem>
//                     <MenuItem value="fixed">Fixed Amount</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   label={selectedPromotion.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
//                   fullWidth
//                   type="number"
//                   InputProps={{
//                     startAdornment: selectedPromotion.type === 'fixed' ? (
//                       <InputAdornment position="start">$</InputAdornment>
//                     ) : null,
//                     endAdornment: selectedPromotion.type === 'percentage' ? (
//                       <InputAdornment position="end">%</InputAdornment>
//                     ) : null,
//                   }}
//                   value={selectedPromotion.value}
//                   onChange={(e) => setSelectedPromotion({...selectedPromotion, value: parseFloat(e.target.value) || 0})}
//                   required
//                   error={!!validationErrors.value}
//                   helperText={validationErrors.value}
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   label="Minimum Order Value"
//                   fullWidth
//                   type="number"
//                   InputProps={{
//                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                   }}
//                   value={selectedPromotion.minOrderValue}
//                   onChange={(e) => setSelectedPromotion({...selectedPromotion, minOrderValue: parseFloat(e.target.value) || 0})}
//                   error={!!validationErrors.minOrderValue}
//                   helperText={validationErrors.minOrderValue}
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   label="Maximum Discount"
//                   fullWidth
//                   type="number"
//                   InputProps={{
//                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                   }}
//                   value={selectedPromotion.maxDiscount || ''}
//                   onChange={(e) => setSelectedPromotion({
//                     ...selectedPromotion, 
//                     maxDiscount: e.target.value === '' ? null : parseFloat(e.target.value) || 0
//                   })}
//                   error={!!validationErrors.maxDiscount}
//                   helperText={validationErrors.maxDiscount}
//                   margin="normal"
//                   placeholder="Leave empty for no limit"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Description"
//                   fullWidth
//                   multiline
//                   rows={2}
//                   value={selectedPromotion.description}
//                   onChange={(e) => setSelectedPromotion({...selectedPromotion, description: e.target.value})}
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//   <TextField
//     label="Start Date"
//     type="date"
//     fullWidth
//     value={selectedPromotion.startDate}
//     onChange={(e) => setSelectedPromotion({
//       ...selectedPromotion, 
//       startDate: e.target.value
//     })}
//     InputLabelProps={{
//       shrink: true,
//     }}
//     error={!!validationErrors.startDate}
//     helperText={validationErrors.startDate}
//     margin="normal"
//   />
// </Grid>

// <Grid item xs={12} sm={6}>
//   <TextField
//     label="End Date"
//     type="date"
//     fullWidth
//     value={selectedPromotion.endDate}
//     onChange={(e) => setSelectedPromotion({
//       ...selectedPromotion, 
//       endDate: e.target.value
//     })}
//     InputLabelProps={{
//       shrink: true,
//     }}
//     error={!!validationErrors.endDate}
//     helperText={validationErrors.endDate}
//     margin="normal"
//   />
// </Grid>
             
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Usage Limit (Per User)"
//                   fullWidth
//                   type="number"
//                   value={selectedPromotion.usageLimit || ''}
//                   onChange={(e) => setSelectedPromotion({
//                     ...selectedPromotion, 
//                     usageLimit: e.target.value === '' ? null : parseInt(e.target.value) || 0
//                   })}
//                   error={!!validationErrors.usageLimit}
//                   helperText={validationErrors.usageLimit}
//                   margin="normal"
//                   placeholder="Leave empty for unlimited usage"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel id="eligible-users-label">Eligible Users</InputLabel>
//                   <Select
//                     labelId="eligible-users-label"
//                     value={selectedPromotion.eligibleUsers}
//                     label="Eligible Users"
//                     onChange={(e) => setSelectedPromotion({...selectedPromotion, eligibleUsers: e.target.value})}
//                   >
//                     <MenuItem value="all">All Users</MenuItem>
//                     <MenuItem value="new">New Users Only</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel id="applicable-services-label">Applicable Services</InputLabel>
//                   <Select
//                     labelId="applicable-services-label"
//                     multiple
//                     value={selectedPromotion.applicableServices}
//                     label="Applicable Services"
//                     onChange={(e) => setSelectedPromotion({...selectedPromotion, applicableServices: e.target.value})}
//                     renderValue={(selected) => (
//                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                         {selected.map((value) => (
//                           <Chip key={value} label={value} size="small" />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     <MenuItem value="All">All Services</MenuItem>
//                     {services.map((service) => (
//                       <MenuItem key={service} value={service}>{service}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel id="eligible-plans-label">Eligible Plans</InputLabel>
//                   <Select
//                     labelId="eligible-plans-label"
//                     multiple
//                     value={selectedPromotion.eligiblePlans}
//                     label="Eligible Plans"
//                     onChange={(e) => setSelectedPromotion({...selectedPromotion, eligiblePlans: e.target.value})}
//                     renderValue={(selected) => (
//                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                         {selected.map((value) => (
//                           <Chip key={value} label={value} size="small" />
//                         ))}
//                       </Box>
//                     )}
//                   >
//                     <MenuItem value="All">All Plans</MenuItem>
//                     {membershipPlans.map((plan) => (
//                       <MenuItem key={plan} value={plan}>{plan}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12}>
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={selectedPromotion.isActive}
//                       onChange={(e) => setSelectedPromotion({...selectedPromotion, isActive: e.target.checked})}
//                     />
//                   }
//                   label="Active"
//                   sx={{ mt: 2 }}
//                 />
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button 
//             onClick={handleSavePromotion} 
//             variant="contained"
//             disabled={!selectedPromotion?.name || !selectedPromotion?.code}
//           >
//             {selectedPromotion?.id ? 'Update Promotion' : 'Add Promotion'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={openDeleteDialog}
//         onClose={handleCloseDeleteDialog}
//       >
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <Alert severity="warning" sx={{ mb: 2 }}>
//             This action cannot be undone!
//           </Alert>
//           <Typography paragraph>
//             Are you sure you want to delete this promotion?
//           </Typography>
//           {selectedPromotion && (
//             <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
//               <Typography fontWeight="bold" gutterBottom>
//                 {selectedPromotion.name} ({selectedPromotion.code})
//               </Typography>
//               <Typography variant="body2">
//                 {selectedPromotion.type === 'percentage' ? `${selectedPromotion.value}% off` : `${selectedPromotion.value} off`}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Valid: {formatDate(selectedPromotion.startDate)} to {formatDate(selectedPromotion.endDate)}
//               </Typography>
//             </Paper>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
//           <Button onClick={handleConfirmDelete} color="error" variant="contained">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
  );
}
