'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  IconButton,
  Typography,
  Avatar,
  Tooltip,
  Badge
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MapIcon from '@mui/icons-material/Map';
import BarChartIcon from '@mui/icons-material/BarChart';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/contexts/AuthContext';

const DRAWER_WIDTH = 260;
const MINI_DRAWER_WIDTH = 72;

export default function Sidebar({ open, toggleDrawer }) {
  const {logout,user} = useAuth()
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [openSubMenu, setOpenSubMenu] = useState({});
  const [activeItem, setActiveItem] = useState('');
  
  // Initialize opened submenus based on current path
  useEffect(() => {
    if (pathname) {
      const segments = pathname.split('/');
      
      if (segments.includes('user-management')) {
        setOpenSubMenu(prev => ({ ...prev, userManagement: true }));
      }
      
      if (segments.includes('order')) {
        setOpenSubMenu(prev => ({ ...prev, orderManagement: true }));
      }
      
      setActiveItem(pathname);
    }
  }, [pathname]);
  
  const handleSubMenuClick = (menuName) => {
    setOpenSubMenu({
      ...openSubMenu,
      [menuName]: !openSubMenu[menuName],
    });
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'User Management',
      icon: <PeopleIcon />,
      subMenu: true,
      id: 'userManagement',
      state: openSubMenu.userManagement,
      onClick: () => handleSubMenuClick('userManagement'),
      items: [
        { text: 'Customers', path: '/user-management/customer' },
        { text: 'Riders', path: '/user-management/rider' },
        { text: 'Partners', path: '/user-management/partner' },
      ],
    },
    {
      text: 'Order Management',
      icon: <ShoppingBasketIcon />,
      subMenu: true,
      id: 'orderManagement',
      state: openSubMenu.orderManagement,
      onClick: () => handleSubMenuClick('orderManagement'),
      items: [
        { text: 'Assign Orders', path: '/order/assign' },
        { text: 'Order Tracking', path: '/order/track' },
      ],
    },
    {
      text: 'Location Management',
      icon: <MapIcon />,
      path: '/location',
    },
    {
      text: 'Reports & Analytics',
      icon: <BarChartIcon />,
      path: '/report',
    },
    {
      text: 'Service Management',
      icon: <MiscellaneousServicesIcon />,
      path: '/service',
    },
  ];
  
  const secondaryMenuItems = [
    {
      text: 'FAQ Management',
      icon: <QuestionAnswerIcon />,
      path: '/faq',
    },
    {
      text: 'Support Management',
      icon: <SupportAgentIcon />,
      path: '/support',
    },
    {
      text: 'Plan Management',
      icon: <SubscriptionsIcon />,
      path: '/plan',
    },
    {
      text: 'Discounts & Promotions',
      icon: <LocalOfferIcon />,
      path: '/discount',
    },
  ];
  
  const isActive = (path) => {
    if (path === activeItem) return true;
    
    // For submenus, check if current path starts with the submenu path
    if (path !== '/' && activeItem.startsWith(path)) return true;
    
    return false;
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={isMobile ? toggleDrawer : undefined}
      sx={{
        width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRight: 'none',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {/* Brand Header with Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          padding: theme.spacing(3),
          minHeight: 64,
        }}
      >
        {open && (
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.contrastText,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* <Box 
              component="img" 
              src="/logo.svg" 
              alt="FreshBox Logo" 
              sx={{ height: 28, mr: 1, display: { xs: 'none', sm: 'block' } }} 
            /> */}
            FreshBox
          </Typography>
        )}
        {open && (
          <IconButton onClick={toggleDrawer} sx={{ color: theme.palette.primary.contrastText }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
        {!open && (
          <IconButton onClick={toggleDrawer} sx={{ color: theme.palette.primary.contrastText }}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>
      
      {/* User Profile Section */}
      {open && (
        <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 42, height: 42, bgcolor: theme.palette.secondary.main }}>{user?.name[0]}</Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Admin
            </Typography>
          </Box>
        </Box>
      )}
      
      {!open && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Tooltip title="John Doe" placement="right">
            <Avatar sx={{ width: 42, height: 42, bgcolor: theme.palette.secondary.main }}>JD</Avatar>
          </Tooltip>
        </Box>
      )}
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
      
      {/* Primary Navigation */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '4px',
          },
        }}
      >
        <List component="nav" sx={{ px: 1 }}>
          {menuItems.map((item) => (
            item.subMenu ? (
              <Box key={item.text}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={item.onClick}
                    sx={{
                      borderRadius: '8px',
                      mb: 0.5,
                      py: 1,
                      backgroundColor: isActive(`/${item.id}`) || item.state ? 'rgba(255,255,255,0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 40,
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <>
                        <ListItemText primary={item.text} />
                        {item.state ? <ExpandLess /> : <ExpandMore />}
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={open && item.state} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.items.map((subItem) => (
                      <Link key={subItem.text} href={subItem.path} style={{ textDecoration: 'none' }}>
                        <ListItemButton
                          sx={{
                            pl: 6,
                            py: 0.75,
                            borderRadius: '8px',
                            mb: 0.5,
                            color: theme.palette.primary.contrastText,
                            backgroundColor: isActive(subItem.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.08)',
                            },
                          }}
                        >
                          {open && <ListItemText 
                            primary={subItem.text} 
                            primaryTypographyProps={{
                              fontSize: 14,
                              fontWeight: isActive(subItem.path) ? 'medium' : 'normal',
                            }}
                          />}
                        </ListItemButton>
                      </Link>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ) : (
              <Link key={item.text} href={item.path} style={{ textDecoration: 'none' }}>
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      borderRadius: '8px',
                      mb: 0.5,
                      py: 1,
                      color: theme.palette.primary.contrastText,
                      backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    <Tooltip title={!open ? item.text : ""} placement="right">
                      <ListItemIcon 
                        sx={{ 
                          minWidth: 40,
                          color: theme.palette.primary.contrastText,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    </Tooltip>
                    {open && <ListItemText primary={item.text} />}
                  </ListItemButton>
                </ListItem>
              </Link>
            )
          ))}
        </List>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
        
        <List component="nav" sx={{ px: 1 }}>
          {secondaryMenuItems.map((item) => (
            <Link key={item.text} href={item.path} style={{ textDecoration: 'none' }}>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    borderRadius: '8px',
                    mb: 0.5,
                    py: 1,
                    color: theme.palette.primary.contrastText,
                    backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  <Tooltip title={!open ? item.text : ""} placement="right">
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 40,
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                  {open && <ListItemText primary={item.text} />}
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Box>
      
      {/* Footer Navigation */}
      <Box sx={{ p: 1 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              <Tooltip title={!open ? "Notifications" : ""} placement="right">
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </ListItemIcon>
              </Tooltip>
              {open && <ListItemText primary="Notifications" />}
            </ListItemButton>
          </ListItem>
  
          
          <ListItem disablePadding>
            <ListItemButton
            onClick={logout}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              <Tooltip title={!open ? "Logout" : ""} placement="right">
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
              </Tooltip>
              {open && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}