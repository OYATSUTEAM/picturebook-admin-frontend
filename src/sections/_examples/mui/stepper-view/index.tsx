'use client';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';

import ComponentBlock from '../../component-block';
import CustomizedStepper from './customized-steppers';
import VerticalLinearStepper from './vertical-linear-stepper';
import HorizontalLinearStepper from './horizontal-linear-stepper';
import LinearAlternativeLabel from './linear-alternative-label-stepper';

// ----------------------------------------------------------------------

export default function StepperView() {
  return (
    <>
      <ComponentHero>
        <CustomBreadcrumbs
          heading="Stepper"
          links={[
            {
              name: 'Components',
              href: paths.components,
            },
            { name: 'Stepper' },
          ]}
          moreLink={['https://mui.com/components/steppers']}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Stack spacing={3}>
          <ComponentBlock title="Horizontal Linear Stepper">
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                width: 1,
              }}
            >
              <HorizontalLinearStepper />
            </Paper>
          </ComponentBlock>

          <ComponentBlock title="Linear Alternative Label">
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                width: 1,
              }}
            >
              <LinearAlternativeLabel />
            </Paper>
          </ComponentBlock>

          <ComponentBlock title="Vertical Linear Stepper">
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                width: 1,
              }}
            >
              <VerticalLinearStepper />
            </Paper>
          </ComponentBlock>

          <ComponentBlock title="Customized Stepper">
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                width: 1,
              }}
            >
              <CustomizedStepper />
            </Paper>
          </ComponentBlock>
        </Stack>
      </Container>
    </>
  );
}
