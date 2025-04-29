'use client';

import Card from '@mui/material/Card';
import Masonry from '@mui/lab/Masonry';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';

import TextMaxLine from 'src/components/text-max-line';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';

// ----------------------------------------------------------------------

export default function TextMaxLineView() {
  return (
    <>
      <ComponentHero>
        <CustomBreadcrumbs
          heading="TextMaxLine"
          links={[
            {
              name: 'Components',
              href: paths.components,
            },
            { name: 'TextMaxLine' },
          ]}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Masonry columns={3} spacing={3}>
          <Card>
            <CardHeader title="1 Line" />
            <CardContent>
              <TextMaxLine line={1}>
                Donec posuere vulputate arcu. Fusce vulputate eleifend sapien. Phasellus magna.
                Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Suspendisse faucibus, nunc
                et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id
                tortor.
              </TextMaxLine>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="2 Line" />
            <CardContent>
              <TextMaxLine>
                Donec posuere vulputate arcu. Fusce vulputate eleifend sapien. Phasellus magna.
                Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Suspendisse faucibus, nunc
                et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id
                tortor.
              </TextMaxLine>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="3 Line" />
            <CardContent>
              <TextMaxLine line={3}>
                Donec posuere vulputate arcu. Fusce vulputate eleifend sapien. Phasellus magna.
                Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Suspendisse faucibus, nunc
                et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id
                tortor.
              </TextMaxLine>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="4 Line" />
            <CardContent>
              <TextMaxLine line={4}>
                Donec posuere vulputate arcu. Fusce vulputate eleifend sapien. Phasellus magna.
                Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Suspendisse faucibus, nunc
                et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id
                tortor.
              </TextMaxLine>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="As Link" />
            <CardContent>
              <TextMaxLine asLink line={3} href="#" color="primary" sx={{ maxWidth: 300 }}>
                Donec posuere vulputate arcu. Fusce vulputate eleifend sapien. Phasellus magna.
                Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Suspendisse faucibus, nunc
                et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id
                tortor.
              </TextMaxLine>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Persistent" />
            <CardContent>
              <TextMaxLine persistent line={3} href="#" sx={{ bgcolor: 'background.neutral' }}>
                Donec posuere vulputate arcu.
              </TextMaxLine>
            </CardContent>
          </Card>
        </Masonry>
      </Container>
    </>
  );
}
