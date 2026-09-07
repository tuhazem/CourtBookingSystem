import SupportContentClient from './SupportContentClient';
import PageBadge from '@/components/PageBadge/PageBadge';
import styles from './support.module.css';

/**
 * Server Component — renders static support page structure instantly.
 * FAQ accordion and contact form use client-side interactivity.
 */
export default function SupportPage() {
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

  return (
    <main className={styles.supportContainer}>
      {/* Header */}
      <header className={styles.header}>
        <PageBadge icon="support_agent" text="مركز الدعم والمساندة" />
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

        <a href="mailto:support@malaabna.app" className={styles.channelCard}>
          <div className={styles.channelIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
            <span className="material-symbols-outlined">mail</span>
          </div>
          <h2 className={styles.channelTitle}>البريد الرسمي</h2>
          <p className={styles.channelDesc}>للشكاوى والاقتراحات وعقود رعاية البطولات والملاعب.</p>
          <span className={styles.channelAction}>
            <span>support@malaabna.app</span>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
              arrow_back
            </span>
          </span>
        </a>
      </section>

      {/* FAQ Accordion and Contact Form - Client Component */}
      <SupportContentClient faqs={faqs} />
    </main>
  );
}
