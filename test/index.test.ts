import dotenv from "dotenv";
import { describe, expect, it } from "vitest";
import { generate } from "../src";

// Load environment variables from .env file
dotenv.config();

// This is a simple test file that demonstrates how to use the Helicone generate function
// in a real project. The tests assume you have a running Helicone API and proper environment variables.

describe("Helicone Generate", () => {
  const simplePromptId = "new-prompt-19";
  const inputsPromptId = "new-prompt-19";
  const chatPromptId = "new-prompt-19";

  it("should generate a response with just a prompt ID", async () => {
    // Simple usage with just a prompt ID
    const response = await generate(simplePromptId);
    expect(response).toBeTruthy();
    console.log("Response:", response);
  });

  it("should generate a response with variable inputs", async () => {
    // Using variable inputs in your prompt
    const response = await generate({
      promptId: inputsPromptId,
      inputs: {
        number: "2",
      },
    });
    expect(response).toBeTruthy();
    console.log("Response with variable inputs:", response);
  });

  it("should generate a response with Helicone properties", async () => {
    // Adding Helicone properties
    const response = await generate({
      promptId: simplePromptId,
      userId: "user-123",
      sessionId: "session-456",
      cache: true,
    });
    expect(response).toBeTruthy();
    console.log("Response with Helicone properties:", response);
  });

  it("should handle error when prompt is not found", async () => {
    // Test error handling for non-existent prompt
    try {
      await generate({
        promptId: "non-existent-prompt-id",
      });
      // If we get here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // Verify we get a proper error message
      expect(error instanceof Error).toBe(true);
      expect(error.message).toContain("Prompt not found");
      console.log("Error handling test passed:", error.message);
    }
  });

  it("should handle error when prompt version is not found", async () => {
    // Test error handling for non-existent prompt version
    try {
      await generate({
        promptId: simplePromptId,
        version: 999, // Non-existent version
      });
      // If we get here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // Verify we get a proper error message
      expect(error instanceof Error).toBe(true);
      expect(error.message).toContain("version 999");
      console.log("Version error handling test passed:", error.message);
    }
  });

  it("should handle chat conversations", async () => {
    // Managing a chat conversation
    const chat: string[] = [];

    // First user message
    chat.push("Hello, can you help me with my homework?");

    // Get assistant response
    const response1 = await generate({
      promptId: chatPromptId,
      chat,
    });

    // Add assistant response to chat history
    chat.push(response1);
    console.log("Assistant:", response1);

    // Second user message
    chat.push("I need help with math. What is 2+2?");

    // Get second assistant response
    const response2 = await generate({
      promptId: chatPromptId,
      chat,
    });

    // Add second assistant response to chat history
    chat.push(response2);
    console.log("Assistant:", response2);

    expect(chat.length).toBe(4); // 2 user messages + 2 assistant responses
  });

  it("should use a specific prompt version", async () => {
    // Using a specific version of a prompt
    const response = await generate({
      promptId: simplePromptId,
      version: 2, // Use version 2 of the prompt
    });
    expect(response).toBeTruthy();
    console.log("Response from version 2:", response);
  });

  it("should use the production version of a prompt", async () => {
    // Using the production version of a prompt
    const response = await generate({
      promptId: simplePromptId,
      version: "production", // Use the production version
    });
    expect(response).toBeTruthy();
    console.log("Response from production version:", response);
  });
});
