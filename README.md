# @helicone/generate

A light and modern interface for calling LLMs through Helicone.

Edit, version and manage your prompts using the [Helicone Prompts Editor](https://docs.helicone.ai/features/prompts/editor).

## Installation

```bash
npm install @helicone/generate
```

## Usage

### Simple usage with just a prompt ID

```typescript
import { generate } from '@helicone/generate';

// model, temperature, messages inferred from id
const response = await generate("prompt-id");

console.log(response);
```

### With variables

```typescript
const response = await generate({
  promptId: "prompt-id",
  inputs: {
    location: "Portugal",
    time: "2:43"
  }
});

console.log(response);
```

### With Helicone properties

```typescript
const response = await generate({
  promptId: "prompt-id",
  userId: "ajwt2kcoe",
  sessionId: "21",
  cache: true
});

console.log(response);
```

### In a chat

```typescript
const promptId = "homework-helper";
const chat = [];

// User
chat.push("can you help me with my homework?");

// Assistant
chat.push(await generate({promptId, chat}));
console.log(chat[chat.length - 1]);

// User
chat.push("thanks, the first question is what is 2+2?");

// Assistant
chat.push(await generate({promptId, chat}));
console.log(chat[chat.length - 1]);
```

## Supported Providers and Required Environment Variables

Always required: `HELICONE_API_KEY`

| Provider | Required Environment Variables |
|----------|-------------------------------|
| OpenAI | `OPENAI_API_KEY` |
| Azure OpenAI | `AZURE_API_KEY`, `AZURE_ENDPOINT`, `AZURE_DEPLOYMENT` |
| Anthropic | `ANTHROPIC_API_KEY` |
| AWS Bedrock | `BEDROCK_API_KEY`, `BEDROCK_REGION` |
| Google Gemini | `GOOGLE_GEMINI_API_KEY` |
| Google Vertex AI | `GOOGLE_VERTEXAI_API_KEY`, `GOOGLE_VERTEXAI_REGION`, `GOOGLE_VERTEXAI_PROJECT`, `GOOGLE_VERTEXAI_LOCATION` |
| OpenRouter | `OPENROUTER_API_KEY` |

---

## API Reference

### `generate(input)`

Generates a response using a Helicone prompt.

#### Parameters

- `input` (string | object): Either a prompt ID string or a parameters object:
  - `promptId` (string): The ID of the prompt to use, created in the [Prompt Editor](https://docs.helicone.ai/features/prompts/editor)
  - `version` (number | "production", optional): The version of the prompt to use. Defaults to "production"
  - `inputs` (object, optional): Variable inputs to use in the prompt, if any
  - `chat` (string[], optional): Chat history for chat-based prompts
  - `userId` (string, optional): User ID for tracking in Helicone
  - `sessionId` (string, optional): Session ID for tracking in [Helicone Sessions](https://docs.helicone.ai/features/sessions)
  - `cache` (boolean, optional): Whether to use Helicone's [LLM Caching
](https://docs.helicone.ai/features/advanced-usage/caching)


#### Returns

- `Promise<object>`: The raw response from the LLM provider

## License

MIT
 
