import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Spinner,
  Center,
  Flex,
  Text,
  Button,
  Container,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { EmailIcon } from "@chakra-ui/icons";
import { AuthContext } from "../utils/hooks/useAuth";
import useAuthStore from "../stores/authStore";

type RouterContext = {
  authentication: AuthContext;
};

const RootPage: React.FC = () => {
  const { isAuth, checkAuth, user } = useAuthStore((state) => state)
  const checkAuthQuery = useQuery("check_auth", checkAuth, {
    enabled: false,
  });

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      checkAuthQuery.refetch();
    }
  }, []);

  if (checkAuthQuery.isLoading) {
    return (
      <Center width="100vw" height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      <Flex
        py={4}
        px={16}
        gap={8}
        alignItems="center"
        justify="space-between"
        style={{
          borderRadius: "0 0 20px 20px",
          boxShadow: "rgba(0, 0, 0, 0.3) 0px 0px 10px 0px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#fff",
        }}
      >
        <Badge variant="outline" colorScheme="teal">
          Библиосфера
        </Badge>
        <HStack spacing={5}>
          {isAuth && (
            <Link
              to="/"
              search={() => {
                {
                }
              }}
              activeOptions={{ exact: true }}
            >
              {({ isActive }: { isActive: boolean }) => (
                <Button size="sm" isActive={isActive}>
                  Домашняя страница
                </Button>
              )}
            </Link>
          )}
          {!isAuth && (
            <Link to="/login" activeOptions={{ exact: true }}>
              {({ isActive }: { isActive: boolean }) => (
                <Button size="sm" isActive={isActive} colorScheme="teal">
                  Войти в аккаунт
                </Button>
              )}
            </Link>
          )}
          {!isAuth && (
            <Link to="/signup" activeOptions={{ exact: true }}>
              {({ isActive }: { isActive: boolean }) => (
                <Button size="sm" isActive={isActive} colorScheme="teal">
                  Регистрация
                </Button>
              )}
            </Link>
          )}
          {isAuth && (
            <Link to="/my" activeOptions={{ exact: true }}>
              {({ isActive }: { isActive: boolean }) => (
                <Button size="sm" isActive={isActive} gap={2}>
                  <EmailIcon />
                  <Text>{user?.email}</Text>
                </Button>
              )}
            </Link>
          )}
          {isAuth && (
            <Link to="/article" activeOptions={{ exact: true }}>
              {({ isActive }: { isActive: boolean }) => (
                <Button size="sm" isActive={isActive}>
                  Внести статью
                </Button>
              )}
            </Link>
          )}
        </HStack>
        {isAuth && (
          <Button as={Link} size="sm" to="/logout" colorScheme="teal">
            Выйти
          </Button>
        )}
      </Flex>
      <Container maxW="100%" width="100%" px="200px" py="16px">
        <Outlet />
      </Container>
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootPage,
});
