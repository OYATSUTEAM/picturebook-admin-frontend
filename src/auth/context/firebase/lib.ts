import { initializeApp } from 'firebase/app';

import { FIREBASE_API } from 'src/config-global';

// ----------------------------------------------------------------------

export const firebaseApp = initializeApp(FIREBASE_API);
