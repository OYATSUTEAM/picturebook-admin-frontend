'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';

import { MotivationIllustration } from 'src/assets/illustrations';
import {
  _mock,
  _ecommerceNewProducts,
  _ecommerceBestSalesman,
  _ecommerceSalesOverview,
  _ecommerceLatestProducts,
} from 'src/_mock';

import Iconify from 'src/components/iconify';
import Walktour, { useWalktour } from 'src/components/walktour';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';
import EcommerceWelcome from 'src/sections/overview/e-commerce/ecommerce-welcome';
import EcommerceNewProducts from 'src/sections/overview/e-commerce/ecommerce-new-products';
import EcommerceYearlySales from 'src/sections/overview/e-commerce/ecommerce-yearly-sales';
import EcommerceBestSalesman from 'src/sections/overview/e-commerce/ecommerce-best-salesman';
import EcommerceSaleByGender from 'src/sections/overview/e-commerce/ecommerce-sale-by-gender';
import EcommerceSalesOverview from 'src/sections/overview/e-commerce/ecommerce-sales-overview';
import EcommerceWidgetSummary from 'src/sections/overview/e-commerce/ecommerce-widget-summary';
import EcommerceLatestProducts from 'src/sections/overview/e-commerce/ecommerce-latest-products';
import EcommerceCurrentBalance from 'src/sections/overview/e-commerce/ecommerce-current-balance';

// ----------------------------------------------------------------------

export default function WalktourView() {
  const theme = useTheme();

  const walktour = useWalktour({
    defaultRun: true,
    showProgress: true,
    steps: [
      {
        target: '#demo__1',
        title: 'Step 1',
        disableBeacon: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna
            dolor sagittis lacus.
          </Typography>
        ),
      },
      {
        target: '#demo__2',
        title: 'Step 2',
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.secondary' }}>
              Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin
              urna dolor sagittis lacus.
            </Typography>
            <Box component="img" alt="cover" src={_mock.image.cover(3)} sx={{ borderRadius: 2 }} />
          </Stack>
        ),
      },
      {
        target: '#demo__3',
        title: 'Step 3',
        placement: 'bottom',
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.secondary' }}>Weekly magic on your inbox</Typography>
            <TextField
              variant="filled"
              fullWidth
              label="Email"
              placeholder="example@gmail.com"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button color="inherit" sx={{ mr: -0.75 }}>
                      Send
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        ),
      },
      {
        target: '#demo__4',
        title: 'Step 4',
        placement: 'left',
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.secondary' }}>
              Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin
              urna dolor sagittis lacus.
            </Typography>
            <Stack
              component={Paper}
              variant="outlined"
              divider={<Divider sx={{ borderStyle: 'dashed' }} />}
            >
              {[
                { label: 'Wi-Fi', icon: 'solar:home-wifi-bold-duotone', defaultChecked: true },
                {
                  label: 'Bluetooth',
                  icon: 'solar:bluetooth-square-bold-duotone',
                  defaultChecked: true,
                },
                { label: 'Airbuds', icon: 'solar:airbuds-bold-duotone', defaultChecked: false },
                { label: 'Alarm', icon: 'solar:alarm-bold-duotone', defaultChecked: false },
              ].map((option) => (
                <ListItem key={option.label}>
                  <Iconify width={26} icon={option.icon} sx={{ color: 'text.secondary', mr: 2 }} />
                  <Box
                    component="span"
                    id={`switch-list-label-${option.label}`}
                    sx={{ typography: 'subtitle2', flexGrow: 1 }}
                  >
                    {option.label}
                  </Box>
                  <Switch
                    color="default"
                    defaultChecked={option.defaultChecked}
                    edge="end"
                    inputProps={{
                      'aria-labelledby': `switch-list-label-${option.label}`,
                    }}
                  />
                </ListItem>
              ))}
            </Stack>
          </Stack>
        ),
      },
      {
        target: '#demo__5',
        title: 'Step 5',
        placement: 'left',
        showProgress: false,
        styles: {
          options: {
            arrowColor: theme.palette.grey[900],
          },
          tooltip: {
            width: 480,
            backgroundColor: theme.palette.grey[900],
          },
          tooltipTitle: {
            color: theme.palette.common.white,
          },
          buttonBack: {
            color: theme.palette.common.white,
          },
          buttonNext: {
            marginLeft: theme.spacing(1.25),
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
          },
        },
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.disabled' }}>
              Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin
              urna dolor sagittis lacus.
            </Typography>
            <Box
              sx={{
                gap: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
              }}
            >
              {[...Array(6)].map((_, index) => (
                <Box
                  key={index}
                  component="img"
                  alt="cover"
                  src={_mock.image.cover(index)}
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Box>
          </Stack>
        ),
      },
    ],
  });

  return (
    <>
      <Walktour
        continuous
        showProgress
        showSkipButton
        disableOverlayClose
        steps={walktour.steps}
        run={walktour.run}
        callback={walktour.onCallback}
        getHelpers={walktour.setHelpers}
        scrollDuration={500}
      />

      <ComponentHero>
        <CustomBreadcrumbs
          heading="Walktour"
          links={[
            {
              name: 'Components',
              href: paths.components,
            },
            { name: 'Walktour' },
          ]}
          moreLink={['https://docs.react-joyride.com/']}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Stack alignItems="flex-end" sx={{ mb: 5 }}>
          <Button
            size="large"
            variant="outlined"
            onClick={() => window.location.reload()}
            startIcon={<Iconify icon="solar:restart-bold" />}
          >
            Reload
          </Button>
        </Stack>

        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <EcommerceWelcome
              id="demo__1"
              title={`Congratulations! \n Jaydon Frankie`}
              description="Best seller of the month You have done 57.6% more sales today."
              img={<MotivationIllustration />}
              action={
                <Button variant="contained" color="primary">
                  Go Now
                </Button>
              }
            />
          </Grid>

          <Grid xs={12} md={4}>
            <EcommerceNewProducts id="demo__2" list={_ecommerceNewProducts} />
          </Grid>

          <Grid xs={12} md={4}>
            <EcommerceWidgetSummary
              title="Product Sold"
              percent={2.6}
              total={765}
              chart={{
                series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
              }}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <EcommerceWidgetSummary
              id="demo__3"
              title="Total Balance"
              percent={-0.1}
              total={18765}
              chart={{
                colors: [theme.palette.info.light, theme.palette.info.main],
                series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
              }}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <EcommerceWidgetSummary
              title="Sales Profit"
              percent={0.6}
              total={4876}
              chart={{
                colors: [theme.palette.warning.light, theme.palette.warning.main],
                series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <EcommerceSaleByGender
              title="Sale By Gender"
              total={2324}
              chart={{
                series: [
                  { label: 'Mens', value: 44 },
                  { label: 'Womens', value: 75 },
                ],
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <EcommerceYearlySales
              id="demo__4"
              title="Yearly Sales"
              subheader="(+43%) than last year"
              chart={{
                categories: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                series: [
                  {
                    year: '2019',
                    data: [
                      {
                        name: 'Total Income',
                        data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                      },
                      {
                        name: 'Total Expenses',
                        data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                      },
                    ],
                  },
                  {
                    year: '2020',
                    data: [
                      {
                        name: 'Total Income',
                        data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                      },
                      {
                        name: 'Total Expenses',
                        data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                      },
                    ],
                  },
                ],
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <EcommerceSalesOverview title="Sales Overview" data={_ecommerceSalesOverview} />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <EcommerceCurrentBalance
              title="Current Balance"
              currentBalance={187650}
              sentAmount={25500}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <EcommerceBestSalesman
              title="Best Salesman"
              tableData={_ecommerceBestSalesman}
              tableLabels={[
                { id: 'name', label: 'Seller' },
                { id: 'category', label: 'Product' },
                { id: 'country', label: 'Country', align: 'center' },
                { id: 'totalAmount', label: 'Total', align: 'right' },
                { id: 'rank', label: 'Rank', align: 'right' },
              ]}
            />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <EcommerceLatestProducts
              id="demo__5"
              title="Latest Products"
              list={_ecommerceLatestProducts}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
