import { useDroppable } from "@dnd-kit/core";

interface WashingMachineProps {
  width?: number;
  height?: number;
}

export default function EmptyWashingMachine({ width = 400, height = 500 }: WashingMachineProps) {
  // Droppable zones
  const { setNodeRef: setDrumRef, isOver: isDrumOver } = useDroppable({
    id: 'washing-drum',
  });

  const { setNodeRef: setTrayRef, isOver: isTrayOver } = useDroppable({
    id: 'detergent-tray',
  });

  const pivotX = 200 + 120; // drum center x + outer radius = hinge x (320)
  const pivotY = 280;

  return (
    <div className="relative inline-block">
      <svg
        width={width}
        height={height}
        viewBox="0 0 400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Washing Machine Body */}
        <rect
          x="50"
          y="50"
          width="300"
          height="400"
          rx="20"
          fill="#E5E7EB"
          stroke="#9CA3AF"
          strokeWidth="3"
        />
        
        {/* Control Panel */}
        <rect
          x="50"
          y="50"
          width="300"
          height="80"
          rx="20"
          fill="#D1D5DB"
          stroke="#9CA3AF"
          strokeWidth="3"
        />
        
        {/* Detergent Tray */}
        <rect
          x="80"
          y="70"
          width="120"
          height="40"
          rx="5"
          fill={isTrayOver ? "#4B5563" : "#6B7280"}
          stroke={isTrayOver ? "#10B981" : "#374151"}
          strokeWidth={isTrayOver ? "3" : "2"}
          className="transition-all"
        />
        
        {/* Tray Compartments */}
        <line x1="120" y1="70" x2="120" y2="110" stroke="#374151" strokeWidth="2" />
        <line x1="160" y1="70" x2="160" y2="110" stroke="#374151" strokeWidth="2" />
        
        {/* Tray Hover Indicator */}
        {isTrayOver && (
          <text
            x="140"
            y="95"
            textAnchor="middle"
            fill="#10B981"
            fontSize="12"
            fontWeight="bold"
          >
            DROP
          </text>
        )}
        
        {/* Control Buttons */}
        <circle cx="250" cy="90" r="15" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" />
        <circle cx="290" cy="90" r="15" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
        <circle cx="320" cy="90" r="15" fill="#10B981" stroke="#047857" strokeWidth="2" />
        
        {/* Drum Window Frame */}
        <circle
          cx="200"
          cy="280"
          r="120"
          fill="#1F2937"
          stroke="#111827"
          strokeWidth="4"
        />
        
        {/* Inner Drum - Dark cavity */}
        <circle
          cx="200"
          cy="280"
          r="110"
          fill="#1F2937"
          fillOpacity="0.9"
        />
        
        {/* Static Drum Holes */}
        {[...Array(24)].map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const radius = 85;
          const cx = 200 + radius * Math.cos(angle);
          const cy = 280 + radius * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="4"
              fill="#111827"
            />
          );
        })}
        
        {/* Center of drum */}
        <circle cx="200" cy="280" r="20" fill="#374151" />

        {/* Open Door - glass panel swung to the right, rotated around hinge at drum edge */}
        <g transform={`translate(${pivotX}, ${pivotY}) rotate(22)`}>
          {/* Door glass (positioned relative to hinge) */}
          <ellipse
            cx="70"
            cy="0"
            rx="60"
            ry="110"
            fill="#60A5FA"
            fillOpacity={isDrumOver ? "0.5" : "0.28"}
            stroke={isDrumOver ? "#10B981" : "#3B82F6"}
            strokeWidth={isDrumOver ? "4" : "3"}
            className="transition-all"
          />

          {/* Door frame (slightly larger ellipse) */}
          <ellipse
            cx="70"
            cy="0"
            rx="66"
            ry="116"
            fill="none"
            stroke="#111827"
            strokeWidth="4"
          />

          {/* Door handle on the open door (positioned relative to door) */}
          <rect
            x="120"
            y="-18"
            width="10"
            height="36"
            rx="4"
            fill="#6B7280"
            stroke="#374151"
            strokeWidth="2"
          />
        </g>

        {/* Door hinge (at the drum's right edge) */}
        <line
          x1={pivotX}
          y1={pivotY - 110}
          x2={pivotX}
          y2={pivotY + 110}
          stroke="#4B5563"
          strokeWidth="3"
        />
        <circle cx={pivotX} cy={pivotY - 100} r="5" fill="#374151" />
        <circle cx={pivotX} cy={pivotY} r="5" fill="#374151" />
        <circle cx={pivotX} cy={pivotY + 100} r="5" fill="#374151" />

        {/* Drop indicator text */}
        {isDrumOver && (
          <text
            x="200"
            y="280"
            textAnchor="middle"
            fill="#10B981"
            fontSize="24"
            fontWeight="bold"
          >
            DROP HERE
          </text>
        )}
      </svg>

      {/* Droppable overlay for drum - positioned absolutely over the drum area */}
      <div
        ref={setDrumRef}
        className="absolute rounded-full"
        style={{
          left: `${(80 / 400) * width}px`,
          top: `${(160 / 500) * height}px`,
          width: `${(240 / 400) * width}px`,
          height: `${(240 / 500) * height}px`,
          pointerEvents: 'all',
          // Uncomment to visualize the drop zone during development:
          // backgroundColor: isDrumOver ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.1)',
          // border: isDrumOver ? '2px solid green' : '2px dashed blue'
        }}
      />

      {/* Droppable overlay for detergent tray */}
      <div
        ref={setTrayRef}
        className="absolute"
        style={{
          left: `${(80 / 400) * width}px`,
          top: `${(70 / 500) * height}px`,
          width: `${(120 / 400) * width}px`,
          height: `${(40 / 500) * height}px`,
          borderRadius: '5px',
          pointerEvents: 'all',
          // Uncomment to visualize:
          backgroundColor: isTrayOver ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.1)',
          border: isTrayOver ? '2px solid green' : '2px dashed blue'
        }}
      />
    </div>
  );
}
// ...existing code...