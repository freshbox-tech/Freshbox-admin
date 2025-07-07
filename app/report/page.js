// app/reports-analytics/page.js
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  ViewList as ListIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Dummy data for reports
const dummyOrdersByService = [
  { name: 'Wash & Fold', orders: 856, value: 12840 },
  { name: 'Dry Cleaning', orders: 432, value: 8640 },
  { name: 'Ironing', orders: 264, value: 1848 },
  { name: 'Bedding & Linens', orders: 120, value: 3600 },
  { name: 'Stain Removal', orders: 48, value: 432 }
];

const dummyOrdersByMonth = [
  { name: 'Jan', orders: 145, revenue: 3625 },
  { name: 'Feb', orders: 178, revenue: 4450 },
  { name: 'Mar', orders: 215, revenue: 5375 },
  { name: 'Apr', orders: 196, revenue: 4900 },
  { name: 'May', orders: 230, revenue: 5750 },
  { name: 'Jun', orders: 258, revenue: 6450 },
  { name: 'Jul', orders: 286, revenue: 7150 },
  { name: 'Aug', orders: 312, revenue: 7800 },
  { name: 'Sep', orders: 278, revenue: 6950 },
  { name: 'Oct', orders: 265, revenue: 6625 },
  { name: 'Nov', orders: 240, revenue: 6000 },
  { name: 'Dec', orders: 217, revenue: 5425 }
];

const dummyOrdersByStatus = [
  { name: 'Delivered', value: 1520 },
  { name: 'In Progress', value: 368 },
  { name: 'Picked Up', value: 245 },
  { name: 'Ready for Delivery', value: 182 },
  { name: 'Ordered', value: 105 },
  { name: 'Cancelled', value: 48 }
];

const dummyOrdersByLocation = [
  { name: '10001', orders: 245, revenue: 6125 },
  { name: '10002', orders: 178, revenue: 4450 },
  { name: '10003', orders: 132, revenue: 3300 },
  { name: '10016', orders: 203, revenue: 5075 },
  { name: '10022', orders: 198, revenue: 4950 },
  { name: '10023', orders: 156, revenue: 3900 },
  { name: '10024', orders: 112, revenue: 2800 }
];

const dummyTopPartners = [
  { id: 1, name: 'City Cleaners', orders: 567, revenue: 14175, rating: 4.7 },
  { id: 2, name: 'Premium Pressers', orders: 432, revenue: 10800, rating: 4.9 },
  { id: 3, name: 'Wash Warriors', orders: 345, revenue: 8625, rating: 4.5 },
  { id: 4, name: 'Elite Cleaners', orders: 289, revenue: 7225, rating: 4.6 },
  { id: 5, name: 'Neighborhood Wash', orders: 187, revenue: 4675, rating: 4.2 }
];

const dummyTopRiders = [
  { id: 1, name: 'Alex Rodriguez', orders: 456, rating: 4.8, onTimeRate: 98 },
  { id: 2, name: 'Samantha Lee', orders: 389, rating: 4.9, onTimeRate: 99 },
  { id: 3, name: 'Carlos Mendez', orders: 342, rating: 4.7, onTimeRate: 96 },
  { id: 4, name: 'Emily Chen', orders: 298, rating: 4.6, onTimeRate: 97 },
  { id: 5, name: 'Michael Johnson', orders: 245, rating: 4.5, onTimeRate: 94 }
];

// Colors for pie charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#d88494'];

export default function ReportsAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('ytd');
  const [currentTab, setCurrentTab] = useState(0);
  const [orderData, setOrderData] = useState({
    byService: [],
    byMonth: [],
    byStatus: [],
    byLocation: [],
    topPartners: [],
    topRiders: []
  });

  useEffect(() => {
    // Simulate fetching report data with selected time range
    // In a real app, this would call an API with the time range parameter
    
    // For now, just use dummy data
    setOrderData({
      byService: dummyOrdersByService,
      byMonth: dummyOrdersByMonth,
      byStatus: dummyOrdersByStatus,
      byLocation: dummyOrdersByLocation,
      topPartners: dummyTopPartners,
      topRiders: dummyTopRiders
    });
  }, [timeRange]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleRefresh = () => {
    // Refresh data logic would go here
    console.log('Refreshing data...');
  };

  const handleExport = () => {
    // Export data logic would go here
    console.log('Exporting data...');
  };

  // Summary metrics
  const totalOrders = orderData.byMonth.reduce((sum, month) => sum + month.orders, 0);
  const totalRevenue = orderData.byMonth.reduce((sum, month) => sum + month.revenue, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <>
         <Box sx={{ mb: 4 }}>
           <Typography variant="h4"  color="text.secondary" component="h1" gutterBottom>
           Development in Progress
           </Typography>
        
         </Box>
    </>
    // <>
    //   <Box sx={{ mb: 4 }}>
    //     <Typography variant="h4" component="h1" gutterBottom>
    //       Reports & Analytics
    //     </Typography>
    //     <Typography variant="body1" color="text.secondary">
    //       View business performance metrics and trends
    //     </Typography>
    //   </Box>

    //   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    //     <FormControl sx={{ minWidth: 200 }}>
    //       <InputLabel id="time-range-label">Time Range</InputLabel>
    //       <Select
    //         labelId="time-range-label"
    //         value={timeRange}
    //         label="Time Range"
    //         onChange={handleTimeRangeChange}
    //         startAdornment={<DateRangeIcon sx={{ mr: 1 }} />}
    //       >
    //         <MenuItem value="7days">Last 7 Days</MenuItem>
    //         <MenuItem value="30days">Last 30 Days</MenuItem>
    //         <MenuItem value="90days">Last 90 Days</MenuItem>
    //         <MenuItem value="6months">Last 6 Months</MenuItem>
    //         <MenuItem value="ytd">Year to Date</MenuItem>
    //         <MenuItem value="1year">Last 12 Months</MenuItem>
    //         <MenuItem value="all">All Time</MenuItem>
    //       </Select>
    //     </FormControl>
        
    //     <Box>
    //       <Tooltip title="Refresh Data">
    //         <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
    //           <RefreshIcon />
    //         </IconButton>
    //       </Tooltip>
    //       <Button 
    //         variant="outlined" 
    //         startIcon={<DownloadIcon />}
    //         onClick={handleExport}
    //       >
    //         Export
    //       </Button>
    //     </Box>
    //   </Box>

    //   {/* Summary Cards */}
    //   <Grid container spacing={3} sx={{ mb: 4 }}>
    //     <Grid item xs={12} sm={6} md={4}>
    //       <Card>
    //         <CardContent>
    //           <Typography variant="h6" color="text.secondary" gutterBottom>
    //             Total Orders
    //           </Typography>
    //           <Typography variant="h3">
    //             {totalOrders.toLocaleString()}
    //           </Typography>
    //         </CardContent>
    //       </Card>
    //     </Grid>
    //     <Grid item xs={12} sm={6} md={4}>
    //       <Card>
    //         <CardContent>
    //           <Typography variant="h6" color="text.secondary" gutterBottom>
    //             Total Revenue
    //           </Typography>
    //           <Typography variant="h3">
    //             ${totalRevenue.toLocaleString()}
    //           </Typography>
    //         </CardContent>
    //       </Card>
    //     </Grid>
    //     <Grid item xs={12} sm={6} md={4}>
    //       <Card>
    //         <CardContent>
    //           <Typography variant="h6" color="text.secondary" gutterBottom>
    //             Average Order Value
    //           </Typography>
    //           <Typography variant="h3">
    //             ${averageOrderValue.toFixed(2)}
    //           </Typography>
    //         </CardContent>
    //       </Card>
    //     </Grid>
    //   </Grid>

    //   {/* Report Tabs */}
    //   <Paper sx={{ mb: 4 }}>
    //     <Tabs 
    //       value={currentTab} 
    //       onChange={handleTabChange} 
    //       variant="scrollable"
    //       scrollButtons="auto"
    //       sx={{ borderBottom: 1, borderColor: 'divider' }}
    //     >
    //       <Tab icon={<TimelineIcon />} label="Orders Over Time" />
    //       <Tab icon={<PieChartIcon />} label="Orders by Service" />
    //       <Tab icon={<BarChartIcon />} label="Orders by Location" />
    //       <Tab icon={<PieChartIcon />} label="Order Status" />
    //       <Tab icon={<ListIcon />} label="Top Partners" />
    //       <Tab icon={<ListIcon />} label="Top Riders" />
    //     </Tabs>
        
    //     <Box sx={{ p: 3 }}>
    //       {/* Orders Over Time Chart */}
    //       {currentTab === 0 && (
    //         <>
    //           <Typography variant="h6" gutterBottom>
    //             Orders & Revenue Over Time
    //           </Typography>
    //           <Box sx={{ height: 400 }}>
    //             <ResponsiveContainer width="100%" height="100%">
    //               <LineChart
    //                 data={orderData.byMonth}
    //                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    //               >
    //                 <CartesianGrid strokeDasharray="3 3" />
    //                 <XAxis dataKey="name" />
    //                 <YAxis yAxisId="left" />
    //                 <YAxis yAxisId="right" orientation="right" />
    //                 <RechartsTooltip />
    //                 <Legend />
    //                 <Line
    //                   yAxisId="left"
    //                   type="monotone"
    //                   dataKey="orders"
    //                   stroke="#8884d8"
    //                   activeDot={{ r: 8 }}
    //                   name="Orders"
    //                 />
    //                 <Line
    //                   yAxisId="right"
    //                   type="monotone"
    //                   dataKey="revenue"
    //                   stroke="#82ca9d"
    //                   name="Revenue ($)"
    //                 />
    //               </LineChart>
    //             </ResponsiveContainer>
    //           </Box>
    //         </>
    //       )}

    //       {/* Orders by Service Chart */}
    //       {currentTab === 1 && (
    //         <>
    //           <Typography variant="h6" gutterBottom>
    //             Orders by Service Type
    //           </Typography>
    //           <Grid container spacing={3}>
    //             <Grid item xs={12} md={7}>
    //               <Box sx={{ height: 400 }}>
    //                 <ResponsiveContainer width="100%" height="100%">
    //                   <PieChart>
    //                     <Pie
    //                       data={orderData.byService}
    //                       cx="50%"
    //                       cy="50%"
    //                       labelLine={false}
    //                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
    //                       outerRadius={150}
    //                       fill="#8884d8"
    //                       dataKey="orders"
    //                     >
    //                       {orderData.byService.map((entry, index) => (
    //                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    //                       ))}
    //                     </Pie>
    //                     <RechartsTooltip />
    //                     <Legend />
    //                   </PieChart>
    //                 </ResponsiveContainer>
    //               </Box>
    //             </Grid>
    //             <Grid item xs={12} md={5}>
    //               <TableContainer component={Paper} variant="outlined">
    //                 <Table size="small">
    //                   <TableHead>
    //                     <TableRow>
    //                       <TableCell>Service Type</TableCell>
    //                       <TableCell align="right">Orders</TableCell>
    //                       <TableCell align="right">Revenue</TableCell>
    //                     </TableRow>
    //                   </TableHead>
    //                   <TableBody>
    //                     {orderData.byService.map((row) => (
    //                       <TableRow key={row.name}>
    //                         <TableCell component="th" scope="row">
    //                           {row.name}
    //                         </TableCell>
    //                         <TableCell align="right">{row.orders}</TableCell>
    //                         <TableCell align="right">${row.value}</TableCell>
    //                       </TableRow>
    //                     ))}
    //                     <TableRow>
    //                       <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
    //                         Total
    //                       </TableCell>
    //                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>
    //                         {orderData.byService.reduce((sum, item) => sum + item.orders, 0)}
    //                       </TableCell>
    //                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>
    //                         ${orderData.byService.reduce((sum, item) => sum + item.value, 0)}
    //                       </TableCell>
    //                     </TableRow>
    //                   </TableBody>
    //                 </Table>
    //               </TableContainer>
    //             </Grid>
    //           </Grid>
    //         </>
    //       )}

    //       {/* Orders by Location Chart */}
    //       {currentTab === 2 && (
    //         <>
    //           <Typography variant="h6" gutterBottom>
    //             Orders by Location (ZIP Code)
    //           </Typography>
    //           <Box sx={{ height: 400 }}>
    //             <ResponsiveContainer width="100%" height="100%">
    //               <BarChart
    //                 data={orderData.byLocation}
    //                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    //               >
    //                 <CartesianGrid strokeDasharray="3 3" />
    //                 <XAxis dataKey="name" />
    //                 <YAxis yAxisId="left" />
    //                 <YAxis yAxisId="right" orientation="right" />
    //                 <RechartsTooltip />
    //                 <Legend />
    //                 <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#8884d8" />
    //                 <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
    //               </BarChart>
    //             </ResponsiveContainer>
    //           </Box>
    //         </>
    //       )}

    //       {/* Order Status Chart */}
    //       {currentTab === 3 && (
    //         <>
    //           <Typography variant="h6" gutterBottom>
    //             Orders by Status
    //           </Typography>
    //           <Grid container spacing={3}>
    //             <Grid item xs={12} md={7}>
    //               <Box sx={{ height: 400 }}>
    //                 <ResponsiveContainer width="100%" height="100%">
    //                   <PieChart>
    //                     <Pie
    //                       data={orderData.byStatus}
    //                       cx="50%"
    //                       cy="50%"
    //                       labelLine={false}
    //                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
    //                       outerRadius={150}
    //                       fill="#8884d8"
    //                       dataKey="value"
    //                     >
    //                       {orderData.byStatus.map((entry, index) => (
    //                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    //                       ))}
    //                     </Pie>
    //                     <RechartsTooltip />
    //                     <Legend />
    //                   </PieChart>
    //                 </ResponsiveContainer>
    //               </Box>
    //             </Grid>
    //             <Grid item xs={12} md={5}>
    //               <TableContainer component={Paper} variant="outlined">
    //                 <Table size="small">
    //                   <TableHead>
    //                     <TableRow>
    //                       <TableCell>Status</TableCell>
    //                       <TableCell align="right">Count</TableCell>
    //                       <TableCell align="right">Percentage</TableCell>
    //                     </TableRow>
    //                   </TableHead>
    //                   <TableBody>
    //                     {orderData.byStatus.map((row) => {
    //                       const total = orderData.byStatus.reduce((sum, item) => sum + item.value, 0);
    //                       const percentage = ((row.value / total) * 100).toFixed(1);
                          
    //                       return (
    //                         <TableRow key={row.name}>
    //                           <TableCell component="th" scope="row">
    //                             {row.name}
    //                           </TableCell>
    //                           <TableCell align="right">{row.value}</TableCell>
    //                           <TableCell align="right">{percentage}%</TableCell>
    //                         </TableRow>
    //                       );
    //                     })}
    //                     <TableRow>
    //                       <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
    //                         Total
    //                       </TableCell>
    //                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>
    //                         {orderData.byStatus.reduce((sum, item) => sum + item.value, 0)}
    //                       </TableCell>
    //                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>
    //                         100%
    //                       </TableCell>
    //                     </TableRow>
    //                   </TableBody>
    //                 </Table>
    //               </TableContainer>
    //             </Grid>
    //           </Grid>
    //         </>
    //       )}

    //       {/* Top Partners */}
    //       {currentTab === 4 && (
    //         <>
    //           <Typography variant="h6" gutterBottom>
    //             Top Performing Partners
    //           </Typography>
    //           <TableContainer component={Paper} variant="outlined">
    //             <Table>
    //               <TableHead>
    //                 <TableRow>
    //                   <TableCell>Partner</TableCell>
    //                   <TableCell align="right">Total Orders</TableCell>
    //                   <TableCell align="right">Total Revenue</TableCell>
    //                   <TableCell align="right">Avg. Rating</TableCell>
    //                   <TableCell align="right">Performance</TableCell>
    //                 </TableRow>
    //               </TableHead>
    //               <TableBody>
    //                 {orderData.topPartners.map((row) => (
    //                   <TableRow key={row.id}>
    //                     <TableCell component="th" scope="row">
    //                       {row.name}
    //                     </TableCell>
    //                     <TableCell align="right">{row.orders}</TableCell>
    //                     <TableCell align="right">${row.revenue}</TableCell>
    //                     <TableCell align="right">{row.rating}</TableCell>
    //                     <TableCell align="right">
    //                       <Chip 
    //                         label={
    //                           row.rating >= 4.8 ? 'Excellent' :
    //                           row.rating >= 4.5 ? 'Good' :
    //                           row.rating >= 4.0 ? 'Average' :
    //                           'Needs Improvement'
    //                         }
    //                         color={
    //                           row.rating >= 4.8 ? 'success' :
    //                           row.rating >= 4.5 ? 'primary' :
    //                           row.rating >= 4.0 ? 'warning' :
    //                           'error'
    //                         }
    //                         size="small"
    //                       />
    //                     </TableCell>
    //                   </TableRow>
    //                 ))}
    //               </TableBody>
    //             </Table>
    //           </TableContainer>
    //         </>
    //       )}

    //       {/* Top Riders */}
    //       {currentTab === 5 && (
    //         <>
    //           <Typography variant="h6" gutterBottom>
    //             Top Performing Riders
    //           </Typography>
    //           <TableContainer component={Paper} variant="outlined">
    //             <Table>
    //               <TableHead>
    //                 <TableRow>
    //                   <TableCell>Rider</TableCell>
    //                   <TableCell align="right">Total Orders</TableCell>
    //                   <TableCell align="right">Avg. Rating</TableCell>
    //                   <TableCell align="right">On-Time Rate</TableCell>
    //                   <TableCell align="right">Performance</TableCell>
    //                 </TableRow>
    //               </TableHead>
    //               <TableBody>
    //                 {orderData.topRiders.map((row) => (
    //                   <TableRow key={row.id}>
    //                     <TableCell component="th" scope="row">
    //                       {row.name}
    //                     </TableCell>
    //                     <TableCell align="right">{row.orders}</TableCell>
    //                     <TableCell align="right">{row.rating}</TableCell>
    //                     <TableCell align="right">{row.onTimeRate}%</TableCell>
    //                     <TableCell align="right">
    //                       <Chip 
    //                         label={
    //                           row.rating >= 4.8 && row.onTimeRate >= 98 ? 'Excellent' :
    //                           row.rating >= 4.5 && row.onTimeRate >= 95 ? 'Good' :
    //                           row.rating >= 4.0 && row.onTimeRate >= 90 ? 'Average' :
    //                           'Needs Improvement'
    //                         }
    //                         color={
    //                           row.rating >= 4.8 && row.onTimeRate >= 98 ? 'success' :
    //                           row.rating >= 4.5 && row.onTimeRate >= 95 ? 'primary' :
    //                           row.rating >= 4.0 && row.onTimeRate >= 90 ? 'warning' :
    //                           'error'
    //                         }
    //                         size="small"
    //                       />
    //                     </TableCell>
    //                   </TableRow>
    //                 ))}
    //               </TableBody>
    //             </Table>
    //           </TableContainer>
    //         </>
    //       )}
    //     </Box>
    //   </Paper>
    // </>
  );
}