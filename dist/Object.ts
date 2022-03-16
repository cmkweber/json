// Package imports
import {Json, JsonInfer} from './Json';

// Object types
type Schema<T extends {[key:string]:Json}> = Required<{[K in keyof T]:T[K]}>;
type Value<T extends {[key:string]:Json}> = {[K in keyof T]:JsonInfer<T[K]>};

// Object class
export class JsonObject<T extends {[key:string]:Json} = {}> extends Json<Value<T>>
{
	// Object constructor
	constructor(readonly schema:Schema<T>, value?:Value<T>)
	{
		// Call creation on json
		super();

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to set the objects value
	override set(value:Value<T>):void
	{
		// Acquire the schemas keys
		const keys:Array<string> = Object.keys(this.schema);

		// Loop through specified objects keys and attempt to set
		for(const key in value)
		{
			// Acquire the index of specified key within schema
			const index:number = keys.indexOf(key);

			// If the specified objects key isnt within schema, delete and skip it
			if(index == -1)
			{
				// Delete key and skip it
				delete value[key];
				continue;
			}

			// Acquire this json
			const json:Json = this.schema[key];

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

			// Remove key from keys
			keys.splice(index, 1);
		}

		// If there are keys remaining, throw error
		if(keys.length > 0)
			throw new Error('Missing keys ' + keys.join(', ')); /* */

		// Call set on json
		super.set(value);
	}

	// Function to update the objects value
	update(value:Partial<Value<T>>):void { this.set({...this.get(), ...value}); }

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt an object, throw error
		if(typeof value != 'object')
			throw new Error('Invalid type');

		// Set the specified value
		this.set(value);
	}
}