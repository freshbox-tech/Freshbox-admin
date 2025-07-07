// app/location-management/page.js
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
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
  Tooltip,
  Alert,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Map as MapIcon,
} from "@mui/icons-material";
import dynamic from 'next/dynamic';
import ApiServices from "@/lib/ApiServices";

// Dynamically import the Map component to avoid SSR issues
const MapWithNoSSR = dynamic(
  () => import('./ServiceAreaMap'),
  { ssr: false }
);

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

// Coverage options
const coverageOptions = ["Full", "Partial", "Limited"];

// US States for dropdown
const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export default function LocationManagementPage() {
  const [serviceAreas, setServiceAreas] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [coverageFilter, setCoverageFilter] = useState("all");
  const [selectedArea, setSelectedArea] = useState(null);
  const [areaId, setAreaId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [mapZoom, setMapZoom] = useState(5);

  useEffect(() => {
    const getAllServicesAreas = async() => {
      setLoading(true);
      try {
        const res = await ApiServices.allServicesArea();
        if(res.data.success){
          setServiceAreas(res.data.areas);
          setFilteredAreas(res.data.areas);
          setError(null);
          
          // Set map center to first area if available
          if (res.data.areas.length > 0 && res.data.areas[0].location?.coordinates) {
            setMapCenter([res.data.areas[0].location.coordinates[1], res.data.areas[0].location.coordinates[0]]);
          }
        }
      } catch (error) {
        console.error("Error fetching service areas:", error);
        setError("Failed to load service areas. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getAllServicesAreas();
  }, []);

  useEffect(() => {
    // Apply filters
    const filtered = serviceAreas.filter((area) => {
      const matchesSearch =
        area.zipCode?.includes(searchTerm) ||
        area.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        area.city?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && area.isActive) ||
        (statusFilter === "inactive" && !area.isActive);

      const matchesCoverage =
        coverageFilter === "all" || area.coverage === coverageFilter;

      return matchesSearch && matchesStatus && matchesCoverage;
    });

    setFilteredAreas(filtered);
  }, [serviceAreas, searchTerm, statusFilter, coverageFilter]);

  // Memoize the map markers data
  const mapMarkers = useMemo(() => {
    return filteredAreas.map(area => ({
      id: area._id,
      position: area.location?.coordinates 
        ? [area.location.coordinates[1], area.location.coordinates[0]] 
        : null,
      name: area.name,
      zipCode: area.zipCode,
      city: area.city,
      state: area.state,
      isActive: area.isActive,
      coverage: area.coverage
    })).filter(marker => marker.position !== null);
  }, [filteredAreas]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleCoverageFilterChange = (event) => {
    setCoverageFilter(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleEditArea = (area) => {
    setSelectedArea({ ...area });
    setValidationErrors({});
    setOpenDialog(true);
  };

  const handleAddNew = () => {
    setSelectedArea({
      zipCode: "",
      name: "",
      city: "",
      state: "NY",
      isActive: true,
      serviceDays: [],
      deliveryFee: 0,
      minOrderValue: 20,
      estimatedDeliveryTime: "24-48 hours",
      activePartners: 0,
      activeRiders: 0,
      activeServices: 0,
      coverage: "Partial",
      location: {
        type: "Point",
        coordinates: [-0.1276, 51.5074] // Default to London coordinates
      },
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    });
    setValidationErrors({});
    setOpenDialog(true);
  };

  const handleDeleteArea = (id) => {
    const area = serviceAreas.find((area) => area._id === id);
    if (area) {
      setSelectedArea(area);
      setAreaId(id);
      setOpenDeleteDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedArea(null);
    setValidationErrors({});
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedArea(null);
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

  const handleSaveArea = async () => {
    const errors = validateArea(selectedArea);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const isEdit = selectedArea._id !== undefined;

    try {
      if (isEdit) {
        const res = await ApiServices.updateServicesArea(selectedArea._id, selectedArea);
        if (res.data.success) {
          setServiceAreas(
            serviceAreas.map((area) =>
              area._id === selectedArea._id ? { ...res.data.area } : area
            )
          );
        }
      } else {
        const res = await ApiServices.addServicesArea(selectedArea);
        if (res.data.success) {
          setServiceAreas([...serviceAreas, res.data.area]);
        }
      }
      
      setOpenDialog(false);
      setSelectedArea(null);
      setValidationErrors({});
    } catch (error) {
      console.error("Error saving service area:", error);
      setError("Failed to save service area. Please try again.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await ApiServices.deleteServicesArea(areaId);
      if (res.data.success) {
        setServiceAreas(serviceAreas.filter((area) => area._id !== areaId));
      }
    } catch (error) {
      console.error("Error deleting service area:", error);
      setError("Failed to delete service area. Please try again.");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedArea(null);
    }
  };

  const handleToggleActive = async(status, id) => {
    try {
      const res = await ApiServices.toggleServicesAreaStatus(id, !status);
      if(res.data.success){
        setServiceAreas(
          serviceAreas.map((area) =>
            area._id === id ? { ...area, isActive: !status } : area
          )
        );
      }
    } catch (error) {
      console.error("Error toggling service area status:", error);
      setError("Failed to update service area status. Please try again.");
    }
  };

  const handleMapClick = (e) => {
    if (openDialog && selectedArea) {
      setSelectedArea({
        ...selectedArea,
        location: {
          type: "Point",
          coordinates: [e.latlng.lng, e.latlng.lat]
        }
      });
    }
  };

  const handleMarkerClick = (marker) => {
    const area = serviceAreas.find(a => a._id === marker.id);
    if (area) {
      setSelectedArea(area);
      setOpenDialog(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Location Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage service areas by zip code
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ width: "100%", mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="location view tabs"
        >
          <Tab
            label="Table View"
            icon={<LocationIcon />}
            iconPosition="start"
          />
          <Tab label="Map View" icon={<MapIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}
        >
          <Box sx={{ 
            display: "flex", 
            gap: 2, 
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', md: 'auto' }
          }}>
            <TextField
              placeholder="Search by ZIP, name or city..."
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
              sx={{ width: { xs: '100%', sm: 250 } }}
            />
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
              <InputLabel id="coverage-filter-label">Coverage</InputLabel>
              <Select
                labelId="coverage-filter-label"
                value={coverageFilter}
                label="Coverage"
                onChange={handleCoverageFilterChange}
              >
                <MenuItem value="all">All Coverage</MenuItem>
                {coverageOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{ width: { xs: '100%', md: 'auto' } }}
          >
            Add New Service Area
          </Button>
        </Box>

        {/* Table View */}
        {currentTab === 0 && (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ZIP Code</TableCell>
                  <TableCell>Area Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Service Days</TableCell>
                  <TableCell>Coverage</TableCell>
                  <TableCell>Services</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAreas.length > 0 ? (
                  filteredAreas.map((area) => (
                    <TableRow key={area._id} hover>
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
                          {area.serviceDays && area.serviceDays.map((day) => (
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
                        <Chip
                          label={area.coverage}
                          color={
                            area.coverage === "Full"
                              ? "success"
                              : area.coverage === "Partial"
                              ? "primary"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="caption">
                            Partners: {area.activePartners}
                          </Typography>
                          <Typography variant="caption">
                            Riders: {area.activeRiders}
                          </Typography>
                          <Typography variant="caption">
                            Services: {area.activeServices}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={area.isActive}
                              onChange={() => handleToggleActive(area.isActive, area._id)}
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
                              onClick={() => handleDeleteArea(area._id)}
                              disabled={
                                area.activePartners > 0 ||
                                area.activeRiders > 0 ||
                                area.activeServices > 0
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No service areas found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Map View */}
        {currentTab === 1 && (
          <Box sx={{ height: '600px', width: '100%', position: 'relative' }}>
            <MapWithNoSSR 
              markers={mapMarkers} 
              center={mapCenter} 
              zoom={mapZoom}
              onClick={openDialog ? handleMapClick : null}
              onMarkerClick={handleMarkerClick}
              selectedPosition={
                openDialog && selectedArea?.location?.coordinates
                  ? [selectedArea.location.coordinates[1], selectedArea.location.coordinates[0]]
                  : null
              }
            />
          </Box>
        )}
      </Paper>

      {/* Add/Edit Service Area Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedArea?._id ? "Edit Service Area" : "Add New Service Area"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={selectedArea?.zipCode || ""}
                onChange={(e) =>
                  setSelectedArea({ ...selectedArea, zipCode: e.target.value })
                }
                required
                error={!!validationErrors.zipCode}
                helperText={validationErrors.zipCode}
                disabled={selectedArea?._id !== undefined}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Area Name"
                value={selectedArea?.name || ""}
                onChange={(e) =>
                  setSelectedArea({ ...selectedArea, name: e.target.value })
                }
                required
                error={!!validationErrors.name}
                helperText={validationErrors.name}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="City"
                value={selectedArea?.city || ""}
                onChange={(e) =>
                  setSelectedArea({ ...selectedArea, city: e.target.value })
                }
                required
                error={!!validationErrors.city}
                helperText={validationErrors.city}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={!!validationErrors.state}>
                <InputLabel id="state-label">State</InputLabel>
                <Select
                  labelId="state-label"
                  value={selectedArea?.state || ""}
                  label="State"
                  onChange={(e) =>
                    setSelectedArea({ ...selectedArea, state: e.target.value })
                  }
                >
                  {usStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.state && (
                  <FormHelperText>{validationErrors.state}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* Map for location selection in dialog */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Location on Map
              </Typography>
              <Box sx={{ height: '300px', width: '100%', mb: 2 }}>
                <MapWithNoSSR 
                  center={
                    selectedArea?.location?.coordinates
                      ? [selectedArea.location.coordinates[1], selectedArea.location.coordinates[0]]
                      : mapCenter
                  }
                  zoom={13}
                  onClick={handleMapClick}
                  selectedPosition={
                    selectedArea?.location?.coordinates
                      ? [selectedArea.location.coordinates[1], selectedArea.location.coordinates[0]]
                      : null
                  }
                  interactive={true}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Click on the map to set the location for this service area
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!validationErrors.serviceDays}>
                <InputLabel id="service-days-label">Service Days</InputLabel>
                <Select
                  labelId="service-days-label"
                  multiple
                  value={selectedArea?.serviceDays || []}
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
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Delivery Fee ($)"
                type="number"
                value={selectedArea?.deliveryFee || 0}
                onChange={(e) =>
                  setSelectedArea({
                    ...selectedArea,
                    deliveryFee: parseFloat(e.target.value) || 0,
                  })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Minimum Order Value ($)"
                type="number"
                value={selectedArea?.minOrderValue || 0}
                onChange={(e) =>
                  setSelectedArea({
                    ...selectedArea,
                    minOrderValue: parseFloat(e.target.value) || 0,
                  })
                }
                required
                error={!!validationErrors.minOrderValue}
                helperText={validationErrors.minOrderValue}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Estimated Delivery Time"
                value={selectedArea?.estimatedDeliveryTime || ""}
                onChange={(e) =>
                  setSelectedArea({
                    ...selectedArea,
                    estimatedDeliveryTime: e.target.value,
                  })
                }
                placeholder="e.g., 24-48 hours"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="coverage-label">Coverage</InputLabel>
                <Select
                  labelId="coverage-label"
                  value={selectedArea?.coverage || "Partial"}
                  label="Coverage"
                  onChange={(e) =>
                    setSelectedArea({
                      ...selectedArea,
                      coverage: e.target.value,
                    })
                  }
                >
                  {coverageOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedArea?.isActive || false}
                    onChange={(e) =>
                      setSelectedArea({
                        ...selectedArea,
                        isActive: e.target.checked,
                      })
                    }
                  />
                }
                label="Active"
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveArea}
            variant="contained"
            disabled={
              !selectedArea?.zipCode ||
              !selectedArea?.name ||
              !selectedArea?.city
            }
          >
            Save
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
          {selectedArea && (
            <Typography paragraph>
              Are you sure you want to delete the service area "{selectedArea.name}" with ZIP code{" "}
              <strong>{selectedArea.zipCode}</strong>?
            </Typography>
          )}
          {selectedArea &&
            (selectedArea.activePartners > 0 ||
              selectedArea.activeRiders > 0 ||
              selectedArea.activeServices > 0) && (
              <Alert severity="error">
                This area cannot be deleted because it is currently used by
                partners, riders, or services. You must reassign these before
                deleting.
              </Alert>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={
              selectedArea &&
              (selectedArea.activePartners > 0 ||
                selectedArea.activeRiders > 0 ||
                selectedArea.activeServices > 0)
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}