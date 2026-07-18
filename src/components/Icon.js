import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

// Line-art icon set matching the shared Claude Design file (Divyas Closet.dc.html)
export default function Icon({ name, size = 24, color = '#0A0A0A', strokeWidth = 1.85 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' };
  const strokeProps = { stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };

  switch (name) {
    case 'home':
      return (
        <Svg {...common}>
          <Path d="M3 10.6 12 3.2l9 7.4" {...strokeProps} />
          <Path d="M5.2 9.4V20a1 1 0 0 0 1 1h11.6a1 1 0 0 0 1-1V9.4" {...strokeProps} />
        </Svg>
      );
    case 'outfits':
      return (
        <Svg {...common}>
          <Path d="M9 6h11M9 12h11M9 18h11" {...strokeProps} />
          <Circle cx="4.2" cy="6" r="1.15" fill={color} stroke="none" />
          <Circle cx="4.2" cy="12" r="1.15" fill={color} stroke="none" />
          <Circle cx="4.2" cy="18" r="1.15" fill={color} stroke="none" />
        </Svg>
      );
    case 'planner':
      return (
        <Svg {...common}>
          <Rect x="3.2" y="4.6" width="17.6" height="16" rx="2.2" {...strokeProps} />
          <Path d="M3.2 9.4h17.6M8 2.6v4M16 2.6v4" {...strokeProps} />
        </Svg>
      );
    case 'wardrobe':
      return (
        <Svg {...common}>
          <Rect x="4.5" y="3" width="15" height="18" rx="1.6" {...strokeProps} />
          <Path d="M12 3.4v17.2M9 10v3.2M15 10v3.2" {...strokeProps} />
        </Svg>
      );
    case 'plus':
      return (
        <Svg {...common}>
          <Path d="M12 5v14M5 12h14" {...strokeProps} />
        </Svg>
      );
    default:
      return null;
  }
}
