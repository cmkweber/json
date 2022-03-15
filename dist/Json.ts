// Json types
export type Json = JsonArray | JsonBoolean | JsonNull | JsonNumber | JsonObject | JsonString;
export type JsonArray = Array<Json>;
export type JsonBoolean = boolean;
export type JsonNull = null;
export type JsonNumber = number;
export type JsonObject = {[key:string]: Json};
export type JsonString = string;