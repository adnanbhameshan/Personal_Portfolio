import { useCallback, useMemo, useState } from "react";

const BOOT_STORAGE_KEY = "nexus.boot.skip";

export function useBootPreference() {
  const prefersSkip = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(BOOT_STORAGE_KEY) === "true";
  }, []);

  const [shouldBoot, setShouldBoot] = useState(!prefersSkip);

  const completeBoot = useCallback((skipNextTime = true) => {
    if (skipNextTime) {
      window.localStorage.setItem(BOOT_STORAGE_KEY, "true");
    }

    setShouldBoot(false);
  }, []);

  return {
    shouldBoot,
    completeBoot,
  };
}

