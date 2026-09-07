import PartnerFormClient from './PartnerFormClient';
import PageBadge from '@/components/PageBadge/PageBadge';
import styles from './partner.module.css';

/**
 * Server Component — renders static marketing content instantly.
 * Only the form section uses client-side interactivity.
 */
export default function PartnerPage() {
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

  return (
    <main className={styles.partnerContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <PageBadge icon="handshake" text="شراكة أصحاب الملاعب الرياضية" />
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

      {/* Registration Form - Client Component */}
      <PartnerFormClient />
    </main>
  );
}
