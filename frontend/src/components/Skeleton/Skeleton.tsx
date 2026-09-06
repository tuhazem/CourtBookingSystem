import styles from './Skeleton.module.css';

export function CourtSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
        <div className={styles.skeletonTags}>
          <div className={styles.skeletonTag} />
          <div className={styles.skeletonTag} />
        </div>
        <div className={styles.skeletonFooter}>
          <div className={styles.skeletonPrice} />
          <div className={styles.skeletonBtn} />
        </div>
      </div>
    </div>
  );
}

export function SlotsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '4.5rem',
            backgroundColor: '#f1f5f9',
            borderRadius: 'var(--radius-lg)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  );
}
