import { create } from "zustand";
import { createSelectors } from "./utility";
import { createJSONStorage, persist } from "zustand/middleware";
import { AuthState, User } from "../models/stores/authentication";

const initialUserProfile: User = {
  name: "",
  email: "",
  role: "",
  token: "",
  userId: "",
};
const storeKey = "MovieBookingAppSession";

export const useAuthStoreBase = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userProfile: initialUserProfile,
      setUserProfile: (userProfile: User) => {
        set(() => ({
          userProfile: {
            ...initialUserProfile,
            ...userProfile,
          },
        }));
      },
      clearUserProfile: () =>
        set(() => ({
          userProfile: initialUserProfile,
        })),
    }),
    {
      name: storeKey,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        userProfile: state.userProfile,
      }),
    }
  )
);

export const useAuthStore = createSelectors(useAuthStoreBase);
