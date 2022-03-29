// Package imports
import {JsonRequired} from './Required';

// Enum types
type Infer<T extends Record<keyof T, number|string>> = T[keyof T] extends number ? number : string;

// Enum class
export class JsonEnum<T extends Record<keyof T, number|string>> extends JsonRequired<keyof T, Infer<T>>
{
	// Enum members
	readonly enumeration:T;
	readonly match?:keyof T|undefined;

	// Enum constructor
	constructor(enumeration:T, match?:keyof T)
	{
		// Acquire the enumerations keys
		const keys:Array<keyof T> = Object.keys(enumeration) as Array<keyof T>;

		// If the specified enumeration is invalid, throw error
		if(keys.length === 0)
			throw new Error('Invalid enumeration');

		// Call creation on json
		super(keys[0]);

		// Store the specified enumeration and match
		this.enumeration = enumeration;
		this.match = match;
	}

	// Function to validate the enums value
	protected validate():void
	{
		// If the enum has a match, and the value doesnt match, throw error
		if(this.match !== undefined && this.value !== this.match)
			throw new Error('Invalid match');
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt a number or string, throw error
		if(typeof value !== 'number' && typeof value !== 'string')
			throw new Error('Invalid type');

		// Acquire the enumerations keys
		const keys:Array<keyof T> = Object.keys(this.enumeration) as Array<keyof T>;

		// Loop through keys and attempt to set the specified value
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key
			const key:keyof T = keys[k];

			// If the specified value is this keys value, set it and return early
			if(value === this.enumeration[key])
			{
				// Set the specified value
				this.set(key);
				return;
			}
		}

		// Throw error
		throw new Error('Invalid value');
	}

	// Function to serialize the enums value
	serialize():Infer<T> { return this.enumeration[this.value] as Infer<T>; }
}