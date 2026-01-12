import fs from "fs";

const token = process.env.GITHUB_TOKEN;
const username = "Mr-Priyanshu-Gupta";

const query = `
query {
  user(login: "${username}") {
    contributionsCollection {
      contributionCalendar {
        totalContributions
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

const data =
  (await res.json()).data.user.contributionsCollection
    .contributionCalendar;

const days = data.weeks.flatMap(w => w.contributionDays);

let currentStreak = 0;
let longestStreak = 0;
let tempStreak = 0;

for (let i = 0; i < days.length; i++) {
  if (days[i].contributionCount > 0) {
    tempStreak++;
    longestStreak = Math.max(longestStreak, tempStreak);
  } else {
    tempStreak = 0;
  }
}

for (let i = days.length - 1; i >= 0; i--) {
  if (days[i].contributionCount > 0) {
    currentStreak++;
  } else {
    break;
  }
}

const total = data.totalContributions;

const svg = `
<svg width="700" height="140" viewBox="0 0 700 140" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" rx="16" width="700" height="140" fill="#0f172a"/>

  <!-- Vertical dividers -->
  <line x1="233" y1="20" x2="233" y2="120" stroke="#1e293b"/>
  <line x1="466" y1="20" x2="466" y2="120" stroke="#1e293b"/>

  <!-- Total Contributions -->
  <text x="116" y="55" text-anchor="middle" font-size="28" fill="#e5e7eb" font-family="Verdana">
    ${total}
  </text>
  <text x="116" y="85" text-anchor="middle" font-size="14" fill="#94a3b8" font-family="Verdana">
    Total Contributions
  </text>

  <!-- Current Streak -->
  <text x="350" y="55" text-anchor="middle" font-size="28" fill="#f59e0b" font-family="Verdana">
    🔥 ${currentStreak}
  </text>
  <text x="350" y="85" text-anchor="middle" font-size="14" fill="#94a3b8" font-family="Verdana">
    Current Streak (days)
  </text>

  <!-- Longest Streak -->
  <text x="583" y="55" text-anchor="middle" font-size="28" fill="#38bdf8" font-family="Verdana">
    ${longestStreak}
  </text>
  <text x="583" y="85" text-anchor="middle" font-size="14" fill="#94a3b8" font-family="Verdana">
    Longest Streak
  </text>
</svg>
`;

fs.mkdirSync("assets", { recursive: true });
fs.writeFileSync("assets/streak.svg", svg);

console.log("Streak card generated");
