'use client';

import { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
  ListItemIcon,
  InputBase,
  Tooltip,
  Button,
  Chip
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const DRAWER_WIDTH = 260;
const MINI_DRAWER_WIDTH = 72;

// Search bar styling
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

// Styled AppBar
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    marginLeft: MINI_DRAWER_WIDTH,
    width: `calc(100% - ${MINI_DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Header({ open, toggleDrawer, isDarkMode, toggleTheme }) {
  const {user,logout} = useAuth()
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [helpAnchorEl, setHelpAnchorEl] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter()
  
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const formatDateTime = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleHelpMenu = (event) => {
    setHelpAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = ()=>{
    router.push("/account-setting")
handleClose()
  }
  
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleHelpClose = () => {
    setHelpAnchorEl(null);
  };

  return (
    <StyledAppBar position="fixed" open={open}>
      <Toolbar>
        {/* Only show menu toggle on mobile */}
        {isMobile && (
          <IconButton
            edge="start"
            onClick={toggleDrawer}
            sx={{ 
              mr: 2,
              color: 'text.primary'
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* App title only on mobile */}
        {isMobile && (
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              fontWeight: 'bold',
              display: { xs: 'block', md: 'none' }
            }}
          >
            FreshBox
          </Typography>
        )}

        {/* Search bar (hidden on very small screens) */}
        {!isSmall && (
          <Search sx={{ 
            flexGrow: { xs: 1, md: 0 },
            mr: { xs: 1, md: 2 },
            display: { xs: 'none', sm: 'block' } 
          }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        )}

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Date and time (hidden on small screens) */}
        {!isMobile && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mr: 3,
              display: { xs: 'none', md: 'block' }
            }}
          >
            {formatDateTime(currentTime)}
          </Typography>
        )}

        {/* Theme toggle
        <Tooltip title="Toggle theme">
          <IconButton 
            onClick={toggleTheme} 
            sx={{ mr: 1 }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip> */}

        {/* Help button with menu */}
        <Tooltip title="Help">
          <IconButton 
            onClick={handleHelpMenu}
            sx={{ mr: 1 }}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={helpAnchorEl}
          open={Boolean(helpAnchorEl)}
          onClose={handleHelpClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleHelpClose}>Documentation</MenuItem>
          <MenuItem onClick={handleHelpClose}>Video Tutorials</MenuItem>
          <Divider />
          <MenuItem onClick={handleHelpClose}>Contact Support</MenuItem>
        </Menu>

        {/* Notifications */}
        {/* <Tooltip title="Notifications">
          <IconButton
            onClick={handleNotificationMenu}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip> */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              width: 320,
              maxHeight: 400,
              overflow: 'auto',
            }
          }}
        >
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleNotificationClose}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Typography variant="subtitle2" fontWeight="bold">New Order #1234</Typography>
                <Chip size="small" label="New" color="primary" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Order placed by John Doe - $79.99
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                10 minutes ago
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Typography variant="subtitle2" fontWeight="bold">Payment Received</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Payment received for Order #1220
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                2 hours ago
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Typography variant="subtitle2" fontWeight="bold">Delivery Complete</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Order #1186 successfully delivered
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Yesterday
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleNotificationClose} sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" color="primary">View All Notifications</Typography>
          </MenuItem>
        </Menu>

        {/* User profile */}
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            ml: 1,
            '&:hover': {
              backgroundColor: 'action.hover',
              borderRadius: 1,
            },
          }}
          onClick={handleUserMenu}
        >
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36,
              bgcolor: 'primary.main',
            }}
          >
            {user?.name[0]}
          </Avatar>
          
          {!isSmall && (
            <>
              <Box 
                sx={{ 
                  ml: 1.5,
                  mr: 0.5,
                  display: { xs: 'none', sm: 'block' } 
                }}
              >
                <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Administrator
                </Typography>
              </Box>
              <KeyboardArrowDownIcon 
                fontSize="small" 
                sx={{ 
                  color: 'text.secondary',
                  display: { xs: 'none', sm: 'block' } 
                }} 
              />
            </>
          )}
        </Box>
        
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">John Doe</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          {/* <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem> */}
          <MenuItem onClick={handleClick}>

            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Account Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={logout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
}