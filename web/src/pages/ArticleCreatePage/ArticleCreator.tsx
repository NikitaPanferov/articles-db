import { FormEvent, useState } from "react";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "react-query";

import SearchSelect from "react-select";

import { useNavigate } from "@tanstack/react-router";
import { ArticleLang } from "../../models/Article";
import ArticleService from "../../services/ArticleService";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { FaHome } from "react-icons/fa";
import { useTerms } from "../../utils/hooks/useTerms";
import {
  isValidEnString,
  isValidIdentifier,
  isValidRuString,
} from "../../utils/utils";

export const ArticleCreator: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: currentYear + 2 - 1900 },
    (_, i) => currentYear - i
  );

  const [name, setName] = useState("");
  const [term, setTerm] = useState("");
  const [terminology, setTerminology] = useState("");
  const [author, setAuthor] = useState("");
  const [keyWords, setKeyWords] = useState("");
  const [publicationYear, setPublicationYear] = useState<number | undefined>(
    undefined
  );
  const [url, setUrl] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [usageContext, setUsageContext] = useState("");
  const [mathApparatus, setMathApparatus] = useState("");
  const [solving, setSolving] = useState("");
  const [interests, setInterests] = useState("");
  const [lang, setLang] = useState("ru");

  const langValidateFunc = lang === "ru" ? isValidRuString : isValidEnString;

  const isAuthorValid = langValidateFunc(author);
  const isNameValid = langValidateFunc(name);
  const isKeyWordValid = langValidateFunc(keyWords);

  const isIdentifierValid = isValidIdentifier(identifier);

  const checkAllFields = () => {
    return (
      isAuthorValid &&
      isNameValid &&
      isKeyWordValid &&
      isIdentifierValid 
    );

  }

  const termsQuery = useTerms(lang as ArticleLang);

  const articleMutation = useMutation(ArticleService.create, {
    onSuccess: ({ data }) => {
      const toastId = toast({
        title: `Статья ${data.id} успешно сохранена`,
        description: (
          <Flex py={1} gap={8} justifyContent="space-between">
            <Button
              onClick={() => {
                navigate({
                  to: "/",
                });
                toast.close(toastId);
              }}
              size="sm"
              width="50%"
            >
              <Icon as={FaHome} />
            </Button>
            <Button
              onClick={() => {
                navigate({
                  to: `/article/$articleId`,
                  params: { articleId: `${data.id}` },
                });
                toast.close(toastId);
              }}
              size="sm"
              width="50%"
            >
              <ArrowRightIcon />
            </Button>
          </Flex>
        ),
        status: "success",
        isClosable: true,
        duration: 10000,
      });
    },
    onError: (_) => {
      toast({
        title: "Ошибка",
        description: "Не получилось сохранить статью",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      checkAllFields()
    ) {
      toast({
        title: "Ошибка",
        description: "Проверьте корректность заполнения полей",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
      return;
    }
    articleMutation.mutate({
      name,
      term,
      terminology,
      author,
      key_words: keyWords,
      publication_year: publicationYear!,
      url,
      identifier,
      usage_context: usageContext,
      math_apparatus: mathApparatus,
      solving,
      interests,
      lang: lang as ArticleLang,
    });
  };

  return (
    <VStack spacing={8} align="stretch">
      <form onSubmit={onSubmit}>
        <Box p={5} shadow="md" borderRadius="10px">
          <FormControl id="lang" isRequired>
            <FormLabel>Язык</FormLabel>
            <Select
              placeholder="Выберите язык статьи"
              value={lang}
              onChange={(e) => {
                setLang(e.target.value as ArticleLang);
              }}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </Select>
          </FormControl>
        </Box>
        <Box p={5} shadow="md" borderRadius="10px">
          <Stack spacing={4}>
            <FormControl id="name" isRequired isInvalid={!!isNameValid}>
              <FormLabel>Название статьи</FormLabel>
              <Input
                placeholder="Название статьи"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormErrorMessage>{isNameValid}</FormErrorMessage>
            </FormControl>
            <FormControl id="term" isRequired>
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
            <FormControl id="terminology" isRequired>
              <FormLabel>Терминология в статье</FormLabel>
              <Textarea
                placeholder="Терминология в статье"
                value={terminology}
                onChange={(e) => {
                  setTerminology(e.target.value);
                }}
              />
            </FormControl>
            <FormControl id="author" isRequired isInvalid={!!isAuthorValid}>
              <FormLabel>Автор</FormLabel>
              <Input
                placeholder="Автор"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                }}
              />
              <FormErrorMessage>{isAuthorValid}</FormErrorMessage>
            </FormControl>
            <FormControl id="key_words" isRequired isInvalid={!!isKeyWordValid}>
              <FormLabel>Ключевые слова</FormLabel>
              <Textarea
                placeholder="Ключевые слова"
                value={keyWords}
                onChange={(e) => {
                  setKeyWords(e.target.value);
                }}
              />
              <FormErrorMessage>{isKeyWordValid}</FormErrorMessage>
            </FormControl>
            <FormControl id="year" isRequired>
              <FormLabel>Год</FormLabel>
              <SearchSelect
                placeholder="Введите год"
                options={yearOptions.map((year) => ({
                  value: year,
                  label: year,
                }))}
                onChange={(option) =>
                  setPublicationYear(option?.value || undefined)
                }
                value={
                  publicationYear
                    ? { value: publicationYear, label: publicationYear }
                    : null
                }
              />
            </FormControl>
            <FormControl id="url" isRequired>
              <FormLabel>Ссылка на источник</FormLabel>
              <InputGroup>
                <InputLeftAddon>https://</InputLeftAddon>
                <Input
                  placeholder="Ссылка на источник"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                  }}
                />
              </InputGroup>
            </FormControl>
            <FormControl
              id="identifier"
              isRequired
              isInvalid={!!isIdentifierValid}
            >
              <FormLabel>Идентификатор статьи</FormLabel>
              <Input
                placeholder="Идентификатор статьи"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                }}
              />
              <FormErrorMessage>{isIdentifierValid}</FormErrorMessage>
            </FormControl>
            <FormControl id="context" isRequired>
              <FormLabel>Контекст использования</FormLabel>
              <Textarea
                placeholder="Контекст использования"
                value={usageContext}
                onChange={(e) => {
                  setUsageContext(e.target.value);
                }}
              />
            </FormControl>
            <FormControl id="math" isRequired>
              <FormLabel>Математический аппарат</FormLabel>
              <Textarea
                placeholder="Математический аппарат"
                value={mathApparatus}
                onChange={(e) => {
                  setMathApparatus(e.target.value);
                }}
              />
            </FormControl>
            <FormControl id="solution" isRequired>
              <FormLabel>Решение задачи</FormLabel>
              <Textarea
                placeholder="Решение задачи"
                value={solving}
                onChange={(e) => {
                  setSolving(e.target.value);
                }}
              />
            </FormControl>
            <FormControl id="interests" isRequired>
              <FormLabel>В чьих интересах</FormLabel>
              <Textarea
                placeholder="В чьих интересах"
                value={interests}
                onChange={(e) => {
                  setInterests(e.target.value);
                }}
              />
            </FormControl>
          </Stack>
        </Box>
        <Flex py={4} gap={8} justifyContent="space-between" width="100%">
          <Button
            width="50%"
            colorScheme="red"
            variant="outline"
            onClick={() => {
              navigate({ to: "/" });
            }}
          >
            Отмена
          </Button>
          <Button
            width="50%"
            colorScheme="teal"
            variant="solid"
            type="submit"
            isLoading={articleMutation.isLoading}
          >
            Подтвердить
          </Button>
        </Flex>
      </form>
    </VStack>
  );
};
