import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Modal,
} from "@mui/material";
import axios from "axios";
import { Movie } from "../interfaces/Movies";
import { Booking } from "../interfaces/Booking";
import { BookingContext } from "../context/BookingContext";

const apiKey = "9f590a4deb36b7a102496a965824d82c";
const baseUrl = "https://api.themoviedb.org/3/movie";
const imageUrl = "https://image.tmdb.org/t/p/w500";

export default function BookingPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showtime, setShowtime] = useState("");
  const [seats, setSeats] = useState("");
  const navigate = useNavigate();
  const showingTimeArray = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"];
  const { dispatch } = useContext(BookingContext)!;
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/${movieId}?api_key=${apiKey}`
        );
        setMovie(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie:", error);
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

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

  if (!movie) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Movie not found.</Typography>
      </Container>
    );
  }

  const handleBooking = () => {
    const newBooking: Booking = {
      movieId: movie.id,
      showtime,
      seats: parseInt(seats, 10),
      movieTitle: movie.title, // Add movieTitle
    };

    dispatch({ type: "ADD_BOOKING", payload: newBooking });
    setOpenModal(true);
    setShowtime(showtime);
    setSeats(seats);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate("/bookings");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <img
              src={`${imageUrl}${movie.poster_path}`}
              alt={movie.title}
              style={{ width: "100%" }}
            />
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
                {showingTimeArray.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
                gap: 2,
              }}
            >
              <Button variant="outlined" onClick={handleGoBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBooking}
              >
                Book Now
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Booking Confirmed!
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Your booking for {movie?.title} at {showtime} with {seats} seats has
            been confirmed.
          </Typography>
          <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
            View Bookings
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}