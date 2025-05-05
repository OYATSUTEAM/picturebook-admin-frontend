import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints, poster } from 'src/utils/axios';

import { IProductItem } from 'src/types/product';
import { HOST_API } from 'src/config-global';
import { IFile } from 'src/types/file';
import { IUserAccount } from 'src/types/user';

// ----------------------------------------------------------------------


export function useGetUsers() {
  const URL = HOST_API + endpoints.user.list;
  
  const { data, isLoading, error, isValidating } = useSWR(URL, poster);


  const memoizedValue = useMemo(
    () => ({
      users: (data?.users as IUserAccount[]) || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.users.length,
    }),
    [data?.products, error, isLoading, isValidating]
  );

  return memoizedValue;
}
