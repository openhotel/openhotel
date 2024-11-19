interface Contributor {
  login: string;
  html_url: string;
  contributions: number;
}

async function fetchContributors() {
  return await fetch(
    "https://api.github.com/repos/openhotel/openhotel/contributors",
    {
      method: "GET",
    },
  )
    .then((response) => response.json())
    .then((response) => {
      return response as Contributor[];
    });
}

async function getFormattedContributors() {
  const contributors = await fetchContributors();
  let contributorsMarkdown = "# Contributors\n";
  contributors.forEach((contributor: Contributor) => {
    contributorsMarkdown += `- [${contributor.login}](${contributor.html_url})\n`;
  });
  return contributorsMarkdown;
}

async function main() {
  const defaultPath = "./build/CONTRIBUTORS.md";
  const path = Deno.args.length === 0 ? defaultPath : Deno.args[0];

  const contributors = await getFormattedContributors();
  await Deno.writeTextFile(path, contributors);
}

await main();
