// app/user-management/partners/page.js
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Divider,
  Link,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Store as StoreIcon,
  LocationOn as LocationIcon,
  ContactPhone as ContactIcon,
  LocalLaundryService as LaundryIcon,
  PendingActions as PendingIcon,
} from '@mui/icons-material';

// Dummy data for partners
const dummyPartners = [
  {
    id: 1,
    name: 'City Cleaners',
    type: 'Laundromat',
    address: '123 Main St, New York, NY 10001',
    email: 'contact@citycleaners.com',
    phone: '(555) 123-4567',
    contactPerson: 'John Smith',
    services: ['Wash & Fold', 'Dry Cleaning', 'Ironing'],
    serviceAreas: ['10001', '10002', '10003'],
    capacity: 'High',
    status: 'Active',
    partneredSince: '2024-01-15',
    completedOrders: 1247,
    pendingOrders: 12,
    logo: '/partner-logo-placeholder.png',
    rating: 4.7,
    isActive: true
  },
  {
    id: 2,
    name: 'Premium Pressers',
    type: 'Dry Cleaner',
    address: '456 Park Ave, New York, NY 10022',
    email: 'info@premiumpressers.com',
    phone: '(555) 987-6543',
    contactPerson: 'Emily Johnson',
    services: ['Dry Cleaning', 'Ironing', 'Stain Removal'],
    serviceAreas: ['10022', '10023', '10024'],
    capacity: 'Medium',
    status: 'Active',
    partneredSince: '2024-03-10',
    completedOrders: 895,
    pendingOrders: 8,
    logo: '/partner-logo-placeholder.png',
    rating: 4.9,
    isActive: true
  },
  {
    id: 3,
    name: 'Wash Warriors',
    type: 'Laundromat',
    address: '789 Broadway, New York, NY 10003',
    email: 'service@washwarriors.com',
    phone: '(555) 456-7890',
    contactPerson: 'Michael Davis',
    services: ['Wash & Fold', 'Bedding & Linens'],
    serviceAreas: ['10003', '10004', '10005'],
    capacity: 'High',
    status: 'Active',
    partneredSince: '2024-02-05',
    completedOrders: 1532,
    pendingOrders: 15,
    logo: '/partner-logo-placeholder.png',
    rating: 4.5,
    isActive: true
  },
  {
    id: 4,
    name: 'Elite Cleaners',
    type: 'Full Service',
    address: '321 5th Ave, New York, NY 10016',
    email: 'support@elitecleaners.com',
    phone: '(555) 789-0123',
    contactPerson: 'Sarah Wilson',
    services: ['Wash & Fold', 'Dry Cleaning', 'Ironing', 'Stain Removal', 'Bedding & Linens'],
    serviceAreas: ['10016', '10017', '10018'],
    capacity: 'High',
    status: 'Pending Approval',
    partneredSince: '2025-03-01',
    completedOrders: 0,
    pendingOrders: 0,
    logo: '/partner-logo-placeholder.png',
    rating: 0,
    isActive: false
  },
  {
    id: 5,
    name: 'Neighborhood Wash',
    type: 'Laundromat',
    address: '567 W 23rd St, New York, NY 10011',
    email: 'hello@neighborhoodwash.com',
    phone: '(555) 234-5678',
    contactPerson: 'Robert Brown',
    services: ['Wash & Fold'],
    serviceAreas: ['10011', '10001'],
    capacity: 'Low',
    status: 'Inactive',
    partneredSince: '2024-05-20',
    completedOrders: 254,
    pendingOrders: 0,
    logo: '/partner-logo-placeholder.png',
    rating: 4.2,
    isActive: false
  }
];

// Available service areas
const serviceAreas = [
  { zipCode: '10001', name: 'Chelsea/Midtown West' },
  { zipCode: '10002', name: 'Lower East Side' },
  { zipCode: '10003', name: 'East Village/Gramercy' },
  { zipCode: '10004', name: 'Financial District' },
  { zipCode: '10005', name: 'Financial District/City Hall' },
  { zipCode: '10011', name: 'Chelsea/West Village' },
  { zipCode: '10016', name: 'Murray Hill/Kips Bay' },
  { zipCode: '10017', name: 'Midtown East' },
  { zipCode: '10018', name: 'Midtown West/Garment District' },
  { zipCode: '10022', name: 'Midtown East' },
  { zipCode: '10023', name: 'Upper West Side' },
  { zipCode: '10024', name: 'Upper West Side' }
];

// Services offered
const servicesOffered = [
  'Wash & Fold',
  'Dry Cleaning',
  'Ironing',
  'Stain Removal',
  'Bedding & Linens'
];

// Partner types
const partnerTypes = ['Laundromat', 'Dry Cleaner', 'Full Service', 'Specialty Cleaner'];

// Capacity options
const capacityOptions = ['Low', 'Medium', 'High'];

// Partner statuses
const partnerStatuses = ['Active', 'Inactive', 'Pending Approval', 'Suspended'];

export default function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editPartner, setEditPartner] = useState(null);
  const [deletePartnerId, setDeletePartnerId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  useEffect(() => {
    // Simulate fetching partners from API
    setPartners(dummyPartners);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setPage(0);
  };

  const handleEditClick = (partner) => {
    setEditPartner(partner);
    setOpenDialog(true);
  };

  const handleDeleteClick = (id) => {
    setDeletePartnerId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditPartner(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeletePartnerId(null);
  };

  const handleAddNew = () => {
    setEditPartner({
      id: null,
      name: '',
      type: 'Laundromat',
      address: '',
      email: '',
      phone: '',
      contactPerson: '',
      services: [],
      serviceAreas: [],
      capacity: 'Medium',
      status: 'Pending Approval',
      partneredSince: new Date().toISOString().split('T')[0],
      completedOrders: 0,
      pendingOrders: 0,
      logo: '',
      rating: 0,
      isActive: false
    });
    setOpenDialog(true);
  };

  const handleSavePartner = () => {
    if (editPartner.id) {
      // Update existing partner
      setPartners(partners.map(p => 
        p.id === editPartner.id ? editPartner : p
      ));
    } else {
      // Add new partner
      const newPartner = {
        ...editPartner,
        id: Math.max(...partners.map(p => p.id)) + 1
      };
      setPartners([...partners, newPartner]);
    }
    setOpenDialog(false);
    setEditPartner(null);
  };

  const handleDeletePartner = () => {
    setPartners(partners.filter(p => p.id !== deletePartnerId));
    setOpenDeleteDialog(false);
    setDeletePartnerId(null);
  };

  const handleToggleActive = (id) => {
    setPartners(partners.map(partner => 
      partner.id === id ? { ...partner, isActive: !partner.isActive } : partner
    ));
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'table' : 'grid');
  };

  // Apply filters
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = 
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.phone.includes(searchTerm) ||
      partner.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && partner.isActive) ||
      (statusFilter === 'inactive' && !partner.isActive) ||
      partner.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesType = 
      typeFilter === 'all' || 
      partner.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const paginatedPartners = filteredPartners.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Partners
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all laundry service partners
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search partners..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending approval">Pending</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="type-filter-label">Type</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                value={typeFilter}
                label="Type"
                onChange={handleTypeFilterChange}
              >
                <MenuItem value="all">All Types</MenuItem>
                {partnerTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button 
              variant="outlined" 
              onClick={toggleViewMode}
              fullWidth
            >
              {viewMode === 'grid' ? 'Table View' : 'Grid View'}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={handleAddNew}
              fullWidth
            >
              Add Partner
            </Button>
          </Grid>
        </Grid>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <Grid container spacing={3}>
            {paginatedPartners.length > 0 ? (
              paginatedPartners.map((partner) => (
                <Grid item key={partner.id} xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={partner.logo} 
                            alt={partner.name}
                            sx={{ mr: 2, width: 50, height: 50 }}
                          >
                            <StoreIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6">{partner.name}</Typography>
                            <Chip 
                              label={partner.type} 
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                        <Chip 
                          label={partner.status} 
                          color={
                            partner.status === 'Active' ? 'success' :
                            partner.status === 'Pending Approval' ? 'warning' :
                            partner.status === 'Suspended' ? 'error' :
                            'default'
                          } 
                          size="small"
                        />
                      </Box>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <LocationIcon fontSize="small" color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        {partner.address}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <ContactIcon fontSize="small" color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        {partner.contactPerson} • {partner.phone}
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Services Offered:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {partner.services.map(service => (
                            <Chip 
                              key={service} 
                              label={service} 
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Service Areas:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {partner.serviceAreas.slice(0, 3).map(area => (
                            <Chip 
                              key={area} 
                              label={area} 
                              size="small"
                              variant="outlined"
                            />
                          ))}
                          {partner.serviceAreas.length > 3 && (
                            <Chip 
                              label={`+${partner.serviceAreas.length - 3}`} 
                              size="small"
                              color="primary"
                            />
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                    
                    <Divider />
                    
                    <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Completed Orders
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {partner.completedOrders}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Pending Orders
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {partner.pendingOrders}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <Divider />
                    
                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Switch 
                            size="small"
                            checked={partner.isActive}
                            onChange={() => handleToggleActive(partner.id)}
                          />
                        }
                        label={partner.isActive ? "Active" : "Inactive"}
                        sx={{ ml: 0 }}
                      />
                      <Box>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEditClick(partner)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteClick(partner.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No partners found
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Partner</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Services</TableCell>
                  <TableCell>Service Areas</TableCell>
                  <TableCell>Orders</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPartners.length > 0 ? (
                  paginatedPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={partner.logo} 
                            alt={partner.name}
                            sx={{ mr: 2, width: 40, height: 40 }}
                          >
                            <StoreIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{partner.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {partner.type}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{partner.contactPerson}</Typography>
                        <Typography variant="body2">{partner.phone}</Typography>
                        <Typography variant="body2">{partner.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {partner.services.slice(0, 2).map(service => (
                            <Chip 
                              key={service} 
                              label={service} 
                              size="small"
                              variant="outlined"
                            />
                          ))}
                          {partner.services.length > 2 && (
                            <Chip 
                              label={`+${partner.services.length - 2}`} 
                              size="small"
                              color="primary"
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {partner.serviceAreas.slice(0, 2).map(area => (
                            <Chip 
                              key={area} 
                              label={area} 
                              size="small"
                              variant="outlined"
                            />
                          ))}
                          {partner.serviceAreas.length > 2 && (
                            <Chip 
                              label={`+${partner.serviceAreas.length - 2}`} 
                              size="small"
                              color="primary"
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          Completed: {partner.completedOrders}
                        </Typography>
                        <Typography variant="body2">
                          Pending: {partner.pendingOrders}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={partner.status} 
                          color={
                            partner.status === 'Active' ? 'success' :
                            partner.status === 'Pending Approval' ? 'warning' :
                            partner.status === 'Suspended' ? 'error' :
                            'default'
                          } 
                          size="small"
                        />
                        <FormControlLabel
                          control={
                            <Switch 
                              size="small"
                              checked={partner.isActive}
                              onChange={() => handleToggleActive(partner.id)}
                            />
                          }
                          label={partner.isActive ? "Active" : "Inactive"}
                          labelPlacement="end"
                          sx={{ ml: 0, mt: 1, display: 'block' }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEditClick(partner)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteClick(partner.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No partners found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPartners.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Edit Partner Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editPartner?.id ? 'Edit Partner' : 'Add New Partner'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Partner Name"
                value={editPartner?.name || ''}
                onChange={(e) => setEditPartner({...editPartner, name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Partner Type</InputLabel>
                <Select
                  value={editPartner?.type || 'Laundromat'}
                  label="Partner Type"
                  onChange={(e) => setEditPartner({...editPartner, type: e.target.value})}
                >
                  {partnerTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={editPartner?.address || ''}
                onChange={(e) => setEditPartner({...editPartner, address: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Person"
                value={editPartner?.contactPerson || ''}
                onChange={(e) => setEditPartner({...editPartner, contactPerson: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={editPartner?.phone || ''}
                onChange={(e) => setEditPartner({...editPartner, phone: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editPartner?.email || ''}
                onChange={(e) => setEditPartner({...editPartner, email: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Capacity</InputLabel>
                <Select
                  value={editPartner?.capacity || 'Medium'}
                  label="Capacity"
                  onChange={(e) => setEditPartner({...editPartner, capacity: e.target.value})}
                >
                  {capacityOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Services Offered</InputLabel>
                <Select
                  multiple
                  value={editPartner?.services || []}
                  label="Services Offered"
                  onChange={(e) => setEditPartner({...editPartner, services: e.target.value})}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {servicesOffered.map((service) => (
                    <MenuItem key={service} value={service}>{service}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Service Areas</InputLabel>
                <Select
                  multiple
                  value={editPartner?.serviceAreas || []}
                  label="Service Areas"
                  onChange={(e) => setEditPartner({...editPartner, serviceAreas: e.target.value})}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {serviceAreas.map((area) => (
                    <MenuItem key={area.zipCode} value={area.zipCode}>
                      {area.zipCode} - {area.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editPartner?.status || 'Pending Approval'}
                  label="Status"
                  onChange={(e) => setEditPartner({...editPartner, status: e.target.value})}
                >
                  {partnerStatuses.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Partnered Since"
                type="date"
                value={editPartner?.partneredSince || ''}
                onChange={(e) => setEditPartner({...editPartner, partneredSince: e.target.value})}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Logo URL"
                value={editPartner?.logo || ''}
                onChange={(e) => setEditPartner({...editPartner, logo: e.target.value})}
                placeholder="Leave blank for default logo"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editPartner?.isActive || false}
                    onChange={(e) => setEditPartner({...editPartner, isActive: e.target.checked})}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSavePartner} 
            variant="contained"
            disabled={!editPartner?.name || !editPartner?.address || !editPartner?.contactPerson}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this partner? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeletePartner} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}