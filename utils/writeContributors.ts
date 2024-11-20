interface Contributor {
  login: string;
  html_url: string;
  avatar_url: string;
  type: string;
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
      return response.map((contributor: Contributor) => ({
        login: contributor.login,
        html_url: contributor.html_url,
        avatar_url: contributor.avatar_url,
        type: contributor.type,
        contributions: contributor.contributions,
      }));
    });
}

async function writeContributors() {
  if (Deno.args.length === 0) {
    console.error("Missing contributors output path.");
    Deno.exit();
  }

  const path = Deno.args[0];
  const contributors: Contributor[] = await fetchContributors();
  const humanContributors = contributors.filter((c) => c.type !== "Bot");
  await Deno.writeTextFile(path, JSON.stringify(humanContributors, null, 2));
}

await writeContributors();
