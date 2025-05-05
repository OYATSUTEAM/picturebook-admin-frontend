import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import { m, AnimatePresence } from 'framer-motion';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Drawer, { DrawerProps } from '@mui/material/Drawer';

import { useBoolean } from 'src/hooks/use-boolean';

import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import FileThumbnail, { fileFormat, fileData, fileThumb } from 'src/components/file-thumbnail';

import { IFile } from 'src/types/file';

import FileManagerShareDialog from './file-manager-share-dialog';
import { varFade } from '../../components/animate';

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: IFile;
  favorited?: boolean;
  //
  onFavorite?: VoidFunction;
  onCopyLink: VoidFunction;
  //
  onClose: VoidFunction;
  onDelete: VoidFunction;
};

export default function FileManagerFileDetails({
  item,
  open,
  favorited,
  //
  onFavorite,
  onCopyLink,
  onClose,
  onDelete,
  ...other
}: Props) {
  const { name, size, url, shared, modifiedAt, pdfFile, audioFiles, publish } = item;
  console.log(item, 'this is detail ')
  const hasShared = shared && !!shared.length;

  const toggleTags = useBoolean(true);

  const share = useBoolean();

  const properties = useBoolean(true);

  const [inviteEmail, setInviteEmail] = useState('');

  // const { key, pdfname = '', pdfsize = 0 } = fileData(file);
  // const [tags, setTags] = useState(item.tags.slice(0, 3));

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

  // const handleChangeTags = useCallback((newValue: string[]) => {
  //   setTags(newValue);
  // }, []);

  const renderTags = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Tags
        <IconButton size="small" onClick={toggleTags.onToggle}>
          <Iconify
            icon={toggleTags.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

    </Stack>
  );

  const renderProperties = (
    <Stack spacing={1.5}>

      <Typography variant="h6"> Info </Typography>
      
      {properties.value && (
        <>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Name
            </Box>
            {name}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Size
            </Box>
            {`${size} Mb`}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Modified
            </Box>
            {fDateTime(modifiedAt)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Publish
            </Box>
            <Chip color={publish == 'published' ? 'success' : 'error'} label={publish == 'published' ? 'publish' : 'draft'} size="small" variant="soft" />

            {/* {publish} */}
          </Stack>
        </>
      )}
    </Stack>
  );

  const renderPDF = (
    <>
      <Stack
        key={'pdfkey'}
        component={m.div}
        {...varFade().inUp}
        alignItems="center"
        display="flex"
        flexDirection={'row'}
        justifyContent="space-between"
        sx={{
          // m: 0.5,
          width: 'inherit',
          height: 60,
          padding: '0 20px',
          borderRadius: 1.25,
          overflow: 'hidden',
          position: 'relative',
          border: (theme) => `solid 1px ${theme.palette.grey[500]}`,
        }}
      >
        <div>

          <Box
            component="img"
            src={fileThumb('pdf')}
            sx={{
              width: 32,
              height: 32,
              flexShrink: 0,
            }}
          />
          <span >  {pdfFile.name}  </span>
        </div>
        <span>  {`${pdfFile.size}Mb`}  </span>
      </Stack>


    </>
  );
  const renderAudios = audioFiles?.map((audio, index) => (
    <Stack
      key={`key${index}`}
      component={m.div}
      {...varFade().inUp}
      alignItems="center"
      display="flex"
      flexDirection={'row'}
      justifyContent="space-between"
      sx={{
        // m: 0.5,
        width: 'inherit',
        height: 60,
        padding: '0 20px',
        borderRadius: 1.25,
        overflow: 'hidden',
        position: 'relative',
        border: (theme) => `solid 1px ${theme.palette.grey[500]}`,
      }}
    >
      <div>
        <Box
          component="img"
          src={fileThumb('audio')}
          sx={{
            width: 32,
            height: 32,
            flexShrink: 0,
          }}
        />
        <span>  {audio.name}  </span>
      </div>
      <span>  {`${audio.size}Mb`}  </span>
    </Stack>
  ));
  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 520 },
        }}
        {...other}
      >
        <Scrollbar sx={{ height: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
            <Typography variant="h6">Info</Typography>
          </Stack>

          <Stack
            spacing={1.5}
            justifyContent="center"
            sx={{
              p: 2.5,
              bgcolor: 'background.neutral',
            }}
          >
            <Stack
              spacing={1.5}
              justifyContent="space-between"
              direction="row"
              sx={{
                p: 2.5,
                bgcolor: 'background.neutral',
              }}
            >
              <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
                {name}
              </Typography>
              <Chip 
                color={publish === 'published' ? 'success' : 'error'} 
                label={publish === 'published' ? 'publish' : 'draft'} 
                size="medium" 
                variant="soft" 
              />
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderProperties}
            {renderPDF}
            {renderAudios}
          </Stack>
        </Scrollbar>

        {/* <Box sx={{ p: 2.5 }}>
          <Button
            fullWidth
            variant="soft"
            color="error"
            size="large"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={onDelete}
          >
            Delete
          </Button>
        </Box> */}
      </Drawer>

      <FileManagerShareDialog
        open={share.value}
        // shared={shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={onCopyLink}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />
    </>
  );
}
