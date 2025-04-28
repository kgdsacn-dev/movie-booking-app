import { nanoid } from "nanoid";

export const userMockList = {
  status: 200,
  message: "Success",
  users: [
    {
      userId: "101",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "johndoe123",
      role: "user",
      token: nanoid(13),
    },
    {
      userId: "102",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "janesmith123",
      role: "admin",
      token: nanoid(13),
    },
    {
      userId: "103",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      password: "alicejohnson123",
      role: "user",
      token: nanoid(13),
    },
  ],
};
