'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useCallback, useState } from 'react';

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
import { createNewProduct } from 'src/api/product';
import { getPdfThumbnail } from 'src/utils/pdf-thumbnail';






export default function ProductNewEditForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();
  const [audioFiles, setAudioFiles] = useState<(File)[]>([]);
  const [pdfFile, setPDFFile] = useState<File | null>(null);
  const [animationFile, setAnimation] = useState<File | null>(null);
  const [animationThumbnail, setAnimationThumbnail] = useState<string | null>(null);
  const [pdfThumbnail, setPdfThumbnail] = useState<string | null>(null);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Price is required'),
    // description: Yup.string().required('Description is required'),
    pdf: Yup.mixed()
      .nullable()
      .test('file', 'PDF is required', (value) => value instanceof File),
    animation: Yup.mixed()
      .nullable()
      .test('file', 'Animation is required', (value) => value instanceof File),
    audio: Yup.mixed()
      .nullable()
      .test('file', 'Audio is required', (value) => value instanceof File),
  });



  type FormValues = {
    name: string;
    price: number;
    description: string;
    animation: File | null;
    pdf: File | null;
    audio: File | null;
  };
  const methods = useForm<FormValues>({
    resolver: yupResolver(NewProductSchema as any),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      animation: null,
      pdf: null,
      audio: null,
    },
  });


  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const handleDropAnimation = useCallback(
    (acceptedFiles: File[]) => {
      const newFile = acceptedFiles[0];
      if (newFile) {
        const fileWithPreview = Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        });
        setAnimation(fileWithPreview);
        setValue('animation', fileWithPreview, { shouldValidate: true });

        // Extract first frame
        const video = document.createElement('video');
        video.src = fileWithPreview.preview;
        video.crossOrigin = 'anonymous';
        video.currentTime = 0;
        video.muted = true;
        video.playsInline = true;

        video.addEventListener('loadeddata', () => {
          // Create a canvas to draw the frame
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageUrl = canvas.toDataURL('image/png');
            setAnimationThumbnail(imageUrl);
          }
        });
      }
    },
    [setValue]
  );

  const handleDropPDFFile = useCallback(
    async (acceptedFiles: File[]) => {
      const newFile = acceptedFiles[0];
      if (newFile) {
        const fileWithPreview = Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        });
        setPDFFile(fileWithPreview);
        setValue('pdf', fileWithPreview, { shouldValidate: true });

        // Generate PDF thumbnail
        // const thumb = await getPdfThumbnail(newFile);
        // setPdfThumbnail(thumb);
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
    setPDFFile(null);
    setValue('pdf', null, { shouldValidate: true });
  };

  const handleRemoveAnimation = () => {
    setAnimation(null);
    setValue('animation', null, { shouldValidate: true });
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
      if (animationFile) {
        formData.append('animation', animationFile as File);
      }
      if (pdfFile) {
        formData.append('pdf', pdfFile as File);
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
      if (filename.status === 200) {
        const result = await createNewProduct(formData);
        if (result.status === 200) {
          enqueueSnackbar('Product created successfully', { variant: 'success' });
          router.push(paths.dashboard.admin.product.root);
        }
      } else {
        enqueueSnackbar('Product name already exists', { variant: 'error' });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      enqueueSnackbar(error.response?.data?.message || 'An error occurred', { variant: 'error' });
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
            <RHFTextField name="price" label="" type='number' />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Content</Typography>
            <RHFEditor simple name="description" />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Animation</Typography>

            <Upload
              multiple={false}
              thumbnail={preview.value}
              thumbnailUrl={animationThumbnail || undefined}
              file={animationFile}
              accept={{ 'video/mp4': ['.mp4'] }}
              onDrop={handleDropAnimation}
              onRemove={() => {
                handleRemoveAnimation();
                setAnimationThumbnail(null);
              }}
            />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">PDF</Typography>

            <Upload
              multiple={false}
              thumbnail={preview.value}
              thumbnailUrl={pdfThumbnail || undefined}
              file={pdfFile}
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

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
      </Grid>
    </FormProvider>
  );
}

