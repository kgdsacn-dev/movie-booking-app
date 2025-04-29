import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import {
  useReactTable,
  // usePagination,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import dayjs, { Dayjs } from "dayjs";
import {
  addMovieToList,
  deleteMovieToList,
  getMoviesList,
  updateMovieToList,
} from "@/services/admin-service";
import { useMoviesStore } from "@/store/moviesStore";
import { v4 as uuidv4 } from "uuid";
import { Movie, MovieForm } from "@/interfaces/Movies";
import { postRequest } from "@/services/axios";
import { set } from "zod";
import { generateRandomNumberId } from "@/features/utilities/common-utils";

export const Route = createFileRoute("/app/admin/")({
  component: AdminHomePage,
});

function AdminHomePage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [releaseDate, setReleaseDate] = useState<Dayjs | null>(
    dayjs("2022-04-17")
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  const [dialogForm, setDialogForm] = useState<MovieForm>({
    movieTitle: "",
    genre: "",
    releaseDate: "",
    movieDescription: "",
    posterPath: "",
  });

  const addMovieForm = useMoviesStore.use.addMovieForm();
  const addMovie = useMoviesStore.use.addMovie();
  const updateMovie = useMoviesStore.use.updateMovie();
  const deleteMovie = useMoviesStore.use.deleteMovie();

  const { data: moviesData } = useQuery({
    queryKey: ["fetchAdminMovies"],
    queryFn: async () => {
      const response = (await getMoviesList()) || [];
      return response;
    },
  });

  const addMovieMutation = useMutation({
    mutationFn: addMovieToList,
    onSuccess: (movie) => {
      addMovie(movie);
      console.log("Movie added successfully");
      movieForm.reset();
      refetchAllMovieQueries();
    },
  });

  const updateMovieMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      updateMovieToList({ id }, updates),
    onSuccess: (updatedMovie: Movie) => {
      useMoviesStore.getState().updateMovie(updatedMovie);
      refetchAllMovieQueries();
      console.log("Movie updated successfully:", updatedMovie);
    },
    onError: (error) => {
      console.error("Failed to update movie:", error);
    },
  });

  const deleteMovieMutation = useMutation({
    mutationFn: deleteMovieToList,
    onSuccess: (id: number) => {
      deleteMovie(id);
      refetchAllMovieQueries();
      console.log("Movie deleted successfully:", id);
    },
  });

  const movieForm = useForm<MovieForm>({
    defaultValues: addMovieForm,
    onSubmit({ value }) {
      const isEditing = useMoviesStore.getState().isMovieFormEditing;

      const newMovie = {
        id: isEditing ? editingMovie?.id : generateRandomNumberId(5),
        movieTitle: value.movieTitle,
        genre: value.genre,
        releaseDate: dayjs(value.releaseDate).format("YYYY-MM-DD"),
        movieDescription: value.movieDescription,
        posterPath: uuidv4() + ".jpg",
      };

      if (isEditing && editingMovie?.id) {
        updateMovieMutation.mutate({ id: editingMovie.id, updates: newMovie });
      } else {
        addMovieMutation.mutate(newMovie);
      }
    },
  });

  const columns: ColumnDef<any, any>[] = [
    {
      id: "movieImage",
      header: "Poster",
      cell: ({ row }) => {
        const movie = row.original;
        return (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
            alt={movie.title}
            style={{ width: 50, height: 75 }}
          />
        );
      },
    },
    { accessorKey: "movieTitle", header: "Title" },
    { accessorKey: "genre", header: "Genre" },
    { accessorKey: "releaseDate", header: "Year" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                setMovieToDelete(row.original); // Set the movie to delete
                setDeleteDialogOpen(true); // Open the dialog
              }}
            >
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  const table = useReactTable({
    data: moviesData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  const handleEdit = (movie: any) => {
    setEditingMovie(movie);
    setDialogForm({
      movieTitle: movie.movieTitle,
      genre: movie.genre,
      releaseDate: movie.releaseDate,
      movieDescription: movie.movieDescription,
      posterPath: movie.posterPath,
    });
    useMoviesStore.getState().setIsMovieFormEditing(true); // Enable editing mode
    setIsDialogOpen(true); // Open the dialog
  };

  const handleSaveEdit = () => {
    const updates = {
      movieTitle: dialogForm.movieTitle,
      genre: dialogForm.genre,
      releaseDate: dayjs(dialogForm.releaseDate).format("YYYY-MM-DD"),
      movieDescription: dialogForm.movieDescription,
      posterPath: dialogForm.posterPath,
    };

    if (editingMovie?.id) {
      updateMovieMutation.mutate({ id: editingMovie.id, updates });
      setIsDialogOpen(false);
      useMoviesStore.getState().setIsMovieFormEditing(false); // Disable editing mode
    }
  };

  const handleDelete = (id: number) => {
    deleteMovieMutation.mutate(id);
  };

  const refetchAllMovieQueries = () => {
    queryClient.refetchQueries({ queryKey: ["fetchAdminMovies"] });
    queryClient.refetchQueries({ queryKey: ["getMovies"] });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ marginBottom: 1 }}>
        <h1>Admin Home Page</h1>
      </Box>

      {/* Add Movie Form */}
      <Box
        component="form"
        sx={{
          display: "flex",
          gap: 2,
          marginBottom: 4,
          alignItems: "center",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          movieForm.handleSubmit();
        }}
      >
        <movieForm.Field name="movieTitle">
          {(field) => (
            <TextField
              label="Movie Title"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              required
            />
          )}
        </movieForm.Field>
        <movieForm.Field name="genre">
          {(field) => (
            <TextField
              label="Genre"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              required
            />
          )}
        </movieForm.Field>
        <movieForm.Field name="movieDescription">
          {(field) => (
            <TextField
              label="Description"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              required
            />
          )}
        </movieForm.Field>
        <movieForm.Field name="releaseDate">
          {(field) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Release Date"
                name={field.name}
                value={dayjs(field.state.value)}
                onChange={(date) =>
                  field.handleChange(date?.toISOString() || "")
                }
              />
            </LocalizationProvider>
          )}
        </movieForm.Field>
        <Button type="submit" variant="contained" color="primary">
          Add Movie
        </Button>
      </Box>

      {/* Movies Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Typography>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </Box>

      {/* Edit Movie Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Edit Movie</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="movieTitle"
            value={dialogForm.movieTitle}
            onChange={(e) =>
              setDialogForm({ ...dialogForm, movieTitle: e.target.value })
            }
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Genre"
            name="genre"
            value={dialogForm.genre}
            onChange={(e) =>
              setDialogForm({ ...dialogForm, genre: e.target.value })
            }
            fullWidth
            margin="dense"
            required
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Release Date"
              value={dayjs(dialogForm.releaseDate)}
              onChange={(date) =>
                setDialogForm({
                  ...dialogForm,
                  releaseDate: date?.toISOString() || "",
                })
              }
            />
          </LocalizationProvider>
          <TextField
            label="Description"
            name="movieDescription"
            value={dialogForm.movieDescription}
            onChange={(e) =>
              setDialogForm({ ...dialogForm, movieDescription: e.target.value })
            }
            fullWidth
            margin="dense"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSaveEdit();
            }}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            padding: 2,
            borderRadius: 2,
            minWidth: "500px",
          },
        }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the movie{" "}
            <strong>{movieToDelete?.movieTitle}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (movieToDelete) {
                handleDelete(movieToDelete.id); // Trigger the delete logic
              }
              setDeleteDialogOpen(false); // Close the dialog
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
