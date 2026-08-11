-- =============================================================================
-- SUPABASE ENTERPRISE DATABASE SETUP SCRIPT
-- Project URL: https://wcdcibrfysftpsteerkn.supabase.co
-- Chạy script này trong Supabase Dashboard -> SQL Editor để khởi tạo tất cả các bảng
-- =============================================================================

-- 1. Bảng Đăng Ký Tư Vấn & Học Thử (Leads)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    grade TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng Đăng Ký Nhận Đề Thi / Newsletter
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng Lưu Trừ Kết Quả Bài Làm Quiz (Student Submissions)
CREATE TABLE IF NOT EXISTS public.student_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    quiz_title TEXT NOT NULL,
    selected_option INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    points INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng Danh Mục Khối Lớp (Grade Levels)
CREATE TABLE IF NOT EXISTS public.grade_levels (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    color_hex TEXT NOT NULL,
    display_order INT DEFAULT 0
);

INSERT INTO public.grade_levels (slug, title, description, color_hex, display_order) VALUES
('mam-non', 'Mầm Non (4-5 tuổi)', 'Làm quen số học & trò chơi tư duy', '#F25123', 1),
('lop-1', 'Lớp 1', 'Toán tư duy Singapore & Số học cơ bản', '#9177F8', 2),
('lop-2', 'Lớp 2', 'Toán tính nhanh & Dãy số quy luật', '#00A6E6', 3),
('lop-3', 'Lớp 3', 'Giải toán có lời văn chuyên sâu', '#60B731', 4),
('lop-4', 'Lớp 4', 'Toán chuyên đề nâng cao', '#7367F0', 5),
('lop-5', 'Lớp 5', 'Ôn thi vào Lớp 6 Trường Chuyên/CLC', '#FF4C51', 6)
ON CONFLICT (slug) DO NOTHING;

-- 5. Bật Row Level Security (RLS) & Cho Phép Truy Cập Công Khai Qua Anon Key
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_levels ENABLE ROW LEVEL SECURITY;

-- Tạo Chính Sách Phân Quyền RLS
CREATE POLICY "Allow public insert to leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to submissions" ON public.student_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select grade levels" ON public.grade_levels FOR SELECT USING (true);
