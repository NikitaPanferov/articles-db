import { createLazyFileRoute } from '@tanstack/react-router'
import { ArticleCreatePage } from '../../../pages/ArticleCreatePage/ArticleCreatePage';

export const Route = createLazyFileRoute('/_authenticated/article/')({
  component: ArticleCreatePage,
});
