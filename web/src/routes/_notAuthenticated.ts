import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_notAuthenticated')({
  beforeLoad: async ({ context }) => {
    const { checkAuth } = context.authentication;    
    if (await checkAuth()) {
		console.log(checkAuth());
		
      throw redirect({ to: '/'});
    }
  },
});