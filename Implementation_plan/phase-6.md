Phase 6: Improve the service model
Goal

Support both generic entities and integration-specific service calls.

Your first version can call:

hass.callService(domain, "turn_on", { entity_id: entityId });

That works for:

input_boolean.*
switch.*

But eventually you may want more advanced config.

Add configurable actions

Example future config:

type: custom:rachio-irrigation-card
title: Irrigation Quick Run
zones:
  - name: Zone 1
    entity: switch.rachio_zone_1
    duration: 10
    tap_action:
      service: switch.turn_on
      data:
        entity_id: switch.rachio_zone_1

stop_action:
  service: rachio.stop_watering
Action type
export interface ServiceActionConfig {
  service: string;
  data?: Record<string, unknown>;
  target?: Record<string, unknown>;
}
Helper
export async function callConfiguredService(
  hass: HomeAssistantLike,
  action: ServiceActionConfig
) {
  const [domain, service] = action.service.split(".");

  if (!domain || !service) {
    throw new Error(`Invalid service: ${action.service}`);
  }

  await hass.callService(domain, service, action.data, action.target);
}

This lets Rachio users configure Rachio-specific actions later without forcing you to develop against the actual integration.