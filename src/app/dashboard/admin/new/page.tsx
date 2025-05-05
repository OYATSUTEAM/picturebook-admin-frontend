import { UserCreateView } from 'src/sections/user/view';
import { AdminCreateView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Create a new user',
};

export default function UserCreatePage() {
  return <UserCreateView />;
}
