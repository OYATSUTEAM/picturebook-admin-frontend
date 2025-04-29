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






export default function ProductNewEditForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const preview = useBoolean();

  const [audioFiles, setAudioFiles] = useState<(File)[]>([]);
  const [pdfFile, setPDFFile] = useState<(File)[]>([]);


  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    // pdf: Yup.mixed().required((value) => value instanceof File),
    pdf: Yup.mixed()
      .nullable()
      .test('file', 'PDF is required', (value) => value instanceof File),
    audio: Yup.mixed()
      .nullable()
      .test('file', 'Audio is required', (value) => value instanceof File),
  });



  type FormValues = {
    name: string;
    description: string;
    pdf: File | null;
    audio: File | null;
  };
  const methods = useForm<FormValues>({
    resolver: yupResolver(NewProductSchema as any),
    defaultValues: {
      name: '',
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



  // const handleRemoveAudioFile = (inputFile: File | string) => {
  //   const filesFiltered = audioFiles.filter((fileFiltered) => fileFiltered !== inputFile);
  //   setAudioFiles(filesFiltered);
  // };
  // const handleRemovePDFFile = (inputFile: File | string) => {
  //   setPDFFile([]);
  // };

  // const handleRemoveAllFiles = () => {
  //   setAudioFiles([]);
  // };



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
      formData.append('description', data.description);
      const filename: any = await axios.post(`${HOST_API}${endpoints.filename}`, { name: data.name });
      console.log(filename)
      if (filename.status == 200) {
        const response = await axios.post(`${HOST_API}${endpoints.upload}`, formData);
        enqueueSnackbar(response.data.message, { variant: 'success' });
      }
      else {
        // enqueueSnackbar(filename.response.data.message, { variant: 'success' });
      }
      router.push(paths.dashboard.product.root);
    } catch (error) {
      console.error('Upload error:', error);
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
  });

  const renderDetails = (
    <Grid xs={12} md={8}>
      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField name="name" label="Product Name" />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Content</Typography>
            <RHFEditor simple name="description" />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">PDF</Typography>
            <CardContent>
              <Upload
                multiple={true}
                thumbnail={preview.value}
                files={pdfFile}
                accept={{ 'application/pdf': [] }}
                onDrop={handleDropPDFFile}
                onRemove={handleRemovePDFFile}
              />
            </CardContent>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Audio</Typography>
            <CardContent>
              <Upload
                multiple
                thumbnail={preview.value}
                files={audioFiles}
                accept={{ 'audio/*': ['*.mp3', '*.m4a', '*.wav', '*.wma'] }}
                onDrop={handleDropMultiAudioFile}
                onRemove={handleRemoveAudioFile}
                onRemoveAll={handleRemoveAllFiles}
              />
            </CardContent>
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

