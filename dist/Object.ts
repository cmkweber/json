// Package imports
import {JsonAny} from './Any';
import {Json, JsonInput, JsonOutput, JsonValue} from './Json';
import {JsonOptional} from './Optional';
import {JsonRequired} from './Required';

// Object types
type RequiredKeys<T extends JsonObjectSchema<T>> = Exclude<{[K in keyof T]:T[K] extends JsonRequired<any, JsonValue> ? K : never}[keyof T], undefined>;
type OptionalKeys<T extends JsonObjectSchema<T>> = Exclude<{[K in keyof T]:T[K] extends JsonOptional<any> ? K : never}[keyof T], undefined>;
export type JsonObjectInput<T extends JsonObjectSchema<T>> = {[K in RequiredKeys<T>]:JsonInput<T[K]>} & {[K in OptionalKeys<T>]?:JsonInput<T[K]>};
export type JsonObjectUpdate<T extends JsonObjectSchema<T>> = {[K in RequiredKeys<T>]?:JsonInput<T[K]>} & {[K in OptionalKeys<T>]?:JsonInput<T[K]>|undefined};
export type JsonObjectOutput<T extends JsonObjectSchema<T>> = {[K in RequiredKeys<T>]:JsonOutput<T[K]>} & {[K in OptionalKeys<T>]?:JsonOutput<T[K]>};
export type JsonObjectSchema<T extends Record<string, Json<any, JsonValue>>> = {[K in keyof T]:T[K]};
export type JsonObjectSchemaAny = Record<string, Json<any, JsonValue>>;

// Object class
export class JsonObject<
	S extends JsonObjectSchema<S> = JsonObjectSchemaAny,
	I extends JsonObjectInput<S> = JsonObjectInput<S>,
	O extends {[key:string]:JsonValue} = JsonObjectOutput<S>
> extends JsonRequired<I, O>
{
	// Object members
	readonly schema:S|undefined;

	// Object constructor
	constructor(schema?:S)
	{
		// Set the object to empty by default
		const value:I = {} as I;

		// If a schema was specified, loop through keys and add to object
		if(schema !== undefined)
		{
			// Acquire the schemas keys
			const keys:Array<string> = Object.keys(schema);

			// Loop through keys and add to object
			for(let k:number = 0; k < keys.length; k++)
			{
				// Acquire this key and json
				const key:string = keys[k];
				const json:Json<any, JsonValue> = schema[key as keyof S];

				// If this json is required, add it to object
				if(json instanceof JsonRequired)
					value[key as keyof I] = json.value;
			}
		}

		// Call creation on json
		super(value);

		// Store the specified schema
		this.schema = schema;
	}

	// Function to set the specified value
	override set(value:I) { super.set({...value}); }

	// Function to validate the objects value
	validate():void
	{
		// Acquire the keys based on whether theres a schema or not
		const keys:Array<string> = Object.keys(this.schema !== undefined ? this.schema : this.value);

		// Loop through keys and attempt to parse
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key
			const key:string = keys[k];

			// Attempt to parse the objects key
			try
			{
				// Acquire this json
				const json:Json<any, JsonValue> = this.schema !== undefined ? this.schema[key as keyof S] : new JsonAny();

				// If the object doesnt have a schema, or the json is required, or the key exists, attempt to parse it
				if(this.schema === undefined || json instanceof JsonRequired || key in this.value)
					json.parse(this.value[key as keyof I]);
			}
			// On error, rethrow it
			catch(error)
			{
				// If the error is an error, prepend key information
				if(error instanceof Error)
					error.message = '{' + key + '}: ' + error.message;

				// Rethrow error
				throw error;
			}
		}
	}

	// Function to update the objects value
	update(value:JsonObjectUpdate<S>):void
	{
		// Acquire copies of the current value and specified value
		const current:I = {...this.value};
		value = {...value};

		// Acquire the keys based on whether theres a schema or not
		const keys:Array<string> = Object.keys(this.schema !== undefined ? this.schema : value);

		// Loop through keys and attempt to update
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key
			const key:string = keys[k];

			// If the object has a schema, determine if the json is required
			if(this.schema !== undefined)
			{
				// Acquire this json
				const json:Json<any, JsonValue> = this.schema[key as keyof S];

				// If this json is required, skip it
				if(json instanceof JsonRequired)
					continue;
			}

			// If the key was specified as undefined, remove it from current and specified object
			if(key in value && value[key as keyof JsonObjectUpdate<S>] === undefined)
			{
				// Remove key from current and specified object
				delete current[key as keyof I];
				delete value[key as keyof JsonObjectUpdate<S>];
			}
		}

		// Set the specified value
		this.set({...current, ...value});
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt an object, throw error
		if(typeof value !== 'object')
			throw new Error('Invalid type');

		// Set the object to empty by default
		const values:I = {} as I;

		// Acquire the keys based on whether theres a schema or not
		const keys:Array<string> = Object.keys(this.schema !== undefined ? this.schema : value);

		// Loop through keys and attempt to parse
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key
			const key:string = keys[k];

			// If the object has a schema, determine if the json is required
			if(this.schema !== undefined)
			{
				// Acquire this json
				const json:Json<any, JsonValue> = this.schema[key as keyof S];

				// If the json is required, and this key wasnt specified, throw error
				if(json instanceof JsonRequired && (!(key in value) || value[key] === undefined))
					throw new Error('Missing key ' + key);
			}

			// If the objects key was defined, store it
			if(value[key] !== undefined)
				values[key as keyof I] = value[key];
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
		const keys:Array<string> = Object.keys(this.value);

		// Loop through keys and serialize
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key and json
			const key:string = keys[k];
			const json:Json<any, JsonValue> = this.schema !== undefined ? this.schema[key as keyof S] : new JsonAny();

			// Set json to this value
			json.set(this.value[key as keyof I]);

			// Add serialized value to serialized object
			serialized[key as keyof O] = json.serialize() as O[keyof O];
		}

		// Return success
		return serialized;
	}
}