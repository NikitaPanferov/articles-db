import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArticleDetailResponse } from "../../models/response/ArticleResponse";
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
  Textarea,
  useToast,
  VStack,
  Text,
  FormLabel,
  Heading,
  Tag,
  Icon,
  FormErrorMessage,
} from "@chakra-ui/react";
import ArticleService from "../../services/ArticleService";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from "react-query";
import { useTerms } from "../../utils/hooks/useTerms";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { FaRegSquare } from "react-icons/fa6";
import {
  isValidEnString,
  isValidIdentifier,
  isValidRuString,
} from "../../utils/utils";
import useAuthStore from "../../stores/authStore";

type ArticleDetailProps = {
  article: ArticleDetailResponse;
  refetchArticle: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<ArticleDetailResponse, unknown>>;
};

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  refetchArticle,
}) => {
  const { user } = useAuthStore((state) => state);
  const isCreator = user!.id === article.user_id;
  const [isEditing, setIsEditing] = useState(false);
  const [articleState, setArticleState] = useState(article);

  const isAllProblemsSolved = useMemo(() => {
    return article.problems.every((item) => item.is_solved === true);
  }, [article]);

  const [newProblem, setNewProblem] = useState("");

  const termsQuery = useTerms(article.lang);

  const toast = useToast();

  useEffect(() => {
    if (!isEditing) setArticleState(article);
  }, [article]);

  const newProblemMutation = useMutation(
    () => ArticleService.createNewProblem(article.id, newProblem),
    {
      onSuccess: () => {
        refetchArticle();
        setNewProblem("");
        toast({
          title: `Проблема успешно зарегистрирована`,
          status: "success",
          isClosable: true,
          duration: 3000,
        });
      },
      onError: ({ response }) => {
        toast({
          title: "Ошибка",
          description:
            response.status !== 422
              ? response.data.detail
              : "Не получилось зарегистрировать проблему",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
      },
    }
  );

  const updateArticleMutation = useMutation(
    async () => {
      const { id, lang, publication_year, ...otherArticleFields } =
        articleState;
      ArticleService.updateArticle(id, otherArticleFields);
    },
    {
      onSuccess: () => {
        refetchArticle();
        toast({
          title: `Все проблемы удачно решены`,
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        setIsEditing(false);
      },
      onError: ({ response }: { response: any }) => {
        toast({
          title: "Ошибка",
          description:
            response.status !== 422
              ? response.data.detail
              : "Не получилось решить проблемы",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
      },
    }
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!articleState.problems.every((item) => item.is_solved === true)) {
      toast({
        title: "Ошибка",
        description: "Решите все проблемы",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
      return;
    }

    if (isAuthorValid || isKeyWordValid || isNameValid || isIdentifierValid) {
      toast({
        title: "Ошибка",
        description: "Проверьте корректность заполнения полей",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
      return;
    }
    updateArticleMutation.mutate();
  };

  const urlParse = (url: string) => `https://${url}`;

  const urlShort = (url: string) => url.replace("https://", "");

  const onSubmitCreateNewForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    newProblemMutation.mutate();
  };

  const langValidateFunc =
    article.lang === "ru" ? isValidRuString : isValidEnString;

  const isAuthorValid = langValidateFunc(articleState.author);
  const isNameValid = langValidateFunc(articleState.name);
  const isKeyWordValid = langValidateFunc(articleState.key_words);

  const isIdentifierValid = isValidIdentifier(articleState.identifier);

  const solveProblem = (problemId: number) => {
    if (isEditing)
      setArticleState((state) => {
        return {
          ...state,
          problems: state.problems.map((problem) =>
            problem.id === problemId
              ? { ...problem, is_solved: !problem.is_solved }
              : problem
          ),
        };
      });
  };

  return (
    <VStack spacing={8} align="stretch">
      <form onSubmit={onSubmit}>
        <Box p={5} shadow="md" borderRadius="10px">
          <Badge
            width="auto"
            variant="solid"
            colorScheme="teal"
            mb={4}
            borderRadius="25%"
          >
            <Text>{article.lang}</Text>
          </Badge>
          <Stack spacing={4}>
            <FormControl
              id="name"
              isRequired={isEditing}
              isInvalid={isEditing && !!isNameValid}
            >
              <FormLabel>Название статьи</FormLabel>
              <Input
                readOnly={!isEditing}
                placeholder="Название статьи"
                value={articleState.name}
                onChange={(e) =>
                  setArticleState((state) => {
                    return {
                      ...state,
                      name: e.target.value,
                    };
                  })
                }
              />
              <FormErrorMessage>{isNameValid}</FormErrorMessage>
            </FormControl>
            <FormControl id="term" isRequired={isEditing}>
              <FormLabel>Термин</FormLabel>
              {isEditing ? (
                <Select
                  placeholder="Выберите термин"
                  value={articleState.term}
                  onChange={(e) => {
                    setArticleState((state) => {
                      return {
                        ...state,
                        term: e.target.value,
                      };
                    });
                  }}
                >
                  {!!termsQuery.data?.length &&
                    termsQuery.data.map((termOption, index) => (
                      <option value={termOption} key={index}>
                        {termOption}
                      </option>
                    ))}
                </Select>
              ) : (
                <Input value={articleState.term} readOnly={!isEditing} />
              )}
            </FormControl>
            <FormControl id="terminology" isRequired={isEditing}>
              <FormLabel>Терминология в статье</FormLabel>
              <Textarea
                readOnly={!isEditing}
                placeholder="Терминология в статье"
                value={articleState.terminology}
                onChange={(e) => {
                  setArticleState((state) => {
                    return {
                      ...state,
                      terminology: e.target.value,
                    };
                  });
                }}
              />
            </FormControl>
            <FormControl
              id="author"
              isRequired={isEditing}
              isInvalid={isEditing && !!isAuthorValid}
            >
              <FormLabel>Автор</FormLabel>
              <Input
                readOnly={!isEditing}
                placeholder="Автор"
                value={articleState.author}
                onChange={(e) => {
                  setArticleState((state) => {
                    return {
                      ...state,
                      author: e.target.value,
                    };
                  });
                }}
              />
              <FormErrorMessage>{isAuthorValid}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="key_words"
              isRequired={isEditing}
              isInvalid={isEditing && !!isKeyWordValid}
            >
              <FormLabel>Ключевые слова</FormLabel>
              <Textarea
                readOnly={!isEditing}
                placeholder="Ключевые слова"
                value={articleState.key_words}
                onChange={(e) => {
                  setArticleState((state) => {
                    return {
                      ...state,
                      key_words: e.target.value,
                    };
                  });
                }}
              />
              <FormErrorMessage>{isKeyWordValid}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="year"
              isRequired={isEditing}
              isDisabled={isEditing}
            >
              <FormLabel>Год</FormLabel>
              <Input
                type="number"
                value={articleState.publication_year}
                readOnly={true}
              />
            </FormControl>
            <FormControl id="url" isRequired={isEditing}>
              <FormLabel>Ссылка на источник</FormLabel>
              {isEditing ? (
                <InputGroup>
                  <InputLeftAddon>https://</InputLeftAddon>
                  <Input
                    placeholder="Ссылка на источник"
                    value={urlShort(articleState.url)}
                    onChange={(e) => {
                      setArticleState((state) => {
                        return {
                          ...state,
                          key_words: urlParse(e.target.value),
                        };
                      });
                    }}
                  />
                </InputGroup>
              ) : (
                <Input
                  placeholder="Ссылка на источник"
                  value={articleState.url}
                  readOnly
                />
              )}
            </FormControl>
            <FormControl
              id="identifier"
              isRequired={isEditing}
              isInvalid={!!isIdentifierValid}
            >
              <FormLabel>Идентификатор статьи</FormLabel>
              <Input
                readOnly={!isEditing}
                placeholder="Идентификатор статьи"
                value={articleState.identifier}
                onChange={(e) => {
                  setArticleState((state) => {
                    return {
                      ...state,
                      identifier: e.target.value,
                    };
                  });
                }}
              />
              <FormErrorMessage>{isIdentifierValid}</FormErrorMessage>
            </FormControl>
            <FormControl id="context" isRequired={isEditing}>
              <FormLabel>Контекст использования</FormLabel>
              <Textarea
                readOnly={!isEditing}
                placeholder="Контекст использования"
                value={articleState.usage_context}
                onChange={(e) => {
                  setArticleState((state) => {
                    return {
                      ...state,
                      usage_context: e.target.value,
                    };
                  });
                }}
              />
            </FormControl>
            <FormControl id="math" isRequired={isEditing}>
              <FormLabel>Математический аппарат</FormLabel>
              <Textarea
                readOnly={!isEditing}
                placeholder="Математический аппарат"
                value={articleState.math_apparatus}
                onChange={(e) => {
                  setArticleState((state) => {
                    return {
                      ...state,
                      math_apparatus: e.target.value,
                    };
                  });
                }}
              />
            </FormControl>
            <FormControl id="solution" isRequired={isEditing}>
              <FormLabel>Решение задачи</FormLabel>
              <Textarea
                readOnly={!isEditing}
                placeholder="Решение задачи"
                value={articleState.solving}
                onChange={(e) => {
                  setArticleState((state) => {
                    return {
                      ...state,
                      solving: e.target.value,
                    };
                  });
                }}
              />
            </FormControl>
            <FormControl id="interests" isRequired={isEditing}>
              <FormLabel>В чьих интересах</FormLabel>
              <Textarea
                readOnly={!isEditing}
                placeholder="В чьих интересах"
                value={articleState.interests}
                onChange={(e) => {
                  setArticleState((state) => {
                    return {
                      ...state,
                      interests: e.target.value,
                    };
                  });
                }}
              />
            </FormControl>
          </Stack>
        </Box>
        {!!article.problems.length && (
          <Box
            background="white"
            mt={6}
            p={5}
            borderRadius="md"
            boxShadow="base"
          >
            <VStack spacing={4}>
              <Heading size="l">Ошибки</Heading>
              {articleState.problems.map((problem, idx) => {
                return (
                  <Box
                    width="100%"
                    position="relative"
                    background="white"
                    p={5}
                    borderRadius="md"
                    boxShadow="base"
                    key={idx}
                  >
                    <Tag
                      position="absolute"
                      top={0}
                      left={0}
                      variant="solid"
                      colorScheme={problem.is_solved ? "green" : "red"}
                      m={1}
                      borderRadius="25%"
                      fontSize={13}
                      onClick={() => {
                        solveProblem(problem.id);
                      }}
                    >
                      {problem.is_solved ? (
                        <CheckCircleIcon />
                      ) : isEditing ? (
                        <Icon as={FaRegSquare} />
                      ) : (
                        <WarningIcon />
                      )}
                    </Tag>
                    <Textarea m={2} readOnly value={problem.text} />
                  </Box>
                );
              })}
              {isCreator && !isEditing && !isAllProblemsSolved && (
                <Button
                  width="100%"
                  colorScheme="teal"
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  Устранить ошибки
                </Button>
              )}
              {isCreator && isEditing && (
                <Flex
                  py={4}
                  gap={8}
                  justifyContent="space-between"
                  width="100%"
                >
                  <Button
                    width="50%"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      refetchArticle();
                    }}
                  >
                    Отмена
                  </Button>
                  <Button
                    width="50%"
                    colorScheme="teal"
                    variant="solid"
                    type="submit"
                    isLoading={updateArticleMutation.isLoading}
                  >
                    Подтвердить
                  </Button>
                </Flex>
              )}
            </VStack>
          </Box>
        )}
      </form>

      {!isCreator && (
        <form id="newProblem" onSubmit={onSubmitCreateNewForm}>
          <Box
            background="white"
            mt={6}
            p={5}
            borderRadius="md"
            boxShadow="base"
          >
            <VStack spacing={4}>
              <Heading size="l">Сообщить об ошибке</Heading>
              <Textarea
                placeholder="Расскажите о проблеме"
                value={newProblem}
                onChange={(e) => {
                  setNewProblem(e.target.value);
                }}
              />
              <Button
                type="submit"
                isLoading={newProblemMutation.isLoading}
                colorScheme="teal"
              >
                Подтвердить
              </Button>
            </VStack>
          </Box>
        </form>
      )}
    </VStack>
  );
};
