'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useCallback, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFEditor,
} from 'src/components/hook-form';

import Upload from 'src/components/upload/upload';
import { Button, CardContent, Container } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { HOST_API } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'axios';
import { endpoints } from 'src/utils/axios';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetProduct } from 'src/api/product';
import ProductNewEditForm from '../product-new-edit-form';
import ProductDetailsDescription from '../product-details-description';
import { RouterLink } from 'src/routes/components';
import ProductDetailsToolbar from '../product-details-toolbar';
import { PRODUCT_PUBLISH_OPTIONS } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import { C } from '@fullcalendar/core/internal-common';

type Props = {
  id: string;
};
// Create a new File object
let newPdfFile = new File(
  [new Blob([], { type: 'application/pdf' })], // content array
  'filename.pdf',                              // filename
  {
    type: 'application/pdf',                   // MIME type
    lastModified: Date.now()                   // last modified timestamp
  }
);
export default function ProductEditView({ id }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const settings = useSettingsContext();
  const preview = useBoolean();
  const [audioFiles, setAudioFiles] = useState<(File)[]>([]);
  const [pdfFile, setPDFFile] = useState<(File)[]>([]);
  const { product: currentProduct } = useGetProduct(id);
  const backLink = paths.dashboard.admin.product.root;
  const [publish, setPublish] = useState('published');

  type FormValues = {
    name: string;
    price: number;
    description: string;
    pdf: File | null;
    audio: File | null;
  };

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Price is required'),
    description: Yup.string().required('Description is required'),
    pdf: Yup.mixed()
      .nullable()
      .test('file', 'PDF is required', (value) => {
        if (value instanceof File) return true;
        if (currentProduct?.pdfFile.name) return true;
        return false;
      }),
    audio: Yup.mixed()
      .nullable()
      .test('file', 'Audio is required', (value) => {
        if (value instanceof File) return true;
        if (currentProduct?.audioFiles && currentProduct.audioFiles.length > 0) return true;
        return false;
      }),
  });

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

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentProduct) {
      setPublish(currentProduct?.publish);
    }
  }, [currentProduct]);


  useEffect(() => {
    if (currentProduct) {
      // Set initial form values
      methods.reset({
        name: currentProduct.name,
        price: currentProduct.price,
        description: currentProduct.description,
        // pdf: null,
        // audio: null,
      });

      // Set PDF file if exists
      if (currentProduct.pdfFile.name) {
        (async () => {
          try {
            const response = await fetch(currentProduct.pdfFile.url);
            const blob = await response.blob();
            const pdfFile = new File([blob], currentProduct.pdfFile.name, {
              type: 'application/pdf',
              lastModified: Date.now()
            });
            
            setPDFFile([pdfFile]);
          } catch (error) {
            console.error('Error loading PDF file:', error);
          }
        })();
      }

      if (currentProduct.audioFiles && currentProduct.audioFiles.length > 0) {
        (async () => {
          try {
            const audioFilesPromises = currentProduct.audioFiles!.map(async (audio) => {
              // Fetch the audio file from the URL
              const response = await fetch(audio.url);
              const blob = await response.blob();
              
              // Create a new File object with the actual file content
              return new File([blob], audio.name, {
                type: 'audio/*',
                lastModified: Date.now()
              });
            });

            // Wait for all audio files to be loaded
            const loadedAudioFiles = await Promise.all(audioFilesPromises);
            setAudioFiles(loadedAudioFiles);
          } catch (error) {
            console.error('Error loading audio files:', error);
          }
        })();
      }
    }
  }, [currentProduct, methods]);

  const handleDropPDFFile = useCallback(

    (acceptedFiles: File[]) => {
      const newFile = acceptedFiles[0];
      if (newFile) {

        const fileWithPreview = Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
          // size: newFile.size,
          // formattedSize: formatFileSize(newFile.size),
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
  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // First delete existing files and directory
      // await axios.post(`${HOST_API}${endpoints.deleteExistingFile}`, { id: currentProduct.id });

      const formData = new FormData();

      // Append basic fields
      formData.append('id', currentProduct.id);
      formData.append('name', data.name);
      formData.append('price', data.price.toString());
      formData.append('description', data.description);
      formData.append('publish', publish);

      // Handle PDF file
      if (pdfFile.length > 0 && pdfFile[0] instanceof File) {
        formData.append('pdf', pdfFile[0]);
      }



      // Handle audio files
      audioFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append('audio', file);
        }
      });

      const response = await axios.post(`${HOST_API}${endpoints.update}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      enqueueSnackbar(response.data.message, { variant: 'success' });
      router.push(paths.dashboard.admin.product.root);
    } catch (error) {
      console.error('Upload error:', error);
      enqueueSnackbar(error.response?.data?.message || 'Error updating product', { variant: 'error' });
    }
  });

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
            <RHFTextField name="price" label="" type="number" />
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
              onClick={() => { }}
            >
              Reset
            </Button>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              color="success"
              variant="contained"
              loading={isSubmitting}
              startIcon={<Iconify icon="material-symbols:save" />}
            >
              Save
            </LoadingButton>
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Product',
              href: paths.dashboard.admin.product.root,
            },
            { name: currentProduct?.name },
          ]}
          sx={{
            mb: { xs: 1, md: 1 },
          }}
        />

        <ProductDetailsToolbar
          backLink={paths.dashboard.admin.product.root}
          editLink={paths.dashboard.admin.product.edit(`${currentProduct?.id}`)}
          liveLink={paths.product.details(`${currentProduct?.id}`)}
          publish={publish || ''}
          onChangePublish={handleChangePublish}
          publishOptions={PRODUCT_PUBLISH_OPTIONS}
        />
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            {renderDetails}
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}


