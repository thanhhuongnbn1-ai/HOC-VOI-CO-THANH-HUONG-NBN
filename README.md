# 🎓 MATHX ENTERPRISE WEB APP - 4-TIER ARCHITECTURE

Hệ thống Website Giáo Dục Trực Tuyến MATHX chuẩn Enterprise được phát triển dựa trên **Sơ Đồ Cấu Trúc 4 Tầng (4-Tier Information Architecture)** và **Ngôn ngữ Thiết kế Tham chiếu MATHX**.

---

## 🏛️ 1. Cấu Trúc 4 Tầng Thông Tin (4-Tier Information Architecture)

1. **Tầng 1 (Global Shell / Header & Navigation):**
   - Topbar Tiện ích (Hotline `0932.474.173`, Thanh toán, Hướng dẫn học, CDN Cloudflare Badge, Dark/Light Mode toggle).
   - Brand Identity (Logo MATHX Gradient, Slogan "Thích học toán - Giỏi tư duy").
   - Mega Menu & Navigation (Giới thiệu, Học toán Mầm Nông - Lớp 5, Toán Vui, Thi Thử AI, Kỳ Thi Olympic, Kho Tài Liệu, Sơ Đồ Kiến Trúc).
   - Quick Search bar & Chế độ Đăng nhập Phụ huynh/Học sinh.

2. **Tầng 2 (Hero & High-Level Overview):**
   - Dynamic Hero Section với Banner Glassmorphism 3D.
   - Trích dẫn cảm hứng từ Cô THANH HƯƠNG - Cùng con vươn ra thế giới.
   - Value Proposition Pills (Tương tác direct 1-1, Giáo trình chất lượng, Sát sao đánh giá).
   - Key Metrics & Stat Board (50,000+ Học sinh, 98.4% Đạt điểm giỏi, 1,200+ Đề thi AI, 99.99% Uptime).
   - Primary Interactive CTAs.

3. **Tầng 3 (Core Business Modules & Content Processing):**
   - Bộ lọc danh mục khối lớp (Interactive Grade Filter Tabs).
   - Card Grid Layout 6 Khối Lớp thiết kế chuẩn tông màu nhận diện từ Ảnh 2:
     - Mầm Nông (Cam `#F25123`), Lớp 1 (Tím `#9177F8`), Lớp 2 (Xanh Lam `#00A6E6`), Lớp 3 (Xanh Lá `#60B731`), Lớp 4 (Tím Chàm `#7367F0`), Lớp 5 (Đỏ Tươi `#FF4C51`).
   - Interactive Exercise Quiz Modal (Làm bài trắc nghiệm Toán tư duy real-time kèm AI giải thích chi tiết).
   - Enterprise System Architecture Explorer (Mô phỏng 4 Tầng Backend Topology dựa trên Ảnh 1).
   - Form Đăng Ký Học Thử Miễn Phí & Tư Vấn Lộ Trình 1-1.

4. **Tầng 4 (Global Footer & System Anchor):**
   - Dynamic Sitemap phân loại theo Chương trình học và Kỳ thi.
   - Form đăng ký Email nhận đề thi hàng tuần.
   - Legal/Compliance (Bảo mật thông tin trẻ em COPPA & GDPR).
   - System Health Anchor & Hotline 0932.474.173.

---

## 🛠️ 2. Hướng Dẫn Vận Hành & Deploy

### Chạy trực tiếp trên môi trường Local:
Mở trực tiếp file `index.html` trong bất kỳ trình duyệt web nào (Chrome, Edge, Firefox, Safari) hoặc phục vụ qua web server (Nginx, Apache, VS Code Live Server, IIS).

### Deploy lên Hosting (Hostinger, cPanel, Vercel, Netlify):
Upload 3 file chính lên thư mục `public_html`:
- `index.html`
- `styles.css`
- `app.js`

### Tích hợp Database PostgreSQL:
Chạy script `database_schema.sql` trên PostgreSQL Database Server để khởi tạo cấu trúc bảng dữ liệu cho Backend API.
