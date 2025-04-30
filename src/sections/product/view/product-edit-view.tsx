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
import { Button, CardContent } from '@mui/material';
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

  const preview = useBoolean();

  const [audioFiles, setAudioFiles] = useState<(File)[]>([]);
  const [pdfFile, setPDFFile] = useState<(File)[]>([]);
  const { product: currentProduct } = useGetProduct(id);

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
      // Set initial form values
      methods.reset({
        name: currentProduct.name,
        price: currentProduct.price,
        description: currentProduct.description,
        pdf: null,
        audio: null,
      });

      // Set PDF file if exists
      if (currentProduct.pdfFile.name) {
        newPdfFile = {
          ...newPdfFile,
          name: currentProduct.pdfFile.name,
          size: currentProduct.pdfFile.size,
          // formattedSize: formatFileSize(currentProduct.pdfFile.size),
        };
        setPDFFile([newPdfFile]);
      }

      // Set audio files if exist
      if (currentProduct.audioFiles && currentProduct.audioFiles.length > 0) {
        const audioFiles = currentProduct.audioFiles.map((audio) => ({
          name: audio.name,
          preview: audio.url,
          lastModified: Date.now(),
          size: audio.size,
          type: 'audio/*',
        })) as unknown as File[];
        setAudioFiles(audioFiles);
      }
    }
  }, [currentProduct, methods]);

  const handleDropPDFFile = useCallback(
    
    (acceptedFiles: File[]) => {
      const newFile = acceptedFiles[0];
    console.log(acceptedFiles)
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

      console.log(acceptedFiles)
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
              Update
            </LoadingButton>
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );

  return (
    <>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Product',
            href: paths.dashboard.product.root,
          },
          { name: currentProduct?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {renderDetails}
        </Grid>
      </FormProvider>
    </>
  );
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

