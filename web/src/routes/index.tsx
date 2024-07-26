import { createFileRoute } from "@tanstack/react-router";
import { IndexPage } from "../pages/IndexPage/IndexPage";

type IndexSearch = {
  term?: string;
  name?: string;
  author?: string;
  publication_year?: number;
};

export const Route = createFileRoute("/")({
  component: IndexPage,
  validateSearch: (search: Record<string, unknown>): IndexSearch => {
    const publication_year =
      typeof search.publication_year === "string"
        ? parseInt(search.publication_year, 10)
        : undefined;
    return {
      term: (search.term as string) || undefined,
      name: (search.name as string) || undefined,
      author: (search.author as string) || undefined,
      publication_year: !isNaN(publication_year as number)
        ? publication_year
        : undefined,
    };
  },
});
