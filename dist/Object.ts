// Package imports
import {Json, JsonInfer, JsonValue} from './Json';
import {JsonOptional} from './Optional';
import {JsonRequired} from './Required';

// Object types
type RequiredKeys<T> = Exclude<{[K in keyof T]:T[K] extends Exclude<T[keyof T], undefined> ? K : never}[keyof T], undefined>;
type OptionalKeys<T> = Exclude<{[K in keyof T]:T[K] extends Exclude<T[keyof T], undefined> ? never : K}[keyof T], undefined>;
type Restricted<T extends Record<string, Json>> = {[K in RequiredKeys<T>]:JsonRequired} & {[K in OptionalKeys<T>]?:JsonOptional};
type Value<T extends Record<string, Json>> = {[K in keyof T]:JsonInfer<T[K]>};

// Object class
export class JsonObject<T extends Record<string, Json> & Restricted<T>> extends JsonRequired
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
		const keys:Array<string> = Object.keys(this.schema);

		// Loop through schemas keys and collect parameters
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key and json
			const key:string = keys[k];
			const json:Json = this.schema[key];

			console.log('key : ' + key + ' opt: ' + (json instanceof JsonOptional).toString() + ' def: ' + (!(json instanceof JsonOptional) || json.defined).toString() + ' val: ' + json.get());

			// If the json isnt optional, or it has been defined, add it to object
			if(!(json instanceof JsonOptional) || json.defined)
				value[key] = json.get();
		}

		// Return success
		return JSON.parse(JSON.stringify(value));
	}

	// Function to set the objects value
	set(value:Value<T>):void
	{
		// Loop through schema and attempt to set
		for(const key in this.schema)
		{
			// Acquire this json
			const json:Json = this.schema[key];

			console.log('key: ' + key + ' opt: ' + (json instanceof JsonOptional).toString() + ' spec: ' + (key in value).toString());

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
					throw new Error('{' + key + '}: ' + error.message);
				// Else, rethrow error
				else
					throw error;
			}
		}
	}

	// Function to update the objects value
	update(value:Partial<Value<T>>):void { this.set({...this.get(), ...value}); }

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt an object, throw error
		if(typeof value != 'object')
			throw new Error('Invalid type');

		// Loop through schema and attempt to parse
		for(const key in this.schema)
		{
			// Acquire this json
			const json:Json = this.schema[key];

			// If the json is required, determine if it was specified
			if(json instanceof JsonRequired)
			{
				// If the key is not within specified object, throw error
				if(!(key in value) || value[key] == undefined)
					throw new Error('Missing key ' + key);
			}
			// Else, if the json is optional, determine if it should be removed
			else if(json instanceof JsonOptional)
			{
				// If the key is within specified object, and its invalid, remove it
				if(key in value && value[key] == undefined)
					delete value[key];
			}
		}

		// Set the specified value
		this.set(value);
	}
}