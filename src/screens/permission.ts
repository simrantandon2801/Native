export type PermissionKey = 'viewing' | 'editing' | 'deleting' | 'getNotification';

export interface Permissions {
  viewing: boolean;
  editing: boolean;
  deleting: boolean;
  getNotification: boolean;
}

