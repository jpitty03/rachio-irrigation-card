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
  }

  .card {
    padding: 12px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
  }

  .connection {
    color: var(--success-color, var(--primary-color));
  }

  .zones {
    display: grid;
    grid-template-columns: repeat(var(--zone-columns, 2), minmax(0, 1fr));
    gap: var(--zone-gap, 8px);
  }

  .zone,
  .action {
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    cursor: pointer;
    min-height: 42px;
    padding: 7px 9px;
    font: inherit;
  }

  .card.compact {
    padding: 6px;
  }

  .card.compact .zone {
    min-height: 32px;
    padding: 4px 6px;
  }

  .card.compact .zone-status {
    display: none;
  }

  .card:not(.compact) .zone-status {
    font-size: 12px;
    opacity: 0.75;
  }

  .zone {
    text-align: left;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "name timer"
      "status timer";
    align-items: center;
    gap: 1px 8px;
  }

  .zone:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .zone.active {
    background: var(--primary-color);
    color: var(--text-primary-color);
    border-color: var(--primary-color);
  }

  .zone-name {
    grid-area: name;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .zone-status {
    grid-area: status;
    font-size: 12px;
    opacity: 0.75;
  }

  .timer {
    grid-area: timer;
    font-variant-numeric: tabular-nums;
    font-size: 13px;
    opacity: 0.9;
  }

  .actions {
    display: grid;
    grid-template-columns: repeat(var(--action-columns, 2), minmax(0, 1fr));
    gap: 8px;
    margin-top: 8px;
  }

  .stop {
    grid-column: 1 / -1;
  }

  .warnings {
    margin-bottom: 8px;
  }

  .warning {
    font-size: 12px;
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
