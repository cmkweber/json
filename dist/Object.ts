// Package imports
import {Json, JsonInfer, JsonValue} from './Json';
import {JsonOptional} from './Optional';
import {JsonRequired} from './Required';

// Object types
type Schema = Record<string, Json>;
type Keys<T extends Schema> = Extract<keyof T, string>;
type RequiredKeys<T extends Schema> = Exclude<{[K in keyof T]:T[K] extends Exclude<T[keyof T], undefined> ? K : never}[keyof T], undefined>;
type OptionalKeys<T extends Schema> = Exclude<{[K in keyof T]:T[K] extends Exclude<T[keyof T], undefined> ? never : K}[keyof T], undefined>;
type Restricted<T extends Schema> = {[K in RequiredKeys<T>]:JsonRequired} & {[K in OptionalKeys<T>]?:JsonOptional};
type Value<T extends Schema> = {[K in keyof T]:JsonInfer<T[K]>};
type Update<T extends Schema> = {[K in RequiredKeys<T>]?:JsonInfer<T[K]>} & {[K in OptionalKeys<T>]?:JsonInfer<T[K]>|undefined};

// Object class
export class JsonObject<T extends Schema & Restricted<T>> extends JsonRequired
{
	// Object constructor
	constructor(readonly schema:Required<T>, value?:Value<T>)
	{
		// Call creation on json
		super();

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to get the objects value
	get():Value<T>
	{
		// Set the object to empty by default
		const value:{[key:string]:JsonValue} = {};

		// Acquire the schemas keys
		const keys:Array<Keys<T>> = Object.keys(this.schema) as Array<Keys<T>>;

		// Loop through schema and collect parameters
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key and json
			const key:keyof T = keys[k];
			const json:Json = this.schema[key];

			// If the json isnt optional, or it has been defined, add it to object
			if(!(json instanceof JsonOptional) || json.defined)
				value[key as string] = json.get();
		}

		// Return success
		return JSON.parse(JSON.stringify(value));
	}

	// Function to set the objects value
	set(value:Value<T>):void
	{
		// Acquire the schemas keys
		const keys:Array<Keys<T>> = Object.keys(this.schema) as Array<Keys<T>>;

		// Loop through schema and attempt to set
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key and json
			const key:keyof T = keys[k];
			const json:Json = this.schema[key];

			// If the json is optional, and the key isnt within specified object, clear it and skip it
			if(json instanceof JsonOptional && !(key in value))
			{
				// Clear optional and skip it
				json.clear();
				continue;
			}

			// Attempt to set the specified objects key
			try {
				json.set(value[key]); }
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
		// Acquire the current value
		const current:Value<T> = this.get();

		// Acquire the schemas keys
		const keys:Array<Keys<T>> = Object.keys(this.schema) as Array<Keys<T>>;

		// Loop through schema and remove optional undefines
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key and json
			const key:keyof T = keys[k];
			const json:Json = this.schema[key];

			// If the json is optional, and was specified as undefined, remove it from current and specified object
			if(json instanceof JsonOptional && key in value && value[key as keyof Update<T>] == undefined)
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

		// Acquire the schemas keys
		const keys:Array<Keys<T>> = Object.keys(this.schema) as Array<Keys<T>>;

		// Loop through schema and attempt to parse
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key and json
			const key:keyof T = keys[k];
			const json:Json = this.schema[key];

			// If the json is required, determine if it was specified
			if(json instanceof JsonRequired)
			{
				// If the key is not within specified object, throw error
				if(!(key in value) || value[key] == undefined)
					throw new Error('Missing key ' + key.toString());
			}
			// Else, if the json is optional, and was specified as undefined, remove it
			else if(json instanceof JsonOptional && key in value && value[key] == undefined)
				delete value[key];
		}

		// Set the specified value
		this.set(value);
	}
}