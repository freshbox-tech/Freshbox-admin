// app/order-management/assign-orders/page.js
"use client";

import { useState, useEffect } from "react";
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  LocalShipping as ShippingIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import ApiServices from "@/lib/ApiServices";

export default function AssignOrdersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [pendingOrders, setPendingOrders] = useState([]);
  const [availableRiders, setAvailableRiders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const [openRiderDialog, setOpenRiderDialog] = useState(false);
  const [filterZipCode, setFilterZipCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { orders, riders } = useAuth();

  useEffect(() => {
    if (orders && riders) {
      const pendingOrders = orders.filter(
        (order) => order.status === "processing"
      );
      setPendingOrders(pendingOrders);
      setAvailableRiders(riders);
    }
  }, [orders, riders]);

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);

    // If mobile, open rider selection dialog
    if (isMobile) {
      setOpenRiderDialog(true);
    }
  };

  const handleRiderSelect = (rider) => {
    setSelectedRider(rider);
  };

  const handleAssign = async () => {
    if (selectedOrder && selectedRider) {
      try {
        const res = await ApiServices.assignOrderToRider(
          selectedRider._id,
          selectedOrder._id
        );
        if (res.data.success) {
          setPendingOrders(
            pendingOrders.filter((order) => order._id !== selectedOrder._id)
          );

          // Update rider's load and order count
          setAvailableRiders(
            availableRiders.map((rider) =>
              rider._id === selectedRider._id
                ? {
                    ...rider,
                    activeOrders: rider.activeOrders + 1,
                  }
                : rider
            )
          );
          const data = {
            orderId: selectedOrder._id,
            riderId: selectedRider._id,
          };
          await ApiServices.createChat(data);
        }
      } catch (error) {}

      // Reset selection
      setSelectedOrder(null);
      setSelectedRider(null);
      setOpenRiderDialog(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleZipCodeFilter = (event) => {
    setFilterZipCode(event.target.value);
  };

  const handlePriorityFilter = (event) => {
    setPriorityFilter(event.target.value);
  };

  const filteredOrders = pendingOrders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesZip =
      !filterZipCode || order.deliveryAddress.postcode === filterZipCode;

    const matchesPriority =
      priorityFilter === "all" ||
      order?.priority.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesZip && matchesPriority;
  });

  const filteredRiders = availableRiders.filter(
    (rider) =>
      rider.status === "Available" &&
      (!selectedOrder ||
        rider.servicesAreas.includes(selectedOrder.deliveryAddress.postcode))
  );

  const formatDateTime = (dateTimeStr) => {
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
          Assign Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Assign pending orders to available riders
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Pending Orders Section */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Pending Orders</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="priority-filter-label">Priority</InputLabel>
                  <Select
                    labelId="priority-filter-label"
                    id="priority-filter"
                    value={priorityFilter}
                    label="Priority"
                    onChange={handlePriorityFilter}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="express">Express</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Card
                    key={order._id}
                    sx={{
                      mb: 2,
                      border:
                        selectedOrder?._id === order._id
                          ? `2px solid ${theme.palette.primary.main}`
                          : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleOrderSelect(order)}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          component="div"
                          fontWeight="bold"
                        >
                          {order._id}
                        </Typography>
                        <Chip
                          label={"Express"}
                          color={"default"}
                          size="small"
                        />
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <PersonIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {order.user.name}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <LocationIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary", mt: 0.5 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {order.deliveryAddress.addressLine1 +
                            order.deliveryAddress.addressLine2}
                          <Typography
                            component="span"
                            variant="body2"
                            fontWeight="medium"
                            color="primary"
                          >
                            {` (${order.deliveryAddress.postcode})`}
                          </Typography>
                        </Typography>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <TimeIcon
                              fontSize="small"
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Pickup
                              </Typography>
                              <Typography variant="body2">
                                {formatDateTime(order?.pickupTime)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <TimeIcon
                              fontSize="small"
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Delivery
                              </Typography>
                              <Typography variant="body2">
                                {formatDateTime(order?.deliveryTime)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          <strong>Services:</strong>{" "}
                          {order?.items
                            .flatMap((item) => item.specifications)
                            .join(", ")}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 1,
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Items:</strong> {order.items.length}
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            ${order.totalPrice.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderSelect(order);
                          if (isMobile) {
                            setOpenRiderDialog(true);
                          }
                        }}
                        fullWidth
                      >
                        Select for Assignment
                      </Button>
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No pending orders found
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Available Riders Section */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Available Riders</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedOrder ? (
                  <>
                    Showing riders available for zip code{" "}
                    <strong>{selectedOrder.deliveryAddress.postcode}</strong>
                  </>
                ) : (
                  "Select an order to see eligible riders"
                )}
              </Typography>
            </Box>

            <Box sx={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}>
              {selectedOrder ? (
                filteredRiders.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Rider</TableCell>
                          <TableCell>Vehicle</TableCell>
                          <TableCell>Capacity</TableCell>
                          <TableCell>Rating</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredRiders.map((rider) => (
                          <TableRow
                            key={rider._id}
                            selected={selectedRider?._id === rider._id}
                            onClick={() => handleRiderSelect(rider)}
                            hover
                            sx={{ cursor: "pointer" }}
                          >
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Avatar sx={{ mr: 2 }}>
                                  {rider.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                  >
                                    {rider.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {rider.phoneNumber}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{rider.vehicleType}</TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {rider?.currentLoad} / {rider?.maxCapacity}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {rider?.activeOrders} active orders
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={`${rider.rating}/5`}
                                color={
                                  rider.rating >= 4.5 ? "success" : "default"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRiderSelect(rider);
                                }}
                                color={
                                  selectedRider?._id === rider._id
                                    ? "success"
                                    : "primary"
                                }
                                startIcon={
                                  selectedRider?._id === rider._id ? (
                                    <CheckIcon />
                                  ) : (
                                    <ShippingIcon />
                                  )
                                }
                              >
                                {selectedRider?._id === rider._id
                                  ? "Selected"
                                  : "Select"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No available riders for this order's zip code
                    </Typography>
                  </Box>
                )
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Select an order from the left to view eligible riders
                  </Typography>
                </Box>
              )}
            </Box>

            {selectedOrder && selectedRider && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAssign}
                  startIcon={<ShippingIcon />}
                >
                  Assign Order {selectedOrder._id} to {selectedRider.name}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Mobile Rider Selection Dialog */}
      <Dialog
        open={openRiderDialog}
        onClose={() => setOpenRiderDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Select a Rider for Order {selectedOrder?._id}</DialogTitle>
        <DialogContent>
          <List sx={{ pt: 0 }}>
            {filteredRiders.length > 0 ? (
              filteredRiders.map((rider) => (
                <ListItem
                  button
                  key={rider._id}
                  onClick={() => handleRiderSelect(rider)}
                  selected={selectedRider?._id === rider._id}
                >
                  <ListItemAvatar>
                    <Avatar>{rider.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={rider.name}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {rider.vehicleType} • {rider?.currentLoad}/
                          {rider?.maxCapacity} capacity
                        </Typography>
                        <br />
                        Rating: {rider.rating}/5 • {rider?.activeOrders} active
                        orders
                      </>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText
                  primary="No available riders"
                  secondary="There are no riders available for this order's zip code"
                />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRiderDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAssign}
            variant="contained"
            disabled={!selectedRider}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
