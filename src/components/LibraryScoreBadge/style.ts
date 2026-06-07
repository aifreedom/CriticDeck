let styleInjected = false

export const ensureTileBadgeStyle = () => {
  if (styleInjected || typeof document === 'undefined') return
  styleInjected = true
  const style = document.createElement('style')
  style.textContent = `
    .criticdeck-tile-badge {
      position: absolute;
      bottom: 4px;
      left: 4px;
      z-index: 3;
      min-width: 28px;
      height: 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      padding: 0 5px;
      pointer-events: none;
      user-select: none;
      box-shadow: 0 1px 4px rgba(0,0,0,0.6);
      letter-spacing: 0.5px;
      line-height: 1;
    }
    .criticdeck-tile-badge[data-tone='great'] {
      background: linear-gradient(135deg, #1b5e20, #43a047);
    }
    .criticdeck-tile-badge[data-tone='good'] {
      background: linear-gradient(135deg, #f57f17, #ffb74d);
    }
    .criticdeck-tile-badge[data-tone='weak'] {
      background: linear-gradient(135deg, #b71c1c, #e57373);
    }
    .criticdeck-tile-badge[data-tone='unknown'] {
      display: none;
    }
  `
  document.head.appendChild(style)
}
