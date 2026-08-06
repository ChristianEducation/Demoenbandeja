export interface FloatPoint {
  top: number;
  left: number;
}

/** Posiciona una tarjeta flotante cerca de un elemento ancla, dentro del viewport. */
export function positionNearRect(rect: DOMRect, cardWidth: number, cardHeight: number, gap = 12): FloatPoint {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top = rect.bottom + gap;
  if (top + cardHeight > vh - 16) {
    const above = rect.top - gap - cardHeight;
    top = above > 16 ? above : Math.max(16, vh - cardHeight - 16);
  }

  let left = rect.left + rect.width / 2 - cardWidth / 2;
  left = Math.min(Math.max(left, 16), Math.max(16, vw - cardWidth - 16));

  return { top, left };
}
