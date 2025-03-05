# Helicone Generate Client Tests

This directory contains a simple test file that demonstrates how to use the Helicone Generate client in a real project.

## Setup

1. Make sure you have a Helicone API key
2. Set your API key as an environment variable:
   ```
   export HELICONE_API_KEY=your-api-key-here
   ```
3. Update the prompt IDs in the test file to match your actual prompt IDs in Helicone

## Running the Tests

Run the tests with:

```bash
npm test
```

Or in watch mode:

```bash
npm run test:watch
```

## Test Structure

This is a simplified test setup with:
- No mocking or complex configuration
- No vitest.config.ts file (using CLI arguments instead)
- Direct calls to the Helicone API

## Test Examples

The test file demonstrates:

1. Basic prompt generation with just a prompt ID
2. Using variables in your prompts
3. Adding tracking information (user ID, session ID)
4. Managing chat conversations
5. Using specific prompt versions

Each test is designed to be a simple, direct example of how you would use the Helicone client in your own code. 