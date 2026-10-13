
import { useEffect, useState } from "react";

import {
  ArrowUpRight,
  Code2,
  RefreshCw,
} from "lucide-react";

import { ActivityCalendar } from "react-activity-calendar";

import { githubConfig } from "../../config/github";

const SYNC_INTERVAL = 60 * 1000;

export function GitHubActivity() {
  const username = githubConfig.username;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    let controller = null;

    async function syncContributions() {
      controller?.abort();
      controller = new AbortController();

      try {
        const response = await fetch(
          "/api/github-contributions",
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to synchronize contributions"
          );
        }

        const result = await response.json();

        if (
          !Array.isArray(result.activity) ||
          !Number.isFinite(
            result.totalContributions
          )
        ) {
          throw new Error(
            "Invalid contribution response"
          );
        }

        if (mounted) {
          setData(result);
          setError(false);
        }
      } catch (err) {
        if (err.name !== "AbortError" && mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    // Initial fetch.
    syncContributions();

    // Refresh automatically while the page is open.
    const interval = window.setInterval(() => {
      if (!document.hidden) {
        syncContributions();
      }
    }, SYNC_INTERVAL);

    // Also refresh when the visitor returns to the tab.
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncContributions();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      mounted = false;
      controller?.abort();
      window.clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  const profileUrl = username
    ? `https://github.com/${encodeURIComponent(username)}`
    : null;

  const formattedTotal =
    data?.totalContributions.toLocaleString() ?? null;

  const lastSynced = data?.syncedAt
    ? new Date(data.syncedAt).toLocaleTimeString(
        undefined,
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    : null;

  return (
    <div
      className="about-github"
      data-reveal
    >
      {/* HEADER */}

      <div className="about-github-header">
        <div className="about-github-title">
          <span className="about-github-icon">
            <Code2
              size={20}
              aria-hidden="true"
            />
          </span>

          <div>
            <span className="about-eyebrow">
              DEVELOPMENT ACTIVITY
            </span>

            <h3>GitHub contributions</h3>
          </div>
        </div>

        {profileUrl && (
          <a
            href={profileUrl}
            className="about-github-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View profile

            <ArrowUpRight
              size={17}
              aria-hidden="true"
            />
          </a>
        )}
      </div>

      {/* CALENDAR AND TOTAL */}

      <div className="about-github-body">
        {loading && !data ? (
          <div className="about-github-loading">
            <RefreshCw
              size={16}
              aria-hidden="true"
            />
            Synchronizing GitHub activity...
          </div>
        ) : !data ? (
          <div className="about-github-error">
            GitHub activity is temporarily unavailable.
          </div>
        ) : (
          <>
            <div className="about-github-calendar-heading">
              <span>
                Github Activity through Today
              </span>
            </div>

            <div className="about-github-scroll">
              <ActivityCalendar
                data={data.activity}
                blockSize={11}
                blockMargin={4}
                fontSize={12}
                showTotalCount={false}
                showColorLegend={true}
                showWeekdayLabels={true}
              />
            </div>

            <div className="about-github-total">
              <div className="about-github-total-count">
                <strong>{formattedTotal}</strong>
                <span>contributions</span>
              </div>

              <span className="about-github-sync">
                {error
                  ? "Using last available data"
                  : `Synced ${lastSynced}`}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
