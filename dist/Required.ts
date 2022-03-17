// Package imports
import {Json, JsonValue} from './Json';

// Required class
export abstract class JsonRequired extends Json
{
	// Required members
	readonly #required:boolean = true;

	// Required constructor
	constructor()
	{
		// Call creation on json
		super();

		// Set that the json is required
		this.#required;
	}

	// Function to get the required value
	abstract override get():JsonValue;

	// Function to set the required value
	abstract override set(value:JsonValue):void;
}