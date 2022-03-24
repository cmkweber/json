// Package imports
import {JsonArray} from './Array';
import {JsonBoolean} from './Boolean';
import {JsonValue} from './Json';
import {JsonNull} from './Null';
import {JsonNumber} from './Number';
import {JsonObject} from './Object';
import {JsonRequired} from './Required';
import {JsonString} from './String';

// Any class
export class JsonAny extends JsonRequired<JsonValue>
{
	// Any members
	#value:JsonValue = null;

	// Any constructor
	constructor(value?:JsonValue)
	{
		// Call creation on json
		super();

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to get the anys value
	get():JsonValue { return this.#value; }

	// Function to set the anys value
	set(value:JsonValue):void { this.#value = value; }

	// Function to parse the specified value
	parse(value:any):void
	{
		// Set the json to null by default
		let json:JsonRequired<JsonValue>;

		// If the specified value is a boolean, set the json to boolean
		if(typeof value == 'boolean')
			json = new JsonBoolean();
		// Else, if the specified value is a null, set the json to null
		else if(typeof value == null)
			json = new JsonNull();
		// Else, if the specified value is a number, set the json to number
		else if(typeof value == 'number')
			json = new JsonNumber();
		// Else, if the specified value is an object, set the json to array or object
		else if(typeof value == 'object')
			json = Array.isArray(value) ? new JsonArray() : new JsonObject();
		// Else, if the specified value is a string, set the json to string
		else if(typeof value == 'string')
			json = new JsonString();
		// Else, throw error
		else
			throw new Error('Invalid type');

		// Attempt to parse the specified value
		json.parse(value);

		// Set the specified value
		this.set(json.get());
	}
}