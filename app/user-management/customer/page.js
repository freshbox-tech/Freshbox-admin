// app/user-management/customers/page.js
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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import ApiServices from "@/lib/ApiServices";
import { useAuth } from "@/contexts/AuthContext";

// Dummy data for customers
const dummyCustomers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "555-123-4567",
    address: "123 Main St, City",
    status: "Active",
    membershipPlan: "Premium",
    joinDate: "2024-10-15",
    totalOrders: 12,
    totalSpent: "$345.85",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "555-987-6543",
    address: "456 Oak Ave, Town",
    status: "Active",
    membershipPlan: "Basic",
    joinDate: "2024-11-20",
    totalOrders: 8,
    totalSpent: "$189.50",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "555-456-7890",
    address: "789 Pine Rd, Village",
    status: "Inactive",
    membershipPlan: "Enterprise",
    joinDate: "2024-09-05",
    totalOrders: 24,
    totalSpent: "$780.25",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "555-789-0123",
    address: "101 Elm Blvd, County",
    status: "Active",
    membershipPlan: "Premium",
    joinDate: "2025-01-10",
    totalOrders: 6,
    totalSpent: "$210.75",
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "555-321-6547",
    address: "202 Cedar Ln, District",
    status: "Active",
    membershipPlan: "Basic",
    joinDate: "2024-12-15",
    totalOrders: 3,
    totalSpent: "$85.99",
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "555-654-3210",
    address: "303 Maple Dr, Region",
    status: "Inactive",
    membershipPlan: "Premium",
    joinDate: "2024-08-25",
    totalOrders: 15,
    totalSpent: "$420.30",
  },
  {
    id: 7,
    name: "David Miller",
    email: "david@example.com",
    phone: "555-987-4561",
    address: "404 Birch St, Zone",
    status: "Active",
    membershipPlan: "Enterprise",
    joinDate: "2025-02-05",
    totalOrders: 9,
    totalSpent: "$550.40",
  },
];

export default function CustomersPage() {
  const { customers } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
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

  const handlePlanFilterChange = (event) => {
    setPlanFilter(event.target.value);
    setPage(0);
  };

  const handleEditClick = (customer) => {
    setEditCustomer(customer);
    setOpenDialog(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteCustomerId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditCustomer(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteCustomerId(null);
  };

  const handleAddNew = () => {
    setEditCustomer({
      id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "Active",
      membershipPlan: "Basic",
      joinDate: new Date().toISOString().slice(0, 10),
      totalOrders: 0,
      totalSpent: "$0.00",
    });
    setOpenDialog(true);
  };

  const userStatusHandler = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const res = await ApiServices.updateUserStatus(id, newStatus);

      if (res.data.success) {
        const updatedStatus = res.data.status;
        setCustomers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, status: updatedStatus } : user
          )
        );
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const handleSaveCustomer = () => {
    if (editCustomer.id) {
      // Update existing customer
      setCustomers(
        customers.map((c) => (c.id === editCustomer.id ? editCustomer : c))
      );
    } else {
      // Add new customer
      const newCustomer = {
        ...editCustomer,
        id: Math.max(...customers.map((c) => c.id)) + 1,
      };
      setCustomers([...customers, newCustomer]);
    }
    setOpenDialog(false);
    setEditCustomer(null);
  };

  const handleDeleteCustomer = () => {
    setCustomers(customers.filter((c) => c.id !== deleteCustomerId));
    setOpenDeleteDialog(false);
    setDeleteCustomerId(null);
  };

  // Apply filters
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" ||
      customer.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPlan =
      planFilter === "all" ||
      customer.membershipPlan.toLowerCase() === planFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Pagination
  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Customers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all customer accounts
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search customers..."
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
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="plan-filter-label">Membership</InputLabel>
              <Select
                labelId="plan-filter-label"
                id="plan-filter"
                value={planFilter}
                label="Membership"
                onChange={handlePlanFilterChange}
              >
                <MenuItem value="all">All Plans</MenuItem>
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="enterprise">Enterprise</MenuItem>
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
              Add New
            </Button>
          </Grid> */}
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Membership</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {customer.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Since {new Date(customer.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{customer.email}</Typography>
                      <Typography variant="body2">{customer.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
  label={customer.plan?.planName || "N/A"}
  color={
    customer.plan?.planName === "Basic"
      ? "default"
      : customer.plan?.planName === "Premium"
      ? "primary"
      : customer.plan?.planName
      ? "secondary"
      : "default"
  }
  size="small"
/>

                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.status}
                        color={
                          customer.status === "Active" ? "success" : "error"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {customer.totalOrders} orders
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.totalSpent}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {customer.status === "inactive" ? (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() =>
                            userStatusHandler(customer._id, customer.status)
                          }
                          sx={{
                            textTransform: "none",
                            boxShadow: "none",
                          }}
                        >
                          Active
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() =>
                            userStatusHandler(customer._id, customer.status)
                          }
                          sx={{
                            textTransform: "none",
                            boxShadow: "none",
                          }}
                        >
                          Inactive
                        </Button>
                      )}

                      {/* <IconButton 
                        color="primary" 
                        onClick={() => handleEditClick(customer)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteClick(customer.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton> */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Edit Customer Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editCustomer?.id ? "Edit Customer" : "Add New Customer"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={editCustomer?.name || ""}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editCustomer?.email || ""}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={editCustomer?.phone || ""}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, phone: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editCustomer?.status || "Active"}
                  label="Status"
                  onChange={(e) =>
                    setEditCustomer({ ...editCustomer, status: e.target.value })
                  }
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={editCustomer?.address || ""}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, address: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Membership Plan</InputLabel>
                <Select
                  value={editCustomer?.membershipPlan || "Basic"}
                  label="Membership Plan"
                  onChange={(e) =>
                    setEditCustomer({
                      ...editCustomer,
                      membershipPlan: e.target.value,
                    })
                  }
                >
                  <MenuItem value="Basic">Basic</MenuItem>
                  <MenuItem value="Premium">Premium</MenuItem>
                  <MenuItem value="Enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Join Date"
                type="date"
                value={editCustomer?.joinDate || ""}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, joinDate: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveCustomer}
            variant="contained"
            disabled={!editCustomer?.name || !editCustomer?.email}
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
            Are you sure you want to delete this customer? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteCustomer}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
