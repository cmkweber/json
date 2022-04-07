// Package imports
import {JsonValue} from './Json';
import {JsonRequired} from './Required';

// Any class
export class JsonAny extends JsonRequired<JsonValue, JsonValue>
{
	// Any constructor
	constructor(value?:JsonValue)
	{
		// Call creation on json
		super(value !== undefined ? value : null);

		// If a value was specified, attempt to validate it
		if(value !== undefined)
			this.validate();
	}

	// Function to validate the anys value
	protected validate():void {}

	// Function to parse the specified value
	parse(value:any):void
	{
		// Switch between possible types
		switch(typeof value)
		{
			// Boolean and string
			case 'boolean':
			case 'string':
				// Store value and break early
				this.set(value);
				break;

			// Number
			case 'number':
				// If the specified number is invalid, throw error
				if(isNaN(value))
					throw new Error('Invalid number');

				// Store value and break early
				this.set(value);
				break;

			// Object
			case 'object':
				// If the specified value is null, store it
				if(value === null)
					this.set(value);
				// Else, if the specified value is an array, parse it
				else if(Array.isArray(value))
				{
					// Create an array to store values
					const values:Array<JsonValue> = [];

					// Create an any to parse values
					const json:JsonAny = new JsonAny();

					// Loop through specified values and parse
					for(let v:number = 0; v < value.length; v++)
					{
						// Parse this value and add it to values
						json.parse(value[v]);
						values.push(json.value);
					}

					// Store value
					this.set(values);
				}
				// Else, parse object
				else
				{
					// Create an object to store values
					const values:{[key:string]:JsonValue} = {};

					// Create an any to parse values
					const json:JsonAny = new JsonAny();

					// Acquire the specified keys
					const keys:Array<string> = Object.keys(value);

					// Loop through specified objects keys and parse
					for(let k:number = 0; k < keys.length; k++)
					{
						// Acquire this key
						const key:string = keys[k];

						// Parse this key and add it to values
						json.parse(value[key]);
						values[key] = json.value;
					}

					// Store value
					this.set(values);
				}

				// Break early
				break;

			// Invalid type
			default:
				throw new Error('Invalid type');
		}
	}

	// Function to serialize the anys value
	serialize():JsonValue { return this.value; }

	// Function to return whether the specified values are equivalent or not
	static equivalent(first:JsonValue, second:JsonValue):boolean
	{
		// Acquire the specified types
		const firstType = typeof first;
		const secondType = typeof second;

		// If the specified types are different, return failure
		if(firstType !== secondType)
			return false;

		// Switch between possible types
		switch(firstType)
		{
			// Boolean, number, and string
			case 'boolean':
			case 'number':
			case 'string':
				// Return whether the specified values are equivalent or not
				return first === second;

			// Object
			case 'object':
				// Determine if the specified values are null
				const firstNull:boolean = first === null;
				const secondNull:boolean = second === null;

				// If either of the specified values are null, return whether they are equivalent
				if(firstNull || secondNull)
					return firstNull && secondNull;

				// If the first specified value is an array, determine if the second value is equivalent
				if(Array.isArray(first))
				{
					// If the second specified value isnt an array, return failure
					if(!Array.isArray(second))
						return false;

					// If the specified arrays lengths are different, return failure
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
				// Else, the specified values are objects, determine if they are equivalent
				else
				{
					// Acquire the values as objects
					const firstObject:{[key:string]:JsonValue} = first as {[key:string]:JsonValue};
					const secondObject:{[key:string]:JsonValue} = second as {[key:string]:JsonValue};

					// Acquire the specified values keys
					const firstKeys:Array<string> = Object.keys(firstObject);
					const secondKeys:Array<string> = Object.keys(secondObject);

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
						if(!JsonAny.equivalent(firstObject[firstKeys[k]], secondObject[firstKeys[k]]))
							return false;
					}

					// Return success
					return true;
				}
		}

		// Return failure
		return false;
	}
}