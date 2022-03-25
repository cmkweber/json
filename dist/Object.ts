// Package imports
import {JsonAny} from './Any';
import {Json, JsonInfer} from './Json';
import {JsonOptional} from './Optional';
import {JsonRequired} from './Required';

// Object types
type Schema<T extends Record<keyof T, Json> = Record<string, Json>> = Record<keyof T, Json>;
type Keys<T extends Schema<T>> = Extract<keyof T, string>;
type RequiredKeys<T extends Schema<T>> = Exclude<{[K in keyof T]:T[K] extends Exclude<T[keyof T], undefined> ? K : never}[keyof T], undefined>;
type OptionalKeys<T extends Schema<T>> = Exclude<{[K in keyof T]:T[K] extends Exclude<T[keyof T], undefined> ? never : K}[keyof T], undefined>;
type Restricted<T extends Schema<T>> = {[K in RequiredKeys<T>]:JsonRequired} & {[K in OptionalKeys<T>]?:JsonOptional};
type Value<T extends Schema<T>> = {[K in keyof T]:JsonInfer<T[K]>};
type Update<T extends Schema<T>> = {[K in RequiredKeys<T>]?:JsonInfer<T[K]>} & {[K in OptionalKeys<T>]?:JsonInfer<T[K]>|undefined};

// Object class
export class JsonObject<T extends Restricted<T> = Record<string, JsonRequired> & Record<string, JsonOptional>> extends JsonRequired<Value<T>>
{
	// Object members
	readonly schema:Required<Schema<T>>|undefined;

	// Object constructor
	constructor(schema?:Required<Schema<T>>)
	{
		// Set the object to empty by default
		const value:Value<T> = {} as Value<T>;

		// If a schema was specified, loop through keys and add to object
		if(schema != undefined)
		{
			// Acquire the schemas keys
			const keys:Array<Keys<T>> = Object.keys(schema) as Array<Keys<T>>;

			// Loop through keys and add to object
			for(let k:number = 0; k < keys.length; k++)
			{
				// Acquire this key and json
				const key:keyof T = keys[k];
				const json:Json = schema[key];

				// If this json is required, add it to object
				if(json instanceof JsonRequired)
					value[key] = json.get();
			}
		}

		// Call creation on json
		super(value);

		// Store the specified schema
		this.schema = schema;
	}

	// Function to set the specified value
	override set(value:Value<T>) { super.set({...value}); }

	// Function to validate the specified object
	validate(value:Value<T>):void
	{
		// Acquire the keys based on whether theres a schema or not
		const keys:Array<Keys<T>> = Object.keys(this.schema != undefined ? this.schema : value) as Array<Keys<T>>;

		// Loop through keys and attempt to parse
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key
			const key:keyof T = keys[k];

			// Attempt to parse the specified objects key
			try
			{
				// Acquire this json
				const json:Json = this.schema != undefined ? this.schema[key] : new JsonAny();

				// If the object doesnt have a schema, or the json is required, or the key was specified, attempt to parse it
				if(this.schema == undefined || json instanceof JsonRequired || key in value)
					json.parse(value[key]);
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
	update(value:Update<T>):void
	{
		// Acquire copies of the current value and specified value
		const current:Value<T> = {...this.get()};
		value = {...value};

		// Acquire the keys based on whether theres a schema or not
		const keys:Array<Keys<T>> = Object.keys(this.schema != undefined ? this.schema : value) as Array<Keys<T>>;

		// Loop through keys and attempt to update
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key
			const key:keyof T = keys[k];

			// Determine if the key is optional or not
			const optional:boolean = this.schema == undefined || this.schema[key] instanceof JsonOptional;

			// If the key is optional, and was specified as undefined, remove it from current and specified object
			if(optional && key in value && value[key as keyof Update<T>] == undefined)
			{
				// Remove key from current and specified object
				delete current[key];
				delete value[key as keyof Update<T>];
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
		const values:Value<T> = {} as Value<T>;

		// Acquire the keys based on whether theres a schema or not
		const keys:Array<Keys<T>> = Object.keys(this.schema != undefined ? this.schema : value) as Array<Keys<T>>;

		// Loop through keys and attempt to parse
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key
			const key:keyof T = keys[k];

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
}