import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";

import { routeTree } from "./routeTree.gen";
import useAuthStore from "./stores/authStore";

const router = createRouter({
  routeTree,
  context: { authentication: undefined! },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const customTheme = extendTheme({
  colors: {
    secondary: {
      50: "#E6FFFA",
      100: "#B2F5EA",
      200: "#81E6D9",
      300: "#4FD1C5",
      400: "#38B2AC",
      500: "#319795",
      600: "#2C7A7B",
      700: "#285E61",
      800: "#234E52",
      900: "#1D4044",
    },
  },
});

const queryClient = new QueryClient();

const App = () => {
  const { checkAuth } = useAuthStore((state) => state);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      checkAuth();
    }
  }, []);

  return (
    <RouterProvider
      router={router}
      context={{ authentication: useAuthStore((state) => state) }}
    />
  );
};

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ChakraProvider theme={customTheme}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ChakraProvider>
    </StrictMode>
  );
}
