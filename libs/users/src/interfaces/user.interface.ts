import type { Role } from '@libs/common';

export interface User {
  id: string;
  email: string;
  roles: Role[];
}
