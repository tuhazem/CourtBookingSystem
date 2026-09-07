import styles from './PageBadge.module.css';

interface PageBadgeProps {
  icon: string;
  text: string;
}

/**
 * Shared badge component for page headers
 * Consistent styling across About, Partner, Support pages
 */
export default function PageBadge({ icon, text }: PageBadgeProps) {
  return (
    <div className={styles.badge}>
      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}
