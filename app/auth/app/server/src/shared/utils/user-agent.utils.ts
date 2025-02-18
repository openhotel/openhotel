export const getUserAgentData = (
  userAgent: string,
): { browser: string; os: string } => {
  let browser = "Unknown";
  let os = "Unknown";

  const browsers = [
    { regex: /Edg\/([\d.]+)/, name: "Edge" },
    { regex: /OPR\/([\d.]+)/, name: "Opera" },
    { regex: /Firefox\/([\d.]+)/, name: "Firefox" },
    { regex: /Chrome\/([\d.]+)/, name: "Chrome" },
    { regex: /Version\/([\d.]+).*Safari\//, name: "Safari" },
    { regex: /(MSIE |rv:)([\d.]+)/, name: "IE" },
  ];

  for (const { regex, name } of browsers) {
    const match = userAgent.match(regex);
    if (match) {
      browser = name;
      break;
    }
  }
  const osPatterns = [
    { regex: /Windows NT ([\d.]+)/, name: "Windows" },
    { regex: /Mac OS X ([\d_]+)/, name: "Mac OS" },
    { regex: /(iPhone|iPad|iPod).*?OS ([\d_]+)/, name: "iOS" },
    { regex: /Android ([\d.]+)/, name: "Android" },
    { regex: /Linux/, name: "Linux" },
  ];

  for (const { regex, name } of osPatterns) {
    const match = userAgent.match(regex);
    if (match) {
      os = name;
      break;
    }
  }

  return { browser, os };
};
