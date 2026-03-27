import { useState } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  content: string;
  label?: string;
}

export default function Tooltip({ content, label = 'More information' }: TooltipProps) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);

  const visible = hovered || pinned;

  return (
    <span className={styles.wrapper}>
      <button
        type="button"
        className={`${styles.trigger} ${pinned ? styles.triggerPinned : ''}`}
        aria-label={label}
        aria-expanded={visible}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={() => setPinned(p => !p)}
      >
        ?
      </button>
      {visible && (
        <span role="tooltip" className={styles.bubble}>
          {content}
          {pinned && (
            <span className={styles.dismissHint}>Click ? to close</span>
          )}
        </span>
      )}
    </span>
  );
}
