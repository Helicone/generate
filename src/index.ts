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
   *
   * Coming soon: In cases where promptId is not provided, the chat history will be used to generate a response
   */
  chat?: string[];

  /**
   * Coming soon: Callback function to handle chunks of the generated response
   */
  onChunk?: (chunk: string) => void;

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
const BASE_URL = "https://generate.helicone.ai"; // "http://localhost:8791";

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
export async function generate(input: GenerateInput): Promise<unknown> {
  // Get API key from environment
  const apiKey = process.env.HELICONE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "HELICONE_API_KEY environment variable is not set or is unreachable"
    );
  }

  // Normalize input to GenerateParams
  const params = typeof input === "string" ? { promptId: input } : input;

  // Prepare request body
  const body: Record<string, any> = {
    promptId: params.promptId,
    version: params.version ?? "production",
    inputs: params.inputs ?? {},
    chat: params.chat ?? [],

    properties: {
      userId: params.userId,
      sessionId: params.sessionId,
      cache: params.cache,
    },
  };

  // Handle variables
  if (params.inputs && Object.keys(params.inputs).length > 0) {
    body.inputs = params.inputs;
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
    "AZURE",
    "ANTHROPIC",
    "BEDROCK",
    "GOOGLE_GEMINI",
    "GOOGLE_VERTEXAI",
    "OPENROUTER",
  ];

  // Add provider region, project, and location if available
  let hasAtLeastOneProviderKey = false;
  for (const provider of providerKeys) {
    const envKey = `${provider}_API_KEY`;
    const regionKey = `${provider}_REGION`;
    const projectKey = `${provider}_PROJECT`;
    const locationKey = `${provider}_LOCATION`;
    if (process.env[envKey]) {
      headers[envKey] = process.env[envKey]!;
      hasAtLeastOneProviderKey = true;
    }
    if (process.env[regionKey]) {
      headers[regionKey] = process.env[regionKey];
    }
    if (process.env[projectKey]) {
      headers[projectKey] = process.env[projectKey];
    }
    if (process.env[locationKey]) {
      headers[locationKey] = process.env[locationKey];
    }
  }

  // Check if at least one provider key is present
  if (!hasAtLeastOneProviderKey) {
    throw new Error(
      "At least one provider API key is required. Please set at least one of the following environment variables: " +
        providerKeys.map((provider) => `${provider}_API_KEY`).join(", ")
    );
  }

  // Make the API request
  try {
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

    // Parse and return the raw response without any processing
    return await response.json();
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}
