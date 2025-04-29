import { CSSProperties } from 'react';

type WaveDividerProps = {
  position: 'top' | 'bottom';
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  className?: string;
  style?: CSSProperties;
};

const WaveDivider = ({
  position = 'bottom',
  primaryColor = '#0891B2',
  secondaryColor = '#22D3EE',
  tertiaryColor = '#0369A1',
  className = '',
  style,
}: WaveDividerProps) => {
  return (
    <div className={`wave-divider ${position} ${className}`} style={style}>
      <svg
        className="wave-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="wave-path"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g>
          <use
            xlinkHref="#wave-path"
            className="wave-3"
            x="50"
            y="0"
            fill={tertiaryColor}
          />
          <use
            xlinkHref="#wave-path"
            className="wave-2"
            x="50"
            y="3"
            fill={secondaryColor}
          />
          <use
            xlinkHref="#wave-path"
            className="wave-1"
            x="50"
            y="5"
            fill={primaryColor}
          />
        </g>
      </svg>
    </div>
  );
};

export default WaveDivider; 