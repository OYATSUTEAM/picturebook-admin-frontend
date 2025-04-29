'use client';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';

import BasicTable from './basic-table';
import CollapsibleTable from './collapsible-table';
import ComponentBlock from '../../component-block';
import SortingSelectingTable from './sorting-selecting-table';
import GroupingFixedHeaderTable from './grouping-fixed-header-table';

// ----------------------------------------------------------------------

export default function TableView() {
  return (
    <>
      <ComponentHero>
        <CustomBreadcrumbs
          heading="Table"
          links={[
            {
              name: 'Components',
              href: paths.components,
            },
            { name: 'Table' },
          ]}
          moreLink={['https://mui.com/components/tables']}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Stack spacing={3}>
          <ComponentBlock>
            <Card sx={{ width: 1 }}>
              <CardHeader title="Basic Table" />
              <BasicTable />
            </Card>
          </ComponentBlock>

          <ComponentBlock>
            <Card sx={{ width: 1 }}>
              <SortingSelectingTable />
            </Card>
          </ComponentBlock>

          <ComponentBlock>
            <Card sx={{ width: 1 }}>
              <CardHeader title="Grouping & FixedHeader" />
              <GroupingFixedHeaderTable />
            </Card>
          </ComponentBlock>

          <ComponentBlock>
            <Card sx={{ width: 1 }}>
              <CardHeader title="Collapsible Table" />
              <CollapsibleTable />
            </Card>
          </ComponentBlock>
        </Stack>
      </Container>
    </>
  );
}
