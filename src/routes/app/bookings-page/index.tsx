import {
  Button,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";

import { useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Booking } from "@/interfaces/Booking";
import { useBookingStore } from "@/store/bookingStore";
import {
  addBookings,
  deleteBooking,
  getMyBookings,
  updateBookingToList,
} from "@/services/user-service";
import { useAuthentication } from "@/features/authentication/auth-context";

const BookingsPage = () => {
  const queryClient = useQueryClient();
  const [editingBooking, setEditingBooking] = useState<Booking>();
  const [dialogForm, setDialogForm] = useState<Booking>({
    id: "",
    userId: "",
    movieId: 0,
    showtime: "",
    seats: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const auth = useAuthentication();
  const userId = auth.userProfile.userId;
  const showingTimeArray = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"];

  const addBooking = useBookingStore.use.addBooking();
  const removeBooking = useBookingStore.use.removeBooking();
  const updateBooking = useBookingStore.use.updateBooking();

  const { data: bookingsData, isLoading } = useQuery<Booking[]>({
    queryKey: ["getMybookings"],
    queryFn: async () => {
      const response = (await getMyBookings(userId)) || [];
      return response;
    },
    enabled: !!userId,
  });

  const updateBookingMutation = useMutation({
    mutationFn: updateBookingToList,
    onSuccess: async (updatedBooking: Booking) => {
      updateBooking(updatedBooking);
      await queryClient.refetchQueries({ queryKey: ["getMybookings"] });
      console.log("Booking updated successfully:", updatedBooking);
    },
    onError: (error) => {
      console.error("Error updating booking:", error);
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: deleteBooking, // Call the deleteBooking service
    onSuccess: (_, variables) => {
      removeBooking(variables.id); // Remove the booking from Zustand store
      queryClient.invalidateQueries({ queryKey: ["getMybookings"] }); // Refetch bookings
      console.log(`Booking with ID ${variables.id} deleted successfully`);
    },
    onError: (error) => {
      console.error("Error deleting booking:", error);
    },
  });

  const columns: ColumnDef<Booking, any>[] = [
    {
      accessorKey: "userId",
      header: "User ID",
    },
    {
      accessorKey: "movieTitle",
      header: "Movie Title",
    },
    {
      accessorKey: "showtime",
      header: "Showtime",
    },
    {
      accessorKey: "seats",
      header: "Seats",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEditBooking(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => {
              setBookingToDelete(row.original); // Set the booking to delete
              setDeleteDialogOpen(true); // Open the dialog
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setDialogForm(booking);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = () => {
    updateBookingMutation.mutate(dialogForm);
    setIsDialogOpen(false);
  };

  const handleDeleteBooking = (id: string) => {
    deleteBookingMutation.mutate({ id });
  };

  const table = useReactTable({
    data: bookingsData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!bookingsData?.length) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "80vh",
        }}
      >
        <Box>
          <SentimentDissatisfiedOutlinedIcon sx={{ fontSize: 50 }} />
        </Box>
        <Box>
          <Typography variant="h5">No bookings found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, padding: 4 }}>
      <Box sx={{ marginBottom: 1 }}>
        <h1>My Bookings</h1>
      </Box>

      {isLoading ? (
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Container>
      ) : (
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="showtime-label">Showtime</InputLabel>
            <Select
              labelId="showtime-label"
              id="showtime"
              label="Showtime"
              value={dialogForm.showtime}
              onChange={(e) =>
                setDialogForm({ ...dialogForm, showtime: e.target.value })
              }
            >
              {showingTimeArray.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Seats"
            type="number"
            value={dialogForm.seats}
            onChange={(e) =>
              setDialogForm({ ...dialogForm, seats: parseInt(e.target.value) })
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            Save Changes
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
            Are you sure you want to delete the booking for{" "}
            <strong>{bookingToDelete?.movieTitle}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (bookingToDelete) {
                handleDeleteBooking(bookingToDelete.id); // Trigger the delete logic
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
    </Container>
  );
};

export const Route = createFileRoute("/app/bookings-page/")({
  component: BookingsPage,
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.userProfile.token) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
