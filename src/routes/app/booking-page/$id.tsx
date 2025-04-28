import { useState } from "react";
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
import { Booking } from "../../../interfaces/Booking";
import { addBookings, getMovies } from "../../../services/user-service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useBookingStore } from "../../../store/bookingStore";
import { useMoviesStore } from "../../../store/moviesStore";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { v4 as uuidv4 } from "uuid";
import { useAuthentication } from "@/features/authentication/auth-context";

const BookingPage = () => {
  const { id } = Route.useParams();
  const router = useRouter();
  const { movie, setMovie } = useMoviesStore();
  const { showtime, seats, setShowtime, setSeats, openModal, setOpenModal } =
    useBookingStore();
  const showingTimeArray = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"];
  const auth = useAuthentication();
  const userId = auth.userProfile.userId;

  const { isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const movies = (await getMovies()) || [];
      const selectedMovie = movies.find(
        (m: any) => m.id === parseInt(id || "0", 10)
      );
      setMovie(selectedMovie || null);
      return selectedMovie;
    },
    enabled: !!id,
  });

  // Mutation for adding bookings
  const mutation = useMutation({
    mutationFn: addBookings,
    onSuccess: (data) => {
      console.log("Booking added successfully:", data);
      setOpenModal(true);
    },
    onError: (error) => {
      console.error("Error adding booking:", error);
    },
  });

  const handleNavigation = (
    router: ReturnType<typeof useRouter>,
    path: string
  ) => {
    router.navigate({ to: path });
  };

  const handleBooking = async () => {
    const booking: Booking = {
      id: uuidv4(),
      userId: userId,
      movieId: movie?.id || 0,
      showtime,
      seats: seats || 0,
      movieTitle: movie?.movieTitle || "",
    };

    await mutation.mutateAsync(booking);
  };

  const handleGoBack = () => {
    handleNavigation(router, "/app");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    handleNavigation(router, "/app/bookings-page");
  };

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

  if (!movie) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Movie not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <img
              src={"https://image.tmdb.org/t/p/w500" + movie?.posterPath}
              alt={movie?.movieTitle}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid>
            <Typography variant="h4" gutterBottom>
              {movie?.movieTitle}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {movie?.movieDescription}
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
              onChange={(e) => setSeats(+e.target.value || 0)}
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
            Your booking for {movie?.movieTitle} at {showtime} with {seats}{" "}
            seats has been confirmed.
          </Typography>
          <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
            View Bookings
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export const Route = createFileRoute("/app/booking-page/$id")({
  component: BookingPage,
  beforeLoad: async ({ context, location }) => {
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
