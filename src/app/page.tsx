'use client';

import { GuestGuard } from 'src/auth/guard';
import { FirebaseLoginView } from 'src/sections/auth/firebase';

// ----------------------------------------------------------------------

export default function HomePage() {
  console.log('this is page ');
  return (
    <GuestGuard>
      <FirebaseLoginView />
    </GuestGuard>
  );
}
