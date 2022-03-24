// Package imports
import {Json, JsonValue} from './Json';

// Required class
export abstract class JsonRequired<T extends JsonValue> extends Json<T>
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