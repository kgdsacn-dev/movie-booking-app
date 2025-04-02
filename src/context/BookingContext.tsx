import React, { createContext, Dispatch } from 'react';
import { Booking } from '../interfaces/Booking';

interface BookingState {
    bookings: Booking[];
}

type BookingAction =
| { type: "ADD_BOOKING"; payload: Booking }
| { type: "REMOVE_BOOKING"; payload: number }
| { type: "UPDATE_BOOKING"; payload: Booking };

interface BookingContextProps {
  bookingState: BookingState;
  dispatch: Dispatch<BookingAction>;
}

export const BookingContext = createContext<BookingContextProps | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BookingContext.Provider value={undefined}>{children}</BookingContext.Provider>;
};