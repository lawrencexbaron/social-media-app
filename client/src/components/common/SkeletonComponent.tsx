import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface SkeletonComponentProps {
  count?: number;
  circle?: boolean;
  className?: string;
  width?: number;
  height?: number;
  borderRadius?: string;
  duration?: number;
  baseColor?: string;
  direction?: "ltr" | "rtl";
  highlightColor?: string;
}

const SkeletonComponent = ({
  count = 1,
  circle = false,
  className = "",
  width = 100,
  height = 10,
  borderRadius = "0.25rem",
  duration = 1.5,
  baseColor = "#ebebeb",
  direction = "ltr" as 'ltr' | 'rtl',
  highlightColor = "#444",
}: SkeletonComponentProps) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <Skeleton
        count={count}
        circle={circle}
        className={className}
        width={width}
        height={height}
        borderRadius={borderRadius}
        duration={duration}
        direction={direction}
      />
    </SkeletonTheme>
  );
};

export default SkeletonComponent;
