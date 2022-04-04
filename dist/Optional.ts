// Package imports
import {JsonAny} from './Any';
import {Json, JsonInput, JsonOutput, JsonValue} from './Json';
import {JsonRequired} from './Required';

// Optional class
export class JsonOptional<T extends JsonRequired<any, JsonValue> = JsonAny> extends Json<JsonInput<T>, JsonOutput<T>>
{
	// Optional members
	readonly #required:boolean = false;

	// Optional getters
	override get value():JsonInput<T> { return this.json.value as JsonInput<T>; }

	// Optional constructor
	constructor(readonly json:T, value?:JsonInput<T>)
	{
		// Call creation on json
		super(value !== undefined ? value : json.value as JsonInput<T>);

		// Set that the json is optional
		this.#required;

		// If a value was specified, attempt to validate it
		if(value !== undefined)
			this.validate();
	}

	// Function to set the optionals value
	override set(value:JsonInput<T>) { this.json.set(value); }

	// Function to validate the optionals value
	protected validate():void {}

	// Function to parse the specified value
	parse(value:any):void { this.json.parse(value); }

	// Function to serialize the optionals value
	serialize():JsonOutput<T> { return this.json.serialize() as JsonOutput<T>; }
}