import React from "react";
import { Route } from "../../routes/_authenticated/article/$articleId";
import { useQuery } from "react-query";
import { Center, Spinner, useToast } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import ArticleService from "../../services/ArticleService";
import { ArticleDetail } from "./ArticleDetail";

export const ArticleDetailPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { articleId } = Route.useParams();
  const { data, isLoading, refetch } = useQuery(
    ["articleDetail", articleId],
    () => ArticleService.get(articleId),
    {
      select: (data) => data.data,
    }
  );

  if (isLoading) {
    return (
      <Center width="100%" height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!data) {
    toast({
      title: "Ошибка",
      description: "Не получилось открыть тест",
      status: "error",
      isClosable: true,
      duration: 2000,
    });
    navigate({ to: "/" });
    return;
  }

  return <ArticleDetail article={data} refetchArticle={refetch} />;
};
