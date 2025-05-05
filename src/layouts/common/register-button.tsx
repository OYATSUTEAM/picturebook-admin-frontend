import Button from '@mui/material/Button';
import { Theme, SxProps } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { PATH_AFTER_LOGIN } from 'src/config-global';
import { endpoints } from 'src/utils/axios';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export default function RegisterButton({ sx }: Props) {
  return (
    <Button component={RouterLink} href={paths.auth.register} variant="outlined" sx={{ mr: 1, ...sx }}>
      Register
    </Button>
  );
}
