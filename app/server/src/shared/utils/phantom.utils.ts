export const getChromeExecutablePath = async () => {
  let executablePath = "";

  for await (const dirEntry of Deno.readDir("chrome")) {
    if (dirEntry.isFile) continue;

    for await (const dirEntry1 of Deno.readDir("chrome/" + dirEntry.name)) {
      if (dirEntry1.isFile) continue;
      executablePath = "chrome/" + dirEntry.name + "/" + dirEntry1.name;
    }
  }
  switch (Deno.build.os) {
    case "linux":
      executablePath += "/chrome";
      break;
    case "darwin":
      executablePath +=
        "/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
      break;
    case "windows":
      executablePath += "/chrome.exe";
      break;
  }

  return executablePath;
};
