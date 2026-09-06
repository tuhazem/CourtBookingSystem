'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './partner.module.css';

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    stadiumName: '',
    city: 'القاهرة',
    area: '',
    courtType: 'خماسي وسداسي',
    courtsCount: '1',
    pricePerHour: '300',
  });
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const benefits = [
    {
      icon: 'trending_up',
      title: 'زيادة الإشغال حتى 40%',
      desc: 'املأ الساعات الصباحية وفترات الظهيرة بمباريات جديدة من مجتمع الكباتن المشتركين في المنصة.',
    },
    {
      icon: 'payments',
      title: 'تحصيل عربون مؤمن 100%',
      desc: 'قضاء تام على ظاهرة المواعيد الوهمية؛ كل حجز مسجل ومؤمن بعربون يحمي وقتك وأرباح ملعبك.',
    },
    {
      icon: 'dashboard',
      title: 'لوحة تحكم ذكية مجاناً',
      desc: 'تابع حجوزاتك، إحصائيات الدخل اليومي، وتحكم في أسعار المواعيد ومواسم الذروة من موبايلك بسهولة.',
    },
    {
      icon: 'verified',
      title: 'اعتماد رسمي وتسويق لملعبك',
      desc: 'نوفر لك مواد تسويقية ولافتات معتمدة ونضيف ملعبك لقائمة أفضل الملاعب الموصى بها في منطقتك.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = 'PTN-' + Math.floor(10000 + Math.random() * 90000);
      setSubmittedId(generatedId);
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <main className={styles.partnerContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
            handshake
          </span>
          <span>شراكة أصحاب الملاعب الرياضية</span>
        </div>
        <h1 className={styles.heroTitle}>
          حوّل إدارة ملعبك للنظام الذكي <br />
          <span className={styles.heroHighlight}>وزوّد أرباحك وإشغال ملعبك حتى 40%</span>
        </h1>
        <p className={styles.heroDesc}>
          انضم لشبكة «ملعبنا» وودع المواعيد الضائعة وجداول الورق. سيطر على حجوزاتك من موبايلك واستقبل حجوزات مؤكدة يومياً بدون مجهود.
        </p>
      </section>

      {/* Benefits Grid */}
      <section className={styles.benefitsGrid}>
        {benefits.map((b, idx) => (
          <div key={idx} className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <span className="material-symbols-outlined">{b.icon}</span>
            </div>
            <h3 className={styles.benefitTitle}>{b.title}</h3>
            <p className={styles.benefitDesc}>{b.desc}</p>
          </div>
        ))}
      </section>

      {/* Registration Form */}
      <section className={styles.formSection}>
        {submittedId ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.successBox}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '3.5rem', color: 'var(--color-primary)' }}>
              verified
            </span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              أهلاً بيك في عائلة «ملعبنا» يا كابتن!
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', lineHeight: 1.7 }}>
              تم استلام طلب انضمام ملعب <strong>{formData.stadiumName}</strong> برقم طلب <strong>#{submittedId}</strong>.
              فريق تطوير الأعمال والعمليات الميدانية هيتواصل معاك هاتفياً لتحديد موعد الزيارة وتفعيل لوحة التحكم.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link
                href="/"
                style={{
                  padding: '0.85rem 1.75rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </motion.div>
        ) : (
          <div>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>سجل ملعبك الرياضي الآن</h2>
              <p className={styles.formSubtitle}>
                املأ بيانات الملعب وسيقوم مستشار تشغيل الملاعب بالتواصل معك خلال 24 ساعة
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>اسم المالك أو المدير المسئول *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كابتن طارق السعيد"
                  className={styles.input}
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>رقم الهاتف للتواصل والواتساب *</label>
                <input
                  type="tel"
                  required
                  placeholder="010 1234 5678"
                  className={styles.input}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>اسم الملعب / المجمع الرياضي *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مجمع أبطال النزهة الرياضي"
                  className={styles.input}
                  value={formData.stadiumName}
                  onChange={(e) => setFormData({ ...formData, stadiumName: e.target.value })}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>المحافظة *</label>
                <select
                  className={styles.select}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                >
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="القليوبية">القليوبية</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="الشرقية">الشرقية</option>
                  <option value="الدقهلية">الدقهلية</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>المنطقة / الحي *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: التجمع الخامس، الدقي، مدينة نصر..."
                  className={styles.input}
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>نوع الملعب الرئيسي *</label>
                <select
                  className={styles.select}
                  value={formData.courtType}
                  onChange={(e) => setFormData({ ...formData, courtType: e.target.value })}
                >
                  <option value="خماسي وسداسي">خماسي وسداسي (نجيل تركي)</option>
                  <option value="سباعي وثماني">سباعي وثماني</option>
                  <option value="قانوني 11 ضد 11">قانوني (11 ضد 11)</option>
                  <option value="ملاعب بادل تنس">ملاعب بادل تنس (Padel)</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>عدد الملاعب المتوفرة</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className={styles.input}
                  value={formData.courtsCount}
                  onChange={(e) => setFormData({ ...formData, courtsCount: e.target.value })}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>سعر الساعة التقريبي (بالجنيه المصري)</label>
                <input
                  type="number"
                  step="50"
                  placeholder="مثال: 350"
                  className={styles.input}
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                />
              </div>

              <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                {isSubmitting ? (
                  <span>جارٍ تسجيل الملعب...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">add_business</span>
                    <span>إرسال طلب تسجيل الملعب</span>
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
