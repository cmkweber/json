// Package imports
import {JsonAny} from './Any';
import {JsonInput, JsonOutput, JsonValue} from './Json';
import {JsonRequired} from './Required';

// Union types
export type JsonUnionInput<A extends JsonRequired<any, JsonValue>, B extends JsonRequired<any, JsonValue>> = JsonInput<A>|JsonInput<B>;
export type JsonUnionOutput<A extends JsonRequired<any, JsonValue>, B extends JsonRequired<any, JsonValue>> = JsonOutput<A>|JsonOutput<B>;

// Union class
export class JsonUnion<
	A extends JsonRequired<any, JsonValue> = JsonAny,
	B extends JsonRequired<any, JsonValue> = JsonAny
> extends JsonRequired<JsonUnionInput<A, B>, JsonUnionOutput<A, B>>
{
	// Union members
	#current:A|B;

	// Union getters
	override get value():JsonUnionInput<A, B> { return this.#current.value; }

	// Union constructor
	constructor(readonly a:A, readonly b:B, value?:JsonUnionInput<A, B>)
	{
		// Call creation on json
		super(a.value);

		// Set the current json to the first json
		this.#current = a;

		// If a value was specified, attempt to set it
		if(value !== undefined)
			this.set(value);
	}

	// Function to set the unions value
	override set(value:JsonUnionInput<A, B>) { this.parse(value); }

	// Function to validate the unions value
	protected validate():void {}

	// Function to parse the specified value
	parse(value:any):void
	{
		// Attempt to parse using the first json
		try
		{
			// Attempt to parse using the first json
			this.a.parse(value);

			// Set the current json to the first json
			this.#current = this.a;
		}
		// On error, attempt to parse using the second json
		catch(error)
		{
			// Attempt to parse using the second json
			this.b.parse(value);

			// Set the current json to the second json
			this.#current = this.b;
		}
	}

	// Function to serialize the unions value
	serialize():JsonUnionOutput<A, B> { return this.#current.serialize() as JsonUnionOutput<A, B>; }
}