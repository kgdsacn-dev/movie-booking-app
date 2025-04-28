import { Booking } from "@/interfaces/Booking";
import { deleteRequest, getRequest, postRequest } from "./axios";
import { Movie } from "@/interfaces/Movies";

export const getMovies = async () => {
  try {
    const response = await getRequest<Movie[]>("/api/getMoviesList");
    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const addBookings = async (payload: Booking) => {
  try {
    const response = await postRequest<Booking>("/api/addBooking", payload);
    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const getMyBookings = async (userId: string) => {
  try {
    const response = await getRequest<Booking[]>(
      `/api/getMyBookings?userId=${userId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const updateBookingToList = async (payload: {
  id: string;
  [key: string]: any;
}) => {
  try {
    if (!payload.id) {
      throw new Error("Booking ID is required");
    }

    const response = await postRequest<Booking>("/api/updateBooking", payload);
    return response;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const deleteBooking = async (filters: { [key: string]: any }) => {
  try {
    if (!filters || Object.keys(filters).length === 0) {
      throw new Error("No filter parameters provided");
    }

    const response = await deleteRequest<any>("/api/deleteBooking", {
      params: filters, // Pass filters as query parameters
    });

    return response;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};
