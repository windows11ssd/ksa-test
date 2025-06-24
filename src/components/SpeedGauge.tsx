
import React from 'react';

interface SpeedGaugeProps {
  value: number;
  maxValue: number;
  unit: string;
  label: string;
  color: string;
  size?: number;
}

export const SpeedGauge: React.FC<SpeedGaugeProps> = ({
  value,
  maxValue,
  unit,
  label,
  color,
  size = 200
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const strokeDasharray = 2 * Math.PI * 80; // 80 is the radius
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="80"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-300 dark:text-gray-600"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="80"
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-foreground">
            {value.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
      </div>
      
      {/* Label */}
      <div className="mt-4 text-lg font-semibold text-foreground">
        {label}
      </div>
    </div>
  );
};
