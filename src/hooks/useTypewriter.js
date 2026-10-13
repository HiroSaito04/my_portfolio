
import { useEffect, useState } from "react";

export function useTypewriter(
  phrases,
  {
    typingSpeed = 65,
    deletingSpeed = 35,
    pauseDuration = 1800,
  } = {}
) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;

    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updatePreference = () => {
      setReducedMotion(media.matches);
    };

    media.addEventListener("change", updatePreference);

    return () => {
      media.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || phrases.length === 0) return;

    const currentPhrase = phrases[phraseIndex] ?? "";

    let delay = deleting ? deletingSpeed : typingSpeed;

    if (!deleting && characterCount === currentPhrase.length) {
      delay = pauseDuration;
    } else if (deleting && characterCount === 0) {
      delay = 250;
    }

    const timer = window.setTimeout(() => {
      if (!deleting && characterCount === currentPhrase.length) {
        setDeleting(true);
        return;
      }

      if (deleting && characterCount === 0) {
        setPhraseIndex((index) => (index + 1) % phrases.length);
        setDeleting(false);
        return;
      }

      setCharacterCount((count) =>
        count + (deleting ? -1 : 1)
      );
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    phraseIndex,
    characterCount,
    deleting,
    phrases,
    reducedMotion,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  if (phrases.length === 0) return "";

  if (reducedMotion) {
    return phrases[0];
  }

  return phrases[phraseIndex].slice(0, characterCount);
}
