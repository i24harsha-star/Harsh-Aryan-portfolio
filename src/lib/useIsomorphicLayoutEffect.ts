import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect in the browser, useEffect on the server.
 *
 * Pinned stages must be measured and positioned before paint or the first frame
 * shows an unpinned layout that then jumps. useLayoutEffect gives that, but
 * warns during SSR, so it is swapped out where there is no DOM.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
