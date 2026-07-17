import { useCallback, useMemo, useState } from "react";

const BOOT_SESSION_KEY = "nexus.boot.seen";

export function useBootPreference() {
  const prefersSkip = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.sessionStorage.getItem(BOOT_SESSION_KEY) === "true";
  }, []);

  const [shouldBoot, setShouldBoot] = useState(!prefersSkip);

  const completeBoot = useCallback((skipNextTime = true) => {
    if (skipNextTime) {
      window.sessionStorage.setItem(BOOT_SESSION_KEY, "true");
    }

    setShouldBoot(false);
  }, []);

  return {
    shouldBoot,
    completeBoot,
  };
}
