'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/lib/api';
import { saveAuth } from '@/lib/auth';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const authResult = await adminLogin({
        username: username.trim(),
        password: password.trim(),
      });

      // Store JWT token & role
      saveAuth(authResult);

      // Redirect to main admin dashboard
      router.push('/admin');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('تعذر تسجيل الدخول. تحقق من البيانات.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
              lock
            </span>
          </div>
          <h1 className={styles.title}>تسجيل دخول المشرفين</h1>
          <p className={styles.subtitle}>أدخل بيانات حساب الإدارة للوصول للوحة التحكم</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          {error && (
            <div className={styles.errorBanner}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                error
              </span>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label htmlFor="username" className={styles.label}>
              اسم المستخدم
            </label>
            <div className={styles.inputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>person</span>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              كلمة المرور
            </label>
            <div className={styles.inputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? (
              <span>جارٍ التحقق وإصدار التوكن...</span>
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <span>←</span>
              </>
            )}
          </button>
        </form>

        <div className={styles.hintNote}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>
            info
          </span>
          <span>الحساب الافتراضي للنظام:</span>
          <strong dir="ltr">admin / Admin@123</strong>
        </div>
      </div>
    </div>
  );
}
