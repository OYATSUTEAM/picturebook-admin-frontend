import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints, poster } from 'src/utils/axios';

import { IProductItem } from 'src/types/product';
import { HOST_API } from 'src/config-global';
import { IFile } from 'src/types/file';

// ----------------------------------------------------------------------

export function useGetProducts() {
  const URL = HOST_API + endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, poster);

  console.log(data, isLoading, error, isValidating)

  const memoizedValue = useMemo(
    () => ({
      products: (data?.products as IProductItem[]) || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.products, error, isLoading, isValidating]
  );

  return memoizedValue;
}


export function useGetFileProducts() {
  const URL = HOST_API + endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, poster);

  console.log(data, isLoading, error, isValidating)

  const memoizedValue = useMemo(
    () => ({
      products: (data?.products as IFile[]) || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.products, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId: string) {
  const URL = productId ? [endpoints.product.details, { params: { productId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, poster);
  const memoizedValue = useMemo(
    () => ({
      product: data?.product as IFile,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query: string) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IProductItem[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
