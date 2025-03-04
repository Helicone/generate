/**
 * A simple greeting function to demonstrate the package setup
 * @param name The name to greet
 * @returns A greeting message
 */
export function greet(name: string): string {
  return `Hello, ${name}! Welcome to your TypeScript package.`;
}

/**
 * Example interface to demonstrate TypeScript type exports
 */
export interface UserConfig {
  name: string;
  age?: number;
  settings?: {
    theme: "light" | "dark";
    notifications: boolean;
  };
}
