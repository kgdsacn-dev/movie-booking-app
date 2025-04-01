import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Container
} from '@mui/material';
import BookingPage from './components/BookingPage';
import MovieList from './components/MovieList';
import { Movie } from './interfaces/Movies';

import './App.css';
import axios from 'axios';

const apiKey = '9f590a4deb36b7a102496a965824d82c';
const baseUrl = 'https://api.themoviedb.org/3/discover/movie';
const imageUrl = 'https://image.tmdb.org/t/p/w500';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}?api_key=${apiKey}`
        );
        const movieData = response.data.results;
        setMovies(movieData);
        setLoading(true);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      } finally {
        setLoading(false)
      }
    };
    fetchMovies();
  }, [apiKey, baseUrl]);

  const handleMovieClick = (movieId: number) => {
    navigate(`/booking/${movieId}`);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Movie Booking App
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/booking/1">
              Booking Example
            </Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<MovieList movies={movies} imageBaseUrl={imageUrl} onMovieClick={handleMovieClick}/>} />
          <Route path="/booking/:movieId" element={<BookingPage />} />
        </Routes>
    </ThemeProvider>
  );
}

export default App;
