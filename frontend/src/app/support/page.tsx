'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './support.module.css';

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'استفسار عن حجز',
    message: '',
  });
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      q: 'إزاي بيتم تأكيد الحجز ودفع العربون؟',
      a: 'بمجرد ما تختار الملعب وميعاد الماتش وتضغط "إرسال طلب الحجز"، بيوصل طلبك لإدارة الملعب. بيتم التواصل معاك عبر الواتساب أو الهاتف لتأكيد عربون الحجز (50% عن طريق إنستاباي InstaPay أو فودافون كاش) ويتحول حجزك فوراً إلى "مؤكد".',
    },
    {
      q: 'لو عاوز أغير ميعاد الماتش أو ألغيه، إيه السياسة المتبعة؟',
      a: 'تقدر تطلب تعديل أو إلغاء الماتش قبل ميعاده بـ 6 ساعات على الأقل من خلال التواصل مع خدمة العملاء أو مشرف الملعب، ويتم استرداد العربون كاملاً أو ترحيله لماتش قادم بدون أي رسوم إضافية.',
    },
    {
      q: 'إيه اللي بيحصل لو اتأخرنا عن ميعاد الماتش؟',
      a: 'ساعة الحجز بتبدأ بالضبط في التوقيت المحجوز لتفادي تعطيل الكباتن والمباريات التالية. بننصح دايماً بوصول الفريق قبل الميعاد بربع ساعة للاستعداد وتسخين الملعب.',
    },
    {
      q: 'هل الكرات وأطقم التمييز (التيبات) متوفرة في الملعب؟',
      a: 'نعم، جميع الملاعب المعتمدة على منصة ملعبنا توفر كرات كورة قدم مقاس 5 معتمدة، بالإضافة إلى أطقم تمييز (بيبسات/تيبات) نظيفة ومقسمة لفريقين.',
    },
    {
      q: 'إزاي أقدر أتواصل مع مشرف الملعب مباشرة؟',
      a: 'في صفحة "حجوزاتي"، بتلاقي تفاصيل كل حجز مع إمكانية الضغط على زر الاتصال المباشر بمشرف الملعب لتنسيق موقع الملعب واللوكيشن الدقيق.',
    },
  ];

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
    <main className={styles.supportContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.badge}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
            support_agent
          </span>
          <span>مركز الدعم والمساندة</span>
        </div>
        <h1 className={styles.title}>إحنا معاك في ظهرك يا كابتن</h1>
        <p className={styles.subtitle}>
          عندك استفسار، عاوز تعدل حجز، أو واجهتك أي مشكلة في الملعب؟ فريق دعم «ملعبنا» متواجد 7 أيام في الأسبوع.
        </p>
      </header>

      {/* Direct Support Channels */}
      <section className={styles.channelsGrid}>
        <a
          href="https://api.whatsapp.com/send?phone=201000000000&text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D9%81%D8%B1%D9%8A%D9%82%20%D9%85%D9%84%D8%B9%D8%A8%D9%86%D8%A7%D8%8C%20%D8%B9%D9%86%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D8%AD%D8%AC%D8%B2%20%D9%85%D9%84%D8%B9%D8%A8"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.channelCard}
        >
          <div className={styles.channelIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
            <span className="material-symbols-outlined">chat</span>
          </div>
          <h2 className={styles.channelTitle}>محادثة واتساب فورية</h2>
          <p className={styles.channelDesc}>رد فوري خلال دقائق لتأكيد المواعيد أو إرسال اللوكيشن.</p>
          <span className={styles.channelAction}>
            <span>فتح المحادثة</span>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
              arrow_back
            </span>
          </span>
        </a>

        <a href="tel:01000000000" className={styles.channelCard}>
          <div className={styles.channelIcon} style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <span className="material-symbols-outlined">call</span>
          </div>
          <h2 className={styles.channelTitle}>الخط الساخن للملاعب</h2>
          <p className={styles.channelDesc}>تحدث مباشرة مع منسق العمليات لحل المشكلات الطارئة.</p>
          <span className={styles.channelAction}>
            <span dir="ltr">010 0000 0000</span>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
              call
            </span>
          </span>
        </a>

        <a href="mailto:support@malabna.app" className={styles.channelCard}>
          <div className={styles.channelIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
            <span className="material-symbols-outlined">mail</span>
          </div>
          <h2 className={styles.channelTitle}>البريد الرسمي</h2>
          <p className={styles.channelDesc}>للشكاوى والاقتراحات وعقود رعاية البطولات والملاعب.</p>
          <span className={styles.channelAction}>
            <span>support@malabna.app</span>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
              arrow_back
            </span>
          </span>
        </a>
      </section>

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
    </main>
  );
}
