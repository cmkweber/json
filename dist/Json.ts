// Package imports
import {JsonArray} from './Array';
import {JsonBoolean} from './Boolean';
import {JsonNull} from './Null';
import {JsonNumber} from './Number';
import {JsonObject} from './Object';
import {JsonRequired} from './Required';
import {JsonString} from './String';

// Json types
export type JsonInfer<T extends Json> = T extends {get(): infer U} ? U : never;
export type JsonValue = Array<JsonValue> | boolean | null | number | {[key:string]:JsonValue} | string;

// Json class
export abstract class Json
{
	// Function to get the jsons value
	abstract get():JsonValue;

	// Function to set the jsons value
	abstract set(value:JsonValue):void;

	// Function to parse the specified value
	abstract parse(value:any):void;

	// Function to parse the specified value
	static parse(value:any):JsonRequired
	{
		// Set the json to null by default
		let json:JsonRequired;

		// If the specified value is a boolean, set the json to boolean
		if(typeof value == 'boolean')
			json = new JsonBoolean();
		// Else, if the specified value is a null, set the json to null
		else if(typeof value == null)
			json = new JsonNull();
		// Else, if the specified value is a number, set the json to number
		else if(typeof value == 'number')
			json = new JsonNumber();
		// Else, if the specified value is an object, set the json to array or object
		else if(typeof value == 'object')
			json = Array.isArray(value) ? new JsonArray() : new JsonObject();
		// Else, if the specified value is a string, set the json to string
		else if(typeof value == 'string')
			json = new JsonString();
		// Else, throw error
		else
			throw new Error('Invalid type');

		// Attempt to parse the specified value
		json.parse(value);

		// Return success
		return json;
	}
}