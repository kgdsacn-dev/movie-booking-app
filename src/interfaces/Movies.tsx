export interface Movie {
  id: number;
  backdropPath?: string | null;
  posterPath?: string | null;
  movieDescription: string;
  movieTitle: string;
  releaseDate?: string;
  genre?: string;
}

export interface MovieForm {
  movieTitle: string;
  genre: string;
  releaseDate: string;
  movieDescription: string;
  posterPath?: string | null;
}
