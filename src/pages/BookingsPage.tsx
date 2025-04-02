import {
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Avatar,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { BookingContext } from "../context/BookingContext";
import axios from "axios";
import { Booking } from "../interfaces/Booking";

const apiKey = "9f590a4deb36b7a102496a965824d82c";
const imageUrl = "https://image.tmdb.org/t/p/w500";

export default function BookingsPage() {
    const { bookingState, dispatch } = useContext(BookingContext)!;
    const [movieImages, setMovieImages] = useState<{ [movieId: number]: string }>({});
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editBooking, setEditBooking] = useState<Booking | null>(null);
    const [editedSeats, setEditedSeats] = useState("");
  
    useEffect(() => {
      const fetchMovieImages = async () => {
        const images: { [movieId: number]: string } = {};
        for (const booking of bookingState.bookings) {
          if (!images[booking.movieId]) {
            try {
              const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${booking.movieId}?api_key=${apiKey}`
              );
              images[booking.movieId] = `${imageUrl}${response.data.poster_path}`;
            } catch (error) {
              console.error(`Error fetching image for movie ${booking.movieId}:`, error);
              images[booking.movieId] = "";
            }
          }
        }
        setMovieImages(images);
      };
  
      fetchMovieImages();
    }, [bookingState.bookings]);
  
    const handleDeleteBooking = (index: number) => {
      dispatch({ type: "REMOVE_BOOKING", payload: index });
    };
  
    const handleEditBooking = (booking: Booking) => {
      setEditBooking(booking);
      setEditedSeats(booking.seats.toString());
      setEditDialogOpen(true);
    };
  
    const handleUpdateBooking = () => {
        if (editBooking) {
          const updatedBooking = { ...editBooking, seats: parseInt(editedSeats, 10) };
          dispatch({ type: "UPDATE_BOOKING", payload: updatedBooking });
          setEditDialogOpen(false);
        }
      };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
  <Paper elevation={3} sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Your Bookings
    </Typography>
    <List>
      {bookingState.bookings.map((booking, index) => (
        <ListItem
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Grid container spacing={2} direction="column"> {/* Changed direction to column */}
            <Grid size={12}>
              <Avatar
                src={movieImages[booking.movieId]}
                alt={booking.movieTitle}
                sx={{ width: 150, height: 225, mb: 2 }}
                variant="rounded"
              />
            </Grid>
            <Grid size={12}>
              <ListItemText
                primary={<Typography variant="h6">{booking.movieTitle}</Typography>}
                secondary={
                  <Typography>
                    Showtime: {booking.showtime}, Seats: {booking.seats}
                  </Typography>
                }
              />
            </Grid>
            <Grid size={12} sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}> {/* Added mt: 1 */}
              <Button
                onClick={() => handleEditBooking(booking)}
                variant="outlined"
                size="small"
                sx={{ mr: 1 }} // Changed ml to mr
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteBooking(index)}
                variant="outlined"
                size="small"
                color="error"
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </ListItem>
      ))}
    </List>
    <Button component={Link} to="/">
      Back to Movies
    </Button>
  </Paper>

  <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
    <DialogTitle>Edit Booking</DialogTitle>
    <DialogContent>
      <TextField
        label="Seats"
        type="number"
        value={editedSeats}
        onChange={(e) => setEditedSeats(e.target.value)}
        fullWidth
        margin="normal"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
      <Button onClick={handleUpdateBooking} variant="contained" color="primary">
        Update
      </Button>
    </DialogActions>
  </Dialog>
</Container>
  );
}
