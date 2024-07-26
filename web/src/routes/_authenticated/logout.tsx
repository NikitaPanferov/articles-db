import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/logout")({
  beforeLoad: async ({ context }) => {
    const { logout } = context.authentication;
    logout();
  },
  component: () => <Navigate to="/login"/>,
});
