# @helicone/generate

A light and modern interface for Helicone's generateRouter API.

## Installation

```bash
npm install @helicone/generate
```

## Usage

### Initialize the client

```typescript
import Helicone from '@helicone/generate';

const helicone = new Helicone({
  heliconeApiKey: process.env.HELICONE_API_KEY
});
```

### Simple usage with just a prompt ID

```typescript
// model, temperature, messages inferred from id
const text = await helicone.generate("prompt-id");

console.log(text);
```

### With variables

```typescript
const text = await helicone.generate({
  promptId: "prompt-id",
  variables: {
    location: "Portugal",
    time: "2:43"
  }
});

console.log(text);
```

### With tracking headers

```typescript
const text = await helicone.generate({
  promptId: "prompt-id",
  userId: "ajwt2kcoe",
  sessionId: "21",
  cache: true
});

console.log(text);
```

### In a chat

```typescript
const promptId = "homework-helper";
const chat = [];

// User
chat.push("can you help me with my homework?");

// Assistant
chat.push(await helicone.generate({promptId, chat}));
console.log(chat[chat.length - 1]);

// User
chat.push("thanks, the first question is what is 2+2?");

// Assistant
chat.push(await helicone.generate({promptId, chat}));
console.log(chat[chat.length - 1]);
```

## API Reference

### `new Helicone(config)`

Creates a new Helicone client.

#### Parameters

- `config` (object):
  - `heliconeApiKey` (string): Your Helicone API key
  - `baseUrl` (string, optional): Base URL for the Helicone API. Defaults to "https://api.helicone.ai"

### `helicone.generate(input)`

Generates a response using a Helicone prompt.

#### Parameters

- `input` (string | object): Either a prompt ID string or a parameters object:
  - `promptId` (string): The ID of the prompt to use
  - `version` (number | "production", optional): The version of the prompt to use. Defaults to "production"
  - `variables` (object, optional): Variables to use in the prompt
  - `userId` (string, optional): User ID for tracking
  - `sessionId` (string, optional): Session ID for tracking
  - `cache` (boolean, optional): Whether to use cache
  - `chat` (string[], optional): Chat history for chat-based prompts

#### Returns

- `Promise<string>`: The generated text

## License

MIT
 
