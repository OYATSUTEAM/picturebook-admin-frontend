import React from 'react';
import { memo } from 'react';

import Stack from '@mui/material/Stack';
import { NavProps } from 'src/components/nav-section/types';
import NavList from 'src/layouts/main/nav/mobile/nav-list';

// ----------------------------------------------------------------------

function NavSectionVertical({ data }: NavProps) {
  return (
    <Stack component="nav" id="nav-section-vertical">
      {data.map((group) => (
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

export default memo(NavSectionVertical);

// ----------------------------------------------------------------------


// function Group({ title, path, icon, slotProps }: NavGroupProps) {
//   const [open, setOpen] = useState(true);
//   const handleToggle = useCallback(() => {
//     setOpen((prev) => !prev);
//   }, []);

//   return (
//     <Stack sx={{ px: 2 }}>
//       <NavItem
//         title={title}
//         path={path}
//         icon={icon}
//         // depth={1}
//         // active={true}
//         // open={open}
//         onClick={handleToggle}
//         {...slotProps}
//       />
//     </Stack>
//   );
// }
