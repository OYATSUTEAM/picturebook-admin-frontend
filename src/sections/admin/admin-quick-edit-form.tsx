import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { countries } from 'src/assets/data';
import { _roles, USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from 'src/_mock';
import axios, { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IUserAccount, IUserItem } from 'src/types/user';
import { IProductItem } from 'src/types/product';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentUser?: IUserAccount;
};

export default function AdminQuickEditForm({ currentUser, open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [purchasedProducts, setPurchasedProducts] = useState<IProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    status: Yup.string().required('State is required'),
    role: Yup.string().required('Role is required'),
    purchased: Yup.mixed()
      .nullable()
      .test('file', 'Purched is required', (value) => {
        if (value as string) return true;
        return false;
      }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      status: currentUser?.status || '',
      purchased: currentUser?.purchased || '',
      role: currentUser?.role || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      if (!currentUser?.purchased || !Array.isArray(currentUser.purchased)) return;

      setLoading(true);
      try {
        const productPromises = currentUser.purchased.map(async (productId) => {
          try {
            const response = await axios.post(endpoints.product.details, { productId });
            return response.data.product;
          } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
          }
        });

        const products = await Promise.all(productPromises);
        console.log(products)
        setPurchasedProducts(products.filter((product): product is IProductItem => product !== null));
      } catch (error) {
        console.error('Error fetching purchased products:', error);
        enqueueSnackbar('Error loading purchased products', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchPurchasedProducts();
    }
  }, [currentUser?.purchased, open, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      onClose();
      enqueueSnackbar('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFSelect name="status" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect name="role" label="Role">
              {USER_ROLE_OPTIONS.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField disabled name="name" label="Full Name" />
            <RHFTextField disabled name="email" label="Email Address" />
          </Box>

          <Box sx={{ mt: 3 }}>
            {/* <Label variant="soft" color="info" sx={{ mb: 2 }}> */}
              Purchased Products
            {/* </Label> */}
            <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : purchasedProducts.length > 0 ? (
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                  {purchasedProducts.map((product) => (
                    <Box
                      width={'-webkit-fill-available'}
                      component="li"
                      key={product.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                      }}
                    >
                      {product.coverUrl && (
                        <Box
                          component="img"
                          src={product.coverUrl}
                          alt={product.name}
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 1,
                            mr: 2,
                            objectFit: 'cover',
                          }}
                        />
                      )}
                      <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} width={'inherit'}>
                        <Typography variant="subtitle2">{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.price} 円
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ color: 'text.secondary' }}>No purchased products</Box>
              )}
            </Box>
          </Box>

          <Box columnGap={2}></Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
