"use client";

import { useState, useEffect } from "react";
import { CHART_THEME } from "@/lib/charts/theme";

const MOBILE_BREAKPOINT = 640;

export default function useChartHeight(
  desktopHeight = CHART_THEME.spacing.chartHeight,
  mobileHeight = CHART_THEME.spacing.chartHeightMobile
): number {
  const [height, setHeight] = useState<number>(desktopHeight);

  useEffect(() => {
    function update() {
      setHeight(
        window.innerWidth < MOBILE_BREAKPOINT ? mobileHeight : desktopHeight
      );
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [desktopHeight, mobileHeight]);

  return height;
}
