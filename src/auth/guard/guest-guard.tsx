import { useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { loading } = useAuthContext();
  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();
  const { authenticated } = useAuthContext();
  const { user } = useAuthContext();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const adminReturnTo = paths.dashboard.admin.product.root;
  const usersReturnTo = paths.dashboard.product.root;
  // const returnTo = searchParams.get('returnTo') || paths.dashboard.root;
  const [returnTo, setReturnTo] = useState(usersReturnTo);

  useEffect(() => {
    if (user) {
      console.log('this is called and user.role is : ', user.role)
      setReturnTo(user.role === 'admin' ? adminReturnTo : usersReturnTo);
    }
  }, [user?.role, adminReturnTo, usersReturnTo]);


  const check = useCallback(() => {
    if (authenticated) {
      router.replace(returnTo);
    }
    else if (pathname !== '/auth/login/' && pathname !== '/auth/register/' && pathname !== '/auth/forgot-password/') {
      router.replace(paths.auth.firebase.login);
    }
  }, [authenticated, returnTo, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
