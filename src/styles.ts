import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    max-width: 100%;
  }

  ha-card {
    display: block;
    overflow: hidden;
    box-sizing: border-box;
    max-width: 100%;
    background: var(--ha-card-background, var(--card-background-color));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, none);
  }

  .quick-run-card {
    padding: 16px;
  }

  /* ── Header ── */
  .quick-run-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .connection-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: var(--secondary-text-color);
  }

  .connection-status ha-icon {
    color: var(--success-color, var(--state-active-color, var(--primary-color)));
    --mdc-icon-size: 18px;
  }

  /* ── Divider ── */
  .divider {
    height: 1px;
    background: var(--divider-color);
    margin-bottom: 12px;
  }

  /* ── Status row (rain) ── */
  .status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
  }

  .status-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--secondary-text-color);
    font-size: 0.9rem;
  }

  .status-label ha-icon {
    color: var(--state-icon-color, var(--secondary-text-color));
    --mdc-icon-size: 20px;
  }

  .status-value {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  /* ── Progress section ── */
  .progress-section {
    padding: 8px 0;
    margin-bottom: 12px;
  }

  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .progress-zone {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .progress-time {
    font-size: 0.875rem;
    font-variant-numeric: tabular-nums;
    color: var(--secondary-text-color);
  }

  .progress-bar {
    height: 8px;
    background: var(--divider-color);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--primary-color, var(--state-active-color));
    border-radius: 4px;
    transition: width 1s linear;
  }

  /* ── Zone grid ── */
  .zone-grid {
    display: grid;
    grid-template-columns: repeat(var(--zone-columns, 4), minmax(0, 1fr));
    gap: 8px;
    margin-bottom: 12px;
  }

  .zone-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--card-background-color, transparent);
    color: var(--primary-text-color);
    cursor: pointer;
    font: inherit;
    transition: background 0.2s, border-color 0.2s;
  }

  .zone-button:hover {
    border-color: var(--primary-color);
  }

  .zone-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .zone-button.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-primary-color, white);
  }

  .zone-button.active .zone-icon {
    color: var(--text-primary-color, white);
  }

  .zone-icon {
    --mdc-icon-size: 28px;
    color: var(--state-icon-color, var(--primary-color));
  }

  .zone-name {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .zone-location {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .zone-status {
    font-size: 0.75rem;
    opacity: 0.6;
  }

  /* ── Compact mode ── */
  .quick-run-card.compact {
    padding: 8px;
  }

  .quick-run-card.compact .zone-button {
    padding: 6px 4px;
  }

  .quick-run-card.compact .zone-location,
  .quick-run-card.compact .zone-status {
    display: none;
  }

  .quick-run-card.compact .zone-icon {
    --mdc-icon-size: 20px;
  }

  /* ── Action grid ── */
  .action-grid {
    display: grid;
    grid-template-columns: repeat(var(--action-columns, 3), minmax(0, 1fr));
    gap: 8px;
  }

  .action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--card-background-color, transparent);
    color: var(--primary-text-color);
    cursor: pointer;
    font: inherit;
    transition: background 0.2s, border-color 0.2s;
  }

  .action-button:hover {
    border-color: var(--primary-color);
  }

  .action-button.stop {
    border-color: var(--error-color, #db4437);
    color: var(--error-color, #db4437);
  }

  .action-button.stop:hover {
    background: var(--error-color, #db4437);
    color: var(--text-primary-color, white);
  }

  .action-icon {
    --mdc-icon-size: 24px;
  }

  .action-name {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .action-status {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  /* ── Warnings ── */
  .warnings {
    margin-bottom: 8px;
  }

  .warning {
    font-size: 0.75rem;
    color: var(--error-color, #db4437);
    padding: 4px 6px;
    border: 1px solid var(--error-color, #db4437);
    border-radius: 6px;
    margin-bottom: 4px;
  }

  .warning code {
    font-family: var(--code-font-family, monospace);
  }
`;