'use client';

import { useState, useEffect, useCallback } from 'react';
import * as Yup from 'yup';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetProduct } from 'src/api/product';
import { PRODUCT_PUBLISH_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { ProductDetailsSkeleton } from '../product-skeleton';
import ProductDetailsReview from '../product-details-review';
import ProductDetailsSummary from '../product-details-summary';
import ProductDetailsToolbar from '../product-details-toolbar';
import ProductDetailsCarousel from '../product-details-carousel';
import ProductDetailsDescription from '../product-details-description';
import { Divider, Stack } from '@mui/material';
import FormProvider, { RHFEditor, RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useSnackbar } from 'notistack';
import { useBoolean } from 'src/hooks/use-boolean';
import Upload from 'src/components/upload/upload';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { HOST_API } from 'src/config-global';
import { endpoints } from 'src/utils/axios';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: '10 Day Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'solar:shield-check-bold',
  },
];

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ProductDetailsView({ id }: Props) {
  const { product, productLoading, productError } = useGetProduct(id);

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('publish');

  const [publish, setPublish] = useState('published');
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();

  const [audioFiles, setAudioFiles] = useState<(File)[]>([]);
  const [pdfFile, setPDFFile] = useState<(File)[]>([]);

  useEffect(() => {
    if (product) {
      setPublish(product?.publish);
    }
  }, [product]);


  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Price is required'),
    description: Yup.string().required('Description is required'),
    pdf: Yup.mixed()
      .nullable()
      .test('file', 'PDF is required', (value) => value instanceof File),
    audio: Yup.mixed()
      .nullable()
      .test('file', 'Audio is required', (value) => value instanceof File),
  });




  type FormValues = {
    name: string;
    price: number;
    description: string;
    pdf: File | null;
    audio: File | null;
  };
  const methods = useForm<FormValues>({
    resolver: yupResolver(NewProductSchema as any),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      pdf: null,
      audio: null,
    },
  });

  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const handleDropPDFFile = useCallback(
    (acceptedFiles: File[]) => {
      const newFile = acceptedFiles[0];
      if (newFile) {
        const fileWithPreview = Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        });
        setPDFFile([fileWithPreview]);
        setValue('pdf', fileWithPreview, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleDropMultiAudioFile = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [
        ...audioFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ];
      setAudioFiles(newFiles);
      setValue('audio', newFiles[0], { shouldValidate: true }); // validate at least one
    },
    [audioFiles, setValue]
  );

  const handleRemovePDFFile = () => {
    setPDFFile([]);
    setValue('pdf', null, { shouldValidate: true });
  };

  const handleRemoveAudioFile = (inputFile: File | string) => {
    const updated = audioFiles.filter((file) => file !== inputFile);
    setAudioFiles(updated);
    setValue('audio', updated[0] || null, { shouldValidate: true });
  };

  const handleRemoveAllFiles = () => {
    setAudioFiles([]);
    setValue('audio', null, { shouldValidate: true });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      if (pdfFile.length > 0) {
        formData.append('pdf', pdfFile[0] as File);
      }
      audioFiles.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`audio_${index}`, file);
        }
      });
      formData.append('name', data.name);
      formData.append('price', data.price.toString());
      formData.append('description', data.description);
      const filename: any = await axios.post(`${HOST_API}${endpoints.filename}`, { name: data.name });
      console.log(filename)
      if (filename.status == 200) {
        const response = await axios.post(`${HOST_API}${endpoints.upload}`, formData);
        enqueueSnackbar(response.data.message, { variant: 'success' });
      }
      else {
      }
      router.push(paths.dashboard.admin.product.root);
    } catch (error) {
      console.error('Upload error:', error);
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  });

  const renderSkeleton = <ProductDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${productError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.product.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );
  const renderDetails = (
    <Grid xs={12} md={8}>
      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Name</Typography>
            <RHFTextField name="name" label="" />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Price</Typography>
            <RHFTextField name="price" label="" type='number' />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Content</Typography>
            <RHFEditor simple name="description" />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">PDF</Typography>

            <Upload
              multiple={true}
              thumbnail={preview.value}
              files={pdfFile}
              accept={{ 'application/pdf': [] }}
              onDrop={handleDropPDFFile}
              onRemove={handleRemovePDFFile}
            />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Audio</Typography>
            <Upload
              multiple
              thumbnail={preview.value}
              files={audioFiles}
              accept={{ 'audio/*': ['*.mp3', '*.m4a', '*.wav', '*.wma'] }}
              onDrop={handleDropMultiAudioFile}
              onRemove={handleRemoveAudioFile}
              onRemoveAll={handleRemoveAllFiles}
            />

          </Stack>

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => router.push(paths.dashboard.product.root)}
            >
              Cancel
            </Button>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              color="success"
              variant="contained"
              loading={isSubmitting}
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            >
              Upload
            </LoadingButton>
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );

  const renderProduct = product && (
    <>
          <CustomBreadcrumbs
            heading="Detail"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              {
                name: 'Product',
                href: paths.dashboard.admin.product.root,
              },
              { name: product?.name },
            ]}
            sx={{
              // mb: { xs: 3, md: 5 },
            }}
          />
      <ProductDetailsToolbar
        backLink={paths.dashboard.admin.product.root}
        editLink={paths.dashboard.admin.product.edit(`${product?.id}`)}
        liveLink={paths.product.details(`${product?.id}`)}
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={PRODUCT_PUBLISH_OPTIONS}
      />
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {renderDetails}
        </Grid>
      </FormProvider>
      {/* <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={5}>
          <Card>
            <ProductDetailsDescription description={product?.name} />
          </Card>
          <Card>
            <ProductDetailsDescription description={product?.description} />
          </Card>
          <Card>
            <ProductDetailsDescription description={product?.price} />
          </Card>
          <Card>
          </Card>
          <Card>
            <ProductDetailsDescription description={product?.pdfFileName} />
          </Card>
          <Card>
          </Card>
        </Grid>
      </Grid> */}

      {/* <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box> */}

    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {productLoading && renderSkeleton}

      {productError && renderError}

      {product && renderProduct}
    </Container>
  );
}
