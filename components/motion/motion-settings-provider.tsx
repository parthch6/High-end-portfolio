"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type MotionSettings = {
  isMobile: boolean;
  reduceMotion: boolean;
};

const MotionSettingsContext = createContext<MotionSettings>({
  isMobile: false,
  reduceMotion: false,
});

type MotionSettingsProviderProps = {
  children: ReactNode;
};

export function MotionSettingsProvider({
  children,
}: MotionSettingsProviderProps) {
  const [settings, setSettings] = useState<MotionSettings>({
    isMobile: false,
    reduceMotion: false,
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setSettings({
        isMobile: mobileQuery.matches,
        reduceMotion: motionQuery.matches,
      });
    };

    update();
    mobileQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);

    return () => {
      mobileQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  return (
    <MotionSettingsContext.Provider
      value={{
        isMobile: settings.isMobile,
        reduceMotion: settings.reduceMotion,
      }}
    >
      {children}
    </MotionSettingsContext.Provider>
  );
}

export function useMotionSettings() {
  return useContext(MotionSettingsContext);
}
