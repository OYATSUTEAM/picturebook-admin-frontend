import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FileThumbnail from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IFile, IFileManager } from 'src/types/file';

import FileManagerShareDialog from './file-manager-share-dialog';
import FileManagerFileDetails from './file-manager-file-details';
import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { Chip, colors } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

type Props = {
  row: IFile;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function FileManagerTableRow({ row, selected, onSelectRow, onDeleteRow }: Props) {
  const theme = useTheme();

  // const { name, size, type, modifiedAt, purchased, isFavorited } = row;
  const { name, price, size, modifiedAt, publishOptions, purchased, publish, onChangePublish } = row;

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  // const favorite = useBoolean(isFavorited);

  const details = useBoolean();

  const share = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });

  const handleCopy = useCallback(() => {
    enqueueSnackbar('Copied!');
    copy(row.url);
  }, [copy, enqueueSnackbar, row.url]);

  const defaultStyles = {
    borderTop: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
  };

  return (
    <>
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: theme.customShadows.z20,
            },
          },
          [`& .${tableCellClasses.root}`]: {
            ...defaultStyles,
          },
          ...(details.value && {
            [`& .${tableCellClasses.root}`]: {
              ...defaultStyles,
            },
          }),
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onDoubleClick={() => console.info('ON DOUBLE CLICK')}
            onClick={onSelectRow}
          />
        </TableCell>

        <TableCell onClick={handleClick}>
          {/* <Link component={RouterLink} href={paths.dashboard.admin.product.edit(row.id)} variant="subtitle2"> */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail file={'folder'} sx={{ width: 36, height: 36 }} />
            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {name}
            </Typography>
          </Stack>
          {/* </Link> */}
        </TableCell>

        <TableCell align="center" onClick={()=>{}} sx={{ whiteSpace: 'nowrap' }}>
          {/* {price == 0 ? 'free' : price} */}
          <Chip color={price !== 0 ? 'success' : 'error'} label={price == 0 ? 'free' : `${price} 円 `} size="medium" variant="soft" />
        </TableCell>

        <TableCell align="center" onClick={()=>{}} sx={{ whiteSpace: 'nowrap' }}>
          {/* {fData(size)} */}
          {size} Mb
        </TableCell>

        <TableCell align="center" onClick={()=>{}} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(modifiedAt)}
            secondary={fTime(modifiedAt)}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell align="center" onClick={()=>{}}>
          {purchased.length}
        </TableCell>

        <TableCell align="center" onClick={()=>{}} sx={{ whiteSpace: 'nowrap' }}>

          <Chip color={publish == 'published' ? 'success' : 'error'} label={publish} size="medium" variant="soft" />

        </TableCell>


        <TableCell align="center"
          sx={{
            px: 1,
            whiteSpace: 'nowrap',
          }}
        >
          <IconButton color={confirm.value == true ? 'default' : 'error'} onClick={confirm.onTrue}>
            <Iconify icon="ic:baseline-delete" />
          </IconButton>
        </TableCell>


        <TableCell align="center"
          sx={{
            px: 1,
            whiteSpace: 'nowrap',
          }}
        >
          <Link component={RouterLink} href={paths.dashboard.admin.product.edit(row.id)} variant="subtitle2">
            <IconButton color={confirm.value == true ? 'default' : 'error'} >
              <Iconify icon="ri:edit-fill" />
            </IconButton>
          </Link>
        </TableCell>

      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {publishOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === publish}
            onClick={() => {
              popover.onClose();
              onChangePublish(option.value);
            }}
          >
            {option.value === 'published' && <Iconify icon="eva:cloud-upload-fill" />}
            {option.value === 'draft' && <Iconify icon="solar:file-text-bold" />}
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
      <FileManagerFileDetails
        item={row}
        // favorited={favorite.value}
        // onFavorite={favorite.onToggle}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
