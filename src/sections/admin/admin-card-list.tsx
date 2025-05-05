import Box from '@mui/material/Box';

import { IUserCard } from 'src/types/user';

import UserCard from './admin-card';

// ----------------------------------------------------------------------

type Props = {
  users: IUserCard[];
};

export default function AdminCardList({ users }: Props) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </Box>
  );
}
