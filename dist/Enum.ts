// Package imports
import {JsonRequired} from './Required';

// Enum types
type Enum<T extends Record<keyof T, number|string>> = {[K in keyof T]:T[K]};
type EnumInfer<T extends Enum<T>> = T extends {[K in keyof T]:infer U} ? U : never;

// Enum class
export class JsonEnum<T extends Enum<T>> extends JsonRequired
{
	// Enum members
	#value:EnumInfer<T>;

	// Enum constructor
	constructor(readonly enumeration:T, readonly match?:EnumInfer<T>, value?:EnumInfer<T>)
	{
		// Call creation on json
		super();

		// Acquire the enumerations values
		const values:Array<EnumInfer<T>> = Object.values(this.enumeration);

		// If the specified enumeration is invalid, throw error
		if(values.length == 0)
			throw new Error('Invalid enumeration');

		// If a match was specified, and its invalid, throw error
		if(match != undefined && !values.includes(match))
			throw new Error('Invalid match');

		// Set the value to the first value
		this.#value = values[0];

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to get the enums value
	get():EnumInfer<T> { return this.#value; }

	// Function to set the enums value
	set(value:EnumInfer<T>):void
	{
		// Acquire the enumerations values
		const values:Array<EnumInfer<T>> = Object.values(this.enumeration);

		// If the specified value isnt within enumeration, throw error
		if(!values.includes(value))
			throw new Error('Invalid value');

		// If the enum has a match, and the specified value doesnt match, throw error
		if(this.match != undefined && value != this.match)
			throw new Error('Invalid match');

		// Store the specified value
		this.#value = value;
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt the same type as the current value, throw error
		if(typeof value != typeof this.#value)
			throw new Error('Invalid type');

		// Set the specified value
		this.set(value);
	}
}