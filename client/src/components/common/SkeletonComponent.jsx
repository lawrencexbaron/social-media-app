import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonComponent = ({
  count = 1,
  circle = false,
  className = "",
  width = 100,
  height = 10,
  borderRadius = "0.25rem",
  duration = 1.5,
  baseColor = "#ebebeb",
  direction = "ltr",
  highlightColor = "#444",
}) => {
  return (
    <SkeletonTheme color={baseColor} highlightColor={highlightColor}>
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
