// app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  useTheme,
} from '@mui/material';
import { 
  Person as PersonIcon, 
  LocalShipping as LocalShippingIcon,
  Store as StoreIcon,
  ShoppingBasket as ShoppingBasketIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ icon, title, value, color }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}.light`,
              color: `${color}.main`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  const { customers, services, riders, orders,user} = useAuth();
  const theme = useTheme();
  const [stats, setStats] = useState({
    customers: 0,
    riders: 0,
    partners: 0,
    orders: 0,
    revenue: 0,
    growth: 0,
  });
  const [lineChartData, setLineChartData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
const router = useRouter()
  useEffect(() => {
    if(!user) router.push("/Login")
    if (!orders || !customers || !riders || !services) return;

    // Calculate stats
    const revenue = orders
      .filter(order => order.status === "delivered")
      .reduce((acc, order) => {
        const price = parseFloat((order?.totalPrice || "0"));
        return acc + (isNaN(price) ? 0 : price);
      }, 0);

    const partnerCount = services.length;
    const orderCount = orders.length;
    const customerCount = customers.length;
    const riderCount = riders.length;

    // Calculate growth (this would normally come from comparing with previous period)
    const growth = orderCount > 0 ? 
      Math.round(((orderCount - (orderCount * 0.8)) / (orderCount * 0.8)) * 100) : 0;

    setStats({
      customers: customerCount,
      riders: riderCount,
      partners: partnerCount,
      orders: orderCount,
      revenue,
      growth,
    });

    // Generate line chart data (last 7 months)
    const currentDate = new Date();
    const monthsData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - (6 - i));
      return {
        name: date.toLocaleString('default', { month: 'short' }),
        month: date.getMonth(),
        year: date.getFullYear(),
        orders: 0,
        amount: 0,
      };
    });

    // Populate line chart data with actual orders
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt || order.date || new Date());
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();
      const orderAmount = parseFloat(order.totalPrice || "0") || 0;

      const monthData = monthsData.find(
        m => m.month === orderMonth && m.year === orderYear
      );

      if (monthData) {
        monthData.orders += 1;
        monthData.amount += orderAmount;
      }
    });

    setLineChartData(monthsData);

    // Calculate order status distribution
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status?.toLowerCase() || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusData = [
      { name: 'Pending', value: statusCounts.pending || 0 },
      { name: 'Processing', value: statusCounts.processing || 0 },
      { name: 'Delivered', value: statusCounts.delivered || 0 },
      { name: 'Cancelled', value: statusCounts.cancelled || 0 },
    ];

    setOrderStatusData(statusData);

    // Prepare recent orders (last 5 orders)
    const sortedOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
      .slice(0, 5);

    const formattedRecentOrders = sortedOrders.map(order => ({
      id: order._id ,
      customer: order?.user?.name,
      status: order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending',
      amount: `$${parseFloat(order.totalPrice || 0).toFixed(2)}`,
      date: new Date(order.createdAt || order.date || new Date()).toLocaleDateString(),
    }));

    setRecentOrders(formattedRecentOrders);
  }, [orders, customers, riders, services]);



  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to the FreshBox Admin Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard 
            icon={<PersonIcon />} 
            title="Customers" 
            value={stats.customers} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard 
            icon={<LocalShippingIcon />} 
            title="Riders" 
            value={stats.riders} 
            color="secondary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard 
            icon={<StoreIcon />} 
            title="Partners" 
            value={stats.partners} 
            color="info" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard 
            icon={<ShoppingBasketIcon />} 
            title="Orders" 
            value={stats.orders} 
            color="success" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard 
            icon={<AttachMoneyIcon />} 
            title="Revenue" 
            value={`$${stats.revenue.toFixed(2)}`} 
            color="warning" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard 
            icon={<TrendingUpIcon />} 
            title="Growth" 
            value={`${stats.growth}%`} 
            color="error" 
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Orders & Revenue Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={lineChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="orders"
                  stroke={theme.palette.primary.main}
                  activeDot={{ r: 8 }}
                />
                <Line yAxisId="right" type="monotone" dataKey="amount" stroke={theme.palette.secondary.main} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Order Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Recent Orders
              </Typography>
              <Link href={"/order/track"}>
              <Button variant="outlined" size="small">
                View All
              </Button>
              </Link>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {recentOrders.map((order) => (
                <Box key={order.id}>
                  <ListItem 
                    secondaryAction={
                       <Link href={"/order/track"}>
                      <Button size="small" variant="outlined">Details</Button>
                      </Link>
                    }
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={3}>
                        <ListItemText 
                          primary={order.id} 
                          secondary={order.date} 
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <ListItemText 
                          primary="Customer" 
                          secondary={order.customer}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <ListItemText 
                          primary="Status" 
                          secondary={
                            <Typography 
                              component="span" 
                              sx={{ 
                                color: order.status === 'Delivered' 
                                  ? 'success.main' 
                                  : order.status === 'Processing' 
                                  ? 'info.main' 
                                  : order.status === 'Pending' 
                                  ? 'warning.main' 
                                  : 'error.main' 
                              }}
                            >
                              {order.status}
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <ListItemText 
                          primary="Amount" 
                          secondary={order.amount}
                        />
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}