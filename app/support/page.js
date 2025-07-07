// app/support-management/page.js
"use client";

import React, { useState, useEffect } from "react";
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Send as SendIcon,
  Person as PersonIcon,
  QuestionAnswer as SupportIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import ApiServices from "@/lib/ApiServices";

// Ticket status options
const ticketStatusOptions = [
  "Open",
  "In Progress",
  "Pending Customer Response",
  "Closed",
];

// Ticket priority options
const ticketPriorityOptions = ["Low", "Medium", "High", "Urgent"];

// Support staff options
const supportStaffOptions = ["Sarah Admin", "Mike Support", "Lisa Manager"];

export default function SupportManagementPage() {
  const { tickets, setTickets } = useAuth();
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (tickets) {
      setFilteredTickets(tickets);
    }
  }, [tickets]);

  useEffect(() => {
    // Apply filters
    const filtered = tickets.filter((ticket) => {
      const matchesSearch =
        ticket._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.from.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.orderNumber &&
          ticket.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    setFilteredTickets(filtered);
    setPage(0);
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handlePriorityFilterChange = (event) => {
    setPriorityFilter(event.target.value);
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setReplyMessage("");
  };

  const handleReplyChange = (event) => {
    setReplyMessage(event.target.value);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;

    const newMessage = {
      _id: Math.max(...selectedTicket?.messages.map((m) => m._id)) + 1,
      sender: "Support",
      message: replyMessage,
      timestamp: new Date().toISOString(),
    };
    const data = {
      email: selectedTicket.from.email,
      message: replyMessage,
    };
    try {
      const res = await ApiServices.sendSupportReply(selectedTicket._id, data);
      if (res.data.success) {
        const updatedTicket = {
          ...selectedTicket,
          messages: [...selectedTicket.messages, newMessage],
          updatedAt: new Date().toISOString(),
          status:
            selectedTicket.status === "Open"
              ? "In Progress"
              : selectedTicket.status,
        };

        // Update tickets state
        setTickets(
          tickets.map((ticket) =>
            ticket._id === selectedTicket._id ? updatedTicket : ticket
          )
        );

        // Update selected ticket
        setSelectedTicket(updatedTicket);
        setReplyMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    const updatedTicket = {
      ...selectedTicket,
      status: newStatus,
    };
    try {
      const res = await ApiServices.updateSupportTicket(
        selectedTicket._id,
        updatedTicket
      );
      if (res.data.success) {
        // Update tickets state
        setTickets(
          tickets.map((ticket) =>
            ticket._id === selectedTicket._id ? updatedTicket : ticket
          )
        );

        // Update selected ticket
        setSelectedTicket(updatedTicket);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePriority = async (newPriority) => {
    const updatedTicket = {
      ...selectedTicket,
      priority: newPriority,
    };

    try {
      const res = await ApiServices.updateSupportTicket(
        selectedTicket._id,
        updatedTicket
      );
      if (res.data.success) {
        // Update tickets state
        setTickets(
          tickets.map((ticket) =>
            ticket._id === selectedTicket._id ? updatedTicket : ticket
          )
        );

        // Update selected ticket
        setSelectedTicket(updatedTicket);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenAssignDialog = () => {
    setSelectedAssignee(selectedTicket.assignedTo || "");
    setOpenAssignDialog(true);
  };

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false);
  };

  const handleAssigneeChange = (event) => {
    setSelectedAssignee(event.target.value);
  };

  const handleConfirmAssign = () => {
    const updatedTicket = {
      ...selectedTicket,
      assignedTo: selectedAssignee,
      updatedAt: new Date().toISOString(),
    };

    // Update tickets state
    setTickets(
      tickets.map((ticket) =>
        ticket._id === selectedTicket._id ? updatedTicket : ticket
      )
    );

    // Update selected ticket
    setSelectedTicket(updatedTicket);
    setOpenAssignDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  // Pagination logic
  const paginatedTickets = filteredTickets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Support Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage customer support tickets and queries
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left panel - Ticket list */}
        <Grid item xs={12} md={5} lg={4}>
          <Paper
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                placeholder="Search tickets..."
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
                sx={{ mb: 2 }}
              />

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
                    {ticketStatusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel id="priority-filter-label">Priority</InputLabel>
                  <Select
                    labelId="priority-filter-label"
                    value={priorityFilter}
                    label="Priority"
                    onChange={handlePriorityFilterChange}
                  >
                    <MenuItem value="all">All Priorities</MenuItem>
                    {ticketPriorityOptions.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Divider />

            <List
              sx={{
                flexGrow: 1,
                overflow: "auto",
                maxHeight: "calc(100vh - 280px)",
              }}
            >
              {paginatedTickets?.length > 0 ? (
                paginatedTickets?.map((ticket) => (
                  <React.Fragment key={ticket._id}>
                    <ListItem
                      alignItems="flex-start"
                      button
                      selected={selectedTicket?._id === ticket._id}
                      onClick={() => handleTicketSelect(ticket)}
                    >
                      <ListItemAvatar>
                        <Badge
                          color={
                            ticket.priority === "high" ||
                            ticket.priority === "urgent"
                              ? "error"
                              : ticket.priority === "medium"
                              ? "warning"
                              : "success"
                          }
                          variant="dot"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          sx={{
                            "& .MuiBadge-badge": {
                              right: 2,
                              bottom: 2,
                            },
                          }}
                        >
                          <Avatar>
                            {ticket.status === "Open" ||
                            ticket.status === "In Progress" ? (
                              <SupportIcon />
                            ) : ticket.status ===
                              "Pending Customer Response" ? (
                              <WarningIcon />
                            ) : (
                              <CheckCircleIcon />
                            )}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2" noWrap>
                              {ticket._id}
                            </Typography>
                            <Chip
                              label={ticket.status}
                              color={
                                ticket.status === "Open"
                                  ? "error"
                                  : ticket.status === "In Progress"
                                  ? "primary"
                                  : ticket.status ===
                                    "Pending Customer Response"
                                  ? "warning"
                                  : ticket.status === "Closed"
                                  ? "success"
                                  : "default"
                              }
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              noWrap
                              sx={{ display: "block" }}
                            >
                              {ticket.name}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {ticket.from.name} •{" "}
                              {formatDateTime(ticket.createdAt)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary="No tickets found"
                    secondary="Try changing your search or filter criteria"
                    sx={{ textAlign: "center" }}
                  />
                </ListItem>
              )}
            </List>

            <Divider />

            <Box sx={{ p: 2 }}>
              <TablePagination
                component="div"
                count={filteredTickets.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage=""
                sx={{ "& .MuiTablePagination-toolbar": { px: 0 } }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Right panel - Ticket details */}
        <Grid item xs={12} md={7} lg={8}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {selectedTicket ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography variant="h5">{selectedTicket.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ticket {selectedTicket._id} • Created{" "}
                      {formatDateTime(selectedTicket.createdAt)}
                    </Typography>
                  </Box>
                  <Chip
                    label={selectedTicket.status}
                    color={
                      selectedTicket.status === "Open"
                        ? "error"
                        : selectedTicket.status === "In progress"
                        ? "primary"
                        : selectedTicket.status === "Pending Customer Response"
                        ? "warning"
                        : selectedTicket.status === "Closed"
                        ? "success"
                        : "default"
                    }
                  />
                </Box>

                <Grid container spacing={3}>
                  {/* Customer Information */}
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Customer Information
                        </Typography>
                        <Typography variant="body2">
                          <strong>Name:</strong> {selectedTicket.from.name}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Email:</strong> {selectedTicket.from.email}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Phone:</strong>{" "}
                          {selectedTicket.from.phoneNumber}
                        </Typography>
                        {selectedTicket.orderNumber && (
                          <Typography variant="body2">
                            <strong>Related Order:</strong>{" "}
                            {selectedTicket.orderNumber}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Ticket Details */}
                  <Grid item xs={12} md={8}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle2">
                            Ticket Details
                          </Typography>
                          <Box>
                            <Button
                              size="small"
                              onClick={handleOpenAssignDialog}
                              sx={{ mr: 1 }}
                            >
                              {selectedTicket?.assignedTo
                                ? "Reassign"
                                : "Assign"}
                            </Button>

                            <FormControl
                              size="small"
                              variant="outlined"
                              sx={{ minWidth: 120, mr: 1 }}
                            >
                              <InputLabel id="status-update-label">
                                Status
                              </InputLabel>
                              <Select
                                labelId="status-update-label"
                                value={selectedTicket.status}
                                label="Status"
                                onChange={(e) =>
                                  handleUpdateStatus(e.target.value)
                                }
                              >
                                {ticketStatusOptions.map((status) => (
                                  <MenuItem key={status} value={status}>
                                    {status}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              size="small"
                              variant="outlined"
                              sx={{ minWidth: 120 }}
                            >
                              <InputLabel id="priority-update-label">
                                Priority
                              </InputLabel>
                              <Select
                                labelId="priority-update-label"
                                value={selectedTicket.priority}
                                label="Priority"
                                onChange={(e) =>
                                  handleUpdatePriority(e.target.value)
                                }
                              >
                                {ticketPriorityOptions.map((priority) => (
                                  <MenuItem key={priority} value={priority}>
                                    {priority}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">
                              Category
                            </Typography>
                            <Typography variant="body2">
                              {selectedTicket.category}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">
                              Priority
                            </Typography>
                            <Chip
                              label={selectedTicket.priority}
                              color={
                                selectedTicket.priority === "Urgent"
                                  ? "error"
                                  : selectedTicket.priority === "High"
                                  ? "warning"
                                  : selectedTicket.priority === "Medium"
                                  ? "primary"
                                  : "default"
                              }
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">
                              Assigned To
                            </Typography>
                            <Typography variant="body2">
                              {selectedTicket.assignedTo || "Unassigned"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Conversation */}
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
                  Conversation
                </Typography>

                <Box
                  sx={{
                    flexGrow: 1,
                    overflow: "auto",
                    maxHeight: "calc(100vh - 500px)",
                    mb: 2,
                  }}
                >
                  {selectedTicket?.messages?.map((message) => (
                    <Box
                      key={message._id}
                      sx={{
                        display: "flex",
                        justifyContent:
                          message.sender === "Support"
                            ? "flex-end"
                            : "flex-start",
                        mb: 2,
                      }}
                    >
                      <Card
                        sx={{
                          maxWidth: "80%",
                          bgcolor:
                            message.sender === "Support"
                              ? "primary.light"
                              : "grey.100",
                        }}
                      >
                        <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            {message.sender} •{" "}
                            {formatDateTime(message.timestamp)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ whiteSpace: "pre-wrap" }}
                          >
                            {message.message}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>

                {/* Reply Form */}
                {selectedTicket.status !== "Closed" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      mt: "auto",
                    }}
                  >
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={handleReplyChange}
                      variant="outlined"
                    />
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim()}
                      sx={{ ml: 2, height: 56 }}
                    >
                      Send
                    </Button>
                  </Box>
                )}
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
                  Select a ticket to view details
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Assign Ticket Dialog */}
      <Dialog open={openAssignDialog} onClose={handleCloseAssignDialog}>
        <DialogTitle>Assign Ticket</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="assignee-label">Assign To</InputLabel>
            <Select
              labelId="assignee-label"
              value={selectedAssignee}
              label="Assign To"
              onChange={handleAssigneeChange}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {supportStaffOptions?.map((staff) => (
                <MenuItem key={staff} value={staff}>
                  {staff}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button onClick={handleConfirmAssign} variant="contained">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
