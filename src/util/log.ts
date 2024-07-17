export function debug(...args: any[]): void {
  if (process.env["DEBUG"] === "true") {
    console.log("$", new Date().toISOString(), ...args);
  }
}

export function log(...args: any[]): void {
  console.log(">>", new Date().toISOString(), ...args);
}
