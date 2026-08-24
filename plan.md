# NekoTech Foundation — Remake Plan

> Trạng thái: đang thực thi · Ngày lập: 2026-08-24
> Scope: bỏ toàn bộ Spline embed → 3D local; remake UI/UX; rebrand copy; viết lại IA;
> cập nhật PRODUCT.md / README.md.

## 1. Quyết định đã chốt (từ câu hỏi với owner)

| Hạng mục | Quyết định | Ghi chú |
|---|---|---|
| Stack 3D | **three.js + OGL hybrid** | three.js cho scene hero có chiều sâu; OGL (đã có) cho fullscreen shader phụ |
| Concept hero | **Wireframe topographic terrain** | mặt lưới đồng mức chuyển động chậm, fog về horizon, light sweep |
| Palette | **Giữ black + vermilion, siết kỷ luật** | accent ≤1 lần/viewport; thêm tầng surface để tạo depth |
| Copy | **Bilingual đầy đủ, EN mặc định** | 0 chuỗi hardcode ngoài i18n; tone súc tích, không buzzword |

## 2. Hiện trạng (audit codebase)

Stack: Vue 3.4 + Vite 5 + TS + vue-router 4, Lenis (smooth scroll), OGL, lucide-vue-next.
Tailwind v4 có trong deps nhưng thực tế toàn bộ styling là CSS vars trong `src/globals.css` + scoped CSS.

**Vấn đề phát hiện:**

1. **2 Spline iframe** — nguồn 3D duy nhất hiện tại, cả hai đều là embed ngoài:
   - `src/components/landing/HomeHero.vue:28` → `my.spline.design/reactiveorb-…`
   - `src/components/sections/OpenSourceCTA.vue:18` → `my.spline.design/boxeshover-…`
   - Kéo theo: watermark "Built with Spline", phụ thuộc network, không kiểm soát màu/motion,
     `pointer-events: auto` trên iframe che mất CTA phía dưới, không có fallback reduced-motion.
2. **Trùng lặp IA** — `OrgTimeline` (quá khứ) và `OrgRoadmap` (tương lai) là cùng một ẩn dụ timeline,
   dựng 2 lần bằng 2 cơ chế khác nhau → gộp thành một trục "Trajectory".
3. **Copy hardcode ngoài i18n** — `Partners.vue` hardcode tiếng Việt, `Team.vue` / `OrgRoadmap.vue` /
   `OpenSourceCTA.vue` hardcode tiếng Anh → đổi ngôn ngữ chỉ dịch được một nửa trang.
4. **Code chết** (0 reference): `ScrollStack`, `ScrollStackItem`, `HomeHeroContent`, `FlowerFigure`,
   `CareerItem`, `MemberModal` + icon `NorthStudio`, `sections/Story` + `StoryCarousel`,
   `sections/Contact`, `vue-bits/InteractiveGrid`.
5. **Route mồ côi** — `/team` render 6 member placeholder ("Javi A. Torres"), `/contact` là
   `<template><div /></template>` rỗng, `/projects` dùng Aurora tím-hồng-đỏ trái hoàn toàn với palette.
6. **README sai sự thật** — mô tả project là Next.js + `app/page.tsx` + deploy Vercel; thực tế là
   Vite + Vue, deploy Netlify (`netlify.toml`).
7. **Scroll-reveal fragile** — `main.ts` ghi đè `innerHTML` của mọi `h1/h2/h3` sau `router.afterEach`
   bằng `setTimeout`, race với Vue render và phá reactivity khi đổi ngôn ngữ.
8. **Naming lệch nghĩa** — section id `#career` / component `Careers.vue` thực chất là *Projects*;
   `t.careers` chứa danh sách sản phẩm.

## 3. Kiến trúc 3D mới (local, không embed)

```
src/components/three/
  TerrainField.vue     — scene hero (three.js). WebGLRenderer đơn, 1 mesh.
  SignalField.vue      — background CTA/footer (OGL fragment shader, ~20kb, không dùng three)
  useSceneLifecycle.ts  — IntersectionObserver pause + reduced-motion + WebGL fallback + dispose
```

**TerrainField — spec:**
- `PlaneGeometry` 160×160 segment, rotate −90°, custom `ShaderMaterial` wireframe.
- Vertex: fBm simplex noise 3 octave, `uTime` cuộn theo trục Z → cảm giác địa hình chảy về phía người xem.
- Fragment: contour line (`fract(height * n)`) + fog theo depth → tan vào `--bg` ở horizon;
  light sweep chạy chậm theo X; accent vermilion chỉ xuất hiện ở đỉnh cao nhất (rim), phần còn lại
  là grayscale → giữ đúng kỷ luật "accent ≤1 lần/viewport".
- Camera: FOV 60, parallax theo cursor (lerp, damping 0.06) + tilt nhẹ theo scroll progress.
- Perf: `dpr = min(devicePixelRatio, 2)`, `powerPreference: 'high-performance'`,
  pause `requestAnimationFrame` khi section ra khỏi viewport hoặc tab ẩn.
- Fallback: `prefers-reduced-motion` → render 1 frame tĩnh; không có WebGL → CSS gradient + SVG grid.

**Cinematic layer (không phải 3D nhưng phục vụ cùng mục tiêu):**
- Hero: mask reveal theo dòng chữ (clip-path), stagger 80ms, ease `cubic-bezier(0.16,1,0.3,1)`.
- Section transition: dùng scroll progress driving thật (Lenis), không phải IntersectionObserver
  bật/tắt một lần.
- Grain overlay rất nhẹ (SVG feTurbulence, opacity 0.025) để 3D không bị "nhựa".

## 4. IA mới cho Home

| # | Section | Thay đổi so với cũ |
|---|---|---|
| 1 | Header | thêm scroll-progress line; nav khớp IA mới; active-section highlight |
| 2 | **Hero** | Spline orb → `TerrainField`; copy rebrand; CTA rõ mục tiêu |
| 3 | **Signal** (stats) | `OrgStats` viết lại như bảng đo: số lớn + commit heatmap + language bar hàng ngang |
| 4 | **Work** (projects) | `Careers` → editorial row, không phải bento card; status chip có nghĩa |
| 5 | **Capabilities** | `Services` → spec list súc tích, bỏ 4 card giống nhau |
| 6 | **Trajectory** | **gộp** `OrgTimeline` + `OrgRoadmap` thành một trục liên tục quá khứ → tương lai |
| 7 | Partners | giữ nội dung, đưa copy vào i18n, layout bớt "card đôi" |
| 8 | Team | giữ, bỏ osu! iframe khỏi luồng chính (chuyển thành link) |
| 9 | **Contact/Footer** | Spline boxes → `SignalField`; thêm footer thật (sitemap, license, năm) |

Route: `/` (Home) · `/projects` (side projects, bỏ Aurora tím-hồng, dùng palette chuẩn).
Xoá `/team` và `/contact` placeholder → redirect về anchor tương ứng.

## 5. Design system — siết lại

- Thêm tầng: `--surface-2`, `--border-strong`, `--ink-faint`.
- Accent chỉ dùng cho: 1 rim trong hero, dot trạng thái "current", focus ring, hover underline.
  **Không** dùng cho heading, không cho background lớn.
- Type: giữ Bricolage Grotesque (display) + Inter (body); thêm `--font-mono` (ui-monospace) cho
  số liệu/nhãn kỹ thuật — đây là org dev, số phải trông như số.
- Motion tokens: thêm `--duration-slower: 900ms`, `--ease-cinematic`.
- Radius cap giữ 12px.

## 6. Rebrand copy (EN default, VI đầy đủ)

Hướng: nói cái đã làm, không nói cái muốn thành. Bỏ "simply advanced your technology",
bỏ "high-impact solutions", "redefine the future of technology", "extraordinary digital experiences".

- Eyebrow: `NekoTech Foundation · Building since Sep 2025`
- H1: `We ship software in the open.`
- Sub: `A developer collective from Vietnam building AI agents, streaming infrastructure, and
  developer tools. Every commit public, every decision documented.`
- CTA: `See what we build` / `Join the org`

Toàn bộ string mới nằm trong `src/locales/{en,vi}.ts` + `types.ts` mở rộng.

## 7. Thứ tự thực thi

1. `npm i` three.js (pin exact) + `@types/three`
2. Viết lại `globals.css` (tokens + reveal system ổn định hơn)
3. `src/components/three/` — TerrainField, SignalField, useSceneLifecycle
4. i18n: `types.ts` → `en.ts` → `vi.ts` (schema mới, phủ 100% copy)
5. Hero + Header
6. Signal / Work / Capabilities / Trajectory / Partners / Team
7. Contact + Footer mới
8. Router + Projects page; xoá route mồ côi
9. Xoá code chết
10. Sửa `main.ts` reveal (bỏ innerHTML rewrite)
11. PRODUCT.md + README.md
12. `npm run build` + kiểm tra typecheck, kiểm tra không còn chuỗi `spline`

## 8. Definition of done

- [ ] `grep -ri spline src index.html` → 0 kết quả
- [ ] `npm run build` pass, không TS error
- [ ] Không còn copy hardcode ngoài i18n ở Home
- [ ] Reduced-motion: 3D tĩnh, mọi reveal hiển thị sẵn
- [ ] Không có WebGL → trang vẫn đọc được (fallback tĩnh)
- [ ] README phản ánh đúng stack (Vite + Vue + Netlify)
