import React from "react";
import { IconProps } from "./SharedProps";

const MergeIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "currentColor",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 21V3M12 3L8.49999 6.5M12 3L15.5 6.5" />
      <path d="M5.754 21L5.754 16.6338C5.754 10.0019 12 13.6006 12 7.748" />
      <path d="M18.246 21V16.6338C18.246 13.8696 17.1609 12.8827 15.8953 12.248" />
    </svg>
  );
};

export default MergeIcon;
