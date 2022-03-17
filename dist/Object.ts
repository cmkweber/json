// Package imports
import {Json, JsonInfer} from './Json';
import {JsonOptional} from './Optional';

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
		// Acquire the specified objects keys
		const keys:Array<string> = Object.keys(value);

		// Loop through specified objects keys and attempt to set
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key and json
			const key:string = keys[k];
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
		}

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

		// Acquire the schema and specified objects keys
		const schemaKeys:Array<string> = Object.keys(this.schema);
		const valueKeys:Array<string> = Object.keys(value);

		// Loop through specified objects keys and remove unknown keys
		for(let k:number = 0; k < valueKeys.length; k++)
		{
			// Acquire this key and property
			const key:string = valueKeys[k];
			const property:any = value[key];

			// Acquire the index of key within schema
			const index:number = schemaKeys.indexOf(key);

			// If the key isnt within schema, delete it
			if(index == -1)
				delete value[key];
			// Else, 
			else
			{
				// If the property is invalid, delete it
				if(property == undefined)
					delete value[key];

				// Remove key from schema keys
				schemaKeys.splice(index, 1);
			}
		}

		// Loop through remaining schema keys and determine if theyre optional
		for(let k:number = 0; k < schemaKeys.length; k++)
		{
			// Acquire this key and json
			const key:string = schemaKeys[k];
			const json:Json = this.schema[key];

			// If the json isnt optional, throw error
			if(!(json instanceof JsonOptional))
				throw new Error('Missing ' + key);
		}

		// Set the specified value
		this.set(value);
	}
}