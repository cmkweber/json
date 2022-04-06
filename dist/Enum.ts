// Package imports
import {JsonRequired} from './Required';

// Enum types
type Infer<T extends Record<keyof T, number|string>> = T[keyof T] extends number ? number : string;

// Enum class
export class JsonEnum<T extends Record<keyof T, number|string>> extends JsonRequired<keyof T, Infer<T>>
{
	// Enum members
	readonly enumeration:T;

	// Enum constructor
	constructor(enumeration:T, value?:keyof T)
	{
		// Acquire the enumerations keys
		const keys:Array<string> = Object.keys(enumeration);

		// If the specified enumeration is invalid, throw error
		if(keys.length === 0)
			throw new Error('Invalid enumeration');

		// Call creation on json
		super(value !== undefined ? value : keys[0] as keyof T);

		// Store the specified enumeration
		this.enumeration = enumeration;

		// If a value was specified, attempt to validate it
		if(value !== undefined)
			this.validate();
	}

	// Function to validate the enums value
	protected validate():void {}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt a number or string, throw error
		if(typeof value !== 'number' && typeof value !== 'string')
			throw new Error('Invalid type');

		// Acquire the enumerations keys
		const keys:Array<string> = Object.keys(this.enumeration);

		// Loop through keys and attempt to set the specified value
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key
			const key:string = keys[k];

			// If the specified value is this key, set it and return early
			if(String(value) === key || String(value) === String(this.enumeration[key as keyof T]))
			{
				// Set the specified value
				this.set(key as keyof T);
				return;
			}
		}

		// Throw error
		throw new Error('Invalid value');
	}

	// Function to serialize the enums value
	serialize():Infer<T> { return this.enumeration[this.value] as Infer<T>; }
}