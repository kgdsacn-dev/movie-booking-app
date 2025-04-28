export interface Booking {
  id: string;
  userId?: string;
  movieId: number;
  showtime: string;
  seats: number;
  movieTitle?: string;
}
