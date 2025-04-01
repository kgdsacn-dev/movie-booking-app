import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Container,
  Paper,
  Grid,
  CircularProgress,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import axios from 'axios';
import { Movie } from '../interfaces/Movies'; // Adjust the import path as necessary
import { API_BASE_URL, API_IMAGE_BASE_URL, MOVIE_API_KEY } from '../environment';

const apiKey = '9f590a4deb36b7a102496a965824d82c';
const baseUrl = 'https://api.themoviedb.org/3/movie';
const imageUrl = 'https://image.tmdb.org/t/p/w500';

export default function BookingPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showtime, setShowtime] = useState('');
  const [seats, setSeats] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/${movieId}?api_key=${apiKey}`
        );
        setMovie(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Movie not found.</Typography>
      </Container>
    );
  }

  const handleBooking = () => {
    // Implement your booking logic here
    console.log('Booking:', {
      movieId: movie.id,
      showtime,
      seats,
    });
    alert(`Booking confirmed for ${movie.title} at ${showtime} with ${seats} seats!`);
  };

  const handleGoBack = () => {
    navigate('/'); // Navigate back to the movie list
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <img src={`${imageUrl}${movie.poster_path}`} alt={movie.title} style={{ width: '100%' }} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h4" gutterBottom>
              {movie.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {movie.overview}
            </Typography>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="showtime-label">Showtime</InputLabel>
              <Select
                labelId="showtime-label"
                id="showtime"
                value={showtime}
                label="Showtime"
                onChange={(e) => setShowtime(e.target.value)}
              >
                <MenuItem value={'10:00 AM'}>10:00 AM</MenuItem>
                <MenuItem value={'1:00 PM'}>1:00 PM</MenuItem>
                <MenuItem value={'4:00 PM'}>4:00 PM</MenuItem>
                <MenuItem value={'7:00 PM'}>7:00 PM</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Number of Seats"
              type="number"
              fullWidth
              sx={{ mt: 2 }}
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
              <Button variant="outlined" onClick={handleGoBack}>
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleBooking}>
                Book Now
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}