import Link from 'next/link';
import PageBadge from '@/components/PageBadge/PageBadge';
import styles from './about.module.css';

export const metadata = {
  title: 'عن ملعبنا | قصة المنصة ومعايير الملاعب الرياضية',
  description: 'تعرف على قصة منصة ملعبنا، المعايير الرياضية المعتمدة، نجيل الفيفا التركي، وأرقام المنصة في خدمة شباب كرة القدم.',
};

export default function AboutPage() {
  const pillars = [
    {
      icon: 'grass',
      title: 'نجيل تركي معتمد بمواصفات الفيفا',
      desc: 'شعيرات نجيل عالية الكثافة مع طبقة رمل سيلكا ومطاط طبي بنسب محسوبة لحماية المفاصل وامتصاص الصدمات.',
    },
    {
      icon: 'wb_incandescent',
      title: 'إضاءة ليلية متوازنة (LED 500 Lux)',
      desc: 'كشافات ليلية احترافية بدون نقاط عمياء لتوفير رؤية بانورامية واضحة وتصوير فيديو عالي النقاء لماتشاتك.',
    },
    {
      icon: 'schedule',
      title: 'حجز فوري ومؤكد (Zero Overbooking)',
      desc: 'ربط مباشر بالنظام يمنع التضارب نهائياً؛ الميعاد اللي تختاره يتقفل تلقائياً ويوصلك إشعار فوري بكود الحجز.',
    },
    {
      icon: 'shower',
      title: 'مرافق وخدمات متكاملة',
      desc: 'غرف تبديل ملابس معقمة، دش ومياه دافئة، كافيتريا مشروبات ومسؤول تنظيم متواجد في الملعب طوال الماتش.',
    },
  ];

  const stats = [
    { number: '+12', label: 'ملعب خماسي وسباعي معتمد' },
    { number: '+4,800', label: 'ماتش اتلعب بنجاح' },
    { number: '99.8%', label: 'نسبة دقة المواعيد والالتزام' },
    { number: '4.9★', label: 'متوسط تقييم الكباتن واللاعبين' },
  ];

  return (
    <main className={styles.aboutContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <PageBadge icon="sports_soccer" text="قصة منصة ملعبنا" />
        <h1 className={styles.heroTitle}>
          من أول تجميعة حجز <br />
          <span className={styles.heroTitleHighlight}>لحد صافرة النهاية</span>
        </h1>
        <p className={styles.heroDesc}>
          بنينا منصة «ملعبنا» عشان ننهي فوضى الاتصالات المزدوجة، والملاعب المتهالكة، ونوفر لكل كابتن تجربة حجز سلسة، سريعة ومضمونة من موبايله في ثواني.
        </p>
      </section>

      {/* Story Section */}
      <section className={styles.storySection}>
        <div className={styles.storyText}>
          <h2>ليه بدأنا «ملعبنا»؟</h2>
          <p>
            كلنا شباب بنلعب كورة كل أسبوع، وكلنا عشنا نفس الموقف السخيف: تجمّع أصحابك وتتفقوا على الميعاد، وتروحوا للملعب تلاقوا حد تاني بيلعب، أو تكتشفوا إن النجيل محروق والمطاط ممسوح ومفيش كشافات شغالة!
          </p>
          <p>
            قررنا نحول شغفنا بالكرة إلى منصة رقمية متطورة تضمن لكل لاعب حقه: مواعيد محددة بدقة، عربون مؤمن، وملاعب معتمدة بجودة حقيقية تليق بمتعة الماتش.
          </p>
        </div>

        <div className={styles.storyCard}>
          <div className={styles.storyCardHeader}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>
              verified
            </span>
            <span>وعدنا لكل كابتن</span>
          </div>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            كل ملعب مدرج على منصة ملعبنا يخضع لزيارة ميدانية وفحص جودة النجيل، كشافات الإضاءة، وتجهيزات المرمى والشباك قبل اعتماده رسمياً.
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className={styles.pillarsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>معايير «ملعبنا» المعتمدة</h2>
          <p className={styles.sectionSubtitle}>
            ما بنعتمدش أي ملعب وخلاص؛ بنشترط معايير سلامة وجودة دقيقة
          </p>
        </div>

        <div className={styles.pillarsGrid}>
          {pillars.map((pillar, idx) => (
            <div key={idx} className={styles.pillarCard}>
              <div className={styles.pillarIcon}>
                <span className="material-symbols-outlined">{pillar.icon}</span>
              </div>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarDesc}>{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <div key={idx}>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className={styles.ctaBox}>
        <h2 className={styles.ctaTitle}>جاهز تنزل الملعب يا كابتن؟</h2>
        <p className={styles.ctaDesc}>
          اكتشف الملاعب المتاحة اليوم بالقاهرة والجيزة، اختر ساعتك المناسبة، وعيش أجواء الماتش الحقيقي.
        </p>
        <Link href="/" className={styles.ctaBtn}>
          <span className="material-symbols-outlined">sports_soccer</span>
          <span>تصفح الملاعب واحجز الآن</span>
        </Link>
      </section>
    </main>
  );
}
