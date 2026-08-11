-- =============================================================================
-- ENTERPRISE DATABASE SCHEMA (POSTGRESQL MAIN DB)
-- Hệ thống MATHX 4-Tier Enterprise Architecture
-- Phục vụ Tầng Cơ Sở Dữ Liệu (Database Layer) từ Ảnh Sơ Đồ Kiến Trúc 1
-- =============================================================================

-- 1. Bảng Vai Trò & Phân Quyền (Auth & Role Guard)
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'student', 'parent', 'teacher', 'admin'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES
('student', 'Học sinh làm bài và luyện tập'),
('parent', 'Phụ huynh theo dõi tiến độ'),
('teacher', 'Giáo viên giảng dạy và chấm điểm'),
('admin', 'Quản trị viên hệ thống')
ON CONFLICT (name) DO NOTHING;

-- 2. Bảng Người Dùng (Users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id INT REFERENCES roles(id) ON DELETE RESTRICT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Khối Lớp & Cây Thư Mục Chương Trình Học (Curriculum Service)
CREATE TABLE IF NOT EXISTS grade_levels (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL, -- 'mam-non', 'lop-1', 'lop-2', 'lop-3', 'lop-4', 'lop-5'
    title VARCHAR(100) NOT NULL,
    description TEXT,
    color_hex VARCHAR(10) NOT NULL,
    display_order INT DEFAULT 0
);

INSERT INTO grade_levels (slug, title, description, color_hex, display_order) VALUES
('mam-non', 'Mầm Non (4-5 tuổi)', 'Làm quen số học & trò chơi tư duy', '#F25123', 1),
('lop-1', 'Lớp 1', 'Toán tư duy Singapore & Số học cơ bản', '#9177F8', 2),
('lop-2', 'Lớp 2', 'Toán tính nhanh & Dãy số quy luật', '#00A6E6', 3),
('lop-3', 'Lớp 3', 'Giải toán có lời văn chuyên sâu', '#60B731', 4),
('lop-4', 'Lớp 4', 'Toán chuyên đề nâng cao', '#7367F0', 5),
('lop-5', 'Lớp 5', 'Ôn thi vào Lớp 6 Trường Chuyên/CLC', '#FF4C51', 6)
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS curriculums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_level_id INT REFERENCES grade_levels(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    video_demo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng Đề Thi & Quiz Engine (Quiz & Assignment Engine)
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_id UUID REFERENCES curriculums(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    time_limit_minutes INT DEFAULT 30,
    passing_score INT DEFAULT 8,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options_json JSONB NOT NULL, -- ["A", "B", "C", "D"]
    correct_option_index INT NOT NULL,
    explanation_text TEXT,
    points INT DEFAULT 10
);

-- 5. Bảng Bài Nộp & Chấm Điểm (Scoring & Leaderboard Engine)
CREATE TABLE IF NOT EXISTS student_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    total_score INT DEFAULT 0,
    time_spent_seconds INT,
    status VARCHAR(20) DEFAULT 'completed', -- 'in_progress', 'completed'
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    grade_level_id INT REFERENCES grade_levels(id),
    total_points INT DEFAULT 0,
    rank_position INT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Index Tối Ưu Hiệu Năng (Core Web Vitals & SLA 99.99%)
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_quizzes_curriculum ON quizzes(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON student_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_rank ON leaderboards(grade_level_id, total_points DESC);
