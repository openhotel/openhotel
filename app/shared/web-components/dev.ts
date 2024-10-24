const command = new Deno.Command(Deno.execPath(), {
  args: ["task", "build"],
});

const { code, stdout, stderr } = command.outputSync();
console.assert(code === 0);
console.assert("hello\n" === new TextDecoder().decode(stdout));
console.assert("world\n" === new TextDecoder().decode(stderr));
