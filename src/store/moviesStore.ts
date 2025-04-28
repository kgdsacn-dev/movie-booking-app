import { create } from "zustand";
import { Movie, MovieForm } from "../interfaces/Movies";
import { getMovies } from "../services/user-service";
import { createSelectors } from "./utility";

interface MoviesStoreBase {
  addMovieForm: MovieForm;
  isMovieFormEditing: boolean;
  movies: Movie[] | null;
  movie: Movie | null;
  loading: boolean;
  error: string | null;
  setMovie: (movie: Movie | null) => void;
  addMovie: (newMovie: Movie) => void;
  updateMovie: (updatedMovie: Movie) => void;
  deleteMovie: (id: number) => void;
  setIsMovieFormEditing: (isEditing: boolean) => void;
}

export const useMoviesStoreBase = create<MoviesStoreBase>((set) => ({
  addMovieForm: {
    movieTitle: "",
    genre: "",
    releaseDate: "",
    movieDescription: "",
    posterPath: "",
  },
  isMovieFormEditing: false,
  movie: null,
  movies: null,
  loading: true,
  error: null,
  setMovie: (movie) => set({ movie }),
  addMovie: (newMovie) =>
    set((state) => ({
      movies: state.movies ? [...state.movies, newMovie] : [newMovie],
    })),
  updateMovie: (updatedMovie) =>
    set((state) => ({
      movies: state.movies
        ? state.movies.map((movie) =>
            movie.id === updatedMovie.id ? updatedMovie : movie
          )
        : [],
    })),
  deleteMovie: (id) =>
    set((state) => ({
      movies: state.movies
        ? state.movies.filter((movie) => movie.id !== id)
        : [],
    })),
  setIsMovieFormEditing: (isEditing) =>
    set(() => ({
      isMovieFormEditing: isEditing,
    })),
}));

export const useMoviesStore = createSelectors(useMoviesStoreBase);
