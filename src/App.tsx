import { useState, useEffect, useReducer } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Container,
} from "@mui/material";
import BookingPage from "./pages/BookingPage";
import MovieList from "./components/MovieList";
import { Movie } from "./interfaces/Movies";
import "./App.css";
import axios from "axios";
import { bookingReducer } from "./reducers/BookingReducer";
import BookingsPage from "./pages/BookingsPage";
import { BookingContext } from "./context/BookingContext";

const apiKey = "9f590a4deb36b7a102496a965824d82c";
const baseUrl = "https://api.themoviedb.org/3/discover/movie";
const imageUrl = "https://image.tmdb.org/t/p/w500";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingState, dispatch] = useReducer(bookingReducer, { bookings: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${baseUrl}?api_key=${apiKey}`);
        const movieData = response.data.results;
        setMovies(movieData);
        setLoading(true);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [apiKey, baseUrl]);

  const handleMovieClick = (movieId: number) => {
    navigate(`/booking/${movieId}`);
  };

  if (loading) {
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
            <Button color="inherit" component={Link} to="/">
              <Typography sx={{ textAlign: "center" }}>Home</Typography>
            </Button>
            <Button color="inherit" component={Link} to="/bookings">
              <Typography sx={{ textAlign: "center" }}>Bookings</Typography>
            </Button>
          </Toolbar>
        </AppBar>
      </Container>
      <BookingContext.Provider value={{ bookingState, dispatch }}>
        <Routes>
          <Route
            path="/"
            element={
              <MovieList
                movies={movies}
                imageBaseUrl={imageUrl}
                onMovieClick={handleMovieClick}
              />
            }
          />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/booking/:movieId" element={<BookingPage />} />
        </Routes>
      </BookingContext.Provider>
    </ThemeProvider>
  );
}

export default App;
