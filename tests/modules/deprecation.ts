// Not deprecated

export interface NotDeprecatedInterface {
  notDeprecatedProperty: string;
  notDeprecatedMethod(): void;
}

export type NotDeprecatedType = {
  notDeprecatedProperty: string;
  notDeprecatedMethod(): void;
};

export class NotDeprecatedClass {
  static notDeprecatedStaticMethod(): void {}
  notDeprecatedProperty: string;
  get notDeprecatedGetter(): string {
    return "";
  }
  set notDeprecatedSetter(value: string) {}
  notDeprecatedMethod(): void {}
}

export enum NotDeprecatedEnum {
  NotDeprecatedMember = 1,
}

export const notDeprecatedVariable = {};

export function notDeprecatedFunction(): void {}

// Deprecated

/** @deprecated Don't use this */
export interface DeprecatedInterface {
  notDeprecatedProperty: string;
  notDeprecatedMethod(): void;
}

/** @deprecated Don't use this */
export type DeprecatedType = {
  notDeprecatedProperty: string;
  notDeprecatedMethod(): void;
};

/** @deprecated Don't use this */
export class DeprecatedClass {
  static notDeprecatedStaticMethod(): void {}
  notDeprecatedProperty: string;
  get notDeprecatedGetter(): string {
    return "";
  }
  set notDeprecatedSetter(value: string) {}
  notDeprecatedMethod(): void {}
}

/** @deprecated Don't use this */
export enum DeprecatedEnum {
  NotDeprecatedMember = 1,
}

/** @deprecated Don't use this */
export const deprecatedVariable = {};

/** @deprecated Don't use this */
export function deprecatedFunction(): void {}

// Some deprecated

export interface SomeDeprecatedInterface {
  /** @deprecated Don't use this */
  deprecatedProperty: string;
  notDeprecatedProperty: string;
  /** @deprecated Don't use this */
  deprecatedMethod(): void;
  notDeprecatedMethod(): void;
}

export type SomeDeprecatedType = {
  /** @deprecated Don't use this */
  deprecatedProperty: string;
  notDeprecatedProperty: string;
  /** @deprecated Don't use this */
  deprecatedMethod(): void;
  notDeprecatedMethod(): void;
};

export class SomeDeprecatedClass {
  /** @deprecated Don't use this */
  static deprecatedStaticMethod(): void {}
  static notDeprecatedStaticMethod(): void {}
  /** @deprecated Don't use this */
  deprecatedProperty: string;
  notDeprecatedProperty: string;
  /** @deprecated Don't use this */
  get deprecatedGetter(): string {
    return "";
  }
  get notDeprecatedGetter(): string {
    return "";
  }
  /** @deprecated Don't use this */
  set deprecatedSetter(value: string) {}
  set notDeprecatedSetter(value: string) {}
  /** @deprecated Don't use this */
  deprecatedMethod(): void {}
  notDeprecatedMethod(): void {}
}

export enum SomeDeprecatedEnum {
  /** @deprecated Don't use this */
  DeprecatedMember = 1,
  NotDeprecatedMember = 2,
}

// Some deprecated signatures

export class DeprecatedSignatureClass {
  static deprecatedSignatureStaticMethod(value: number): void;
  /** @deprecated Don't use this */
  static deprecatedSignatureStaticMethod(value: string): void;
  static deprecatedSignatureStaticMethod(value: any): void {}
  deprecatedSignatureMethod(value: number): void;
  /** @deprecated Don't use this */
  deprecatedSignatureMethod(value: string): void;
  deprecatedSignatureMethod(value: any): void {}
}

export function deprecatedSignatureFunction(value: number): void;
/** @deprecated Don't use this */
export function deprecatedSignatureFunction(value: string): void;
export function deprecatedSignatureFunction(value: any): void {}

// Deprecated constructor

export class DeprecatedConstructorClass {
  /** @deprecated Don't use this */
  constructor() {}
}

export class DeprecatedConstructorSignatureClass {
  constructor(value: number);
  /** @deprecated Don't use this */
  constructor(value: string);
  constructor(value: any) {}
}
