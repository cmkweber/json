// Package imports
import {JsonAny} from './Any';
import {Json, JsonInfer, JsonValue} from './Json';
import {JsonOptional} from './Optional';
import {JsonRequired} from './Required';

// Object types
type Schema<T extends Record<keyof T, Json<JsonValue>> = Record<string, Json<JsonValue>>> = Record<keyof T, Json<JsonValue>>;
type Keys<T extends Schema<T>> = Extract<keyof T, string>;
type RequiredKeys<T extends Schema<T>> = Exclude<{[K in keyof T]:T[K] extends Exclude<T[keyof T], undefined> ? K : never}[keyof T], undefined>;
type OptionalKeys<T extends Schema<T>> = Exclude<{[K in keyof T]:T[K] extends Exclude<T[keyof T], undefined> ? never : K}[keyof T], undefined>;
type Restricted<T extends Schema<T>> = {[K in RequiredKeys<T>]:JsonRequired<JsonValue>} & {[K in OptionalKeys<T>]?:JsonOptional};
type Value<T extends Schema<T>> = {[K in keyof T]:JsonInfer<T[K]>};
type Update<T extends Schema<T>> = {[K in RequiredKeys<T>]?:JsonInfer<T[K]>} & {[K in OptionalKeys<T>]?:JsonInfer<T[K]>|undefined};

// Object class
export class JsonObject<T extends Restricted<T> = Record<string, JsonRequired<JsonValue>> & Record<string, JsonOptional>> extends JsonRequired<Value<T>>
{
	// Object members
	#value:Value<T> = {} as Value<T>;

	// Object constructor
	constructor(readonly schema?:Required<Schema<T>>, value?:Value<T>)
	{
		// Call creation on json
		super();

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to get the objects value
	get():Value<T> { return this.#value; }

	// Function to set the objects value
	set(value:Value<T>):void
	{
		// Set the object to empty by default
		this.#value = {} as Value<T>;

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
				const json:Json<JsonValue> = this.schema != undefined ? this.schema[key] : new JsonAny();

				// If the object has a schema, and the json is optional, and the key wasnt specified, skip it
				if(this.schema != undefined && json instanceof JsonOptional && !(key in value))
					continue;

				// Attempt to parse the specified objects key
				json.parse(value[key]);

				// Set the specified key
				this.#value[key] = json.get() as JsonInfer<T[typeof key]>;
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
		// Acquire the current value
		const current:Value<T> = this.get();

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