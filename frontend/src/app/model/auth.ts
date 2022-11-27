export interface Auth {
  username?: string;
  pass?: string;
  passHash?: string;
  token?: string;
  adminLevel?: 0 | 1 | 2 | 3 | 4;
}
