import {
  HStack,
  VStack,
  Text,
  Button,
  Tooltip,
  LinkBox,
  LinkOverlay,
  Badge,
  Box,
} from "@chakra-ui/react";
import {
  CopyIcon,
  ExternalLinkIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { copyArticleAdress } from "../../utils/utils";
import { Link } from "@tanstack/react-router";
import { ArticleShort } from "../../models/Article";
import useAuthStore from "../../stores/authStore";

type ArticleListProps = {
  articles: ArticleShort[];
};

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
}) => {
  const { user } = useAuthStore((state) => state);

  return (
    <VStack width="100%">
      {articles.map((article) => (
        <LinkBox
          position="relative"
          p={5}
          shadow="md"
          borderRadius="10px"
          width="100%"
          key={article.id}
        >
          <Badge
            position="absolute"
            top={0}
            left={0}
            width="auto"
            variant="solid"
            colorScheme="teal"
            m={2}
            borderRadius="25%"
          >
            <Text>{article.lang}</Text>
          </Badge>
          <HStack spacing={4} width="100%">
            <Box flex="1" minW="0">
              <LinkOverlay as={Link} to={`/article/${article.id}`}>
                <Text noOfLines={2} overflow="hidden" textOverflow="ellipsis">
                  {article.name}
                </Text>
              </LinkOverlay>
            </Box>

            <HStack flexShrink={1}>
              <Tooltip label="Перейти на источник">
                <Button
                  as="a"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon />
                </Button>
              </Tooltip>
              <Tooltip label="Скопировать ссылку">
                <Button onClick={() => copyArticleAdress(article.id)}>
                  <CopyIcon />
                </Button>
              </Tooltip>
              <Tooltip label="Пожаловаться">
                <Button
                  as={Link}
                  isDisabled={user?.id == article.user_id}
                  colorScheme="red"
                  to={`/article/${article.id || ""}/#newProblem`}
                >
                  <WarningTwoIcon />
                </Button>
              </Tooltip>
            </HStack>
          </HStack>
        </LinkBox>
      ))}
    </VStack>
  );
};

export default ArticleList;
