// Not internal

export interface NotInternalInterface {
  notInternalProperty: string;
  notInternalMethod(): void;
}

export type NotInternalType = {
  notInternalProperty: string;
  notInternalMethod(): void;
};

export class NotInternalClass {
  static notInternalStaticMethod(): void {}
  notInternalProperty: string;
  get notInternalGetter(): string {
    return "";
  }
  set notInternalSetter(value: string) {}
  notInternalMethod(): void {}
}

export enum NotInternalEnum {
  NotInternalMember = 1,
}

export const notInternalVariable = {};

export function notInternalFunction(): void {}

// Internal

/** @internal */
export interface InternalInterface {
  notInternalProperty: string;
  notInternalMethod(): void;
}

/** @internal */
export type InternalType = {
  notInternalProperty: string;
  notInternalMethod(): void;
};

/** @internal */
export class InternalClass {
  static notInternalStaticMethod(): void {}
  notInternalProperty: string;
  get notInternalGetter(): string {
    return "";
  }
  set notInternalSetter(value: string) {}
  notInternalMethod(): void {}
}

/** @internal */
export enum InternalEnum {
  NotInternalMember = 1,
}

/** @internal */
export const internalVariable = {};

/** @internal */
export function internalFunction(): void {}

// Some internal

export interface SomeInternalInterface {
  /** @internal */
  internalProperty: string;
  notInternalProperty: string;
  /** @internal */
  internalMethod(): void;
  notInternalMethod(): void;
}

export type SomeInternalType = {
  /** @internal */
  internalProperty: string;
  notInternalProperty: string;
  /** @internal */
  internalMethod(): void;
  notInternalMethod(): void;
};

export class SomeInternalClass {
  /** @internal */
  static internalStaticMethod(): void {}
  static notInternalStaticMethod(): void {}
  /** @internal */
  internalProperty: string;
  notInternalProperty: string;
  /** @internal */
  get internalGetter(): string {
    return "";
  }
  get notInternalGetter(): string {
    return "";
  }
  /** @internal */
  set internalSetter(value: string) {}
  set notInternalSetter(value: string) {}
  /** @internal */
  internalMethod(): void {}
  notInternalMethod(): void {}
}

export enum SomeInternalEnum {
  /** @internal */
  InternalMember = 1,
  NotInternalMember = 2,
}

// Some internal signatures

export class InternalSignatureClass {
  static internalSignatureStaticMethod(value: number): void;
  /** @internal */
  static internalSignatureStaticMethod(value: string): void;
  static internalSignatureStaticMethod(value: any): void {}
  internalSignatureMethod(value: number): void;
  /** @internal */
  internalSignatureMethod(value: string): void;
  internalSignatureMethod(value: any): void {}
}

export function internalSignatureFunction(value: number): void;
/** @internal */
export function internalSignatureFunction(value: string): void;
export function internalSignatureFunction(value: any): void {}

// Internal constructor

export class InternalConstructorClass {
  /** @internal */
  constructor() {}
}

export class InternalConstructorSignatureClass {
  constructor(value: number);
  /** @internal */
  constructor(value: string);
  constructor(value: any) {}
}
