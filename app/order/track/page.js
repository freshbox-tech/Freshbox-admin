// app/order-management/order-tracking/page.js
"use client";

import { useState, useEffect } from "react";
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
  Card,
  CardContent,
  Chip,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ShoppingBasket as OrderIcon,
  Schedule as ScheduleIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Store as StoreIcon,
  Message as MessageIcon,
  MoreVert as MoreVertIcon,
  History as HistoryIcon,
  LocalLaundryService as LaundryIcon,
  OpenInFull,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import ApiServices from "@/lib/ApiServices";

// Order status options
const orderStatuses = [
  "Ordered",
  "Assigned",
  "Picked Up",
  "In Progress",
  "Ready for Delivery",
  "Delivered",
];

// Map status to step number
const statusToStep = {
  processing: 0,
  assign: 1,
  scheduled: 2,
  ready: 3,
  delivered: 5,
  cancelled: -1,
};
const statusOfOrders = [
  "processing",
  "assign",
  "scheduled",
  "ready",
  "delivered",
  "cancelled",
];

export default function OrderTrackingPage() {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const { orders, setOrders } = useAuth();

  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders);
    }
  }, [orders]);

  // Update the handleDateFilterChange function and add date filtering logic
  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  // Add this useEffect to handle date filtering
  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesSearch =
        order?._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.user.phoneNumber.includes(searchTerm) ||
        order?.user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order?.status === statusFilter;

      // Date filtering logic
      let matchesDate = true;
      if (dateFilter !== "all") {
        const orderDate = new Date(order?.createdAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (dateFilter) {
          case "today":
            const todayEnd = new Date(today);
            todayEnd.setDate(today.getDate() + 1);
            matchesDate = orderDate >= today && orderDate < todayEnd;
            break;

          case "yesterday":
            const yesterdayStart = new Date(today);
            yesterdayStart.setDate(today.getDate() - 1);
            const yesterdayEnd = new Date(today);
            matchesDate =
              orderDate >= yesterdayStart && orderDate < yesterdayEnd;
            break;

          case "thisWeek":
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
            matchesDate = orderDate >= weekStart;
            break;

          case "thisMonth":
            const monthStart = new Date(
              today.getFullYear(),
              today.getMonth(),
              1
            );
            matchesDate = orderDate >= monthStart;
            break;

          default:
            matchesDate = true;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus("");
    setStatusNote("");
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleSaveStatus = async () => {
    if (!newStatus) return;

    try {
      const data = {
        status: newStatus,
        note: statusNote,
      };
      const res = await ApiServices.updateStepStatus(selectedOrder._id, data);
      if (res.data.success) {
        const updatedOrder = res.data.order;
        console.log(updatedOrder)
        setOrders(
          orders.map((order) =>
            order._id === selectedOrder._id ? updatedOrder : order
          )
        );

        // Update selected order
        setSelectedOrder(updatedOrder);

        setOpenUpdateDialog(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeStr).toLocaleDateString("en-US", options);
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Order Tracking
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and update order status
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Panel - Order List */}
        <Grid item xs={12} md={5} lg={4}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Search orders..."
                value={searchTerm}
                onChange={handleSearch}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {statusOfOrders.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel id="date-filter-label">Date</InputLabel>
                <Select
                  labelId="date-filter-label"
                  value={dateFilter}
                  label="Date"
                  onChange={handleDateFilterChange}
                >
                  <MenuItem value="all">All Dates</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="yesterday">Yesterday</MenuItem>
                  <MenuItem value="thisWeek">This Week</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              {filteredOrders.length} Orders
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ height: "calc(100vh - 300px)", overflow: "auto" }}>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Card
                    key={order._id}
                    sx={{
                      mb: 2,
                      cursor: "pointer",
                      border:
                        selectedOrder?._id === order._id
                          ? "2px solid #1976d2"
                          : "none",
                    }}
                    onClick={() => handleOrderSelect(order)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="medium">
                          {order._id}
                        </Typography>
                        <Chip
                          label={order.status}
                          color={
                            order.status === "delivered"
                              ? "success"
                              : order.status === "rejected"
                              ? "error"
                              : order.status === "ready" ||
                                order.status === "scheduled"
                              ? "info"
                              : "default"
                          }
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2">
                        <PersonIcon
                          fontSize="small"
                          sx={{ verticalAlign: "middle", mr: 0.5 }}
                        />
                        {order.user.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          <TimeIcon
                            fontSize="small"
                            sx={{ verticalAlign: "middle", mr: 0.5 }}
                          />
                          {formatDateTime(order?.steps[0].date)}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          ${order.totalPrice.toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No orders found
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel - Order Details */}
        <Grid item xs={12} md={7} lg={8}>
          <Paper sx={{ p: 3, height: "100%" }}>
            {selectedOrder ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography variant="h5">
                      Order {selectedOrder._id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Placed on {formatDateTime(selectedOrder.createdAt)}
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => handleUpdateStatus(selectedOrder)}
                    >
                      Update Status
                    </Button>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {/* Order Status Timeline */}
                  <Grid item xs={12} lg={6}>
                    <Typography variant="h6" gutterBottom>
                      Order Status
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Stepper
                        activeStep={statusToStep[selectedOrder.status]}
                        orientation="vertical"
                        sx={{ "& .MuiStepLabel-iconContainer": { pr: 4 } }}
                      >
                        {orderStatuses.slice(0, 6).map((label, index) => (
                          <Step key={label}>
                            <StepLabel>
                              <Typography>{label}</Typography>
                            </StepLabel>
                            <StepContent>
                              {selectedOrder?.steps.find(
                                (history) => history.status === label
                              ) ? (
                                <Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {formatDateTime(
                                      selectedOrder.steps.find(
                                        (history) => history.status === label
                                      )?.timestamp
                                    )}
                                  </Typography>
                                  <Typography variant="body2">
                                    {
                                      selectedOrder.steps.find(
                                        (history) => history.status === label
                                      )?.note
                                    }
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Pending
                                </Typography>
                              )}
                            </StepContent>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                  </Grid>

                  {/* Order Details */}
                  <Grid item xs={12} lg={6}>
                    <Grid container spacing={3}>
                      {/* Customer Information */}
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Customer Information
                        </Typography>
                        <Card variant="outlined" sx={{ mb: 3 }}>
                          <CardContent>
                            <Typography variant="subtitle1">
                              {selectedOrder.user.name}
                            </Typography>
                            <Typography variant="body2">
                              {selectedOrder.user.email}
                            </Typography>
                            <Typography variant="body2">
                              {selectedOrder.user.phoneNumber}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2">
                              <LocationIcon
                                fontSize="small"
                                sx={{ verticalAlign: "middle", mr: 0.5 }}
                              />
                              {selectedOrder.deliveryAddress.addressLine1 +
                                selectedOrder.deliveryAddress.addressLine2}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Assigned Rider & Partner */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          Assigned Rider
                        </Typography>
                        <Card variant="outlined" sx={{ mb: 3 }}>
                          <CardContent>
                            {selectedOrder?.rider ? (
                              <>
                                <Typography variant="subtitle2">
                                  {selectedOrder?.rider.name}
                                </Typography>
                                <Typography variant="body2">
                                  {selectedOrder?.rider.phoneNumber}
                                </Typography>
                              </>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Not assigned yet
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            Laundry Partner
                          </Typography>
                          <Card variant="outlined" sx={{ mb: 3 }}>
                            <CardContent>
                              {selectedOrder.partner ? (
                                <>
                                  <Typography variant="subtitle2">
                                    {selectedOrder.partner.name}
                                  </Typography>
                                  <Typography variant="body2">
                                    {selectedOrder.partner.phone}
                                  </Typography>
                                </>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  Not assigned yet
                                </Typography>
                              )}
                            </CardContent>
                          </Card>
                        </Grid> */}
                    </Grid>

                    {/* Order Items */}
                    <Typography variant="h6" gutterBottom>
                      Order Items
                    </Typography>
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ mb: 3 }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Service</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items.map((item) => (
                            <TableRow key={item.name}>
                              <TableCell>
                                {item.specifications.join(",")}
                              </TableCell>
                              <TableCell align="right">
                                {item.quantity}
                              </TableCell>
                              <TableCell align="right">
                                ${item.pricePerItem.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              Total:
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              ${selectedOrder.totalPrice.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Payment Information */}
                    <Typography variant="h6" gutterBottom>
                      Payment Information
                    </Typography>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2">
                              Payment Method
                            </Typography>
                            <Typography variant="body2">
                              {selectedOrder.paymentType}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2">
                              Payment Status
                            </Typography>
                            <Chip
                              label={"Paid"}
                              color={"success"}
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Select an order to view details
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Update Status Dialog */}
      <Dialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="new-status-label">New Status</InputLabel>
              <Select
                labelId="new-status-label"
                value={newStatus}
                label="New Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {orderStatuses.map((status) => (
                  <MenuItem
                    key={status}
                    value={status}
                    disabled={selectedOrder?.status === status}
                  >
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Status Note"
              multiline
              rows={2}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Add a note about this status update"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button
            onClick={handleSaveStatus}
            variant="contained"
            disabled={!newStatus}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
