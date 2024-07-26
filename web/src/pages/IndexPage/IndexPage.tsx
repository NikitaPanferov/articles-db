import { Button, HStack } from "@chakra-ui/react";
import useAuthStore from "../../stores/authStore";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "react-query";
import ArticleService from "../../services/ArticleService";
import ArticleList from "./ArticleList";
import { Search } from "./Search";
import { useEffect, useState } from "react";
import { Route } from "../../routes/";

export const IndexPage = ({ my = false }) => {
  const navigate = useNavigate();
  const { isAuth } = useAuthStore((state) => state);
  const [searchString, setSearchString] = useState("");

  const {
    term = undefined,
    name = undefined,
    author = undefined,
    publication_year = undefined,
  } = my ? {} : Route.useSearch();

  const articlesQuery = my
    ? useQuery("myArticles", ArticleService.getMyArticles, {
        select: (data) => data.data,
        enabled: isAuth,
      })
    : useQuery(
        ["articles", searchString],
        () => ArticleService.getArticles(searchString),
        {
          select: (data) => data.data,
          enabled: isAuth,
        }
      );

  useEffect(() => {
    const search = {
      term,
      name,
      author,
      publication_year,
    };

    const searchString = Object.entries(search)
      .filter(([_, value]) => !!value)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`
      )
      .join("&");

    setSearchString(searchString);
  }, [term, name, author, publication_year]);

  if (!isAuth) {
    return (
      <HStack justify="center" py="32px">
        <Button onClick={() => navigate({ to: "/login" })}>Войти</Button>
        <Button onClick={() => navigate({ to: "/signup" })}>Регистрация</Button>
      </HStack>
    );
  }

  return (
    <>
      {!my && (
        <Search
          onSearch={articlesQuery.refetch}
          setQueryString={setSearchString}
          isLoading={articlesQuery.isLoading}
          queryString={searchString}
        />
      )}
      <ArticleList articles={articlesQuery.data || []} />
    </>
  );
};
