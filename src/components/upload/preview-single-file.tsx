import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Image from '../image';
import { fData } from 'src/utils/format-number';
import { fileData } from '../file-thumbnail';

// ----------------------------------------------------------------------

type Props = {
  imgUrl?: string;
  file?: File | string;
};

export default function SingleFilePreview({ imgUrl = '', file }: Props) {
  // const { size = 0 } = file ? fileData(file) : {};
  console.log(imgUrl)
  return (
    <Box
      sx={{
        p: 1,
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        alt="file preview"
   
        src={imgUrl}
        sx={{
          width: 1,
          height: 1,
          borderRadius: 1,
        }}
      />
      {/* {size > 0 && (
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            color: 'text.secondary',
          }}
        >
          {fData(size)}
        </Typography>
      )} */}
    </Box>
  );
}
