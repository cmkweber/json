// Package imports
import {Json, JsonValue} from './Json';

// Required class
export abstract class JsonRequired<T extends JsonValue = JsonValue> extends Json<T>
{
	// Required members
	readonly #required:boolean = true;

	// Required constructor
	constructor(value:T)
	{
		// Call creation on json
		super(value);

		// Set that the json is required
		this.#required;
	}
}