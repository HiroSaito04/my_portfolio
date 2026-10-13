
import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

/* =========================================================
   CONFIGURATION
========================================================= */

const CHANNEL_NAME = "portfolio-live-visitors";

const VISITOR_ID_KEY = "mr-portfolio-visitor-id";
const AVATAR_KEY = "mr-portfolio-mascot-v3";

const AVATAR_COUNT = 5;

/* =========================================================
   RANDOM AVATAR SELECTION
========================================================= */

function getRandomAvatar() {
  if (
    typeof crypto !== "undefined" &&
    crypto.getRandomValues
  ) {
    const values = new Uint32Array(1);

    crypto.getRandomValues(values);

    return values[0] % AVATAR_COUNT;
  }

  return Math.floor(Math.random() * AVATAR_COUNT);
}

/* =========================================================
   BROWSER IDENTITY
========================================================= */

function getVisitorIdentity() {
  const fallbackId =
    typeof crypto !== "undefined" &&
    crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);

    if (!id) {
      id = fallbackId;
      localStorage.setItem(VISITOR_ID_KEY, id);
    }

    const savedAvatar = localStorage.getItem(
      AVATAR_KEY
    );

    let avatarIndex =
      savedAvatar !== null
        ? Number(savedAvatar)
        : NaN;

    if (
      !Number.isInteger(avatarIndex) ||
      avatarIndex < 0 ||
      avatarIndex >= AVATAR_COUNT
    ) {
      avatarIndex = getRandomAvatar();

      localStorage.setItem(
        AVATAR_KEY,
        String(avatarIndex)
      );
    }

    return {
      id,
      avatarIndex,
    };
  } catch {
    return {
      id: fallbackId,
      avatarIndex: getRandomAvatar(),
    };
  }
}

/* =========================================================
   LIVE VISITOR HOOK
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

    const identity = getVisitorIdentity();

    /* =====================================================
       CREATE REALTIME CHANNEL
    ===================================================== */

    const channel = supabase.channel(
      CHANNEL_NAME,
      {
        config: {
          presence: {
            key: identity.id,
          },
        },
      }
    );

    /* =====================================================
       SYNC ACTIVE VISITORS
    ===================================================== */

    const syncVisitors = () => {
      if (!mounted) return;

      const presenceState = channel.presenceState();

      const currentVisitors = Object.entries(
        presenceState
      )
        .filter(
          ([, sessions]) =>
            Array.isArray(sessions) &&
            sessions.length > 0
        )
        .map(([id, sessions]) => {
          const sessionWithAvatar = sessions.find(
            (session) =>
              Number.isInteger(
                session.avatarIndex
              ) &&
              session.avatarIndex >= 0 &&
              session.avatarIndex < AVATAR_COUNT
          );

          return {
            id,
            avatarIndex:
              sessionWithAvatar?.avatarIndex ?? 0,
          };
        });

      /* Show the current browser first. */

      currentVisitors.sort((a, b) => {
        if (a.id === identity.id) return -1;
        if (b.id === identity.id) return 1;

        return a.id.localeCompare(b.id);
      });

      setVisitors(currentVisitors);
      setVisitorCount(currentVisitors.length);
      setStatus("connected");
    };

    /* =====================================================
       LISTEN FOR PRESENCE CHANGES
    ===================================================== */

    channel.on(
      "presence",
      { event: "sync" },
      syncVisitors
    );

    /* =====================================================
       JOIN CHANNEL
    ===================================================== */

    channel.subscribe(async (channelStatus) => {
      if (!mounted) return;

      if (channelStatus === "SUBSCRIBED") {
        try {
          const result = await channel.track({
            avatarIndex: identity.avatarIndex,
            joined_at: new Date().toISOString(),
          });

          if (!mounted) return;

          if (result !== "ok") {
            throw new Error(
              "Presence tracking failed."
            );
          }
        } catch (error) {
          if (!mounted) return;

          console.error(
            "Visitor tracking error:",
            error
          );

          setStatus("error");
          setVisitorCount(null);
          setVisitors([]);
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

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      mounted = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return {
    visitorCount,
    visitors,
    status,
  };
}
