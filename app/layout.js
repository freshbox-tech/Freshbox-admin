"use client";

import { Inter } from "next/font/google";
import { useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

// Constants
const DRAWER_WIDTH = 260;
const MINI_DRAWER_WIDTH = 72;
const SPACING = 24; // Space between sidebar and content (in pixels)

export default function RootLayout({ children }) {
  const path = usePathname()
  const [open, setOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to dashboard if at root path
  useEffect(() => {
    if (pathname === "/") {
      router.push("/dashboard");
    }
  }, [pathname, router]);

  // Create a theme with dark mode support
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: {
            main: "#28ddcd",
          },
          secondary: {
            main: "#4fc3f7",
          },
          background: {
            default: isDarkMode ? "#121212" : "#f5f5f5",
            paper: isDarkMode ? "#1e1e1e" : "#ffffff",
          },
          divider: isDarkMode
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(0, 0, 0, 0.12)",
        },
        typography: {
          fontFamily: inter.style.fontFamily,
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: 8,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [isDarkMode]
  );

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <html lang="en" data-arp="">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <CssBaseline />
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
              {path !== "/Login" && <>   <Sidebar open={open} toggleDrawer={toggleDrawer} />

              <Header
                open={open}
                toggleDrawer={toggleDrawer}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
              /></>  }
          

              <Box
                component="div"
                sx={{
                  flexGrow: 1,
                  pt: 10, // Space for the fixed header
                  px: 3, // Horizontal padding
                  pb: 3, // Bottom padding
                  overflowX: "hidden",
                }}
              >
                {children}
              </Box>
            </Box>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
