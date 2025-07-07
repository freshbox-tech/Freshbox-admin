// app/service-management/page.js
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Alert,
  FormHelperText,
  CardActions,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalLaundryService as LaundryIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import ApiServices from "@/lib/ApiServices";
import { useAuth } from "@/contexts/AuthContext";

// Service categories
const serviceCategories = [
  "Standard",
  "Premium",
  "Specialized",
  "Add-on",
  "Business",
];

// Days of the week
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ServiceManagementPage() {
  const [currentTab, setCurrentTab] = useState(0);
const { services, setServices,serviceAreas, setServiceAreas} = useAuth()

  const [selectedService, setSelectedService] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openAreaDialog, setOpenAreaDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [validationErrors, setValidationErrors] = useState({});
  const[zipCode,setZipCode] = useState(null)


  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handleAreaFilterChange = (event) => {
    setAreaFilter(event.target.value);
  };

  // Service CRUD operations
  const handleAddService = () => {
    setSelectedService({
      id: null,
      name: "",
      description: "",
      price: 0,
      priceType: "per item",
      estimatedTime: 24,
      isActive: true,
      availableInZipCodes: [],
      imageUrl: "",
      category: "Standard",
      specifications: [""],
    });
    setValidationErrors({});
    setOpenServiceDialog(true);
  };

  const handleEditService = (service) => {
    setSelectedService({ ...service });
    setValidationErrors({});
    setOpenServiceDialog(true);
  };

  const handleDeleteServiceClick = (id) => {
    setDeleteType("service");
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseServiceDialog = () => {
    setOpenServiceDialog(false);
    setSelectedService(null);
    setValidationErrors({});
  };

  const validateService = (service) => {
    const errors = {};
    if (!service.name) errors.name = "Name is required";
    if (!service.description) errors.description = "Description is required";
    if (service.price <= 0) errors.price = "Price must be greater than 0";
    if (!service.priceType) errors.priceType = "Price type is required";
    if (service.estimatedTime <= 0)
      errors.estimatedTime = "Time must be greater than 0";
    if (service.availableInZipCodes.length === 0)
      errors.availableInZipCodes = "Select at least one service area";

    return errors;
  };

  const handleSaveService = async () => {
    const errors = validateService(selectedService);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const existingServiceIndex = services.findIndex(
      (a) => a?._id === selectedService?._id
    );

    if (existingServiceIndex >= 0) {
      try {
        const res = await ApiServices.updateServices(selectedService._id,selectedService);
        if (res.data.success) {
          const updatedServices = [...services];
          updatedServices[existingServiceIndex] = {
            ...res.data.service,
          };
          setServices(updatedServices);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await ApiServices.addServices(selectedService);

        if (res.data.success) {
          setServices([...services, res.data.service]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    setOpenServiceDialog(false);
    setSelectedService(null);
    setValidationErrors({});
  };

  const handleServiceSpecChange = (index, value) => {
    const updatedSpecs = [...selectedService.specifications];
    updatedSpecs[index] = value;
    setSelectedService({ ...selectedService, specifications: updatedSpecs });
  };

  const handleAddServiceSpec = () => {
    setSelectedService({
      ...selectedService,
      specifications: [...selectedService.specifications, ""],
    });
  };

  const handleRemoveServiceSpec = (index) => {
    const updatedSpecs = [...selectedService.specifications];
    updatedSpecs.splice(index, 1);
    setSelectedService({ ...selectedService, specifications: updatedSpecs });
  };

  // Area CRUD operations
  const handleAddArea = () => {
    setSelectedArea({
      zipCode: "",
      name: "",
      city: "",
      state: "",
      isActive: true,
      serviceDays: [],
      deliveryFee: 0,
      minOrderValue: 20,
      estimatedDeliveryTime: "24-48 hours",
      activeServices: 0,
    });
    setValidationErrors({});
    setOpenAreaDialog(true);
  };

  const handleEditArea = (area) => {
    setSelectedArea({ ...area });
    setValidationErrors({});
    setOpenAreaDialog(true);
  };

  const handleDeleteAreaClick = (id,zipCode) => {
    setDeleteType("area");
    setDeleteId(id);
    setZipCode(zipCode)
    setOpenDeleteDialog(true);
  };

  const handleCloseAreaDialog = () => {
    setOpenAreaDialog(false);
    setSelectedArea(null);
    setValidationErrors({});
  };

  const validateArea = (area) => {
    const errors = {};
    if (!area.zipCode) errors.zipCode = "Zip code is required";
    else if (!/^\d{5}$/.test(area.zipCode))
      errors.zipCode = "Zip code must be 5 digits";
    if (!area.name) errors.name = "Area name is required";
    if (!area.city) errors.city = "City is required";
    if (!area.state) errors.state = "State is required";
    if (area.serviceDays.length === 0)
      errors.serviceDays = "Select at least one service day";
    if (area.minOrderValue <= 0)
      errors.minOrderValue = "Minimum order value must be greater than 0";

    return errors;
  };

    const handleToggleActive = async(status,id) => {
      try {
        const res = await ApiServices.toggleServicesAreaStatus(id,!status)
        if(res.data.success){
          const status = res.data.status
          setServiceAreas(
            serviceAreas.map((area) =>
              area._id === id ? { ...area, isActive: status } : area
            )
          );
        }
      } catch (error) {
        console.log(error)
      }
    
    };

      const handleToggleActiveServices = async(status,id) => {
        try {
          const res = await ApiServices.toggleServicesStatus(id,!status)
          if(res.data.success){
            const status = res.data.status
            setServices(
              services.map((service) =>
                service._id === id ? { ...service, isActive: status } : service
              )
            );
          }
        } catch (error) {
          console.log(error)
        }
      
      };

 const handleSaveArea = async () => {
    const errors = validateArea(selectedArea);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const existingAreaIndex = serviceAreas.findIndex(
      (a) => a.zipCode === selectedArea.zipCode
    );

    if (existingAreaIndex >= 0) {
      try {
        const res = await ApiServices.addServicesArea(selectedArea);
        if (res.data.success) {
          const updatedAreas = [...serviceAreas];
          updatedAreas[existingAreaIndex] = {
            ...res.data.area,
          };
          setServiceAreas(updatedAreas);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await ApiServices.addServicesArea(selectedArea);

        if (res.data.success) {
          setServiceAreas([
            ...serviceAreas,
            {
              ...res.data.area,
            },
          ]);
        }
      } catch (error) {
        console.log(error);
      }
    }

    setOpenAreaDialog(false);
    setSelectedArea(null);
    setValidationErrors({});
  };

  const handleConfirmDelete = async() => {
    if (deleteType === "service") {
      try {
        const res = await ApiServices.deleteServices(deleteId)
        if(res.data.success){
          setServices(services.filter((s) => s._id !== deleteId));
        }
        
      } catch (error) {
        console.log(error)
      }
    
    } else if (deleteType === "area") {
       try {
            const res = await ApiServices.deleteServicesArea(deleteId);
            if (res.data.success) {
              setServiceAreas(
                serviceAreas.filter((area) => area._id !== deleteId)
              );
              setServices(
                services.map((service) => ({
                  ...service,
                  availableInZipCodes: service.availableInZipCodes.filter(
                    (zip) => zip !== zipCode
                  ),
                }))
              );
            }
          } catch (error) {
            console.log(error);
          }

    
    }

    setOpenDeleteDialog(false);
    setDeleteType("");
    setDeleteId(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteType("");
    setDeleteId(null);
  };

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter;

    const matchesArea =
      areaFilter === "all" || service.availableInZipCodes.includes(areaFilter);

    return matchesSearch && matchesCategory && matchesArea;
  });

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Service Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage laundry services and service areas
        </Typography>
      </Box>

      <Box sx={{ width: "100%", mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="service management tabs"
          >
            <Tab label="Services" icon={<LaundryIcon />} iconPosition="start" />
            <Tab
              label="Service Areas"
              icon={<LocationIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Box>

      {/* Services Tab */}
      {currentTab === 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                placeholder="Search services..."
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 250 }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="category-filter-label">Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  value={categoryFilter}
                  label="Category"
                  onChange={handleCategoryFilterChange}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {serviceCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="area-filter-label">Service Area</InputLabel>
                <Select
                  labelId="area-filter-label"
                  value={areaFilter}
                  label="Service Area"
                  onChange={handleAreaFilterChange}
                >
                  <MenuItem value="all">All Areas</MenuItem>
                  {serviceAreas.map((area) => (
                    <MenuItem key={area.zipCode} value={area.zipCode}>
                      {area.zipCode} - {area.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddService}
            >
              Add New Service
            </Button>
          </Box>

          <Grid container spacing={3}>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Grid item key={service._id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      opacity: service.isActive ? 1 : 0.7,
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" component="div">
                          {service.name}
                        </Typography>
                        <Chip
                          label={service.category}
                          size="small"
                          color={
                            service.category === "Premium"
                              ? "primary"
                              : service.category === "Specialized"
                              ? "secondary"
                              : service.category === "Add-on"
                              ? "info"
                              : service.category === "Business"
                              ? "warning"
                              : "default"
                          }
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {service.description}
                      </Typography>

                      <Divider sx={{ my: 1 }} />

                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2">Price:</Typography>
                          <Typography variant="body2">
                            ${service.price.toFixed(2)} {service.priceType}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2">
                            Est. Time:
                          </Typography>
                          <Typography variant="body2">
                            {service.estimatedTime} hours
                          </Typography>
                        </Grid>
                      </Grid>

                      <Typography variant="subtitle2" gutterBottom>
                        Specifications:
                      </Typography>
                      <List dense disablePadding>
                        {service.specifications
                          .slice(0, 2)
                          .map((spec, index) => (
                            <ListItem key={index} disablePadding>
                              <ListItemText
                                primary={spec}
                                primaryTypographyProps={{ variant: "body2" }}
                              />
                            </ListItem>
                          ))}
                        {service.specifications.length > 2 && (
                          <ListItem disablePadding>
                            <ListItemText
                              primary={`+${
                                service.specifications.length - 2
                              } more`}
                              primaryTypographyProps={{
                                variant: "body2",
                                color: "primary",
                              }}
                            />
                          </ListItem>
                        )}
                      </List>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Available in:
                        </Typography>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {service.availableInZipCodes
                            .slice(0, 3)
                            .map((zip) => (
                              <Chip
                                key={zip}
                                label={zip}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          {service.availableInZipCodes.length > 3 && (
                            <Chip
                              label={`+${
                                service.availableInZipCodes.length - 3
                              }`}
                              size="small"
                              color="primary"
                            />
                          )}
                        </Box>
                      </Box>
                    </CardContent>

                    <Box sx={{ bgcolor: "background.default", p: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={service.isActive}
                            onChange={
                              () => handleToggleActiveServices(service.isActive,service._id)
                            }
                          />
                        }
                        label={service.isActive ? "Active" : "Inactive"}
                      />
                    </Box>

                    <Divider />

                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditService(service)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteServiceClick(service._id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body1" color="text.secondary">
                    No services found matching your criteria.
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      )}

      {/* Service Areas Tab */}
      {currentTab === 1 && (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddArea}
            >
              Add New Service Area
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Zip Code</TableCell>
                  <TableCell>Area Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Service Days</TableCell>
                  <TableCell>Delivery Info</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceAreas.map((area) => (
                  <TableRow key={area.zipCode} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {area.zipCode}
                      </Typography>
                    </TableCell>
                    <TableCell>{area.name}</TableCell>
                    <TableCell>
                      {area.city}, {area.state}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {area.serviceDays.map((day) => (
                          <Chip
                            key={day}
                            label={day.slice(0, 3)}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {area.deliveryFee === 0
                          ? "Free Delivery"
                          : `${area.deliveryFee.toFixed(2)} Fee`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Min Order: ${area.minOrderValue}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ETA: {area.estimatedDeliveryTime}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={area.isActive}
                            onChange={() => handleToggleActive(area.isActive,area._id)}
                          />
                        }
                        label={
                          <Chip
                            label={area.isActive ? "Active" : "Inactive"}
                            color={area.isActive ? "success" : "default"}
                            size="small"
                          />
                        }
                        sx={{ ml: -1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Edit Area">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditArea(area)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Area">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteAreaClick(area._id,area.zipCode)}
                            disabled={area.activeServices > 0}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      {area.activeServices > 0 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Used by {area.activeServices} services
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Service Dialog */}
      <Dialog
        open={openServiceDialog}
        onClose={handleCloseServiceDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedService?.id ? "Edit Service" : "Add New Service"}
        </DialogTitle>
        <DialogContent dividers>
          {selectedService && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Service Name"
                  fullWidth
                  value={selectedService.name}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      name: e.target.value,
                    })
                  }
                  required
                  error={!!validationErrors.name}
                  helperText={validationErrors.name}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    value={selectedService.category}
                    label="Category"
                    onChange={(e) =>
                      setSelectedService({
                        ...selectedService,
                        category: e.target.value,
                      })
                    }
                  >
                    {serviceCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
                  value={selectedService.description}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      description: e.target.value,
                    })
                  }
                  required
                  error={!!validationErrors.description}
                  helperText={validationErrors.description}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Price"
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  value={selectedService.price}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      price: parseFloat(e.target.value),
                    })
                  }
                  required
                  error={!!validationErrors.price}
                  helperText={validationErrors.price}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="price-type-label">Price Type</InputLabel>
                  <Select
                    labelId="price-type-label"
                    value={selectedService.priceType}
                    label="Price Type"
                    onChange={(e) =>
                      setSelectedService({
                        ...selectedService,
                        priceType: e.target.value,
                      })
                    }
                    error={!!validationErrors.priceType}
                  >
                    <MenuItem value="per item">Per Item</MenuItem>
                    <MenuItem value="per lb">Per Pound</MenuItem>
                    <MenuItem value="per set">Per Set</MenuItem>
                    <MenuItem value="per stain">Per Stain</MenuItem>
                  </Select>
                  {validationErrors.priceType && (
                    <FormHelperText error>
                      {validationErrors.priceType}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Estimated Time (hours)"
                  fullWidth
                  type="number"
                  value={selectedService.estimatedTime}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      estimatedTime: parseInt(e.target.value),
                    })
                  }
                  required
                  error={!!validationErrors.estimatedTime}
                  helperText={validationErrors.estimatedTime}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!validationErrors.availableInZipCodes}
                >
                  <Autocomplete
                    multiple
                    options={serviceAreas.map((area) => area.zipCode)}
                    getOptionLabel={(option) => {
                      const area = serviceAreas.find(
                        (a) => a.zipCode === option
                      );
                      return area ? `${option} - ${area.name}` : option;
                    }}
                    value={selectedService.availableInZipCodes}
                    onChange={(e, newValue) =>
                      setSelectedService({
                        ...selectedService,
                        availableInZipCodes: newValue,
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Available in Zip Codes"
                        placeholder="Add zip codes"
                        error={!!validationErrors.availableInZipCodes}
                        helperText={validationErrors.availableInZipCodes}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Image URL"
                  fullWidth
                  value={selectedService.imageUrl}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      imageUrl: e.target.value,
                    })
                  }
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Service Specifications
                </Typography>
                {selectedService.specifications.map((spec, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <TextField
                      label={`Specification ${index + 1}`}
                      fullWidth
                      value={spec}
                      onChange={(e) =>
                        handleServiceSpecChange(index, e.target.value)
                      }
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveServiceSpec(index)}
                      disabled={selectedService.specifications.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddServiceSpec}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Add Specification
                </Button>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedService.isActive}
                      onChange={(e) =>
                        setSelectedService({
                          ...selectedService,
                          isActive: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Active"
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseServiceDialog}>Cancel</Button>
          <Button
            onClick={handleSaveService}
            variant="contained"
            disabled={!selectedService?.name}
          >
            {selectedService?.id ? "Update Service" : "Add Service"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Area Dialog */}
      <Dialog
        open={openAreaDialog}
        onClose={handleCloseAreaDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedArea?.zipCode &&
          serviceAreas.some((a) => a.zipCode === selectedArea.zipCode)
            ? "Edit Service Area"
            : "Add New Service Area"}
        </DialogTitle>
        <DialogContent dividers>
          {selectedArea && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Zip Code"
                  fullWidth
                  value={selectedArea.zipCode}
                  onChange={(e) =>
                    setSelectedArea({
                      ...selectedArea,
                      zipCode: e.target.value,
                    })
                  }
                  required
                  error={!!validationErrors.zipCode}
                  helperText={validationErrors.zipCode}
                  margin="normal"
                  disabled={
                    selectedArea?.zipCode &&
                    serviceAreas.some((a) => a.zipCode === selectedArea.zipCode)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Area Name"
                  fullWidth
                  value={selectedArea.name}
                  onChange={(e) =>
                    setSelectedArea({ ...selectedArea, name: e.target.value })
                  }
                  required
                  error={!!validationErrors.name}
                  helperText={validationErrors.name}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  fullWidth
                  value={selectedArea.city}
                  onChange={(e) =>
                    setSelectedArea({ ...selectedArea, city: e.target.value })
                  }
                  required
                  error={!!validationErrors.city}
                  helperText={validationErrors.city}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  fullWidth
                  value={selectedArea.state}
                  onChange={(e) =>
                    setSelectedArea({ ...selectedArea, state: e.target.value })
                  }
                  required
                  error={!!validationErrors.state}
                  helperText={validationErrors.state}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!validationErrors.serviceDays}
                >
                  <InputLabel id="service-days-label">Service Days</InputLabel>
                  <Select
                    labelId="service-days-label"
                    multiple
                    value={selectedArea.serviceDays}
                    label="Service Days"
                    onChange={(e) =>
                      setSelectedArea({
                        ...selectedArea,
                        serviceDays: e.target.value,
                      })
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {daysOfWeek.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.serviceDays && (
                    <FormHelperText>
                      {validationErrors.serviceDays}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Delivery Fee"
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  value={selectedArea.deliveryFee}
                  onChange={(e) =>
                    setSelectedArea({
                      ...selectedArea,
                      deliveryFee: parseFloat(e.target.value),
                    })
                  }
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Minimum Order Value"
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  value={selectedArea.minOrderValue}
                  onChange={(e) =>
                    setSelectedArea({
                      ...selectedArea,
                      minOrderValue: parseFloat(e.target.value),
                    })
                  }
                  required
                  error={!!validationErrors.minOrderValue}
                  helperText={validationErrors.minOrderValue}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Estimated Delivery Time"
                  fullWidth
                  value={selectedArea.estimatedDeliveryTime}
                  onChange={(e) =>
                    setSelectedArea({
                      ...selectedArea,
                      estimatedDeliveryTime: e.target.value,
                    })
                  }
                  margin="normal"
                  placeholder="e.g., 24-48 hours"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedArea.isActive}
                      onChange={(e) =>
                        setSelectedArea({
                          ...selectedArea,
                          isActive: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Active"
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAreaDialog}>Cancel</Button>
          <Button
            onClick={handleSaveArea}
            variant="contained"
            disabled={!selectedArea?.zipCode || !selectedArea?.name}
          >
            {selectedArea?.zipCode &&
            serviceAreas.some((a) => a.zipCode === selectedArea.zipCode)
              ? "Update Area"
              : "Add Area"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone!
          </Alert>
          {deleteType === "service" && (
            <Typography>
              Are you sure you want to delete this service? This will remove it
              from all service areas.
            </Typography>
          )}
          {deleteType === "area" && (
            <>
              <Typography>
                Are you sure you want to delete this service area?
              </Typography>
              {serviceAreas.find((a) => a.zipCode === deleteId)
                ?.activeServices > 0 && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  This area is currently used by{" "}
                  {
                    serviceAreas.find((a) => a.zipCode === deleteId)
                      ?.activeServices
                  }{" "}
                  services. You must remove these services from this area before
                  deleting it.
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={
              deleteType === "area" &&
              serviceAreas.find((a) => a.zipCode === deleteId)?.activeServices >
                0
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}