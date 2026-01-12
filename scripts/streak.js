import fs from "fs";

const token = process.env.GITHUB_TOKEN;
const username = "Mr-Priyanshu-Gupta";

if (!token) {
  console.error("Missing GITHUB_TOKEN");
  process.exit(1);
}

const query = `
query {
  user(login: "${username}") {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`;

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query }),
});

const json = await res.json();
const days =
  json.data.user.contributionsCollection.contributionCalendar.weeks
    .flatMap(w => w.contributionDays);

let streak = 0;
for (let i = days.length - 1; i >= 0; i--) {
  if (days[i].contributionCount > 0) {
    streak++;
  } else {
    break;
  }
}

const svg = `
<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" rx="15" fill="#1a1b27"/>
  <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle"
        font-size="22" fill="#70a5fd" font-family="Verdana">
    🔥 GitHub Streak
  </text>
  <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle"
        font-size="28" fill="#c0caf5" font-family="Verdana">
    ${streak} days
  </text>
</svg>
`;

fs.mkdirSync("assets", { recursive: true });
fs.writeFileSync("assets/streak.svg", svg);

console.log(`Streak generated: ${streak} days`);
