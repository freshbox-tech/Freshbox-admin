// app/user-management/riders/page.js
"use client";

import { useState, useEffect } from "react";
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
  Rating,
  Badge,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  LocalShipping as VehicleIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import ApiServices from "@/lib/ApiServices";

// Vehicle types
const vehicleTypes = ["Scooter", "Bicycle", "Car", "Van","Truck"];

// Rider statuses
const riderStatuses = ["Available", "Busy", "On Break", "On Leave", "Inactive"];

export default function RidersPage() {
  const { riders, setRiders, serviceAreas } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [editRider, setEditRider] = useState(null);
  const [deleteRiderId, setDeleteRiderId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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

  const handleVehicleFilterChange = (event) => {
    setVehicleFilter(event.target.value);
    setPage(0);
  };

  const handleEditClick = (rider) => {
    setEditRider(rider);
    setOpenDialog(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteRiderId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditRider(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteRiderId(null);
  };

  const handleAddNew = () => {
    setEditRider({
      id: null,
      name: "",
      phone: "",
      email: "",
      photo: "",
      vehicle: "Scooter",
      status: "Available",
      rating: 0,
      currentLoad: 0,
      maxCapacity: 10,
      servicesAreas: [],
      activeOrders: 0,
      completedOrders: 0,
      joinDate: new Date().toISOString().split("T")[0],
      isActive: true,
    });
    setOpenDialog(true);
  };

  const handleSaveRider = async () => {
    try {
      const res = await ApiServices.updateRider(editRider._id, editRider);
      if (res.data.success) {
        setRiders(riders.map((r) => (r._id === editRider._id ? editRider : r)));
        setOpenDialog(false);
        setEditRider(null);
      }
    } catch (error) {
      console.log(error);
    }
    // if (editRider._id) {

    // } else {
    //   // Add new rider
    //   const newRider = {
    //     ...editRider,
    //     id: Math.max(...riders.map((r) => r.id)) + 1,
    //   };
    //   setRiders([...riders, newRider]);
    // }
  };

  const handleDeleteRider = () => {
    setRiders(riders.filter((r) => r._id !== deleteRiderId));
    setOpenDeleteDialog(false);
    setDeleteRiderId(null);
  };

  const handleToggleActive = async (id) => {
    try {
      const currentRider = riders.find((rider) => rider._id === id);
      if (!currentRider) {
        console.log("Rider not found");
        return;
      }

      const res = await ApiServices.updateOnlineStatus(
        id,
        !currentRider.online
      );

      if (res.data.success) {
        setRiders(
          riders.map((rider) =>
            rider._id === id ? { ...rider, online: !rider.online } : rider
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Apply filters
  const filteredRiders = riders.filter((rider) => {
    const matchesSearch =
      rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && rider.isActive) ||
      (statusFilter === "inactive" && !rider.isActive) ||
      rider.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesVehicle =
      vehicleFilter === "all" || rider.vehicle === vehicleFilter;

    return matchesSearch && matchesStatus && matchesVehicle;
  });

  // Pagination
  const paginatedRiders = filteredRiders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Riders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all delivery personnel
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search riders..."
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
          <Grid item xs={12} sm={6} md={3}>
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
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="busy">Busy</MenuItem>
                <MenuItem value="on break">On Break</MenuItem>
                <MenuItem value="on leave">On Leave</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="vehicle-filter-label">Vehicle</InputLabel>
              <Select
                labelId="vehicle-filter-label"
                id="vehicle-filter"
                value={vehicleFilter}
                label="Vehicle"
                onChange={handleVehicleFilterChange}
              >
                <MenuItem value="all">All Vehicles</MenuItem>
                {vehicleTypes.map((vehicle) => (
                  <MenuItem key={vehicle} value={vehicle}>
                    {vehicle}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              fullWidth
            >
              Add Rider
            </Button>
          </Grid> */}
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rider</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Performance</TableCell>
                <TableCell>Service Areas</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRiders.length > 0 ? (
                paginatedRiders.map((rider) => (
                  <TableRow key={rider._id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={rider.profilePicture}
                          alt={rider.name}
                          sx={{ mr: 2, width: 40, height: 40 }}
                        >
                          {rider.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {rider.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Since{" "}
                            {new Date(rider.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{rider.email}</Typography>
                      <Typography variant="body2">
                        {rider.phoneNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<VehicleIcon />}
                        label={rider.vehicleType}
                        variant="outlined"
                        size="small"
                      />
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 0.5 }}
                      >
                        Max Capacity: {rider.vehicleCapacity} items
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <Rating
                          value={rider.rating}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {rider.rating}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {rider.completedOrders} orders completed
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rider?.activeOrders} active orders
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {rider.servicesAreas.slice(0, 3).map((area, index) => (
                          <Chip
                            key={index}
                            label={area}
                            size="small"
                            variant="outlined"
                          />
                        ))}

                        {rider.servicesAreas.length > 3 && (
                          <Chip
                            label={`+${rider.servicesAreas.length - 3}`}
                            size="small"
                            color="primary"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={
                          rider.status === "Available"
                            ? "success"
                            : rider.status === "Busy"
                            ? "error"
                            : rider.status === "On Break"
                            ? "warning"
                            : "default"
                        }
                        variant="dot"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" component="span">
                        {rider.status}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={rider.online}
                            onChange={() => handleToggleActive(rider._id)}
                          />
                        }
                        label={rider.online ? "Active" : "Inactive"}
                        labelPlacement="end"
                        sx={{ ml: 0, mt: 1, display: "block" }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(rider)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      {/* <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(rider._id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton> */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No riders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRiders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Edit Rider Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editRider?._id ? "Edit Rider" : "Add New Rider"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={editRider?.name || ""}
                onChange={(e) =>
                  setEditRider({ ...editRider, name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editRider?.email || ""}
                onChange={(e) =>
                  setEditRider({ ...editRider, email: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={editRider?.phoneNumber || ""}
                onChange={(e) =>
                  setEditRider({ ...editRider, phoneNumber: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  value={editRider?.vehicleType || "Scooter"}
                  label="Vehicle Type"
                  onChange={(e) =>
                    setEditRider({ ...editRider, vehicleType: e.target.value })
                  }
                >
                  {vehicleTypes.map((vehicle) => (
                    <MenuItem key={vehicle} value={vehicle}>
                      {vehicle}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Capacity (items)"
                type="text"
                value={editRider?.vehicleCapacity || ""}
                onChange={(e) =>
                  setEditRider({
                    ...editRider,
                    vehicleCapacity: e.target.value || "",
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editRider?.status || "Available"}
                  label="Status"
                  onChange={(e) =>
                    setEditRider({ ...editRider, status: e.target.value })
                  }
                >
                  {riderStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Service Areas</InputLabel>

                <Select
                  multiple
                  value={editRider?.servicesAreas || []}
                  label="Service Area"
                  onChange={(e) =>
                    setEditRider({
                      ...editRider,
                      servicesAreas: e.target.value,
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
                  {serviceAreas.map((area) => (
                    <MenuItem key={area.zipCode} value={area.zipCode}>
                      {area.zipCode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Join Date"
                type="date"
                value={editRider?.createdAt || ""}
                onChange={(e) =>
                  setEditRider({ ...editRider, createdAt: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Photo URL"
                value={editRider?.profilePicture || ""}
                onChange={(e) =>
                  setEditRider({ ...editRider, profilePicture: e.target.value })
                }
                placeholder="Leave blank for default avatar"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editRider?.online || false}
                    onChange={(e) =>
                      setEditRider({ ...editRider, online: e.target.checked })
                    }
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
            onClick={handleSaveRider}
            variant="contained"
            disabled={
              !editRider?.name || !editRider?.email || !editRider?.phoneNumber
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
          <DialogContentText>
            Are you sure you want to delete this rider? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteRider} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
