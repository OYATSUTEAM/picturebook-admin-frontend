import { memo } from 'react';

import Stack from '@mui/material/Stack';

// import NavList from './nav-list';
import { NavProps, NavGroupProps } from '../types';
import NavList from 'src/layouts/main/nav/mobile/nav-list';

// ----------------------------------------------------------------------

function NavSectionMini({ data, slotProps, ...other }: NavProps) {
  return (
    <Stack component="nav" id="nav-section-mini" spacing={`${slotProps?.gap || 4}px`} {...other}>
      {data.map((group, index) => (
         <NavList 
                  key={group.title} 
                  data={{
                    title: group.title,
                    path: group.path,
                    icon: group.icon
                  }}
                />
      ))}
    </Stack>
  );
}

export default memo(NavSectionMini);

// ----------------------------------------------------------------------

// function Group({ items, slotProps }: NavGroupProps) {
//   return (
//     <>
//       {items.map((list) => (
//         <NavList key={list.title} data={list} depth={1} slotProps={slotProps} />
//       ))}
//     </>
//   );
// }
