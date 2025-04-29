import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';

import { fShortenNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type ItemProps = {
  id: string;
  name: string;
  android: number;
  windows: number;
  apple: number;
  flag: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: ItemProps[];
}

export default function AppTopInstalledCountries({ title, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          {list.map((country) => (
            <CountryItem key={country.id} country={country} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type CountryItemProps = {
  country: ItemProps;
};

function CountryItem({ country }: CountryItemProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" flexGrow={1} sx={{ minWidth: 120 }}>
        <Iconify icon={country.flag} sx={{ borderRadius: 0.65, width: 28, mr: 1 }} />

        <Typography variant="subtitle2" noWrap>
          {country.name}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" sx={{ minWidth: 80 }}>
        <Iconify
          width={14}
          icon="ant-design:android-filled"
          sx={{ mr: 0.5, color: 'text.disabled' }}
        />
        <Typography variant="body2">{fShortenNumber(country.android)}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" sx={{ minWidth: 80 }}>
        <Iconify icon="mingcute:windows-fill" width={14} sx={{ mr: 0.5, color: 'text.disabled' }} />
        <Typography variant="body2">{fShortenNumber(country.windows)}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" sx={{ minWidth: 80 }}>
        <Iconify icon="mingcute:apple-fill" width={14} sx={{ mr: 0.5, color: 'text.disabled' }} />
        <Typography variant="body2">{fShortenNumber(country.windows)}</Typography>
      </Stack>
    </Stack>
  );
}
