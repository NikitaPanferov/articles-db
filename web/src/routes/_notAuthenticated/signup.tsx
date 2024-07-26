import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "../../pages/SignUpPage/SignUpPage";

export const Route = createFileRoute("/_notAuthenticated/signup")({
  component: SignUpPage,
});
