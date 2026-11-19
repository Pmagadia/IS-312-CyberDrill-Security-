
import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";

export default function DroppablePort({
  port,
  matchedProtocol,
  isMissed = false,
  onSelect,
}: {
  port: number;
  matchedProtocol?: string;
  isMissed?: boolean;
  onSelect?: (port: number) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: String(port),
  });

  // Red for missed, green for correct.
  const backgroundColor = isMissed
    ? "#7f1d1d"
    : matchedProtocol
      ? "#1b4332"
      : isOver
        ? "#b3e5fc"
        : "var(--surface)";

  // Use theme text color for unmatched ports.
  // Keep white text on completed matches.
  const textColor =
    matchedProtocol
      ? "#ffffff"
      : isOver
        ? "#111111"
        : "var(--text)";

  return (
    <motion.div
      ref={setNodeRef}
      onClick={() => onSelect?.(port)}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(event) => {
        if (
          onSelect &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onSelect(port);
        }
      }}
      // Briefly pulses when an answer is completed.
      animate={
        matchedProtocol
          ? { scale: [1, 1.06, 1] }
          : { scale: 1 }
      }
      transition={{
        duration: 0.8,
        ease: "easeInOut",
      }}
      style={{
        padding: "10px",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        backgroundColor,
        color: textColor,
        textAlign: "center",
        minHeight: "65px",
        cursor: onSelect ? "pointer" : "default",
      }}
    >
      <strong>{port}</strong>

      {matchedProtocol && (
        <p>
          {matchedProtocol} {isMissed ? "✗" : "✓"}
        </p>
      )}
    </motion.div>
  );
}
