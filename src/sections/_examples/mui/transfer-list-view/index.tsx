'use client';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';

import ComponentBlock from '../../component-block';
import SimpleTransferList from './simple-transfer-list';
import EnhancedTransferList from './enhanced-transfer-list';

// ----------------------------------------------------------------------

export default function TransferListView() {
  return (
    <>
      <ComponentHero>
        <CustomBreadcrumbs
          heading="Transfer List"
          links={[
            {
              name: 'Components',
              href: paths.components,
            },
            { name: 'Transfer List' },
          ]}
          moreLink={['https://mui.com/components/transfer-list']}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Stack spacing={3}>
          <ComponentBlock title="Simple">
            <SimpleTransferList />
          </ComponentBlock>

          <ComponentBlock title="Enhanced">
            <EnhancedTransferList />
          </ComponentBlock>
        </Stack>
      </Container>
    </>
  );
}
