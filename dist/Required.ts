// Package imports
import {Json, JsonValue} from './Json';

// Required class
export abstract class JsonRequired<I, O extends JsonValue> extends Json<I, O>
{
	// Required members
	readonly #required:boolean = true;

	// Required constructor
	constructor(value:I)
	{
		// Call creation on json
		super(value);

		// Set that the json is required
		this.#required;
	}
}