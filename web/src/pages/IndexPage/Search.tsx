import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Select,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { ArticleLang } from "../../models/Article";
import { useTerms } from "../../utils/hooks/useTerms";
import { FormEvent, useEffect, useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { ArticlesResponse } from "../../models/response/ArticleResponse";
import { Route } from "../../routes/";

type SearchProps = {
  onSearch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<ArticlesResponse, unknown>>;
  queryString: string;
  setQueryString: (q: string) => void;
  isLoading: boolean;
};

export const Search: React.FC<SearchProps> = ({ isLoading }) => {
  const navigate = useNavigate();
  const termsQuery = useTerms("ru" as ArticleLang);

  const currentYear = new Date().getFullYear();

  const {
    term: inTerm,
    name: inName,
    author: inAuthor,
    publication_year: inPublication_year,
  } = Route.useSearch();

  const [term, setTerm] = useState(inTerm ?? "");
  const [name, setName] = useState(inName ?? "");
  const [author, setAuthor] = useState(inAuthor ?? "");
  const [publication_year, setPublicationYear] = useState<number | undefined>(
    inPublication_year
  );

  useEffect(() => {
    setTerm(inTerm ?? "");
    setName(inName ?? "");
    setAuthor(inAuthor ?? "");
    setPublicationYear(inPublication_year);
  }, [inTerm, inName, inAuthor, inPublication_year]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = {
      term,
      name,
      author,
      publication_year,
    };
    navigate({
      from: ".",
      to: "/",
      search,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Box
        background="white"
        p={5}
        borderRadius="md"
        boxShadow="base"
        mb={6}
        borderWidth={2}
        borderColor="teal"
      >
        <HStack width="100%" display="flex" alignItems="flex-end">
          <FormControl id="term">
            <FormLabel>Термин</FormLabel>
            <Select
              placeholder="Выберите термин"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
              }}
              isDisabled={!termsQuery.data?.length}
            >
              {!!termsQuery.data?.length &&
                termsQuery.data.map((termOption, index) => (
                  <option value={termOption} key={index}>
                    {termOption}
                  </option>
                ))}
            </Select>
          </FormControl>
          <FormControl id="name">
            <FormLabel>Название статьи</FormLabel>
            <Input
              placeholder="Название статьи"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl id="author">
            <FormLabel>Автор</FormLabel>
            <Input
              placeholder="Автор"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
            />
          </FormControl>
          <FormControl id="year">
            <FormLabel>Год</FormLabel>
            <Input
              type="number"
              placeholder="Введите год"
              min={1900}
              max={currentYear}
              value={publication_year}
              onChange={(e) => {
                setPublicationYear(+e.target.value);
              }}
            />
          </FormControl>
          <IconButton
            type="submit"
            aria-label="Search database"
            icon={<SearchIcon />}
            colorScheme="teal"
            variant="outline"
            isLoading={isLoading}
          />
        </HStack>
      </Box>
    </form>
  );
};
