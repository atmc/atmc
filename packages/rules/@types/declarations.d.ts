declare type Value = string | number;
export declare type ValueArray = Value | Value[];
export declare const serialize: (property: string, value: ValueArray) => string;
export {};
