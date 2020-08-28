/* eslint-disable @typescript-eslint/ban-types */
export type Entry<T> = { [U in keyof T]: [U, T[U]] }[keyof T];

export type Exclusive<T> = _Exclusive<T>;

type _Exclusive<T, U extends keyof T = keyof T> = U extends {}
  ? { [V in U]: T[U] } & { [V in Exclude<keyof T, U>]?: never }
  : never;
