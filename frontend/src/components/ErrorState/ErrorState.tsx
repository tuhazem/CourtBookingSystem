import styles from './ErrorState.module.css';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'حدث خطأ في الاتصال',
  message = 'تعذر تحميل البيانات من السيرفر. يرجى التأكد من تشغيل الـ Backend API.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.iconWrapper}>
        <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>
          cloud_off
        </span>
      </div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>

      {onRetry && (
        <button type="button" onClick={onRetry} className={styles.retryBtn}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
            refresh
          </span>
          <span>إعادة المحاولة</span>
        </button>
      )}
    </div>
  );
}
