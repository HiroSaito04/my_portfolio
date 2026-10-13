
import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

/* =========================================================
   CONFIGURATION
========================================================= */

const CHANNEL_NAME = "portfolio-live-visitors";
const STORAGE_KEY = "mr-portfolio-visitor-id";

const AVATAR_COUNT = 5;

/* =========================================================
   ANONYMOUS BROWSER ID

   Reuses one ID across tabs in the same browser.
   No email, name, or account is required.
========================================================= */

function getVisitorId() {
  try {
    let id = window.localStorage.getItem(STORAGE_KEY);

    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(STORAGE_KEY, id);
    }

    return id;
  } catch {
    return crypto.randomUUID();
  }
}

/* =========================================================
   CONSISTENT AVATAR SELECTION
========================================================= */

function getAvatarIndex(id) {
  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = (
      (hash * 31) + id.charCodeAt(i)
    ) >>> 0;
  }

  return hash % AVATAR_COUNT;
}

/* =========================================================
   REALTIME VISITOR HOOK
========================================================= */

export function useLiveVisitors() {
  const [visitorCount, setVisitorCount] =
    useState(null);

  const [visitors, setVisitors] = useState([]);

  const [status, setStatus] = useState(
    supabase ? "connecting" : "unconfigured"
  );

  useEffect(() => {
    if (!supabase) {
      setStatus("unconfigured");
      return;
    }

    let mounted = true;

    const visitorId = getVisitorId();

    const channel = supabase.channel(
      CHANNEL_NAME,
      {
        config: {
          presence: {
            key: visitorId,
          },
        },
      }
    );

    /* ===============================================
       READ THE ACTUAL PRESENCE STATE
    ================================================ */

    const syncVisitors = () => {
      if (!mounted) return;

      const presenceState = channel.presenceState();

      const activeVisitors = Object.entries(
        presenceState
      )
        .filter(
          ([, presences]) =>
            Array.isArray(presences) &&
            presences.length > 0
        )
        .map(([id, presences]) => ({
          id,
          avatarIndex:
            typeof presences[0]?.avatarIndex === "number"
              ? presences[0].avatarIndex % AVATAR_COUNT
              : getAvatarIndex(id),
        }))
        .sort((a, b) =>
          a.id.localeCompare(b.id)
        );

      setVisitors(activeVisitors);
      setVisitorCount(activeVisitors.length);
      setStatus("connected");
    };

    /* ===============================================
       LISTEN FOR CHANGES
    ================================================ */

    channel.on(
      "presence",
      { event: "sync" },
      syncVisitors
    );

    /* ===============================================
       CONNECT AND REGISTER THIS BROWSER
    ================================================ */

    channel.subscribe(async (channelStatus) => {
      if (!mounted) return;

      if (channelStatus === "SUBSCRIBED") {
        const result = await channel.track({
          avatarIndex: getAvatarIndex(visitorId),
          online_at: new Date().toISOString(),
        });

        if (!mounted) return;

        if (result !== "ok") {
          setStatus("error");
          setVisitorCount(null);
          setVisitors([]);
          console.error(
            "Could not register visitor presence:",
            result
          );
        }

        return;
      }

      if (
        channelStatus === "CHANNEL_ERROR" ||
        channelStatus === "TIMED_OUT" ||
        channelStatus === "CLOSED"
      ) {
        setStatus("error");
        setVisitorCount(null);
        setVisitors([]);
      }
    });

    /* ===============================================
       CLEANUP WHEN SITE IS CLOSED
    ================================================ */

    return () => {
      mounted = false;

      supabase.removeChannel(channel);
    };
  }, []);

  return {
    visitorCount,
    visitors,
    status,
  };
}
