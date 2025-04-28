import { Movie } from "@/interfaces/Movies";
import { deleteRequest, getRequest, postRequest, putRequest } from "./axios";

export const getMoviesList = async () => {
  try {
    const response = await getRequest<Movie[]>("/admin/getMoviesList");
    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const addMovieToList = async (payload: any) => {
  try {
    const response = await postRequest<any>("/admin/addMovie", payload);
    console.log("response", response);
    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const updateMovieToList = async (
  match: { id: number },
  updates: any
) => {
  try {
    const response = await putRequest<any>("/admin/updateMovie", {
      match,
      ...updates,
    });
    return response;
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error;
  }
};

export const deleteMovieToList = async (movieId: number) => {
  try {
    const response = await deleteRequest<any>("/admin/deleteMovie", {
      params: { id: movieId },
    });
    return response;
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};
