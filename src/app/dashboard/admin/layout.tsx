
'use client';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

export default function Layout({ children }: Props) {
    return (
        <RoleBasedGuard roles={['admin']} hasContent={true}>
            {children}
        </RoleBasedGuard>
    );
}
