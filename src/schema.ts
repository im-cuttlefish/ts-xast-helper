/* eslint-disable @typescript-eslint/ban-types */
import * as Xast from "./xast";
import * as Unist from "./unist";
import { Exclusive } from "./utils";
import { Append, Reverse, Concat } from "./array";

export type SchemaEntry = Omit<Xast.Element, "children" | "attributes"> & {
  attributes?: {
    [key: string]: unknown;
  };
  children: {
    mustElements?: string[];
  } & Exclusive<{
    allowedElements: string;
    deniedElements: string;
  }> &
    Exclusive<{
      allowedType: Exclude<Xast.Element["children"][number], Xast.Element>;
      deniedType: Exclude<Xast.Element["children"][number], Xast.Element>;
    }>;
};

export type Schema<T extends SchemaEntry> = {
  Parent: Unist.Parent & {
    children: Schema<T>["Node"][];
  };

  Literal: Unist.Literal & {
    value: string;
  };

  Node:
    | Schema<T>["Element"]
    | Xast.Text
    | Xast.Comment
    | Xast.Doctype
    | Xast.Instruction
    | Xast.Cdata;

  Root: Schema<T>["Parent"] & {
    type: "root";
  };

  Element: Element<T>;

  Text: Schema<T>["Literal"] & {
    type: "text";
  };

  Comment: Schema<T>["Literal"] & {
    type: "comment";
  };

  DocType: Schema<T>["Node"] & {
    type: "doctype";
    name: string;
    public?: string;
    system?: string;
  };

  Instruction: Schema<T>["Literal"] & {
    type: "instruction";
    name: string;
  };

  Cdata: Schema<T>["Literal"] & {
    type: "cdata";
  };
};

type Element<Set extends SchemaEntry> = _Element<Set>;

type _Element<
  Set extends SchemaEntry,
  _CopySet extends Set = Set
> = Set extends {} ? EachElement<Set, _CopySet> : never;

type EachElement<Target extends SchemaEntry, Set extends SchemaEntry> = Omit<
  Target,
  "children"
> & {
  children: Target["children"]["mustElements"] extends infer T
    ? T extends string[]
      ? Concat<MustElement<T, Set>, AcceptableChildren<Target, Set>>
      : AcceptableChildren<Target, Set>
    : never;
};

type MustElement<Target extends string[], Set extends SchemaEntry> = Reverse<
  Target
> extends infer T
  ? T extends string[]
    ? _MustElement<T, Set, [], [], Target["length"]>
    : never
  : never;

type _MustElement<
  Target extends string[],
  Set extends SchemaEntry,
  To extends Element<SchemaEntry>[],
  Index extends unknown[],
  Limit extends number
> = {
  0: To;
  1: _MustElement<
    Target,
    Set,
    Append<
      EachElement<Extract<Set, { name: Target[Index["length"]] }>, Set>,
      To
    >,
    Append<unknown, Index>,
    Limit
  >;
}[Index extends { length: Limit } ? 0 : 1];

type AcceptableChildren<
  Target extends SchemaEntry,
  Set extends SchemaEntry
> = _AcceptableChildren<Target, Set>;

type _AcceptableChildren<
  Target extends SchemaEntry,
  Set extends SchemaEntry,
  _CopySet extends Set = Set
> = Array<
  | ("allowedElements" extends keyof Target["children"]
      ? Extract<Element<Set>, { name: Target["children"]["allowedElements"] }>
      : never)
  | ("deniedElements" extends keyof Target["children"]
      ? Extract<
          Element<Set>,
          { name: Exclude<Set["name"], Target["children"]["deniedElements"]> }
        >
      : never)
  | ("allowedType" extends keyof Target["children"]
      ? Target["children"]["allowedType"]
      : never)
  | ("deniedType" extends keyof Target["children"]
      ? Exclude<
          Exclude<Xast.Element["children"][number], Xast.Element>,
          Target["children"]["deniedType"]
        >
      : never)
>;
