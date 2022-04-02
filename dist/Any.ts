// Package imports
import {JsonArray} from './Array';
import {JsonBoolean} from './Boolean';
import {JsonValue} from './Json';
import {JsonNull} from './Null';
import {JsonNumber} from './Number';
import {JsonObject} from './Object';
import {JsonRequired} from './Required';
import {JsonString} from './String';

// Any class
export class JsonAny extends JsonRequired<JsonValue, JsonValue>
{
	// Any constructor
	constructor(value?:JsonValue)
	{
		// Call creation on json
		super(value !== undefined ? value : null);

		// Attempt to validate any
		this.validate();
	}

	// Function to validate the anys value
	protected validate():void {}

	// Function to parse the specified value
	parse(value:any):void
	{
		// Set the json to null by default
		let json:JsonRequired<JsonValue, JsonValue>;

		// If the specified value is a boolean, set the json to boolean
		if(typeof value === 'boolean')
			json = new JsonBoolean();
		// Else, if the specified value is a number, set the json to number
		else if(typeof value === 'number')
			json = new JsonNumber();
		// Else, if the specified value is an object, set the json to array, null, or object
		else if(typeof value === 'object')
		{
			// If the specified value is a null, set the json to null
			if(value === null)
				json = new JsonNull();
			// Else, set the json to array or object
			else
				json = Array.isArray(value) ? new JsonArray() : new JsonObject();
		}
		// Else, if the specified value is a string, set the json to string
		else if(typeof value === 'string')
			json = new JsonString();
		// Else, throw error
		else
			throw new Error('Invalid type');

		// Attempt to parse the specified value
		json.parse(value);

		// Set the specified value
		this.set(json.value);
	}

	// Function to serialize the anys value
	serialize():JsonValue { return this.value; }

	// Function to return whether the specified values are equivalent or not
	static equivalent(first:JsonValue, second:JsonValue):boolean
	{
		// If the specified values are booleans, return whether they are equivalent
		if(typeof first === 'boolean' && typeof second === 'boolean')
			return first === second;
		// Else, if the specified values are numbers, return whether they are equivalent
		else if(typeof first === 'number' && typeof second === 'number')
			return first === second;
		// Else, if the specified values are objects, determine if they are equivalent
		else if(typeof first === 'object' && typeof second === 'object')
		{
			// If either of the specified values are null, return whether they are equivalent
			if(first === null || second === null)
				return first === null && second === null;

			// If the specified values are arrays, determine if they are equivalent
			if(Array.isArray(first) && Array.isArray(second))
			{
				// If the specified arrays lengths are difference, return failure
				if(first.length != second.length)
					return false;

				// Loop through specified arrays and determine if they are equivalent
				for(let v:number = 0; v < first.length; v++)
				{
					// If this value isnt equivalent, return failure
					if(!JsonAny.equivalent(first[v], second[v]))
						return false;
				}

				// Return success
				return true;
			}
			// Else, if the specified values are objects, determine if they are equivalent
			else if(!Array.isArray(first) && !Array.isArray(second))
			{
				// Acquire the specified values keys
				const firstKeys:Array<string> = Object.keys(first);
				const secondKeys:Array<string> = Object.keys(second);

				// Sort the values keys
				firstKeys.sort();
				secondKeys.sort();

				// If the specified values keys arent equivalent, return failure
				if(firstKeys.join() != secondKeys.join())
					return false;

				// Loop through specified keys and determine if they are equivalent
				for(let k:number = 0; k < firstKeys.length; k++)
				{
					// If this key isnt equivalent, return failure
					if(!JsonAny.equivalent(first[firstKeys[k]], second[firstKeys[k]]))
						return false;
				}

				// Return success
				return true;
			}
			// Else, return failure
			else
				return false;
		}
		// Else, if the specified values are strings, return whether they are equivalent
		else if(typeof first === 'string' && typeof second === 'string')
			return first === second;
		// Else, return failure
		else
			return false;
	}
}