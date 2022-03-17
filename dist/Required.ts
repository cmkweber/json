// Package imports
import {Json} from './Json';

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
}