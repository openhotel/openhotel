const indexData = await Deno.readTextFile("./index.html");

const data = `export const clientIndex = \`${encodeURIComponent(indexData)}\``;
await Deno.writeTextFile("./client-index.ts", data);
