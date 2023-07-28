import { User } from 'src/users/entities/user.entity';

export interface Database {
  users: User[];
}
