export interface UserRes {
  state: 'success'|'taken'|'failed'|'wrong',
  id?: number,
  username?: string,
  pass?: string,
  token?:string
}
