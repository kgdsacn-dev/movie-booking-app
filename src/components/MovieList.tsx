import {
  Typography,
  Container,
  Grid,
  Button,
  Card,
  CardMedia,
  Paper,
  Box,
} from "@mui/material";
import { Movie } from "../interfaces/Movies";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface MovieProps {
  movies: Movie[];
  imageBaseUrl: string;
}

const handleNavigation = (
  movieId: number,
  router: ReturnType<typeof useRouter>
) => {
  router.navigate({ to: `/app/booking-page/${movieId}` });
};

export default function MovieList({ movies, imageBaseUrl }: MovieProps) {
  const router = useRouter();
  const [isRootPath, setIsRootPath] = useState(
    window.location.pathname === "/app"
  );

  // Listen for route changes and update `isRootPath`
  useEffect(() => {
    const unsubscribe = router.subscribe("onLoad", () => {
      setIsRootPath(window.location.pathname === "/app");
    });

    return () => {
      unsubscribe(); // Cleanup the subscription on unmount
    };
  }, [router]);

  if (!isRootPath) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={movie.id}>
            <Paper elevation={3} sx={{ height: "100%", p: 2 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={`${imageBaseUrl}${movie.posterPath}`}
                  alt={movie.movieTitle}
                  sx={{ objectFit: "cover" }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    {movie.movieTitle}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {movie.movieDescription}
                  </Typography>
                  <Button
                    sx={{ mt: 2 }}
                    onClick={() => handleNavigation(movie.id, router)}
                    variant="contained"
                    color="primary"
                    fullWidth // Full-width button for better mobile experience
                  >
                    Book Now
                  </Button>
                </Box>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
