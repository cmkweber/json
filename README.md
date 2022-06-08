# json

Class based Json Schema Validation with typescript type inference.
` `  
` `  
## Description

There are many Json validators, including my favorite [myzod](https://github.com/davidmdm/myzod).
This package attempts to validate using classes to allow implementers to extend functionality.
For instance, a Document class could extend from JsonObject and provide remote CRUD operations.
` `  
` `  
## Usage

Instantiate or extend from one of the provided json primitives.

### JsonAny

```typescript
new JsonAny(
	value?:JsonValue // Default value
);
```

### JsonArray

```typescript
new JsonArray(
	pattern:Array<Json<T>>, // Array of primitives which values must validate against sequentially
	min?:number, // Minimum amount of values
	max?:number // Maximum amount of values,
	value?:Array<T> // Default value
);
```

### JsonBoolean

```typescript
new JsonBoolean(
	value?:boolean // Default value
);
```

### JsonEnum

```typescript
new JsonEnum(
	enumeration:Record<keyof T, number|string>, // A map describing the enumeration
	value?:keyof T // Default value
);
```

### JsonNull

```typescript
new JsonNull(
	value?:null // Default value
);
```

### JsonNumber

```typescript
new JsonNumber(
	integer?:boolean, // Whether the number should be a safe integer or not
	min?:number, // Minimum number value
	max?:number, // Maximum number value
	value?:number // Default value
);
```

### JsonObject

```typescript
new JsonObject(
	schema?:Record<string, Json<T>>, // A map describing the object schema
	value?:T // Default value
);
```

### JsonOptional

```typescript
new JsonOptional(
	json:Json<T>, // A primitive that will be validated when this optionals value is provided
	value?:T // Default value
);
```

### JsonString

```typescript
new JsonString(
	pattern?:RegExp, // A regular expression pattern the string will be tested against
	value?:string // Default value, must be provided if pattern is provided
);
```
` `  
` `  
## Example

```typescript
// System imports
import {JsonArray, JsonBoolean, JsonEnum, JsonNumber, JsonObject, JsonOptional, JsonString} from 'json';

// Condition schema
const ConditionSchema = {
	damaged: 2,
	used: 1,
	new : 0
};

// Metadata schema
const MetadataSchema = {
	rating: new JsonNumber(false, 0.0, 5.0),
	tags: new JsonArray([new JsonString()], 1)
};

// Product schema
const ProductSchema = {
	active: new JsonBoolean(),
	condition: new JsonEnum(ConditionSchema),
	inventory: new JsonNumber(true, 0),
	metadata: new JsonOptional(new JsonObject(MetadataSchema)),
	title: new JsonString(new RegExp(/^.{1,64}$/), 'Default Title')
};

// Product class
export class JsonProduct extends JsonObject<typeof ProductSchema>
{
	// Product members
	readonly #url:URL;

	// Product constructor
	private constructor(url:URL)
	{
		// Call creation on json object
		super(ProductSchema);

		// Store the specified url
		this.#url = url;
	}

	// Function to download product from database
	static async fromDatabase(id:number):Promise<JsonProduct>
	{
		// Create a url based on specified id
		const url:URL = new URL('https://www.store.com/products/' + id);

		// Create a product
		const product:JsonProduct = new JsonProduct(url);

		// Attempt to download url
		const response:Response = await fetch(url);

		// Parse response
		product.parse(await response.json());

		// Return success
		return product;
	}

	// Function to upload product to database
	async upload():Promise<void>
	{
		// Attempt to upload url
		await fetch(this.#url, {
			body: JSON.stringify(this.serialize()),
			headers: {'Content-Type': 'application/json'},
			method: 'POST'
		});
	}

	// Function to debug the condition
	debugCondition():void
	{
		// Value getter is fully typed, condition is recognized as an enumeration
		const condition:'damaged'|'new'|'used' = this.value.condition;
		console.log(condition);
	}

	// Called when the product has been sold
	async sold():Promise<void>
	{
		// Update the product with reduced inventory and upload it
		this.update({inventory: Math.max(this.value.inventory - 1, 0)});
		await this.upload();
	}
}
```
` `  
` `  
## Helper primitives

For additional primitives not covered by strict json types, such as JsonDate, JsonUrl, etc., see [jsoncommon](https://github.com/cmkweber/jsoncommon).