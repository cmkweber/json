// Package imports
import {Json, JsonInfer} from './Json';
import {JsonRequired} from './Required';

// Optional class
export class JsonOptional<T extends JsonRequired = JsonRequired> extends Json
{
	// Optional members
	#defined:boolean = false;
	readonly #required:boolean = false;

	// Optional getters
	get defined():boolean { return this.#defined; }

	// Optional constructor
	constructor(readonly json:T, value?:JsonInfer<T>)
	{
		// Call creation on json
		super();

		// Set that the json is optional
		this.#required;

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to get the optionals value
	get():JsonInfer<T> { return this.json.get() as JsonInfer<T>; }

	// Function to set the optionals value
	set(value:JsonInfer<T>):void
	{
		// Attempt to set the specified value
		this.json.set(value);

		// Set that the optional is defined
		this.#defined = true;
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// Attempt to parse the specified value
		this.json.parse(value);

		// Set that the optional is defined
		this.#defined = true;
	}

	// Function to clear the optional value
	clear():void { this.#defined = false; }
}