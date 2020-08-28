import * as Unist from "./unist";

interface Attributes {
  [x: string]: unknown;
}

interface Parent extends Unist.Parent {
  children: Node[];
}

interface Literal extends Unist.Literal {
  value: string;
}

export type Node = Element | Text | Comment | Doctype | Instruction | Cdata;

export interface Root extends Parent {
  type: "root";
}

export interface Element extends Parent {
  type: "element";
  name: string;
  attributes?: Attributes;
  children: (Element | Text | Comment | Instruction | Cdata)[];
}

export interface Text extends Literal {
  type: "text";
}

export interface Comment extends Literal {
  type: "comment";
}

export interface Doctype extends Unist.Node {
  type: "doctype";
  name: string;
  public?: string;
  system?: string;
}

export interface Instruction extends Literal {
  type: "instruction";
  name: string;
}

export interface Cdata extends Literal {
  type: "cdata";
}
