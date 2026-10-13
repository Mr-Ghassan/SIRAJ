# SIRAJ Icon System v1.0

**Architectural precision + the graceful continuous line of silk.**
SIRAJ icons are drawn like the wordmark is built. Straight members are cut square and stencil-clean. Each icon may carry one flowing *silk* curve, the gesture of the R's leg and the A's blade. The **Lumen ◆**, the stone diamond above the I and J, is the light point.

- **82 icons**, each in two styles (outline and filled), on one 24 px grid
- Source of truth: `tools/build-icons.js`. It holds every path definition and writes everything in this folder. Edit the definitions there and do not hand-edit the generated SVGs.

```
07-Icon-System/
├── svg/outline/siraj-icon-<name>.svg     outline style (master)
├── svg/filled/siraj-icon-<name>.svg      filled style
├── sprite/siraj-icons.svg                <symbol id="sj-<name>"> + <symbol id="sj-<name>-filled">
├── siraj-icons.json                      name → markup, category, EN/AR labels + keywords, RTL rule
└── previews/                             specimen sheets, size test, construction diagram
```

Rebuild with `node tools/build-icons.js` (use `--no-png` to skip the previews).

---

## 1. Grid and keylines

| Spec | Value |
|---|---|
| Canvas | 24 × 24 px, `viewBox="0 0 24 24"` |
| Padding | 2 px on every side, so the live area is 2–22 |
| Keyline · circle | Ø 20 (r 10), the maximum for round forms |
| Keyline · square | 18 × 18 (3–21) |
| Keyline · portrait | 16 × 20 (x 4–20, y 2–22) |
| Keyline · landscape | 20 × 16 (x 2–22, y 4–20) |
| Coordinate grid | 0.25 px. Stroke-defining points sit on .0 / .25 / .5 / .75 |

Keylines and the live area describe the **stroke centre-line**. The half stroke (0.625) may sit in the padding, so ink never comes closer than 1.375 px to the canvas edge. Lumens and solid fills stay inside 2–22.

See `previews/SIRAJ_Icons_Construction_v1.0.png`.

## 2. Stroke

| Spec | Value |
|---|---|
| Master stroke | **1.25** on the 24 grid |
| Compact stroke | **1.5**, for 16–20 px rendering (sprite: `--siraj-icon-stroke: 1.5`) |
| Colour | `stroke="currentColor"`. Icons never carry their own colour |
| Fill | `fill="none"` on the root. Only Lumens and filled-style bodies fill |

Do not scale the stroke with the icon. At 32 and 48 px the icon keeps 1.25 on the grid, so it stays fine-lined like the rest of the identity.

## 3. Caps, joins and corners

| Element | Caps | Joins | Corners |
|---|---|---|---|
| **Architecture** (walls, frames, arrows, members) | square | mitre | square, never rounded |
| **Silk** (the one flowing curve) | round | round | n/a |
| Butt-ended members (a tie or fold line that dies inside another stroke) | butt | — | — |

The root `<svg>` carries `stroke-linecap="square" stroke-linejoin="miter"`. Silk paths override this with `stroke-linecap="round" stroke-linejoin="round"`. Mixing the two inside one icon is the system's signature: the frame is cut, and the gesture flows.

Corner treatment follows the shape language. Corners are square by default, with no rounded rectangles or pill shapes. The only soft forms are true curves: pin head, dome, leaf, heart and handset.

## 4. The silk-curve rule

- Use at most **one** continuous S- or C-curve per icon, and only where it means something: the tower's facade (`building`), a signature (`contract`), water (`pool`, `sea-view`), a growth line (`growth`), a door swing (`floor-plan`), the flap of a letter (`email`), the vein of a leaf (`sustainability`), the handset (`whatsapp`).
- It is drawn as one path with tangent-continuous Béziers, so it has no kinks and no polyline approximations.
- It starts or ends cleanly. Either it dies inside an architectural stroke (its round cap hidden under a square cap) or it ends free with a round cap.
- It is not a decoration. If an icon reads better without a curve, it has none (arrows, grid, lock).

## 5. The Lumen accent rule

- The Lumen is a filled 45° square standing on its point, `fill="currentColor" stroke="none"`.
- Default size is **3 px across** (point to point). The allowed range is 2–3.5. Interface marks (`info`, `alert`) use 2–2.5, and knob or node roles use 4–5.
- Use **one accent role per icon**. It is the light source: the pin head (`location`), the key bow (`key`), the beacon on the tower (`building`), the growth tip (`growth`), the bell button (`amenities`), the lit window (`apartment`), the load on the crane (`construction`).
- The Lumen replaces generic dots and circles. That covers the dot of the i, the point of `alert`, the bullets of `list`, the dots of `more`, the knobs of `filter` and the nodes of `share`.
- In the filled style a Lumen on a solid area becomes a **diamond-shaped hole** of the same visual size.
- In product UI the Lumen inherits `currentColor` like the rest of the icon. Do not tint it Stone inside an icon. Stone is for the stand-alone ◆ marker.

## 6. Filled style

- Filled icons use the **same silhouette** as the outline. Bodies are drawn as fill plus a 1.25 stroke, so solid and line weights match exactly.
- Interior detail is **knocked out** with `fill-rule="evenodd"`. Windows, doors, text lines and the silk groove become holes, never overlays in a background colour, so filled icons work on any surface.
- Negative lines are cut **1.5 wide** (optical correction, because a knocked-out line reads thinner than an inked one). Holes are enlarged to compensate for the body stroke.
- Pure line glyphs share one drawing in both styles: arrows, chevrons, close, menu, plus, minus, check, area, download, upload, external and list.
- Use filled for **active / selected** states (tab bars, favourites, the current step) and for small solid markers on imagery. Use outline everywhere else.

## 7. Optical corrections

- **Circles vs squares.** A circular container runs about 0.5 larger per side than the square it replaces (`info`, `clock`, `compass` and `globe` use r 9.5 against the 18 px square). Ø 20 is the absolute maximum.
- **Acute mitres.** Sharp joins project beyond their vertex (factor 1/sin(½θ)). Such vertices are pulled in so the spike ends inside the padding: the pin tip, the bookmark notch, the triangle in `alert` and `play`, the star points.
- **Arrow shafts** stop 1 unit short of the tip, so the square cap never pokes past the mitred head.
- **Play.** The triangle's bounding box sits right of centre, so its visual mass reads as centred.
- **Diagonals** run at 45° wherever possible (`close`, `arrow-up-right`, `tag`, `percent`), so they render evenly.
- **Knock-outs** run 1.5 wide (see section 6).

## 8. Sizes

| Size | Use | Notes |
|---|---|---|
| **16 px** | dense tables, inline with 14 px text | the minimum. Outline only, compact stroke 1.5 |
| **20 px** | inputs, chips, list rows | compact stroke 1.5. The minimum for the **filled** style |
| **24 px** | the default UI size | master stroke |
| **32 px** | feature lists, property facts | master stroke |
| **48 px +** | editorial, print, signage | master stroke. Consider the outline style |

See `previews/SIRAJ_Icons_Size-Test_v1.0.png`.

## 9. Colour

| Context | Colour |
|---|---|
| On light (Warm Ivory `#F7F2ED`, Linen `#EFE7E0`) | **Graphite `#3B3436`** (default), Ash `#6B625E` for secondary |
| On dark (SIRAJ Deep `#2C0F12`, Shadow `#170608`) | **Sand `#D6C0B2`** |
| Active / selected / brand moment | **SIRAJ Maroon `#602733`** on light, usually with the filled style |
| On photography | Ivory or Sand with a G1 scrim behind. Never place an icon on a busy image without one |

Never use Stone `#AA9180` for functional icons on light backgrounds (2.7:1). Never use gradients, two-tone fills or drop shadows on icons. Colour always comes from `currentColor`. Set `color` in CSS, using the tokens (`var(--siraj-text)`, `var(--siraj-color-brand-primary)`).

## 10. Do / Don't

**Do**
- Align icons to the text cap height and baseline. At 24 px with 16 px body text, centre the icon on the line box.
- Keep an 8 px minimum gap between an icon and its label.
- Pair every icon with a label in navigation. Icon-only buttons need `aria-label`.
- Mirror directional icons in RTL (see the `rtl` field in the JSON).

**Don't**
- Don't round the corners, change the stroke weight per icon, or add a second silk curve.
- Don't recolour parts of an icon. A Stone Lumen inside a Graphite icon is off-brand in UI.
- Don't stretch, skew or outline-then-scale icons, and don't rotate them, except for 90° steps of arrows and chevrons.
- Don't mix with third-party icon packs in the same view. If an icon is missing, draw it to this spec and add it to `tools/build-icons.js`.
- Don't place filled-style icons below 20 px, because their knock-outs close up.
- Don't treat `whatsapp` as the WhatsApp logo. It is a SIRAJ-drawn evocation (speech bubble plus a one-line silk handset). Where the official mark is required, use WhatsApp's brand asset under their guidelines.

## 11. Naming

- Files: `siraj-icon-<name>.svg` (kebab-case, English, singular), in `svg/outline/` or `svg/filled/`.
- Sprite ids: `sj-<name>` for outline and `sj-<name>-filled` for filled.
- Names describe the **meaning**, not the drawing (`handover`, not `open-door`). Other teams reference these names, so treat them as API. Add new names freely, but never rename one.

## 12. Using the sprite

```html
<!-- external sprite (same origin) -->
<svg class="sj-icon" aria-hidden="true"><use href="/assets/icons/siraj-icons.svg#sj-key"/></svg>

<!-- filled style, active state -->
<svg class="sj-icon is-active" aria-hidden="true"><use href="/assets/icons/siraj-icons.svg#sj-heart-filled"/></svg>

<!-- icon-only button -->
<button class="sj-icon-btn" aria-label="Call SIRAJ"><svg class="sj-icon"><use href="siraj-icons.svg#sj-call"/></svg></button>
```

```css
.sj-icon          { width: 24px; height: 24px; color: var(--siraj-text); flex: none; }
.sj-icon--sm      { width: 16px; height: 16px; --siraj-icon-stroke: 1.5; }   /* compact stroke */
.sj-icon--md      { width: 20px; height: 20px; --siraj-icon-stroke: 1.5; }
.sj-icon--lg      { width: 32px; height: 32px; }
.sj-icon.is-active{ color: var(--siraj-color-brand-primary); }
.on-dark .sj-icon { color: #D6C0B2; /* Sand */ }
[dir="rtl"] .sj-icon--mirror { transform: scaleX(-1); }
```

- Each `<symbol>` sets `fill="none" stroke="currentColor"`, square caps and mitre joins, and `style="stroke-width:var(--siraj-icon-stroke,1.25)"`. A page can switch the stroke weight with one custom property.
- External `<use>` references must be **same-origin**. For a CDN or cross-origin setup, inline the sprite once at the top of `<body>` and reference `#sj-key`.
- For frameworks, `siraj-icons.json` gives the inner markup of each style (`outline`, `filled`) to wrap in your own `<svg viewBox="0 0 24 24" …>` with the root attributes listed under `attributes`.

**RTL.** Icons with `"rtl": "mirror"` in the JSON are flipped in Arabic layouts: `arrow-left`, `arrow-right`, `arrow-up-right`, `chevron-left`, `chevron-right`, `external`, `share` and `list`. Everything else (clocks, the handset, `play`, the checkmark, the Lumen) is never mirrored.

---

## 13. Icon index

<!-- INDEX:START -->
85 icons. ◆ marks icons that carry the Lumen, ∿ those with a silk curve. "Same" means one drawing serves both styles.

### Property · العقار

| Name | Arabic | Sprite id | Accent | Styles | RTL | Keywords |
|---|---|---|---|---|---|---|
| `property` | عقار | `sj-property` | ◆ | outline + filled | — | property, house, home, residence, listing · عقار، منزل، بيت، سكن |
| `building` | مبنى | `sj-building` | ◆ ∿ | outline + filled | — | building, tower, high-rise, development · مبنى، برج، بناية، مشروع |
| `apartment` | شقة | `sj-apartment` | ◆ | outline + filled | — | apartment, flat, residential block, unit · شقة، وحدة سكنية، عمارة |
| `villa` | فيلا | `sj-villa` | ◆ | outline + filled | — | villa, house, detached, modern home · فيلا، منزل مستقل، بيت |
| `commercial` | تجاري | `sj-commercial` | ◆ | outline + filled | — | commercial, retail, office, shop, storefront · تجاري، محل، مكتب، تجزئة |
| `land` | أرض | `sj-land` | ◆ | outline + filled | — | land, plot, parcel, site · أرض، قطعة أرض، موقع |
| `community` | مجتمع سكني | `sj-community` | ◆ | outline + filled | — | community, neighbourhood, masterplan, district · مجتمع، حي، مجمع سكني |
| `construction` | إنشاء | `sj-construction` | ◆ | outline + filled | — | construction, crane, under construction, progress · إنشاء، قيد الإنشاء، رافعة، تشييد |
| `handover` | تسليم | `sj-handover` | ◆ | outline + filled | — | handover, move in, delivery, open door, welcome home · تسليم، استلام، الانتقال، باب |
| `shop` | محل تجاري | `sj-shop` | ◆ ∿ | outline + filled | — | shop, retail unit, storefront, store, commercial unit · محل، محل تجاري، واجهة محل، متجر |

### Spaces & Amenities · المساحات والمرافق

| Name | Arabic | Sprite id | Accent | Styles | RTL | Keywords |
|---|---|---|---|---|---|---|
| `floor-plan` | مخطط الطابق | `sj-floor-plan` | ∿ | outline + filled | — | floor plan, layout, blueprint, plan · مخطط، مخطط الطابق، تصميم داخلي |
| `area` | المساحة | `sj-area` | — | same | — | area, size, square metres, m2, dimensions · المساحة، متر مربع، الأبعاد |
| `bedroom` | غرفة نوم | `sj-bedroom` | ∿ | outline + filled | — | bedroom, bed, rooms, sleep · غرفة نوم، سرير، غرف |
| `bathroom` | حمّام | `sj-bathroom` | ◆ ∿ | outline + filled | — | bathroom, bath, bathtub, washroom · حمّام، دورة مياه، حوض استحمام |
| `parking` | موقف سيارات | `sj-parking` | ∿ | outline + filled | — | parking, car park, garage · موقف، مواقف سيارات، كراج |
| `amenities` | المرافق | `sj-amenities` | ◆ ∿ | outline + filled | — | amenities, services, concierge, facilities · المرافق، الخدمات، كونسيرج |
| `pool` | مسبح | `sj-pool` | ∿ | outline + filled | — | pool, swimming, leisure · مسبح، سباحة، حمّام سباحة |
| `gym` | نادٍ رياضي | `sj-gym` | — | outline + filled | — | gym, fitness, wellness, dumbbell · نادي رياضي، لياقة، صالة رياضية |
| `elevator` | مصعد | `sj-elevator` | — | outline + filled | — | elevator, lift · مصعد |
| `sea-view` | إطلالة بحرية | `sj-sea-view` | ∿ | outline + filled | — | sea view, waterfront, beach, ocean · إطلالة بحرية، واجهة بحرية، شاطئ، بحر |
| `view` | إطلالة | `sj-view` | ◆ ∿ | outline + filled | — | view, preview, visibility, see, watch · عرض، إطلالة، مشاهدة، معاينة |
| `sun` | شمس | `sj-sun` | — | outline + filled | — | sun, daylight, orientation, sunlight · شمس، ضوء النهار، إضاءة طبيعية |

### Location · الموقع

| Name | Arabic | Sprite id | Accent | Styles | RTL | Keywords |
|---|---|---|---|---|---|---|
| `location` | الموقع | `sj-location` | ◆ | outline + filled | — | location, pin, address, map marker · الموقع، عنوان، دبوس الخريطة |
| `map` | خريطة | `sj-map` | ◆ | outline + filled | — | map, masterplan, area map, neighbourhood · خريطة، مخطط عام، الحي |
| `direction` | الاتجاهات | `sj-direction` | — | outline + filled | — | directions, signpost, route, navigate, how to get there · الاتجاهات، لافتة، الطريق |
| `compass` | بوصلة | `sj-compass` | — | outline + filled | — | compass, orientation, explore, north · بوصلة، اتجاه، استكشاف، الشمال |
| `globe` | عالمي | `sj-globe` | — | outline + filled | — | globe, international, language, website, world · عالمي، دولي، اللغة، الموقع الإلكتروني |

### Investment & Finance · الاستثمار والتمويل

| Name | Arabic | Sprite id | Accent | Styles | RTL | Keywords |
|---|---|---|---|---|---|---|
| `investment` | استثمار | `sj-investment` | ◆ | outline + filled | — | investment, wealth, capital, assets, gold · استثمار، ثروة، رأس المال، أصول |
| `roi` | العائد على الاستثمار | `sj-roi` | ◆ ∿ | outline + filled | — | roi, return, yield, rental income, returns · العائد، العائد على الاستثمار، عائد إيجاري |
| `growth` | نمو | `sj-growth` | ◆ ∿ | outline + filled | — | growth, appreciation, value, chart, trend · نمو، ارتفاع القيمة، مؤشر، اتجاه |
| `payment` | دفع | `sj-payment` | ◆ | outline + filled | — | payment, card, pay, instalment, transaction · دفع، بطاقة، قسط، معاملة |
| `sales` | مبيعات | `sj-sales` | ◆ | outline + filled | — | sales, for sale, sign, available, listing · مبيعات، للبيع، لافتة، متاح |
| `tag` | السعر | `sj-tag` | ◆ | outline + filled | — | tag, price, offer, label · السعر، عرض، وسم |
| `percent` | نسبة مئوية | `sj-percent` | — | outline + filled | — | percent, discount, rate, down payment · نسبة، خصم، دفعة أولى |

### Purchase Journey · رحلة الشراء

| Name | Arabic | Sprite id | Accent | Styles | RTL | Keywords |
|---|---|---|---|---|---|---|
| `reservation` | حجز | `sj-reservation` | ◆ | outline + filled | — | reservation, booking, reserve, save, hold · حجز، حجز وحدة، حفظ |
| `contract` | عقد | `sj-contract` | ∿ | outline + filled | — | contract, agreement, sign, spa, deed · عقد، اتفاقية، توقيع، سند |
| `documents` | مستندات | `sj-documents` | — | outline + filled | — | documents, files, brochure, paperwork · مستندات، ملفات، كتيّب، أوراق |
| `calendar` | تقويم | `sj-calendar` | ◆ | outline + filled | — | calendar, date, schedule, appointment, viewing · تقويم، موعد، جدول، زيارة |
| `clock` | الوقت | `sj-clock` | ◆ | outline + filled | — | clock, time, hours, duration, opening hours · الوقت، ساعة، مواعيد العمل |
| `key` | مفتاح | `sj-key` | ◆ | outline + filled | — | key, keys, ownership, access, unlock · مفتاح، مفاتيح، تملّك، دخول |

### Trust & Values · الثقة والقيم

| Name | Arabic | Sprite id | Accent | Styles | RTL | Keywords |
|---|---|---|---|---|---|---|
| `security` | أمان | `sj-security` | ◆ | outline + filled | — | security, safe, protection, gated, guarantee · أمان، حماية، ضمان، مجمع مسوّر |
| `quality` | جودة | `sj-quality` | ◆ | outline + filled | — | quality, award, premium, certified, excellence · جودة، جائزة، تميّز، معتمد |
| `sustainability` | استدامة | `sj-sustainability` | ∿ | outline + filled | — | sustainability, green, eco, nature, landscape · استدامة، صديق للبيئة، طبيعة، مساحات خضراء |
| `lock` | قفل | `sj-lock` | ◆ | outline + filled | — | lock, secure, private, password · قفل، آمن، خاص، كلمة المرور |
| `star` | مميّز | `sj-star` | — | outline + filled | — | star, featured, rating, favourite, premium · مميّز، تقييم، نجمة |
| `heart` | مفضّلة | `sj-heart` | ∿ | outline + filled | — | heart, favourite, save, wishlist, like · مفضّلة، حفظ، إعجاب |

### People & Contact · الأشخاص والتواصل

| Name | Arabic | Sprite id | Accent | Styles | RTL | Keywords |
|---|---|---|---|---|---|---|
| `customer` | عميل | `sj-customer` | ◆ ∿ | outline + filled | — | customer, client, buyer, owner, vip · عميل، مشتري، مالك، كبار العملاء |
| `team` | فريق | `sj-team` | ∿ | outline + filled | — | team, agents, advisors, people, staff · فريق، مستشارون، وكلاء، موظفون |
| `user` | مستخدم | `sj-user` | ∿ | outline + filled | — | user, account, profile, sign in · مستخدم، حساب، الملف الشخصي، تسجيل الدخول |
| `call` | اتصال | `sj-call` | ∿ | outline + filled | — | call, phone, telephone, contact · اتصال، هاتف، تواصل |
| `whatsapp` | واتساب | `sj-whatsapp` | ∿ | outline + filled | — | whatsapp, chat, message, instant messaging · واتساب، محادثة، رسالة |
| `email` | بريد إلكتروني | `sj-email` | ∿ | outline + filled | — | email, mail, message, newsletter, enquiry · بريد إلكتروني، رسالة، استفسار، نشرة |
| `instagram` | إنستغرام | `sj-instagram` | ◆ | outline + filled | — | instagram, social, profile, handle, follow · إنستغرام، تواصل اجتماعي، حساب، متابعة |

### Media & Sharing · الوسائط والمشاركة

| Name | Arabic | Sprite id | Accent | Styles | RTL | Keywords |
|---|---|---|---|---|---|---|
| `image` | صورة | `sj-image` | ◆ ∿ | outline + filled | — | image, photo, gallery, render · صورة، معرض الصور، تصوير |
| `video` | فيديو | `sj-video` | ◆ | outline + filled | — | video, film, walkthrough, reel · فيديو، فيلم، جولة مصوّرة |
| `360-tour` | جولة 360 | `sj-360-tour` | ◆ ∿ | outline + filled | — | 360, virtual tour, panorama, 3d tour, immersive · جولة 360، جولة افتراضية، بانوراما |
| `play` | تشغيل | `sj-play` | — | outline + filled | — | play, start, video · تشغيل، بدء |
| `pause` | إيقاف مؤقت | `sj-pause` | — | outline + filled | — | pause, hold · إيقاف مؤقت |
| `share` | مشاركة | `sj-share` | — | outline + filled | mirror | share, send, network · مشاركة، إرسال |
| `download` | تنزيل | `sj-download` | — | same | — | download, brochure, save, export · تنزيل، تحميل، كتيّب |
| `upload` | رفع | `sj-upload` | — | same | — | upload, attach, submit · رفع، إرفاق، إرسال |
| `external` | رابط خارجي | `sj-external` | — | same | mirror | external, open, new window, link · رابط خارجي، فتح، نافذة جديدة |
| `brochure` | كتيّب المشروع | `sj-brochure` | ◆ ∿ | outline + filled | — | brochure, booklet, catalogue, sales brochure, download brochure · كتيّب، بروشور، كتالوج، تنزيل الكتيّب |

### Navigation · التنقّل

| Name | Arabic | Sprite id | Accent | Styles | RTL | Keywords |
|---|---|---|---|---|---|---|
| `arrow-left` | سهم لليسار | `sj-arrow-left` | — | same | mirror | arrow left, back, previous · سهم، رجوع، السابق |
| `arrow-right` | سهم لليمين | `sj-arrow-right` | — | same | mirror | arrow right, next, forward, continue · سهم، التالي، متابعة |
| `arrow-up` | سهم لأعلى | `sj-arrow-up` | — | same | — | arrow up, top, increase · سهم، أعلى، زيادة |
| `arrow-down` | سهم لأسفل | `sj-arrow-down` | — | same | — | arrow down, scroll, decrease · سهم، أسفل، انخفاض |
| `arrow-up-right` | سهم قطري | `sj-arrow-up-right` | — | same | mirror | arrow up right, go, link, explore · سهم، انتقال، رابط |
| `chevron-left` | رأس سهم لليسار | `sj-chevron-left` | — | same | mirror | chevron left, back, previous · السابق، رجوع |
| `chevron-right` | رأس سهم لليمين | `sj-chevron-right` | — | same | mirror | chevron right, next, more · التالي، المزيد |
| `chevron-up` | رأس سهم لأعلى | `sj-chevron-up` | — | same | — | chevron up, collapse · طي، أعلى |
| `chevron-down` | رأس سهم لأسفل | `sj-chevron-down` | — | same | — | chevron down, expand, dropdown · توسيع، قائمة منسدلة |

### Interface · الواجهة

| Name | Arabic | Sprite id | Accent | Styles | RTL | Keywords |
|---|---|---|---|---|---|---|
| `close` | إغلاق | `sj-close` | — | same | — | close, dismiss, cancel, x · إغلاق، إلغاء |
| `menu` | القائمة | `sj-menu` | — | same | — | menu, navigation, hamburger · القائمة، التنقّل |
| `plus` | إضافة | `sj-plus` | — | same | — | plus, add, new, expand · إضافة، جديد |
| `minus` | طرح | `sj-minus` | — | same | — | minus, remove, collapse · إزالة، طي |
| `check` | تأكيد | `sj-check` | — | same | — | check, done, confirmed, included, sold · تأكيد، تم، مشمول |
| `info` | معلومات | `sj-info` | ◆ | outline + filled | — | info, information, details, help · معلومات، تفاصيل، مساعدة |
| `alert` | تنبيه | `sj-alert` | ◆ | outline + filled | — | alert, warning, attention, notice · تنبيه، تحذير، انتباه |
| `more` | المزيد | `sj-more` | ◆ | same | — | more, options, overflow, ellipsis · المزيد، خيارات |
| `grid` | شبكة | `sj-grid` | — | outline + filled | — | grid, gallery view, tiles, units · شبكة، عرض شبكي، وحدات |
| `list` | قائمة | `sj-list` | ◆ | same | mirror | list, list view, details · قائمة، عرض القائمة |
| `search` | بحث | `sj-search` | — | outline + filled | — | search, find, explore, lookup · بحث، إيجاد، استكشاف |
| `filter` | تصفية | `sj-filter` | — | outline + filled | — | filter, refine, sliders, settings · تصفية، فرز، إعدادات |
| `layers` | طبقات | `sj-layers` | — | outline + filled | — | layers, floors, levels, stack · طبقات، طوابق، مستويات |
<!-- INDEX:END -->
