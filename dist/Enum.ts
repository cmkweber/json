// Package imports
import {JsonRequired} from './Required';

// Enum types
type Enum<T extends {[key:number|string]:V}, V = any> = {[K in keyof T]-?:V};
type Keys<T extends Enum<T>> = Extract<keyof T, number|string>;

// Enum class
export class JsonEnum<T extends Enum<T, V>, V = any> extends JsonRequired
{
	// Enum members
	#value:Keys<T>;

	// Enum constructor
	constructor(readonly enumeration:T, readonly match?:Keys<T>, value?:Keys<T>)
	{
		// Call creation on json
		super();

		// Acquire the enumerations keys
		const keys:Array<string> = Object.keys(this.enumeration);

		// If the specified enumeration is invalid, throw error
		if(keys.length == 0)
			throw new Error('Invalid enumeration');

		// Set the value to the first value
		this.#value = (isNaN(Number(keys[0])) ? keys[0] : Number(keys[0])) as Keys<T>;

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to get the enums value
	get():Keys<T> { return this.#value; }

	// Function to set the enums value
	set(value:Keys<T>):void
	{
		// If the enum has a match, and the specified value doesnt match, throw error
		if(this.match != undefined && value != this.match)
			throw new Error('Invalid match');

		// Store the specified value
		this.#value = value;
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt a number or string, throw error
		if(typeof value != 'number' && typeof value != 'string')
			throw new Error('Invalid type');

		// Acquire the enumerations keys
		const keys:Array<string> = Object.keys(this.enumeration);

		// Loop through keys and attempt to set the specified value
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key
			const key:number|string = isNaN(Number(keys[k])) ? keys[k] : Number(keys[k]);

			// If the specified value is this key, set it and return early
			if(value === key)
			{
				// Set the specified value
				this.set(key as Keys<T>);
				return;
			}
		}

		// Throw error
		throw new Error('Invalid value');
	}
}