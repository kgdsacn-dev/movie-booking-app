import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
  colors,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useAuthentication } from "@/features/authentication/auth-context";
import { getListUsers } from "@/services/login-service";
import { User } from "@/models/stores/authentication";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

const imageUrl = "https://image.tmdb.org/t/p/w500";

function LoginComponent() {
  const useAuthProvider = useAuthentication();
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { data: userList } = useQuery({
    queryKey: ["getListUsers"],
    queryFn: async () => {
      const response = await getListUsers();
      return response.payload.userList || [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const matchedUser = userList?.find(
      (user: User) => user.email === userEmail && user.password === password
    );

    if (!matchedUser) {
      setError("Invalid email or password");
      return;
    }

    const name = matchedUser.name;
    const role = matchedUser.role;
    const email = matchedUser.email;
    const userId = matchedUser.userId;
    const userProfile = {
      email,
      name,
      role,
      userId,
      token: nanoid(),
    };

    useAuthProvider.login(userProfile);
    await router.invalidate();
    router.navigate({ to: "/app" });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(120deg, #0b0b0b, #b20710, #1a1a1a)",
        backgroundSize: "300% 300%",
        animation: "netflixBackground 10s ease-in-out infinite",
        "@keyframes netflixBackground": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
      }}
    >
      <Card
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "rgba(0, 0, 0, 0.42)", // Semi-transparent black for the card
        }}
      >
        <Box
          sx={{
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
          }}
        >
          <Avatar sx={{ bgcolor: "#e50914", mb: 1 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Please log in to continue
          </Typography>
        </Box>
        <CardContent sx={{ padding: 4 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{
                input: {
                  color: "white",
                },
                label: {
                  color: "white",
                  borderColor: "white",
                },

                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "white",
                  },
              }}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{
                input: {
                  color: "white",
                },
                label: {
                  color: "white",
                  borderColor: "white",
                },

                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "white",
                  },
              }}
            />

            {/* Error Message */}
            {error && (
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                background: "#e50914",
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  background: "#b20710",
                },
              }}
            >
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
