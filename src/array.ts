export type Append<T, U extends unknown[]> = ((x: T, ...y: U) => void) extends (
  ...x: infer V
) => void
  ? V
  : never;

export type Unshift<T, U extends unknown[]> = ((
  x: T,
  ...y: U
) => void) extends (...x: infer U) => void
  ? U
  : never;

export type Shift<T extends unknown[]> = ((...x: T) => void) extends (
  x: T[0],
  ...y: infer U
) => void
  ? U
  : never;

export type Reverse<T extends unknown[]> = _Reverse<T, [], [], T["length"]>;

type _Reverse<
  From extends unknown[],
  To extends unknown[],
  Index extends unknown[],
  Limit extends number
> = {
  0: To;
  1: _Reverse<
    From,
    Unshift<From[Index["length"]], To>,
    Append<unknown, Index>,
    Limit
  >;
}[Index extends { length: Limit } ? 0 : 1];

export type Concat<T extends unknown[], U extends unknown[]> = Reverse<
  T
> extends infer V
  ? V extends unknown[]
    ? _Concat<V, U, [], T["length"]>
    : never
  : never;

type _Concat<
  From extends unknown[],
  To extends unknown[],
  Index extends unknown[],
  Limit extends number
> = {
  0: To;
  1: _Concat<
    From,
    Append<From[Index["length"]], To>,
    Append<unknown, Index>,
    Limit
  >;
}[Index extends { length: Limit } ? 0 : 1];
