import { ISiteUser } from '@pnp/sp/site-users';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';
export interface IToDoListAppProps {
  listTitle: string;
  absoluteUrl: string;
  heightWebPart: string;
  user: ISiteUserInfo;
}
