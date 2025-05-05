import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export const adminNavData = [
  { title: 'Dashboard', path: paths.dashboard.root, icon: <Iconify icon="material-symbols:dashboard" /> },

  { title: 'Account Manage', path: paths.dashboard.admin.list, icon: <Iconify icon="mdi:account-cog" /> },

  { title: 'Product Manage', path: paths.dashboard.admin.product.root, icon: <Iconify icon="simple-icons:bookstack" /> },
]

export const userNavData =
  [
    {
      title: 'Dashboard',
      path: paths.dashboard.root,
      icon: <Iconify icon="material-symbols:dashboard" />
    },
    {
      title: 'All Products',
      path: paths.dashboard.product.root,
      icon: <Iconify icon="ph:books-fill" />
    },
    {
      title: 'Paid Books',
      path: paths.dashboard.product.paid,
      icon: <Iconify icon="wpf:paid" />
    },
  ]



// export function useAdminNavData() {
//   const { t } = useTranslate();
// return {
//   [
//     { title: t('dashboard'), path: paths.dashboard.root, icon: ICONS.user },
//     { title: t('account manage'), path: paths.dashboard.admin.list, icon: ICONS.user },
//     { title: t('product manage'), path: paths.dashboard.admin.product.root, icon: ICONS.user },
//   ]
// }
//   const data = useMemo(
//     () => [

//       { title: t('dashboard'), path: paths.dashboard.root, icon: ICONS.user },
//       { title: t('account manage'), path: paths.dashboard.admin.list, icon: ICONS.user },
//       { title: t('product manage'), path: paths.dashboard.admin.product.root, icon: ICONS.user },

//     ],
//     [t]
//   );

//   return data;
// }

export const mobileAuthConfig = [
  {
    title: 'Login',
    icon: <Iconify icon="ic:baseline-login" />,
    path: paths.auth.login,
  },
  {
    title: 'Register',
    icon: <Iconify icon="hugeicons:registered" />,
    path: paths.auth.register,
  },
];


export function useUserNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      {
        title: t('all products'),
        path: paths.dashboard.product.root,
        icon: ICONS.product,
      },
      {
        title: t('paid books'),
        path: paths.dashboard.product.root,
        icon: ICONS.product,
      },
    ],
    [t]
  );

  return data;
}
