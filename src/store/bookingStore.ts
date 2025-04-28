import { create } from "zustand";
import { createSelectors } from "./utility";
import { Booking } from "@/interfaces/Booking";

interface BookingStore {
  bookings: Booking[];
  showtime: string;
  seats: number | null;
  loading: boolean;
  openModal: boolean;
  setLoading: (loading: boolean) => void;
  setOpenModal: (open: boolean) => void;
  setShowtime: (showtime: string) => void;
  setSeats: (seats: number) => void;
  setBookings: (bookings: Booking[]) => void; // New method to set all bookings
  addBooking: (booking: Booking) => void;
  removeBooking: (id: string) => void; // Updated to use `id` instead of `index`
  updateBooking: (updatedBooking: Booking) => void;
}

export const useBookingStoreBase = create<BookingStore>((set) => ({
  bookings: [],
  showtime: "",
  seats: null,
  loading: true,
  openModal: false,
  setLoading: (loading) => set({ loading }),
  setOpenModal: (open) => set({ openModal: open }),
  setShowtime: (showtime) => set({ showtime }),
  setSeats: (seats) => set({ seats }),
  setBookings: (bookings) => set({ bookings }),
  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),
  removeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((booking) => booking.id !== id),
    })),
  updateBooking: (updatedBooking) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      ),
    })),
}));

export const useBookingStore = createSelectors(useBookingStoreBase);
