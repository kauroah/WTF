import React from "react";

const SRC = "/logo-engine.svg";

export default function Logo({
  className = "",
  height = 28,
  invert = false,
}) {
  return (
    <img
      src={SRC}
      alt="What The Fashion"
      className={`object-contain ${
        invert ? "invert" : ""
      } ${className}`}
      style={{ height }}
    />
  );
}