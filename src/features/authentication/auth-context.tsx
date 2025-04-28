import { createContext, useCallback, useContext, useMemo } from "react";
import { User } from "../../models/stores/authentication";
import { useAuthStore } from "../../store/authenticationStore";

export type AuthenticationContextValue = {
  login: (userProfile: User) => void;
  logout: () => void;
  userProfile: User;
};

const AuthenticationContext = createContext<AuthenticationContextValue | null>(
  null
);

export const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userProfile = useAuthStore.use.userProfile();
  const setUserProfile = useAuthStore.use.setUserProfile();
  const clearUserProfile = useAuthStore.use.clearUserProfile();
  const login = useCallback(
    (userProfile: User) => {
      setUserProfile(userProfile);
    },
    [setUserProfile]
  );
  const logout = useCallback(() => {
    clearUserProfile();
  }, [clearUserProfile]);

  const contextValue = useMemo(
    () => ({ login, logout, userProfile }),
    [login, logout, userProfile]
  );

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  if (!context)
    throw new Error("missing Authentication Provider in useAuthentication");
  return context;
};
