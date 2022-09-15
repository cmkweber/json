// Package imports
import {JsonAny} from './Any';
import {Json, JsonInput, JsonOutput, JsonValue} from './Json';
import {JsonOptional} from './Optional';
import {JsonRequired} from './Required';

// Object types
type RequiredKeys<T extends JsonObjectSchema> = Exclude<{[K in keyof T]:T[K] extends JsonRequired<any, JsonValue> ? K : never}[keyof T], undefined>;
type OptionalKeys<T extends JsonObjectSchema> = Exclude<{[K in keyof T]:T[K] extends JsonOptional<any> ? K : never}[keyof T], undefined>;
export type JsonObjectInput<T extends JsonObjectSchema> = {[K in RequiredKeys<T>]:JsonInput<T[K]>} & {[K in OptionalKeys<T>]?:JsonInput<T[K]>};
export type JsonObjectUpdate<T extends JsonObjectSchema> = {[K in RequiredKeys<T>]?:JsonInput<T[K]>} & {[K in OptionalKeys<T>]?:JsonInput<T[K]>|undefined};
export type JsonObjectOutput<T extends JsonObjectSchema> = {[K in RequiredKeys<T>]:JsonOutput<T[K]>} & {[K in OptionalKeys<T>]?:JsonOutput<T[K]>};
export type JsonObjectSchema = Record<string, Json<any, JsonValue>>;

// Object class
export class JsonObject<
	S extends JsonObjectSchema = JsonObjectSchema,
	I extends JsonObjectInput<S> = JsonObjectInput<S>,
	O extends {[key:string]:JsonValue} = JsonObjectOutput<S>
> extends JsonRequired<I, O>
{
	// Object members
	readonly schema:S|undefined;

	// Object constructor
	constructor(schema?:S, value?:I)
	{
		// Acquire the specified value or create an empty object
		const values:I = value !== undefined ? value : {} as I;

		// If a value wasnt specified, and a schema was, loop through keys and add to object
		if(value === undefined && schema !== undefined)
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
					values[key as keyof I] = json.value;
			}
		}

		// Call creation on json
		super(values);

		// Store the specified schema
		this.schema = schema;

		// If a value was specified, attempt to validate it
		if(value !== undefined)
			this.validate();
	}

	// Function to validate the objects value
	protected validate():void
	{
		// If the object doesnt have a schema, return early
		if(this.schema === undefined)
			return;

		// Acquire the schemas keys
		const keys:Array<string> = Object.keys(this.schema);

		// Loop through schema keys and validate
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key and json
			const key:string = keys[k];
			const json:Json<any, JsonValue> = this.schema[key as keyof S];

			// Attempt to set this key
			try
			{
				// If the json is required, or the key exists, attempt to set it
				if(json instanceof JsonRequired || key in this.value)
					json.set(this.value[key as keyof I]);
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
		// Acquire the current value
		const current:I = {...this.value};

		// Create an empty object to store values
		const values:I = {} as I;

		// Create an any to parse values
		const any:JsonAny = new JsonAny();

		// Determine if the object has a schema
		const hasSchema:boolean = this.schema !== undefined;

		// Acquire the specified keys
		const keys:Array<string> = Object.keys(value);

		// Loop through keys and attempt to update
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key and json
			const key:string = keys[k];
			const json:Json<any, JsonValue> = hasSchema ? this.schema![key as keyof S] : any;

			// If the object doesnt have a schema, or the json is optional, and the key was specified as undefined, remove it from current and skip it
			if((!hasSchema || json instanceof JsonOptional) && key in value && value[key as keyof JsonObjectUpdate<S>] === undefined)
			{
				// Remove key from current value and skip it
				delete current[key as keyof I];
				continue;
			}

			// Attempt to set json
			json.set(value[key as keyof JsonObjectUpdate<S>]);

			// Add json to object
			values[key as keyof I] = json.value;
		}

		// Set the specified value
		this.set({...current, ...values});
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt an object, throw error
		if(typeof value !== 'object')
			throw new Error('Invalid type');

		// Create an empty object to store values
		const values:I = {} as I;

		// Create an any to parse values
		const any:JsonAny = new JsonAny();

		// Determine if the object has a schema
		const hasSchema:boolean = this.schema !== undefined;

		// Acquire the keys based on whether theres a schema or not
		const keys:Array<string> = Object.keys(hasSchema ? this.schema : value);

		// Loop through keys and attempt to parse
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key and json
			const key:string = keys[k];
			const json:Json<any, JsonValue> = hasSchema ? this.schema![key as keyof S] : any;

			// If the object has a schema, determine if the json is required
			if(hasSchema)
			{
				// If the json is required, and this key wasnt specified, throw error
				if(json instanceof JsonRequired && (!(key in value) || value[key] === undefined))
					throw new Error('Missing key "' + key + '"');
			}

			// If the objects key wasnt defined, skip it
			if(value[key] === undefined)
				continue;

			// Attempt to parse json
			try
			{
				// Attempt to parse json
				json.parse(value[key]);

				// Add json to object
				values[key as keyof I] = json.value;
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

		// Set the specified value
		this.set(values);
	}

	// Function to serialize the objects value
	serialize():O
	{
		// Create an empty object to store serialized values
		const serialized:O = {} as O;

		// Create an any to parse values
		const any:JsonAny = new JsonAny();

		// Determine if the object has a schema
		const hasSchema:boolean = this.schema !== undefined;

		// Acquire the objects keys
		const keys:Array<string> = Object.keys(this.value);

		// Loop through keys and serialize
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key and json
			const key:string = keys[k];
			const json:Json<any, JsonValue> = hasSchema ? this.schema![key as keyof S] : any;

			// Attempt to set json
			json.set(this.value[key as keyof I]);

			// Add serialized value to serialized object
			serialized[key as keyof O] = json.serialize() as O[keyof O];
		}

		// Return success
		return serialized;
	}
}