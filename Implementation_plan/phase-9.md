Phase 9: Add card validation and error handling
Goal

Make the card friendly when users misconfigure it.

Validate:

[ ] zones is present
[ ] zones is an array
[ ] each zone has entity
[ ] duration is positive if provided
[ ] rain_delay_entity exists if configured
[ ] standby_entity exists if configured
[ ] service strings are valid if action config is used

Display missing entities inside the card instead of throwing fatal errors.

Example:

Zone 1
Missing entity

Do throw errors only for invalid config shape, such as missing zones.