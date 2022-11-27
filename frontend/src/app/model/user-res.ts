export interface UserRes {
  state: 'success' | 'taken' | 'failed' | 'wrong';
  username?: string;
  pass?: string;
  token?: string;
  adminLevel?: 0 | 1 | 2 | 3 | 4;
}
