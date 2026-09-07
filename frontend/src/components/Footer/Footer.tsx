import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandSide}>
          <div className={styles.logoBadge}>
            <Image 
              src="/images/logo.png" 
              alt="ملعبنا" 
              className={styles.footerLogoImg}
              width={32}
              height={32}
            />
          </div>
          <p className={styles.copyright}>
            ملعبنا © 2026 • حجز ملاعب كرة القدم المعتمدة
          </p>
        </div>

        <div className={styles.links}>
          <Link href="/about">عن ملعبنا</Link>
          <span className={styles.dividerDot}>•</span>
          <Link href="/support">الدعم والمساعدة</Link>
          <span className={styles.dividerDot}>•</span>
          <Link href="/partner">انضم كمزود ملعب</Link>
          <span className={styles.dividerDot}>•</span>
          <Link href="/terms">الشروط والأحكام</Link>
          <span className={styles.dividerDot}>•</span>
          <Link href="/privacy">سياسة الخصوصية</Link>
        </div>
      </div>
    </footer>
  );
}
