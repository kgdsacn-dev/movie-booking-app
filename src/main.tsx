import { StrictMode } from "react";

import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import {
  AuthenticationProvider,
  useAuthentication,
} from "./features/authentication/auth-context";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;
const InnerApp = () => {
  const auth = useAuthentication();
  return <RouterProvider router={router} context={{ auth }} />;
};

const App = () => {
  return (
    <AuthenticationProvider>
      <InnerApp />
    </AuthenticationProvider>
  );
};

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
