// SIRAJ website — official imagery only, imported from its canonical place in the repository and optimised at
// build time (AVIF + WebP, responsive widths). No stock, no replacement architecture, no fictional projects.
// Alt text describes what the image shows; it never re-types the brand or project name.
import type { ImageMetadata } from 'astro';

import cornerBlue from '../../../14-Property-Marketing/12-Project-Siraj/Source/Clean/SIRAJ_Project-Siraj_Corner_Blue-Hour_Clean_v1.0.jpg';
import cornerDay from '../../../14-Property-Marketing/12-Project-Siraj/Source/Clean/SIRAJ_Project-Siraj_Corner_Cloudy-Day_Clean_v1.0.jpg';
import frontBlue from '../../../14-Property-Marketing/12-Project-Siraj/Source/Clean/SIRAJ_Project-Siraj_Front_Blue-Hour_Clean_v1.0.jpg';
import frontDay from '../../../14-Property-Marketing/12-Project-Siraj/Source/Clean/SIRAJ_Project-Siraj_Front_Cloudy-Day_Clean_v1.0.jpg';
import sideBlue from '../../../14-Property-Marketing/12-Project-Siraj/Source/Clean/SIRAJ_Project-Siraj_Side_Blue-Hour_Clean_v1.0.jpg';
import sideDay from '../../../14-Property-Marketing/12-Project-Siraj/Source/Clean/SIRAJ_Project-Siraj_Side_Cloudy-Day_Clean_v1.0.jpg';

import kvLantern from '../../../14-Property-Marketing/12-Project-Siraj/Source/KeyVisuals/SIRAJ_Project-Siraj_KV_Lantern_4x5_v1.0.jpg';
import kvLanternTall from '../../../14-Property-Marketing/12-Project-Siraj/Source/KeyVisuals/SIRAJ_Project-Siraj_KV_Lantern_9x16_v1.0.jpg';
import kvVeil from '../../../14-Property-Marketing/12-Project-Siraj/Source/KeyVisuals/SIRAJ_Project-Siraj_KV_Veil_4x5_v1.0.jpg';
import kvReveal from '../../../14-Property-Marketing/12-Project-Siraj/Source/KeyVisuals/SIRAJ_Project-Siraj_KV_Reveal_4x5_v1.0.jpg';
import kvRibbon from '../../../14-Property-Marketing/12-Project-Siraj/Source/KeyVisuals/SIRAJ_Project-Siraj_KV_Ribbon_4x5_v1.0.jpg';
import kvDetail from '../../../14-Property-Marketing/12-Project-Siraj/Source/KeyVisuals/SIRAJ_Project-Siraj_KV_Detail_4x5_v1.0.jpg';

import silkLongRibbon from '../../../06-SIRAJ-Silk/Stills/Alpha/SIRAJ_Silk_Long-Ribbon-Alpha_3x1_v1.0.png';
import silkHorizon from '../../../06-SIRAJ-Silk/Stills/Alpha/SIRAJ_Silk_Horizon-Alpha_16x9_v1.0.png';
import silkLumen from '../../../06-SIRAJ-Silk/Stills/Drape-Lumen/SIRAJ_Silk_Drape-Lumen_16x9_v1.0.jpg';
import silkLumenTall from '../../../06-SIRAJ-Silk/Stills/Drape-Lumen/SIRAJ_Silk_Drape-Lumen_9x16_v1.0.jpg';

export interface Media { src: ImageMetadata; alt: string; caption?: string; position?: string }

export const RENDERS: Record<string, Media> = {
  cornerBlue: { src: cornerBlue, alt: 'المبنى من زاويته عند الساعة الزرقاء، واجهاته مضاءة من الداخل', caption: 'الزاوية · الساعة الزرقاء', position: '50% 38%' },
  frontBlue: { src: frontBlue, alt: 'الواجهة الأمامية عند الساعة الزرقاء، وواجهة المحلات التجارية مضاءة في الطابق السفلي', caption: 'الواجهة · الساعة الزرقاء', position: '50% 40%' },
  sideBlue: { src: sideBlue, alt: 'الواجهة الجانبية عند الساعة الزرقاء، بشرفات تحيط بها النباتات', caption: 'الواجهة الجانبية · الساعة الزرقاء', position: '50% 40%' },
  cornerDay: { src: cornerDay, alt: 'المبنى من زاويته في نهار غائم، بواجهات حجرية فاتحة وستائر طوبية مثقّبة', caption: 'الزاوية · نهار غائم', position: '50% 38%' },
  frontDay: { src: frontDay, alt: 'الواجهة الأمامية في نهار غائم', caption: 'الواجهة · نهار غائم', position: '50% 40%' },
  sideDay: { src: sideDay, alt: 'الواجهة الجانبية في نهار غائم', caption: 'الواجهة الجانبية · نهار غائم', position: '50% 40%' },
};

export const KEY_VISUALS: Record<string, Media> = {
  lantern: { src: kvLantern, alt: 'المبنى يضيء من الداخل كالفانوس، وشريط من الحرير العنابي يعبر أمامه', position: '50% 40%' },
  lanternTall: { src: kvLanternTall, alt: 'المبنى يضيء من الداخل كالفانوس، وشريط من الحرير العنابي يعبر أمامه', position: '50% 40%' },
  veil: { src: kvVeil, alt: 'حرير عنابي يغطّي المبنى قبل الكشف عنه' },
  reveal: { src: kvReveal, alt: 'الحرير ينسحب كاشفًا المبنى' },
  ribbon: { src: kvRibbon, alt: 'شريط من الحرير يلتفّ حول المبنى' },
  detail: { src: kvDetail, alt: 'ضوء يعبر الطوب المثقّب في تفاصيل الواجهة' },
};

export const SILK = {
  longRibbon: { src: silkLongRibbon, alt: '' },     // decorative gesture: empty alt, aria-hidden
  horizon: { src: silkHorizon, alt: '' },
  lumen: { src: silkLumen, alt: '' },
  lumenTall: { src: silkLumenTall, alt: '' },
};

export const GALLERY = ['cornerBlue', 'frontBlue', 'sideBlue', 'cornerDay', 'frontDay', 'sideDay'] as const;
