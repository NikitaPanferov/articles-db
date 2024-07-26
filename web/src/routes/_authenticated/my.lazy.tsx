import { createLazyFileRoute } from "@tanstack/react-router";
import { IndexPage } from "../../pages/IndexPage/IndexPage";

export const Route = createLazyFileRoute("/_authenticated/my")({
  component: () => <IndexPage my />,
});
