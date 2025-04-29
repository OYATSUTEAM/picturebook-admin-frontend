'use client';

import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';

import Textfields from './textfield';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'outlined',
    label: 'Outlined',
    component: <Textfields variant="outlined" />,
  },
  {
    value: 'filled',
    label: 'Filled',
    component: <Textfields variant="filled" />,
  },
  {
    value: 'standard',
    label: 'Standard',
    component: <Textfields variant="standard" />,
  },
];

// ----------------------------------------------------------------------

export default function TextfieldView() {
  const [currentTab, setCurrentTab] = useState('outlined');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <>
      <ComponentHero>
        <CustomBreadcrumbs
          heading="Textfield"
          links={[
            {
              name: 'Components',
              href: paths.components,
            },
            { name: 'Textfield' },
          ]}
          moreLink={['https://mui.com/components/text-fields']}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Tabs value={currentTab} onChange={handleChangeTab}>
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        <form noValidate autoComplete="off">
          {TABS.map(
            (tab) =>
              tab.value === currentTab && (
                <Box key={tab.value} sx={{ mt: 5 }}>
                  {tab.component}
                </Box>
              )
          )}
        </form>
      </Container>
    </>
  );
}
