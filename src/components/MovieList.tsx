import { Link } from "react-router-dom";
import {
  Typography,
  Container,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  Paper,
  Chip,
  Box,
} from "@mui/material";
import { Movie } from "../interfaces/Movies";

interface MovieProps {
  movies: Movie[];
  imageBaseUrl: string;
  onMovieClick: (movieId: number) => void;
}

export default function MovieList({ movies, imageBaseUrl, onMovieClick  }: MovieProps) {
  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {movies.map((movie) => (
          <Paper key={movie.id} elevation={3} sx={{ flex: '1 0 400px', p: 3 }}> {/* flex and minWidth */}
            <Grid container spacing={4}>
              <Grid size={{ xs: 12 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={`${imageBaseUrl}${movie.poster_path}`}
                    alt={movie.title}
                    sx={{ flexGrow: 1, objectFit: 'cover' }}
                    onClick={() => onMovieClick(movie.id)}
                  />
                </Card>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h4" gutterBottom>
                  {movie.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Overview:</strong> {movie.overview}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Release Date:</strong> {movie.release_date}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Original Language:</strong> {movie.original_language}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Popularity:</strong> {movie.popularity}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Vote Average:</strong> {movie.vote_average} ({movie.vote_count} votes)
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Adult:</strong> {movie.adult ? 'Yes' : 'No'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                  {movie.genre_ids.map((genreId) => (
                    <Chip key={genreId} label={`Genre ${genreId}`} />
                  ))}
                </Box>
                <Button component={Link} to={`/booking/${movie.id}`} sx={{ mt: 2 }}>
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
