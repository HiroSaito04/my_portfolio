
const GITHUB_USERNAME = "HiroSaito04";

async function githubGraphQL(query) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured.");
  }

  const response = await fetch(
    "https://api.github.com/graphql",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
        "User-Agent": "Mike-Portfolio",
      },
      body: JSON.stringify({ query }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed: ${response.status}`
    );
  }

  const result = await response.json();

  if (result.errors?.length) {
    throw new Error(
      result.errors.map((error) => error.message).join("; ")
    );
  }

  if (!result.data) {
    throw new Error("GitHub returned no data.");
  }

  return result.data;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");

    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const today = now.toISOString().slice(0, 10);

    // Get every year with contributions.
    const metadata = await githubGraphQL(`
      query {
        viewer {
          login
          contributionsCollection {
            contributionYears
          }
        }
      }
    `);

    const viewer = metadata.viewer;

    if (
      !viewer ||
      viewer.login.toLowerCase() !==
        GITHUB_USERNAME.toLowerCase()
    ) {
      throw new Error(
        "The GitHub token belongs to a different account."
      );
    }

    const years = [
      ...new Set([
        ...viewer.contributionsCollection.contributionYears,
        currentYear,
      ]),
    ]
      .filter(
        (year) =>
          Number.isInteger(year) &&
          year >= 2008 &&
          year <= currentYear
      )
      .sort((a, b) => a - b);

    // Retrieve official totals for every year.
    // Retrieve daily heatmap data for the current year.
    const yearlyFields = years
      .map((year) => {
        const from =
          `${year}-01-01T00:00:00Z`;

        const to =
          year === currentYear
            ? now.toISOString()
            : `${year}-12-31T23:59:59Z`;

        return `
          year${year}: contributionsCollection(
            from: "${from}"
            to: "${to}"
          ) {
            contributionCalendar {
              totalContributions

              ${
                year === currentYear
                  ? `
                    weeks {
                      contributionDays {
                        date
                        contributionCount
                        contributionLevel
                      }
                    }
                  `
                  : ""
              }
            }
          }
        `;
      })
      .join("\n");

    const result = await githubGraphQL(`
      query {
        viewer {
          login
          ${yearlyFields}
        }
      }
    `);

    const yearlyTotals = years.map((year) => {
      const calendar =
        result.viewer[`year${year}`]
          .contributionCalendar;

      return {
        year,
        total: calendar.totalContributions,
      };
    });

    const totalContributions =
      yearlyTotals.reduce(
        (sum, item) => sum + item.total,
        0
      );

    const currentCalendar =
      result.viewer[`year${currentYear}`]
        .contributionCalendar;

    const levelMap = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };

    const activity = currentCalendar.weeks
      .flatMap((week) => week.contributionDays)
      .filter(
        (day) =>
          day.date >= `${currentYear}-01-01` &&
          day.date <= today
      )
      .map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: levelMap[day.contributionLevel] ?? 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Vercel caches the response briefly.
    // New requests refresh data roughly every minute.
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=30"
    );

    return res.status(200).json({
      username: viewer.login,
      currentYear,
      currentYearTotal:
        currentCalendar.totalContributions,
      totalContributions,
      yearlyTotals,
      activity,
      syncedAt: now.toISOString(),
    });
  } catch (error) {
    console.error(
      "GitHub contributions API:",
      error.message
    );

    return res.status(502).json({
      error:
        "GitHub contribution data is temporarily unavailable.",
    });
  }
}
