"use client";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Force the cursor to stay hidden until the user physically moves their mouse
    const updatePosition = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive =
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "input" ||
        target.tagName.toLowerCase() === "textarea" ||
        target.closest("a") !== null ||
        target.closest("button") !== null;
      setIsHovering(interactive);
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible]);

  // Don't render anything until the first mouse movement is detected
  if (!isVisible) return null;

  return (
    <>
      {/* Primary Dot */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "12px",
          height: "12px",
          backgroundColor: "#D97757", // FRUOR Copper
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 999999,
          // CSS transform handles the movement and scaling instantly
          transform: `translate(${position.x - 6}px, ${position.y - 6}px) scale(${isHovering ? 0 : 1})`,
          transition: "transform 0.1s ease-out",
        }}
      />

      {/* Trailing Glass Ring */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "40px",
          height: "40px",
          border: "2px solid #D97757",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 999998,
          backdropFilter: "blur(4px)", // Glassmorphism effect
          transform: `translate(${position.x - 20}px, ${position.y - 20}px) scale(${isHovering ? 1.5 : 1})`,
          backgroundColor: isHovering ? "rgba(217, 119, 87, 0.15)" : "transparent",
          // The slightly slower transition creates the "trailing" physics effect
          transition: "transform 0.2s ease-out, background-color 0.2s ease",
        }}
      />
    </>
  );
}