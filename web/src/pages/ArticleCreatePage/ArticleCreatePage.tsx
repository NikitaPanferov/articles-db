import { Box, Heading } from "@chakra-ui/react";
import { ArticleCreator } from "./ArticleCreator";


export const ArticleCreatePage = () => {
    return (
        <>
            <Heading mb={5}>Создание новой статьи</Heading>
            <Box background="white" p={5} borderRadius="md" boxShadow="base">
                <ArticleCreator />
            </Box>
        </>
    );
};