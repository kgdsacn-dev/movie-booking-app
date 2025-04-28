import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    common: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
  responseType: "json",
  withCredentials: false,
});

export const getRequest = <T>(URL: string): Promise<T> => {
  return axiosClient.get<T>(URL).then((response) => response.data);
};

export const postRequest = <T>(URL: string, payload: any): Promise<T> => {
  return axiosClient
    .post<T>(URL, payload)
    .then((response) => response.data);
};

export const putRequest = <T>(URL: string, payload: any): Promise<T> => {
  return axiosClient
    .put<T>(URL, payload)
    .then((response) => response.data);
};

export const deleteRequest = <T>(URL: string, payload: any): Promise<T> => {
  return axiosClient
    .delete<T>(URL, payload)
    .then((response) => response.data);
};