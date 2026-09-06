'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { isAuthenticated } from '@/lib/auth';
import { fetchCourts, updateCourtPrice, toggleCourtStatus, createCourt } from '@/lib/api';
import { CourtDto, CourtType } from '@/lib/types';
import AdminNavbar from '@/components/Admin/AdminNavbar';
import ErrorState from '@/components/ErrorState/ErrorState';
import { modalBackdropVariants, modalContentVariants, staggerContainerVariants, fadeUpVariants } from '@/lib/animations';
import styles from './page.module.css';

export default function AdminCourtsPage() {
  const router = useRouter();
  const [courts, setCourts] = useState<CourtDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Modal: Edit Price
  const [editPriceTarget, setEditPriceTarget] = useState<CourtDto | null>(null);
  const [newPriceValue, setNewPriceValue] = useState<string>('');

  // Modal: Add Court
  const [isAddingCourt, setIsAddingCourt] = useState(false);
  const [newCourtName, setNewCourtName] = useState('');
  const [newCourtType, setNewCourtType] = useState<CourtType>(CourtType.Khomasy);
  const [newCourtPrice, setNewCourtPrice] = useState<string>('');

  const loadCourts = useCallback(async (isSilent: boolean = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      // Pass false to fetch ALL courts including those under maintenance
      const data = await fetchCourts(false);
      setCourts(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('تعذر تحميل بيانات الملاعب.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    loadCourts();
  }, [router, loadCourts]);

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Toggle Active / Maintenance status (instant action without blocking browser native confirm)
  const handleToggleStatus = async (court: CourtDto) => {
    const nextStatus = !court.isActive;
    setTogglingId(court.id);
    try {
      await toggleCourtStatus({ courtId: court.id, isActive: nextStatus });
      setNotification({
        type: 'success',
        message: nextStatus
          ? `تم تفعيل ${court.name} وأصبح متاحاً للحجز للعملاء بنجاح!`
          : `تم تحويل ${court.name} إلى وضع الصيانة بنجاح.`,
      });
      await loadCourts(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر تغيير حالة الملعب';
      setNotification({ type: 'error', message: msg });
    } finally {
      setTogglingId(null);
    }
  };

  // Open Edit Price Modal
  const openPriceModal = (court: CourtDto) => {
    setEditPriceTarget(court);
    setNewPriceValue(court.pricePerHour.toString());
  };

  // Submit Price Update
  const handleSavePrice = async (e: FormEvent) => {
    e.preventDefault();
    if (!editPriceTarget) return;

    const priceNum = parseFloat(newPriceValue);
    if (isNaN(priceNum) || priceNum <= 0) {
      setNotification({ type: 'error', message: 'يرجى إدخال سعر صحيح أكبر من صفر.' });
      return;
    }

    setActionLoading(true);
    try {
      await updateCourtPrice({
        courtId: editPriceTarget.id,
        newPrice: priceNum,
      });
      setNotification({
        type: 'success',
        message: `تم تحديث سعر الساعة لـ (${editPriceTarget.name}) إلى ${priceNum} ج.م بنجاح!`,
      });
      setEditPriceTarget(null);
      await loadCourts(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر تحديث السعر';
      setNotification({ type: 'error', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  // Submit New Court
  const handleCreateCourt = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCourtName.trim()) {
      setNotification({ type: 'error', message: 'يرجى إدخال اسم الملعب.' });
      return;
    }

    const priceNum = parseFloat(newCourtPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setNotification({ type: 'error', message: 'يرجى إدخال سعر ساعة صحيح.' });
      return;
    }

    setActionLoading(true);
    try {
      await createCourt({
        name: newCourtName.trim(),
        type: newCourtType,
        pricePerHour: priceNum,
      });
      setNotification({
        type: 'success',
        message: `تمت إضافة ملعب (${newCourtName.trim()}) بنجاح إلى النظام!`,
      });
      setIsAddingCourt(false);
      setNewCourtName('');
      setNewCourtPrice('');
      await loadCourts(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر إضافة الملعب';
      setNotification({ type: 'error', message: msg });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminNavbar />

      <main className={styles.main}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.titleBlock}>
            <h1>إدارة الملاعب والأسعار</h1>
            <p>التحكم في تسعير الساعات، إضافة ملاعب جديدة، وتفعيل أو تعطيل الملاعب لأعمال الصيانة</p>
          </div>

          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => setIsAddingCourt(true)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                add_circle
              </span>
              <span>إضافة ملعب جديد</span>
            </button>

            <button
              type="button"
              className={styles.refreshBtn}
              onClick={() => loadCourts(true)}
              disabled={refreshing || loading}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '1.125rem',
                  transform: refreshing ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.4s ease',
                }}
              >
                refresh
              </span>
              <span>{refreshing ? 'جاري التحديث...' : 'تحديث'}</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {notification && (
          <div
            style={{
              padding: '0.875rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.5rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor:
                notification.type === 'success' ? 'var(--color-primary-soft)' : 'var(--color-error-soft)',
              color:
                notification.type === 'success' ? 'var(--color-primary-dark)' : 'var(--color-error)',
              border: `1px solid ${
                notification.type === 'success' ? 'rgba(0, 109, 55, 0.2)' : 'rgba(239, 68, 68, 0.2)'
              }`,
            }}
          >
            <span>{notification.message}</span>
            <button
              type="button"
              onClick={() => setNotification(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Body */}
        {error ? (
          <ErrorState message={error} onRetry={() => loadCourts()} />
        ) : loading ? (
          <div className={styles.courtsGrid}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '14rem',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-2xl)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        ) : courts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#fff', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-border)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3.5rem', color: 'var(--color-primary)', marginBottom: '1rem', display: 'inline-block' }}>
              stadium
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>لا توجد ملاعب مسجلة</h3>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>ابدأ بإضافة أول ملعب رياضي بالنقر على زر "إضافة ملعب جديد".</p>
          </div>
        ) : (
          <motion.div
            className={styles.courtsGrid}
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {courts.map((court) => (
              <motion.div
                key={court.id}
                variants={fadeUpVariants}
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                className={`${styles.courtCard} ${!court.isActive ? styles.courtCardInactive : ''}`}
              >
                <div>
                  <div className={styles.cardHeader}>
                    <span className={styles.courtTypeBadge}>
                      {court.type === CourtType.Khomasy ? 'ملعب خماسي' : 'ملعب سباعي'}
                    </span>

                    <span
                      className={`${styles.statusPill} ${
                        court.isActive ? styles.statusPillActive : styles.statusPillInactive
                      }`}
                    >
                      <span
                        className={`${styles.statusDot} ${
                          court.isActive ? styles.statusDotActive : styles.statusDotInactive
                        }`}
                      />
                      <span>{court.isActive ? 'متاح ونشط' : 'تحت الصيانة'}</span>
                    </span>
                  </div>

                  <h3 className={styles.courtName}>{court.name}</h3>

                  <div className={styles.priceBlock}>
                    <span className={styles.priceLabel}>سعر الساعة:</span>
                    <div>
                      <span className={`${styles.priceValue} num-font`}>{court.pricePerHour}</span>
                      <span className={styles.priceUnit}>ج.م / ساعة</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    className={`${styles.actionBtn} ${styles.editPriceBtn}`}
                    onClick={() => openPriceModal(court)}
                    disabled={actionLoading}
                    title="تعديل سعر الساعة"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                      edit
                    </span>
                    <span>تعديل السعر</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    className={`${styles.actionBtn} ${
                      court.isActive ? styles.toggleStatusBtnActive : styles.toggleStatusBtnInactive
                    }`}
                    onClick={() => handleToggleStatus(court)}
                    disabled={togglingId === court.id || actionLoading}
                    title={court.isActive ? 'تعطيل للصيانة' : 'تفعيل الملعب'}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                      {togglingId === court.id ? 'sync' : court.isActive ? 'build' : 'check_circle'}
                    </span>
                    <span>
                      {togglingId === court.id
                        ? 'جاري التحويل...'
                        : court.isActive
                        ? 'تعطيل للصيانة'
                        : 'تفعيل الملعب'}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Edit Price Modal with Spring Motion */}
      <AnimatePresence>
        {editPriceTarget && (
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={styles.modalBackdrop}
            onClick={() => setEditPriceTarget(null)}
          >
            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>تعديل سعر الساعة</h3>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setEditPriceTarget(null)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePrice}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>اسم الملعب</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={editPriceTarget.name}
                    disabled
                    style={{ backgroundColor: 'var(--color-surface-low)', color: 'var(--color-text-muted)' }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="newPriceInput">
                    سعر الساعة الجديد (ج.م) *
                  </label>
                  <input
                    id="newPriceInput"
                    type="number"
                    step="10"
                    min="1"
                    required
                    autoFocus
                    className={styles.formInput}
                    value={newPriceValue}
                    onChange={(e) => setNewPriceValue(e.target.value)}
                    placeholder="مثال: 300"
                  />
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelModalBtn}
                    onClick={() => setEditPriceTarget(null)}
                    disabled={actionLoading}
                  >
                    إلغاء
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    className={styles.submitBtn}
                    disabled={actionLoading || !newPriceValue}
                  >
                    {actionLoading ? 'جاري الحفظ...' : 'حفظ السعر الجديد'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Court Modal with Spring Motion */}
      <AnimatePresence>
        {isAddingCourt && (
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={styles.modalBackdrop}
            onClick={() => setIsAddingCourt(false)}
          >
            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>إضافة ملعب جديد</h3>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setIsAddingCourt(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCourt}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="courtNameInput">
                    اسم الملعب *
                  </label>
                  <input
                    id="courtNameInput"
                    type="text"
                    required
                    autoFocus
                    className={styles.formInput}
                    value={newCourtName}
                    onChange={(e) => setNewCourtName(e.target.value)}
                    placeholder="مثال: ملعب ويمبلي (1)"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="courtTypeSelect">
                    نوع الملعب *
                  </label>
                  <select
                    id="courtTypeSelect"
                    className={styles.formSelect}
                    value={newCourtType}
                    onChange={(e) => setNewCourtType(Number(e.target.value) as CourtType)}
                  >
                    <option value={CourtType.Khomasy}>ملعب خماسي (5 ضد 5)</option>
                    <option value={CourtType.Sobaey}>ملعب سباعي (7 ضد 7)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="courtPriceInput">
                    سعر الساعة الافتراضي (ج.م) *
                  </label>
                  <input
                    id="courtPriceInput"
                    type="number"
                    step="10"
                    min="1"
                    required
                    className={styles.formInput}
                    value={newCourtPrice}
                    onChange={(e) => setNewCourtPrice(e.target.value)}
                    placeholder="مثال: 250"
                  />
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelModalBtn}
                    onClick={() => setIsAddingCourt(false)}
                    disabled={actionLoading}
                  >
                    إلغاء
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    className={styles.submitBtn}
                    disabled={actionLoading || !newCourtName || !newCourtPrice}
                  >
                    {actionLoading ? 'جاري الإضافة...' : 'إضافة الملعب'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
