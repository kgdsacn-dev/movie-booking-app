import { userMockList } from "@/mocks/user-mock";
import { User } from "@/models/stores/authentication";

const mockUsers: User[] = [...userMockList.users];

export const getListUsers = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      status: true,
      message: "Success",
      payload: {
        userList: mockUsers,
      },
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
