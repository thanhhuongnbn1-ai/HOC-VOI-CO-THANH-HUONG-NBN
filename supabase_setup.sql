-- =============================================================================
-- SUPABASE ENTERPRISE DATABASE SETUP SCRIPT (UPDATE CHỨC NĂNG HỌC SINH & ADMIN)
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

-- 2. Bảng Danh Sách Mã Đăng Nhập Học Sinh (Students Credentials)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL, -- Ví dụ: NGUYENVANA001
    code TEXT NOT NULL,             -- Mật khẩu mã riêng: nbn4001
    grade TEXT NOT NULL,
    status TEXT DEFAULT 'Hoạt động',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed dữ liệu mẫu Học Sinh
INSERT INTO public.students (full_name, username, code, grade) VALUES
('Nguyễn Văn An', 'NGUYENVANA001', 'nbn4001', 'Lớp 5'),
('Trần Thị Bình', 'TRANTHIB002', 'nbn4002', 'Lớp 4'),
('Lê Văn Phúc', 'LEVANP003', 'nbn4003', 'Lớp 3')
ON CONFLICT (username) DO NOTHING;

-- 3. Bảng Đăng Ký Nhận Đề Thi / Newsletter
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng Lưu Trừ Kết Quả Bài Làm Quiz (Student Submissions)
CREATE TABLE IF NOT EXISTS public.student_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    quiz_title TEXT NOT NULL,
    selected_option INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    points INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bật Row Level Security (RLS) & Cho Phép Truy Cập Công Khai
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;

-- Tạo Chính Sách Phân Quyền RLS
CREATE POLICY "Allow public all leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "Allow public all students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow public insert newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert submissions" ON public.student_submissions FOR INSERT WITH CHECK (true);
