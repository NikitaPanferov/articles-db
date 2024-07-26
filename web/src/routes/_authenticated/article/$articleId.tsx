import { createFileRoute } from '@tanstack/react-router'
import { ArticleDetailPage } from '../../../pages/ArticleDetailPage/ArticleDetailPage'

export const Route = createFileRoute('/_authenticated/article/$articleId')({
  component: ArticleDetailPage,
});
