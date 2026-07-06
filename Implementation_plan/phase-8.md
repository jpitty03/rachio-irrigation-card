Phase 8: Add layout and styling options
Goal

Make the card configurable enough for your dashboard without overbuilding it.

Suggested config
layout:
  columns: 2
  compact: true
  show_status: true
  show_timer: true
Supported options
export interface LayoutConfig {
  columns?: number;
  compact?: boolean;
  show_status?: boolean;
  show_timer?: boolean;
}
Target layouts

Your preferred layout:

Irrigation Quick Run   ●

[ Zone 1 info ] [ Zone 2 info ]
[ Zone 3 info ] [ Zone 4 info ]

[ Rain Delay ] [ Standby ]
[      Stop Watering      ]

Add CSS variable support:

.zones {
  grid-template-columns: repeat(var(--zone-columns, 2), minmax(0, 1fr));
}

Then set style dynamically in render:

style=${`--zone-columns: ${this.config.layout?.columns ?? 2}`}