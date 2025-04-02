import { Booking } from "../interfaces/Booking";

export interface BookingState {
  bookings: Booking[];
}

export type BookingAction =
  | { type: "ADD_BOOKING"; payload: Booking }
  | { type: "REMOVE_BOOKING"; payload: number }
  | { type: "UPDATE_BOOKING"; payload: Booking };

export const bookingReducer = (
  state: BookingState,
  action: BookingAction
): BookingState => {
  switch (action.type) {
    case "ADD_BOOKING":
      return { bookings: [...state.bookings, action.payload] };
    case "REMOVE_BOOKING":
      return { bookings: state.bookings.filter((_, index) => index !== action.payload) };
    case "UPDATE_BOOKING":
      return {
        bookings: state.bookings.map((booking) =>
          booking.movieId === action.payload.movieId &&
          booking.showtime === action.payload.showtime
            ? action.payload
            : booking
        ),
      };
    default:
      return state;
  }
};