'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './support.module.css';

interface FAQ {
  q: string;
  a: string;
}

interface SupportContentClientProps {
  faqs: FAQ[];
}

export default function SupportContentClient({ faqs }: SupportContentClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'استفسار عن حجز',
    message: '',
  });
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedTicket = 'SUP-' + Math.floor(100000 + Math.random() * 900000);
      setTicketId(generatedTicket);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <>
      {/* FAQ Accordion Section */}
      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>الأسئلة الأكثر شيوعاً (FAQ)</h2>
        <p className={styles.sectionSubtitle}>كل الإجابات اللي بتدور عليها بخصوص الحجز واللعب</p>

        <div className={styles.faqList}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className={styles.faqQuestion}
                >
                  <span>{faq.q}</span>
                  <span
                    className={`material-symbols-outlined ${styles.faqIcon} ${
                      isOpen ? styles.faqIconRotated : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={styles.faqAnswer}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact / Ticket Form */}
      <section className={styles.contactCard}>
        {ticketId ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.successBox}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '3.5rem', color: 'var(--color-primary)' }}>
              check_circle
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              تم استلام رسالتك بنجاح يا كابتن!
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', lineHeight: 1.6 }}>
              فريق خدمة عملاء «ملعبنا» هيتواصل معاك على رقم <strong>{formData.phone}</strong> في أقرب وقت.
            </p>
            <div className={styles.ticketBadge}>رقم التذكرة: #{ticketId}</div>
            <button
              type="button"
              onClick={() => {
                setTicketId(null);
                setFormData({ name: '', phone: '', category: 'استفسار عن حجز', message: '' });
              }}
              style={{
                marginTop: '1rem',
                padding: '0.65rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border-medium)',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              إرسال استفسار جديد
            </button>
          </motion.div>
        ) : (
          <div>
            <h2 className={styles.sectionTitle} style={{ textAlign: 'right', marginBottom: '0.5rem' }}>
              أرسل لنا استفسارك أو مشكلتك
            </h2>
            <p className={styles.sectionSubtitle} style={{ textAlign: 'right', marginBottom: '2rem' }}>
              اكتب بياناتك والمشكلة بالتفصيل، وهنرد عليك فوراً
            </p>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>اسم الكابتن بالكامل *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حسام حسن"
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>رقم التليفون أو الواتساب *</label>
                <input
                  type="tel"
                  required
                  placeholder="010 1234 5678"
                  className={styles.input}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                <label className={styles.label}>نوع الطلب *</label>
                <select
                  className={styles.select}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="استفسار عن حجز">استفسار عن حجز أو موعد</option>
                  <option value="تعديل أو إلغاء ميعاد">طلب تعديل أو إلغاء ميعاد</option>
                  <option value="شكوى من جودة ملعب">شكوى من جودة نجيل أو مرافق ملعب</option>
                  <option value="اقتراح أو شراكة">اقتراح أو تنظيم دورة رمضانية</option>
                </select>
              </div>

              <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                <label className={styles.label}>تفاصيل الرسالة *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="اشرح لنا المشكلة أو الاستفسار بالتفصيل..."
                  className={styles.textarea}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                {isSubmitting ? (
                  <span>جارٍ إرسال التذكرة...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">send</span>
                    <span>إرسال الرسالة لفريق الدعم</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </section>
    </>
  );
}
