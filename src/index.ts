/**
 * Helicone Generate Client
 * A light and modern interface for Helicone's generateRouter API
 */

/**
 * Parameters for the generate method
 */
export interface GenerateParams {
  /**
   * The ID of the prompt to use
   */
  promptId: string;

  /**
   * The version of the prompt to use
   * @default "production"
   */
  version?: number | "production";

  /**
   * Variable inputs to use in the prompt
   */
  inputs?: Record<string, string>;

  /**
   * Chat history for chat-based prompts
   */
  chat?: string[];

  /**
   * User ID for tracking
   */
  userId?: string;

  /**
   * Session ID for tracking
   */
  sessionId?: string;

  /**
   * Whether to use cache
   */
  cache?: boolean;
}

/**
 * Simplified type for generate method parameters
 */
export type GenerateInput = string | GenerateParams;

/**
 * Error response from the Helicone API
 */
interface ErrorResponse {
  error?: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
  helicone_error?: string;
  success: false;
}

/**
 * Success response from the Helicone API
 */
interface SuccessResponse {
  // OpenAI-style response structure
  choices?: Array<{
    index?: number;
    message?: {
      role?: string;
      content?: string;
      refusal?: string | null;
    };
    logprobs?: any;
    finish_reason?: string;
  }>;
}

// Internal configuration
const BASE_URL = "http://localhost:8791"; // "https://generate.helicone.ai";

/**
 * Format chat history into a string format
 * @private
 */
function formatChatHistory(chat: string[]): string {
  return chat
    .map((message, index) => {
      const role = index % 2 === 0 ? "User" : "Assistant";
      return `${role}: ${message}`;
    })
    .join("\n\n");
}

/**
 * Generate a response using a Helicone prompt
 *
 * @param input Prompt ID or generate parameters
 * @returns The generated text
 *
 * @example
 * // Simple usage with just a prompt ID
 * const text = await generate("prompt-id");
 *
 * @example
 * // With variables
 * const text = await generate({
 *   promptId: "prompt-id",
 *   inputs: {
 *     location: "Portugal",
 *     time: "2:43"
 *   }
 * });
 *
 * @example
 * // With tracking headers
 * const text = await generate({
 *   promptId: "prompt-id",
 *   userId: "ajwt2kcoe",
 *   sessionId: "21",
 *   cache: true
 * });
 *
 * @example
 * // In a chat
 * const chat = [];
 * chat.push("can you help me with my homework?");
 * chat.push(await generate({promptId: "homework-helper", chat}));
 */
export async function generate(input: GenerateInput): Promise<string> {
  // Get API key from environment
  const apiKey = process.env.HELICONE_API_KEY;
  if (!apiKey) {
    throw new Error("HELICONE_API_KEY environment variable is not set");
  }

  // Normalize input to GenerateParams
  const params = typeof input === "string" ? { promptId: input } : input;

  // Prepare request body
  const body: Record<string, any> = {
    promptId: params.promptId,
  };

  // Add optional parameters
  if (params.version !== undefined) {
    body.version = params.version;
  }

  // Handle variables
  if (params.inputs && Object.keys(params.inputs).length > 0) {
    body.inputs = params.inputs;
  }

  // Handle chat history
  // TODO: This is wrong
  if (params.chat && params.chat.length > 0) {
    // Convert chat array to inputs format
    body.inputs = {
      ...(body.inputs || {}),
      chat_history: formatChatHistory(params.chat),
    };
  }

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Helicone-Auth": `Bearer ${apiKey}`,
  };

  // Add helicone property headers
  if (params.userId) {
    headers["Helicone-User-Id"] = params.userId;
  }
  if (params.sessionId) {
    headers["Helicone-Session-Id"] = params.sessionId;
  }
  if (params.cache !== undefined) {
    headers["Helicone-Cache"] = params.cache.toString();
  }

  // Add provider API keys from environment variables
  const providerKeys = [
    "OPENAI",
    "ANTHROPIC",
    "GOOGLE",
    "AZURE",
    "TOGETHER",
    "COHERE",
    "MISTRAL",
    "GROQ",
    "PERPLEXITY",
    "FIREWORKS",
    "ANYSCALE",
    "CLOUDFLARE",
    "DEEPINFRA",
    "AWS",
    "X",
    "DEEPSEEK",
    "OPENROUTER",
    "AVIAN",
    "NEBIUS",
    "NOVITA",
  ];

  for (const provider of providerKeys) {
    const envKey = `${provider}_API_KEY`;
    if (process.env[envKey]) {
      headers[`${provider}_API_KEY`] = process.env[envKey]!;
    }
  }

  // Make the API request
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  // Handle errors
  if (!response.ok) {
    const errorData = (await response
      .json()
      .catch(() => null)) as ErrorResponse | null;

    if (errorData?.error?.message) {
      throw new Error(
        `Helicone API error: ${errorData.error.message} (${errorData.error.code})`
      );
    } else {
      throw new Error(
        errorData?.helicone_error || `Helicone API error: ${response.status}`
      );
    }
  }

  // Parse and return the response
  const responseData = (await response.json()) as SuccessResponse;

  // Handle OpenAI-style response structure (choices[0].message.content)
  if (
    responseData.choices &&
    Array.isArray(responseData.choices) &&
    responseData.choices.length > 0 &&
    responseData.choices[0].message &&
    responseData.choices[0].message.content
  ) {
    return responseData.choices[0].message.content;
  }

  // Fall back to data.content if it exists
  return JSON.stringify(responseData, null, 2);
}
