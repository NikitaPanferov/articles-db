import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const { checkAuth } = context.authentication;    
    if (!await checkAuth()) {
      throw redirect({ to: '/login'});
    }
  },
});