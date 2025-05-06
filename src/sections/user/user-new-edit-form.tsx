import * as Yup from 'yup';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
} from 'src/components/hook-form';

import { IUserAccount, IUserItem } from 'src/types/user';
import { MenuItem } from '@mui/material';
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from 'src/_mock';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserAccount;
  slotprops?: string;
};

export default function UserNewEditForm({ currentUser, slotprops }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const [backLink, setBackLink] = useState(slotprops)
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    role: Yup.string().required('Role is required'),
    purchased: Yup.mixed()
      .nullable()
      .test('file', 'Purched is required', (value) => {
        if (value as string) return true;
        return false;
      }),
    status: Yup.string(),
    isVerified: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      role: currentUser?.role || '',
      purchased: currentUser?.purchased || '',
      status: currentUser?.status || '',
      isVerified: currentUser?.isVerified || false,
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  // useEffect = (() => {


  // }, [slotprops])

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3} direction={'column'} xs={12} md={8} rowGap={2} justifyContent={'start'}>
          {/* <Grid xs={12} md={8} rowGap={2}> */}
        <Stack alignItems="flex-start" sx={{ mt: 3 }}>

          <Button
            component={RouterLink}
            href={backLink}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          >
            Back
          </Button>
        </Stack>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="name" label="Full Name" />
            <RHFTextField name="email" label="Email Address" />
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
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => reset()}
              >
                Reset
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
        {/* </Grid> */}
      </Grid>
    </FormProvider>
  );
}
