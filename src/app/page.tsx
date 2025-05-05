'use client';

import { GuestGuard } from 'src/auth/guard';
import AuthClassicLayout from 'src/layouts/auth/classic';
import AuthModernLayout from 'src/layouts/auth/modern';
import AuthModernCompactLayout from 'src/layouts/auth/modern-compact';
import { FirebaseLoginView } from 'src/sections/auth/firebase';
import { JwtLoginView } from 'src/sections/auth/jwt';
import OverviewAppPage from './dashboard/page';
import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function HomePage() {
  return <>
    <GuestGuard>
      < HomeView />;
    </GuestGuard>
  </>
}
