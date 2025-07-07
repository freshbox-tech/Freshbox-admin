// app/plan-management/page.js
'use client';

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
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Switch,
  FormControlLabel,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Inventory as InventoryIcon,
  AutorenewSharp as RecurringIcon,
  CreditCard as PaymentIcon,
  Timer as DurationIcon,
  StarRate as RewardIcon,
  LocalOffer as DiscountIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';

// Dummy data based on the PDF
const initialPlans = [
  {
    id: 1,
    name: 'Basic',
    description: 'Affordable plan for occasional laundry needs',
    isActive: true,
    features: [
      { feature: 'Standard laundry service (wash and fold)', included: true },
      { feature: 'Limited number of items per month (up to 40 items)', included: true },
      { feature: 'Basic customer support (email or chat)', included: true },
      { feature: 'Priority service', included: false },
      { feature: 'Discounts on additional services', included: false },
      { feature: 'Reward points accumulation', included: false },
      { feature: 'Free trial', included: false }
    ],
    pricing: [
      { billingCycle: 'Biweekly', price: 20 },
      { billingCycle: 'Monthly', price: 30 }
    ],
    itemLimit: 40,
    createdAt: '2024-10-15',
    updatedAt: '2025-01-20',
    currentSubscribers: 156
  },
  {
    id: 2,
    name: 'Premium',
    description: 'Best value for regular laundry users with priority service',
    isActive: true,
    features: [
      { feature: 'Standard and express laundry options (wash and fold, dry cleaning)', included: true },
      { feature: 'Up to 75 items per month', included: true },
      { feature: 'Discounted rates for additional items ($1/item)', included: true },
      { feature: 'Priority service (next-day delivery)', included: true },
      { feature: 'Reward points system (1 point per $1 spent)', included: true },
      { feature: '10% discount on additional services', included: true },
      { feature: 'Access to exclusive promotions', included: true },
      { feature: '7-day free trial for new users', included: true }
    ],
    pricing: [
      { billingCycle: 'Biweekly', price: 35 },
      { billingCycle: 'Monthly', price: 50 },
      { billingCycle: 'Quarterly', price: 130 },
      { billingCycle: 'Annual', price: 480 }
    ],
    itemLimit: 75,
    createdAt: '2024-10-15',
    updatedAt: '2025-03-01',
    currentSubscribers: 243
  },
  {
    id: 3,
    name: 'Enterprise',
    description: 'Comprehensive solution for businesses or high-volume customers',
    isActive: true,
    features: [
      { feature: 'Unlimited laundry services (wash, fold, dry cleaning)', included: true },
      { feature: 'Customizable service limits based on business needs', included: true },
      { feature: 'Premium customer support (dedicated account manager)', included: true },
      { feature: 'Priority service (same-day service guarantee)', included: true },
      { feature: 'Discounted rates for bulk laundry', included: true },
      { feature: 'Advanced reward points system (2 points per $1 spent)', included: true },
      { feature: '14-day free trial for new users', included: true },
      { feature: 'Free delivery and pickup for large quantities', included: true },
      { feature: '15% discount on any additional services', included: true },
      { feature: 'Access to exclusive promotions and events', included: true }
    ],
    pricing: [
      { billingCycle: 'Monthly', price: 100 },
      { billingCycle: 'Quarterly', price: 275 },
      { billingCycle: 'Annual', price: 1000 }
    ],
    itemLimit: null, // Unlimited
    createdAt: '2024-10-15',
    updatedAt: '2025-02-10',
    currentSubscribers: 68
  }
];

export default function PlanManagementPage() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [addons, setAddons] = useState([
    { id: 1, name: 'Extra items', price: 1, description: 'Price per additional item beyond plan limit' },
    { id: 2, name: 'Same-day service', price: 5, description: 'Priority processing for non-Enterprise members' },
    { id: 3, name: 'Specialty cleaning', price: 2, description: 'For delicates, down items, etc. (per item)' },
    { id: 4, name: 'Stain treatment', price: 3, description: 'Special treatment for tough stains (per item)' }
  ]);
  const [currentTab, setCurrentTab] = useState(0);
  const [openAddonDialog, setOpenAddonDialog] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);

  useEffect(() => {
    // Simulate fetching plans from API
    setPlans(initialPlans);
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleAddPlan = () => {
    setSelectedPlan({
      id: null,
      name: '',
      description: '',
      isActive: true,
      features: [
        { feature: 'Standard laundry service (wash and fold)', included: true }
      ],
      pricing: [
        { billingCycle: 'Monthly', price: 0 }
      ],
      itemLimit: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      currentSubscribers: 0
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleDeletePlan = (plan) => {
    setSelectedPlan(plan);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPlan(null);
    setEditMode(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedPlan(null);
  };

  const handleConfirmDelete = () => {
    setPlans(plans.filter(p => p.id !== selectedPlan.id));
    setOpenDeleteDialog(false);
    setSelectedPlan(null);
  };

  const handleSavePlan = () => {
    if (selectedPlan.id) {
      // Update existing plan
      setPlans(plans.map(p => 
        p.id === selectedPlan.id ? { ...selectedPlan, updatedAt: new Date().toISOString().split('T')[0] } : p
      ));
    } else {
      // Add new plan
      const newPlan = {
        ...selectedPlan,
        id: Math.max(...plans.map(p => p.id)) + 1,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setPlans([...plans, newPlan]);
    }
    setOpenDialog(false);
    setSelectedPlan(null);
    setEditMode(false);
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...selectedPlan.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setSelectedPlan({ ...selectedPlan, features: updatedFeatures });
  };

  const handleAddFeature = () => {
    setSelectedPlan({
      ...selectedPlan,
      features: [...selectedPlan.features, { feature: '', included: false }]
    });
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...selectedPlan.features];
    updatedFeatures.splice(index, 1);
    setSelectedPlan({ ...selectedPlan, features: updatedFeatures });
  };

  const handlePricingChange = (index, field, value) => {
    const updatedPricing = [...selectedPlan.pricing];
    updatedPricing[index] = { ...updatedPricing[index], [field]: field === 'price' ? Number(value) : value };
    setSelectedPlan({ ...selectedPlan, pricing: updatedPricing });
  };

  const handleAddPricing = () => {
    setSelectedPlan({
      ...selectedPlan,
      pricing: [...selectedPlan.pricing, { billingCycle: 'Monthly', price: 0 }]
    });
  };

  const handleRemovePricing = (index) => {
    const updatedPricing = [...selectedPlan.pricing];
    updatedPricing.splice(index, 1);
    setSelectedPlan({ ...selectedPlan, pricing: updatedPricing });
  };

  const handleToggleActive = (planId) => {
    setPlans(plans.map(plan => 
      plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
    ));
  };

  const handleAddAddon = () => {
    setSelectedAddon({
      id: null,
      name: '',
      price: 0,
      description: ''
    });
    setOpenAddonDialog(true);
  };

  const handleEditAddon = (addon) => {
    setSelectedAddon(addon);
    setOpenAddonDialog(true);
  };

  const handleSaveAddon = () => {
    if (selectedAddon.id) {
      // Update existing addon
      setAddons(addons.map(a => 
        a.id === selectedAddon.id ? selectedAddon : a
      ));
    } else {
      // Add new addon
      const newAddon = {
        ...selectedAddon,
        id: Math.max(...addons.map(a => a.id)) + 1
      };
      setAddons([...addons, newAddon]);
    }
    setOpenAddonDialog(false);
    setSelectedAddon(null);
  };

  const handleDeleteAddon = (addonId) => {
    setAddons(addons.filter(a => a.id !== addonId));
  };

  const handleCloseAddonDialog = () => {
    setOpenAddonDialog(false);
    setSelectedAddon(null);
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Plan Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage subscription plans and add-ons for FreshBox Laundry
        </Typography>
      </Box>

      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="plan management tabs">
            <Tab label="Subscription Plans" />
            <Tab label="Add-ons" />
          </Tabs>
        </Box>
      </Box>

      {/* Subscription Plans Tab */}
      {currentTab === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddPlan}
            >
              Add New Plan
            </Button>
          </Box>

          <Grid container spacing={3}>
            {plans.map((plan) => (
              <Grid item xs={12} md={6} lg={4} key={plan.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {plan.name}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={plan.isActive}
                            onChange={() => handleToggleActive(plan.id)}
                            color="primary"
                          />
                        }
                        label={plan.isActive ? "Active" : "Inactive"}
                        labelPlacement="start"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {plan.description}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        <RecurringIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Pricing
                      </Typography>
                      <Grid container spacing={1}>
                        {plan.pricing.map((price, index) => (
                          <Grid item xs={6} key={index}>
                            <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                {price.billingCycle}
                              </Typography>
                              <Typography variant="h6" component="div">
                                ${price.price}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        <InventoryIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Item Limit
                      </Typography>
                      <Typography variant="body1">
                        {plan.itemLimit ? `${plan.itemLimit} items per month` : 'Unlimited'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckIcon fontSize="small" sx={{ mr: 1 }} />
                          Key Features
                        </Box>
                      </Typography>
                      <List dense>
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <ListItem key={index} disablePadding>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              {feature.included ? (
                                <CheckIcon fontSize="small" color="success" />
                              ) : (
                                <CloseIcon fontSize="small" color="error" />
                              )}
                            </ListItemIcon>
                            <ListItemText primary={feature.feature} />
                          </ListItem>
                        ))}
                        {plan.features.length > 3 && (
                          <ListItem disablePadding>
                            <ListItemText 
                              primary={`+${plan.features.length - 3} more features`} 
                              sx={{ color: 'primary.main', pl: 4 }} 
                            />
                          </ListItem>
                        )}
                      </List>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Current Subscribers:
                      </Typography>
                      <Chip 
                        label={plan.currentSubscribers} 
                        size="small" 
                        color="primary" 
                      />
                    </Box>
                  </Box>
                  <Divider />
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => handleViewPlan(plan)}
                      startIcon={<PreviewIcon />}
                    >
                      View
                    </Button>
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => handleEditPlan(plan)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => handleDeletePlan(plan)}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Add-ons Tab */}
      {currentTab === 1 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddAddon}
            >
              Add New Add-on
            </Button>
          </Box>

          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addons.map((addon) => (
                    <TableRow key={addon.id}>
                      <TableCell>{addon.name}</TableCell>
                      <TableCell>{addon.description}</TableCell>
                      <TableCell>${addon.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditAddon(addon)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteAddon(addon.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {/* Plan Detail/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode 
            ? (selectedPlan?.id ? `Edit ${selectedPlan.name} Plan` : 'Add New Plan') 
            : `${selectedPlan?.name} Plan Details`
          }
        </DialogTitle>
        <DialogContent dividers>
          {selectedPlan && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Plan Name"
                  fullWidth
                  value={selectedPlan.name}
                  onChange={(e) => setSelectedPlan({...selectedPlan, name: e.target.value})}
                  disabled={!editMode}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedPlan.isActive}
                      onChange={(e) => setSelectedPlan({...selectedPlan, isActive: e.target.checked})}
                      disabled={!editMode}
                    />
                  }
                  label="Active"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
                  value={selectedPlan.description}
                  onChange={(e) => setSelectedPlan({...selectedPlan, description: e.target.value})}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Item Limit (0 for unlimited)"
                  fullWidth
                  type="number"
                  value={selectedPlan.itemLimit || 0}
                  onChange={(e) => setSelectedPlan({...selectedPlan, itemLimit: e.target.value === '0' ? null : Number(e.target.value)})}
                  disabled={!editMode}
                  margin="normal"
                />
              </Grid>
              {!editMode && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Current Subscribers"
                      fullWidth
                      value={selectedPlan.currentSubscribers}
                      disabled
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Created At"
                      fullWidth
                      value={selectedPlan.createdAt}
                      disabled
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Updated"
                      fullWidth
                      value={selectedPlan.updatedAt}
                      disabled
                      margin="normal"
                    />
                  </Grid>
                </>
              )}
              
              {/* Features Section */}
              <Grid item xs={12}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Plan Features</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {selectedPlan.features.map((feature, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 2,
                          gap: 1
                        }}
                      >
                        {editMode ? (
                          <>
                            <TextField
                              label="Feature"
                              value={feature.feature}
                              onChange={(e) => handleFeatureChange(index, 'feature', e.target.value)}
                              sx={{ flexGrow: 1 }}
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={feature.included}
                                  onChange={(e) => handleFeatureChange(index, 'included', e.target.checked)}
                                />
                              }
                              label="Included"
                            />
                            <IconButton 
                              color="error" 
                              onClick={() => handleRemoveFeature(index)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        ) : (
                          <ListItem disablePadding>
                            <ListItemIcon>
                              {feature.included ? (
                                <CheckIcon color="success" />
                              ) : (
                                <CloseIcon color="error" />
                              )}
                            </ListItemIcon>
                            <ListItemText primary={feature.feature} />
                          </ListItem>
                        )}
                      </Box>
                    ))}
                    {editMode && (
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddFeature}
                        sx={{ mt: 1 }}
                      >
                        Add Feature
                      </Button>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Grid>
              
              {/* Pricing Section */}
              <Grid item xs={12}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Pricing Options</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {selectedPlan.pricing.map((price, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 2,
                          gap: 2
                        }}
                      >
                        {editMode ? (
                          <>
                            <FormControl sx={{ minWidth: 150 }}>
                              <InputLabel>Billing Cycle</InputLabel>
                              <Select
                                value={price.billingCycle}
                                label="Billing Cycle"
                                onChange={(e) => handlePricingChange(index, 'billingCycle', e.target.value)}
                              >
                                <MenuItem value="Biweekly">Biweekly</MenuItem>
                                <MenuItem value="Monthly">Monthly</MenuItem>
                                <MenuItem value="Quarterly">Quarterly</MenuItem>
                                <MenuItem value="Annual">Annual</MenuItem>
                              </Select>
                            </FormControl>
                            <TextField
                              label="Price ($)"
                              type="number"
                              value={price.price}
                              onChange={(e) => handlePricingChange(index, 'price', e.target.value)}
                              sx={{ flexGrow: 1 }}
                            />
                            <IconButton 
                              color="error" 
                              onClick={() => handleRemovePricing(index)}
                              disabled={selectedPlan.pricing.length <= 1}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        ) : (
                          <Box sx={{ display: 'flex', width: '100%' }}>
                            <Typography variant="body1" sx={{ flexGrow: 1 }}>
                              {price.billingCycle}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              ${price.price}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                    {editMode && (
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddPricing}
                        sx={{ mt: 1 }}
                      >
                        Add Pricing Option
                      </Button>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {editMode ? 'Cancel' : 'Close'}
          </Button>
          {editMode && (
            <Button 
              onClick={handleSavePlan} 
              variant="contained"
              disabled={!selectedPlan?.name}
            >
              Save Plan
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone!
          </Alert>
          <Typography>
            Are you sure you want to delete the <strong>{selectedPlan?.name}</strong> plan?
            This plan currently has <strong>{selectedPlan?.currentSubscribers}</strong> subscribers.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Add-on Dialog */}
      <Dialog
        open={openAddonDialog}
        onClose={handleCloseAddonDialog}
      >
        <DialogTitle>
          {selectedAddon?.id ? 'Edit Add-on' : 'Add New Add-on'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Add-on Name"
                fullWidth
                value={selectedAddon?.name || ''}
                onChange={(e) => setSelectedAddon({...selectedAddon, name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                value={selectedAddon?.description || ''}
                onChange={(e) => setSelectedAddon({...selectedAddon, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Price ($)"
                fullWidth
                type="number"
                value={selectedAddon?.price || 0}
                onChange={(e) => setSelectedAddon({...selectedAddon, price: Number(e.target.value)})}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddonDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveAddon} 
            variant="contained"
            disabled={!selectedAddon?.name}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}