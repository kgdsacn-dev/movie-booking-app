import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticationContextValue } from "../features/authentication/auth-context";

const queryClient = new QueryClient();
type RouterContext = {
  auth: AuthenticationContextValue;
};
const Root = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
};

const NotFound = () => {
  return (
    <div className="flex h-[100vh] flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-500 underline">
        Go to Home
      </Link>
    </div>
  );
};
export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
  notFoundComponent() {
    return <NotFound />;
  },
});
