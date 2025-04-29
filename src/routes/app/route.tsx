import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Box,
  useMediaQuery,
  IconButton,
  ListItem,
  List,
  ListItemText,
  Drawer,
} from "@mui/material";
import "../../App.css";
import {
  createFileRoute,
  Navigate,
  NavigateFn,
  Outlet,
  redirect,
  useMatch,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "@/services/user-service";
import MovieList from "@/components/MovieList";
import { Movie } from "@/interfaces/Movies";
import { useAuthentication } from "@/features/authentication/auth-context";
import { useState } from "react";

import HomeIcon from "@mui/icons-material/HomeOutlined";
import MenuIcon from "@mui/icons-material/MenuOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";

const imageUrl = "https://image.tmdb.org/t/p/w500";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const appStyles = {
  navButton: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    marginRight: 2,
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  dialog: {
    "& .MuiDialog-paper": {
      padding: 2,
      borderRadius: 2,
      minWidth: "500px",
    },
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
};

function App() {
  const router = useRouter();
  const auth = useAuthentication();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const userRole = auth.userProfile.role;
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  interface NavigateParams {
    to: string;
    [key: string]: any;
  }

  const handleNavigation = (params: NavigateParams) => {
    router.navigate(params);
  };

  const handleLogout = () => {
    auth.logout();
    router.invalidate().finally(() => {
      handleNavigation({ to: "/login", search: { redirect: location.href } });
    });
  };

  const fetchMovies = async () => {
    try {
      const response = (await getMovies()) || [];
      return response;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getMovies"],
    queryFn: fetchMovies,
  });

  if (isLoading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <AppBar position="static">
          <Toolbar disableGutters variant="dense">
            {isSmallScreen ? (
              <>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => setDrawerOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="left"
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                >
                  <List>
                    <ListItem
                      component={"button"}
                      onClick={() => {
                        handleNavigation({ to: "/app" });
                        setDrawerOpen(false);
                      }}
                    >
                      <HomeIcon sx={{ marginRight: 1 }} />
                      <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem
                      component={"button"}
                      onClick={() => {
                        handleNavigation({ to: "/app/bookings-page" });
                        setDrawerOpen(false);
                      }}
                    >
                      <EventSeatOutlinedIcon sx={{ marginRight: 1 }} />
                      <ListItemText primary="My Bookings" />
                    </ListItem>
                    {userRole === "admin" && (
                      <ListItem
                        component={"button"}
                        onClick={() => {
                          handleNavigation({ to: "/app/admin" });
                          setDrawerOpen(false);
                        }}
                      >
                        <SupervisorAccountOutlinedIcon
                          sx={{ marginRight: 1 }}
                        />
                        <ListItemText primary="Admin" />
                      </ListItem>
                    )}
                    <ListItem
                      component={"button"}
                      onClick={() => {
                        setLogoutDialogOpen(true);
                        setDrawerOpen(false);
                      }}
                    >
                      <ExitToAppOutlinedIcon sx={{ marginRight: 1 }} />
                      <ListItemText primary="Logout" />
                    </ListItem>
                  </List>
                </Drawer>
              </>
            ) : (
              <>
                <Box
                  sx={appStyles.navButton}
                  onClick={() => handleNavigation({ to: "/app" })}
                >
                  <HomeIcon sx={{ marginRight: 1 }} />
                  <Typography sx={{ textAlign: "center" }}>Home</Typography>
                </Box>
                <Box
                  sx={appStyles.navButton}
                  onClick={() => handleNavigation({ to: "/app/bookings-page" })}
                >
                  <EventSeatOutlinedIcon sx={{ marginRight: 1 }} />
                  <Typography sx={{ textAlign: "center" }}>
                    My Bookings
                  </Typography>
                </Box>
                {userRole === "admin" && (
                  <Box
                    sx={appStyles.navButton}
                    onClick={() => handleNavigation({ to: "/app/admin" })}
                  >
                    <SupervisorAccountOutlinedIcon sx={{ marginRight: 1 }} />
                    <Typography sx={{ textAlign: "center" }}>Admin</Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    marginLeft: "auto",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                  onClick={() => setLogoutDialogOpen(true)}
                >
                  <ExitToAppOutlinedIcon sx={{ marginRight: 1 }} />
                  <Typography sx={{ textAlign: "center" }}>Logout</Typography>
                </Box>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Outlet />
        {data && <MovieList movies={data} imageBaseUrl={imageUrl} />}

        <Dialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
          fullWidth
          maxWidth={isSmallScreen ? "xs" : "sm"}
          sx={{
            "& .MuiDialog-paper": {
              padding: isSmallScreen ? 1 : 2,
              borderRadius: 2,
              minWidth: isSmallScreen ? "300px" : "500px",
            },
          }}
        >
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogContent>
            <Typography
              variant="body1"
              textAlign={isSmallScreen ? "center" : "left"}
            >
              Are you sure you want to log out?
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              flexDirection: isSmallScreen ? "column" : "row",
              gap: isSmallScreen ? 1 : 0,
            }}
          >
            <Button
              onClick={() => setLogoutDialogOpen(false)}
              color="primary"
              fullWidth={isSmallScreen}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setLogoutDialogOpen(false);
                handleLogout();
              }}
              color="error"
              variant="contained"
              fullWidth={isSmallScreen}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export const Route = createFileRoute("/app")({
  component: App,
  beforeLoad({ context, location }) {
    if (!context.auth.userProfile.token) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
