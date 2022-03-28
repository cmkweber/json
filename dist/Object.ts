// Package imports
import {JsonAny} from './Any';
import {Json, JsonInput, JsonOutput, JsonValue} from './Json';
import {JsonOptional} from './Optional';
import {JsonRequired} from './Required';

// Object types
type Schema<T extends Record<keyof T, Json<any, JsonValue>> = Record<string, Json<any, JsonValue>>> = Record<keyof T, Json<any, JsonValue>>;
type Keys<T extends Schema<T>> = Extract<keyof T, string>;
type RequiredKeys<T extends Schema<T>> = Exclude<{[K in keyof T]:T[K] extends Exclude<T[keyof T], undefined> ? K : never}[keyof T], undefined>;
type OptionalKeys<T extends Schema<T>> = Exclude<{[K in keyof T]:T[K] extends Exclude<T[keyof T], undefined> ? never : K}[keyof T], undefined>;
export type JsonObjectInput<T extends Schema<T>> = {[K in keyof T]:JsonInput<T[K]>};
export type JsonObjectUpdate<T extends Schema<T>> = {[K in RequiredKeys<T>]?:JsonInput<T[K]>} & {[K in OptionalKeys<T>]?:JsonInput<T[K]>|undefined};
export type JsonObjectOutput<T extends Schema<T>> = {[K in keyof T]:JsonOutput<T[K]>};
export type JsonObjectType<T extends Schema<T>> = {[K in RequiredKeys<T>]:JsonRequired<any, JsonValue>} & {[K in OptionalKeys<T>]?:JsonOptional<any>};
export type JsonObjectTypeAny = Record<string, JsonRequired<any, JsonValue>> & Record<string, JsonOptional<any>>;
export type JsonObjectSchema<T extends JsonObjectType<T>> = Required<Schema<T>>;

// Object class
export class JsonObject<I extends JsonObjectType<I> = JsonObjectTypeAny, O extends {[key:string]:JsonValue} = JsonObjectOutput<I>> extends JsonRequired<JsonObjectInput<I>, O>
{
	// Object members
	readonly schema:JsonObjectSchema<I>|undefined;

	// Object constructor
	constructor(schema?:JsonObjectSchema<I>)
	{
		// Set the object to empty by default
		const value:JsonObjectInput<I> = {} as JsonObjectInput<I>;

		// If a schema was specified, loop through keys and add to object
		if(schema != undefined)
		{
			// Acquire the schemas keys
			const keys:Array<Keys<I>> = Object.keys(schema) as Array<Keys<I>>;

			// Loop through keys and add to object
			for(let k:number = 0; k < keys.length; k++)
			{
				// Acquire this key and json
				const key:keyof I = keys[k];
				const json:Json<any, JsonValue> = schema[key];

				// If this json is required, add it to object
				if(json instanceof JsonRequired)
					value[key] = json.value;
			}
		}

		// Call creation on json
		super(value);

		// Store the specified schema
		this.schema = schema;
	}

	// Function to set the specified value
	override set(value:JsonObjectInput<I>) { super.set({...value}); }

	// Function to validate the objects value
	validate():void
	{
		// Acquire the keys based on whether theres a schema or not
		const keys:Array<Keys<I>> = Object.keys(this.schema != undefined ? this.schema : this.value) as Array<Keys<I>>;

		// Loop through keys and attempt to parse
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key
			const key:keyof I = keys[k];

			// Attempt to parse the objects key
			try
			{
				// Acquire this json
				const json:Json<any, JsonValue> = this.schema != undefined ? this.schema[key] : new JsonAny();

				// If the object doesnt have a schema, or the json is required, or the key exists, attempt to parse it
				if(this.schema == undefined || json instanceof JsonRequired || key in this.value)
					json.parse(this.value[key]);
			}
			// On error, rethrow it
			catch(error)
			{
				// If the error is an error, rethrow it with key information
				if(error instanceof Error)
					throw new Error('{' + key.toString() + '}: ' + error.message);
				// Else, rethrow error
				else
					throw error;
			}
		}
	}

	// Function to update the objects value
	update(value:JsonObjectUpdate<I>):void
	{
		// Acquire copies of the current value and specified value
		const current:JsonObjectInput<I> = {...this.value};
		value = {...value};

		// Acquire the keys based on whether theres a schema or not
		const keys:Array<Keys<I>> = Object.keys(this.schema != undefined ? this.schema : value) as Array<Keys<I>>;

		// Loop through keys and attempt to update
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key
			const key:keyof I = keys[k];

			// If the key is required, skip it
			if(this.schema != undefined && this.schema[key] instanceof JsonRequired)
				continue;

			// If the key was specified as undefined, remove it from current and specified object
			if(key in value && value[key as keyof JsonObjectUpdate<I>] == undefined)
			{
				// Remove key from current and specified object
				delete current[key];
				delete value[key as keyof JsonObjectUpdate<I>];
			}
		}

		// Set the specified value
		this.set({...current, ...value});
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt an object, throw error
		if(typeof value != 'object')
			throw new Error('Invalid type');

		// Set the object to empty by default
		const values:JsonObjectInput<I> = {} as JsonObjectInput<I>;

		// Acquire the keys based on whether theres a schema or not
		const keys:Array<Keys<I>> = Object.keys(this.schema != undefined ? this.schema : value) as Array<Keys<I>>;

		// Loop through keys and attempt to parse
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key
			const key:keyof I = keys[k];

			// If the object has a schema, and this key is required but not specified, throw error
			if(this.schema != undefined && this.schema[key] instanceof JsonRequired && (!(key in value) || value[key] == undefined))
				throw new Error('Missing key ' + key.toString());

			// If the objects key was defined, store it
			if(value[key] != undefined)
				values[key] = value[key];
		}

		// Set the specified value
		this.set(values);
	}

	// Function to serialize the objects value
	serialize():O
	{
		// Set the serialized object to empty by default
		const serialized:O = {} as O;

		// Acquire the objects keys
		const keys:Array<Keys<I>> = Object.keys(this.value) as Array<Keys<I>>;

		// Loop through keys and serialize
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key and json
			const key:keyof I = keys[k];
			const json:Json<any, JsonValue> = this.schema != undefined ? this.schema[key] : new JsonAny();

			// Set json to this value
			json.set(this.value[key]);

			// Add serialized value to serialized object
			serialized[key as keyof O] = json.serialize() as O[keyof O];
		}

		// Return success
		return serialized;
	}
}