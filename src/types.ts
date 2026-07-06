export interface ServiceActionConfig {
  service: string;
  data?: Record<string, unknown>;
  target?: Record<string, unknown>;
}

export interface IrrigationZoneConfig {
  name?: string;
  location?: string;
  entity: string;
  duration?: number;
  icon?: string;
  tap_action?: ServiceActionConfig;
}

export interface LayoutConfig {
  columns?: number;
  compact?: boolean;
  show_status?: boolean;
  show_timer?: boolean;
}

export interface RachioIrrigationCardConfig {
  type: string;
  title?: string;
  zones: IrrigationZoneConfig[];
  rain_delay_entity?: string;
  standby_entity?: string;
  show_timer?: boolean;
  default_duration?: number;
  stop_action?: ServiceActionConfig;
  layout?: LayoutConfig;
}

export interface HomeAssistantEntity {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    [key: string]: unknown;
  };
}

export interface HomeAssistantLike {
  states: Record<string, HomeAssistantEntity>;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>
  ) => Promise<void>;
}