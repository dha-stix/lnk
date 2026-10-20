import type { Modifier } from "@dnd-kit/core";

/** Keeps dragged rows in their column (same as @dnd-kit/modifiers, without the extra package). */
export const restrictToVerticalAxis: Modifier = ({ transform }) => ({ ...transform, x: 0 });
