export interface UserRes {
  state: 'success'|'taken'|'failed'|'wrong',
  username?: string,
  pass?: string,
  token?:string
}
