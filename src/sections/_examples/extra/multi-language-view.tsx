'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import { CardContent } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';

import { fData, fNumber, fPercent, fCurrency, fShortenNumber } from 'src/utils/format-number';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';

// ----------------------------------------------------------------------

export default function MultiLanguageView() {
  const { t, onChangeLang } = useTranslate();

  const { allLangs, currentLang } = useLocales();

  const [mounted, setMounted] = useState(false);

  const [page, setPage] = useState(2);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => setMounted(true), []);

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    []
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  return (
    <>
      <ComponentHero>
        <CustomBreadcrumbs
          heading="Multi Language"
          links={[
            {
              name: 'Components',
              href: paths.components,
            },
            { name: 'Multi Language' },
          ]}
          moreLink={[
            'https://react.i18next.com',
            'https://mui.com/guides/localization/#main-content',
          ]}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Grid container spacing={5} disableEqualOverflow>
          <Grid xs={12} md={4}>
            <Card>
              <CardHeader title="Langs" />

              <Box sx={{ p: 3 }}>
                <RadioGroup
                  value={currentLang.value}
                  onChange={(event) => onChangeLang(event.target.value)}
                >
                  {allLangs.map((lang) => (
                    <FormControlLabel
                      key={lang.label}
                      value={lang.value}
                      label={lang.label}
                      control={<Radio />}
                    />
                  ))}
                </RadioGroup>
              </Box>
            </Card>
          </Grid>

          <Grid xs={12} md={8}>
            <Stack spacing={5}>
              <Card>
                <CardHeader title="Flexible" />

                <CardContent component={Stack} spacing={3}>
                  <Stack direction="row" alignItems="center" sx={{ typography: 'h3' }}>
                    <Iconify icon={currentLang.icon} width={32} sx={{ mr: 1, borderRadius: 1 }} />
                    {mounted && t('demo.title')}
                  </Stack>

                  <Typography>
                    Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
                    hymenaeos. Praesent ac massa at ligula laoreet iaculis. Vivamus in erat ut urna
                    cursus vestibulum.
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="System (MUI)" sx={{ pb: 2 }} />

                <CardContent
                  component={Stack}
                  sx={{
                    mx: 3,
                    borderRadius: 2,
                    typography: 'body2',
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                    border: (theme) => `dashed 1px ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ typography: 'subtitle2' }}>Supports other components including:</Box>
                  <Box component="ul" sx={{ pl: 3 }}>
                    <Box component="li"> Data Grid</Box>
                    <Box component="li"> Date Pickers</Box>
                  </Box>
                </CardContent>

                <TablePagination
                  component="div"
                  count={100}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>

              <Card>
                <CardHeader title="Numbers" sx={{ pb: 2 }} />

                <CardContent
                  component={Stack}
                  spacing={3}
                  sx={{
                    mx: 3,
                    mb: 3,
                    borderRadius: 2,
                    typography: 'body2',
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                    border: (theme) => `dashed 1px ${theme.palette.divider}`,
                  }}
                >
                  <Stack spacing={0.5}>
                    <Box sx={{ typography: 'subtitle2' }}>Currency</Box>
                    {[2217.01, 247598.18, 677606.08, 4734447.51, 8471442.09].map((numb) => (
                      <Box key={numb}>
                        <Box component="span" sx={{ color: 'text.primary' }}>
                          {numb}
                        </Box>
                        <Box component="span" sx={{ color: 'text.secondary' }}>
                          {' => '} {fCurrency(numb)}
                        </Box>
                      </Box>
                    ))}
                  </Stack>

                  <Stack spacing={0.5}>
                    <Box sx={{ typography: 'subtitle2' }}>Percent</Box>
                    {[1.7, 17.67, 28.1, 41.3, 91.16].map((numb) => (
                      <Box key={numb}>
                        <Box component="span" sx={{ color: 'text.primary' }}>
                          {numb}
                        </Box>
                        <Box component="span" sx={{ color: 'text.secondary' }}>
                          {' => '} {fPercent(numb)}
                        </Box>
                      </Box>
                    ))}
                  </Stack>

                  <Stack spacing={0.5}>
                    <Box sx={{ typography: 'subtitle2' }}>Shorten</Box>
                    {[719, 719.63, 3683.72, 5583407.51, 3345583407.51].map((numb) => (
                      <Box key={numb}>
                        <Box component="span" sx={{ color: 'text.primary' }}>
                          {numb}
                        </Box>
                        <Box component="span" sx={{ color: 'text.secondary' }}>
                          {' => '} {fShortenNumber(numb)}
                        </Box>
                      </Box>
                    ))}
                  </Stack>

                  <Stack spacing={0.5}>
                    <Box sx={{ typography: 'subtitle2' }}>Data</Box>

                    {[356, 356.56, 3826.63, 7536340.92, 5679332343.62, 75344386390.46].map(
                      (numb) => (
                        <Box key={numb}>
                          <Box component="span" sx={{ color: 'text.primary' }}>
                            {numb}
                          </Box>
                          <Box component="span" sx={{ color: 'text.secondary' }}>
                            {' => '} {fData(numb)}
                          </Box>
                        </Box>
                      )
                    )}
                  </Stack>

                  <Stack spacing={0.5}>
                    <Box sx={{ typography: 'subtitle2' }}>Number</Box>

                    {[451, 451.82, 1081.62, 27921.9, 600668.81, 7587054.86].map((numb) => (
                      <Box key={numb}>
                        <Box component="span" sx={{ color: 'text.primary' }}>
                          {numb}
                        </Box>
                        <Box component="span" sx={{ color: 'text.secondary' }}>
                          {' => '} {fNumber(numb)}
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
