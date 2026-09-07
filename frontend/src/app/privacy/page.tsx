import styles from '../terms/terms.module.css';

export const metadata = {
  title: 'سياسة الخصوصية | منصة ملعبنا',
  description: 'سياسة الخصوصية وحماية بيانات العملاء وحجوزات الملاعب في منصة ملعبنا.',
};

export default function PrivacyPage() {
  return (
    <main className={styles.legalContainer}>
      <header className={styles.header}>
        <div className={styles.badge}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
            security
          </span>
          <span>حماية وأمان البيانات</span>
        </div>
        <h1 className={styles.title}>سياسة الخصوصية (Privacy Policy)</h1>
        <p className={styles.lastUpdated}>آخر تحديث: سبتمبر 2026</p>
      </header>

      <article className={styles.contentCard}>
        <section className={styles.section}>
          <h2>1. البيانات التي نجمعها</h2>
          <p>
            نحن في منصة «ملعبنا» نحرص على جمع الحد الأدنى الضروري من البيانات لتنفيذ حجزك بسلاسة، وتشمل:
          </p>
          <ul>
            <li>اسم كابتن الحجز للتسجيل في كشف مباريات الملعب.</li>
            <li>رقم الهاتف المحمول لإرسال كود الحجز وتأكيد الموعد عبر الرسائل النصية والواتساب.</li>
            <li>بيانات الحجز (اسم الملعب، تاريخ وساعة المباراة، وحالة الدفع).</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>2. كيف نستخدم بياناتك؟</h2>
          <ul>
            <li>تأكيد الحجز ومطابقته عند وصولك للملعب لمنع أي تلاعب أو تضارب.</li>
            <li>إتاحة صفحة «حجوزاتي» لعرض تفاصيل مبارياتك على جهازك المحلي.</li>
            <li>التواصل المباشر في حالات الطوارئ أو تعديل المواعيد من قِبل إدارة الملعب.</li>
            <li>تحسين جودة الخدمة والملاعب وتطوير تجربة المستخدم.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. عدم مشاركة البيانات مع جهات خارجية</h2>
          <p>
            نحن نلتزم بشكل قاطع بعدم بيع أو تأجير أو مشاركة أرقام هواتف الكباتن أو أي معلومات شخصية مع أي جهات إعلانية أو أطراف خارجية. البيانات يتم مشاركتها فقط مع مشرف الملعب المختار لتنظيم دخول الفريق.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. أمان التخزين</h2>
          <p>
            تطبق المنصة أحدث معايير التشفير (HTTPS / TLS) لحماية كافة الاتصالات بين جهازك وخوادمنا. كما يتم تشفير وحماية بيانات لوحة التحكم الإدارية باستخدام رموز JWT الموقعة رقمياً.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. حقوقك والتواصل معنا</h2>
          <p>
            يحق لك في أي وقت طلب حذف بياناتك أو تعديلها من خلال التواصل مع فريق الدعم الفني عبر البريد الإلكتروني: <strong>support@malaabna.app</strong> أو عبر صفحة الدعم والمساعدة.
          </p>
        </section>
      </article>
    </main>
  );
}
