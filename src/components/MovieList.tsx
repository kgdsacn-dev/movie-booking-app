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
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {movies.map((movie) => (
          <Paper key={movie.id} elevation={3} sx={{ flex: "1 0 400px", p: 3 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12 }}>
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
                    sx={{ flexGrow: 1, objectFit: "cover" }}
                  />
                </Card>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h4" gutterBottom>
                  {movie.movieTitle}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {movie.movieDescription}
                </Typography>
                <Button
                  sx={{ mt: 2 }}
                  onClick={() => handleNavigation(movie.id, router)}
                  variant="contained"
                  color="primary"
                >
                  Book Now
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
