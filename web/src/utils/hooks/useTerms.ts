import { useToast } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { ArticleLang } from "../../models/Article";
import ArticleService from "../../services/ArticleService";

export const useTerms = (lang: ArticleLang) => {
	const toast = useToast()
	const termsQuery = useQuery(
		["terms", lang],
		() => ArticleService.getTermsByLang(lang),
		{
			select: (data) => data.data,
			onError: (_) => {
				toast({
				title: "Ошибка",
				description: `Не удалось получить термины на языке RU`,
				status: "error",
				isClosable: true,
				});
			},
		}
	);
	return termsQuery
}