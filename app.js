/**
 * MATHX ENTERPRISE WEB APPLICATION ENGINE
 * Đăng Nhập / Đăng Ký Chuẩn Theo Mã Số Học Sinh (4001 -> Lớp 4, 5001 -> Lớp 5)
 * Tự động chuyển hướng mở Lớp Học & Hiển thị thông báo "Chúc mừng bạn đến với lớp học cô Thanh Hương"
 * Supabase Project URL: https://wcdcibrfysftpsteerkn.supabase.co
 */

// Supabase Configuration
const SUPABASE_URL = 'https://wcdcibrfysftpsteerkn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZGNpYnJmeXNmdHBzdGVlcmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzOTQ1MzgsImV4cCI6MjEwMTk3MDUzOH0.GA1B3eTeb4NzblQGpQ7aPIRzoPYYOQhLa2A0LBXulnM';

const supabase = (window.supabase && window.supabase.createClient) 
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
    : null;

const app = {
    // Application State
    state: {
        theme: localStorage.getItem('mathx_theme') || 'light',
        activeGradeFilter: 'all',
        authRole: 'student', // 'student' | 'admin'
        authMode: 'login', // 'login' | 'register'
        currentQuiz: null,
        selectedAnswer: null,
        currentUser: null,
        targetGradeAfterLogin: null,
        
        // Mock Lead Registrations
        leads: [
            { id: 1, name: 'Nguyễn Văn An', phone: '0932474173', grade: 'Lớp 4', created_at: '2026-08-11 09:30' },
            { id: 2, name: 'Trần Thị Bình', phone: '0912345678', grade: 'Lớp 5 (Ôn Thi Cấp 2)', created_at: '2026-08-11 10:15' },
            { id: 3, name: 'Lê Văn Phúc', phone: '0988776655', grade: 'Lớp 3', created_at: '2026-08-11 10:45' }
        ],

        // Pre-configured Student Credentials (Tên đăng nhập & Mật khẩu mã riêng chuẩn 4001 -> Lớp 4, 5001 -> Lớp 5)
        students: [
            { id: 1, name: 'Nguyễn Văn A', username: 'NGUYENVANA4001', code: '4001', grade: 'lop-4', gradeName: 'Lớp 4', status: 'Hoạt động' },
            { id: 2, name: 'Trần Thị B', username: 'TRANTHIB5001', code: '5001', grade: 'lop-5', gradeName: 'Lớp 5 (Ôn Thi Cấp 2)', status: 'Hoạt động' },
            { id: 3, name: 'Lê Văn P', username: 'LEVANP3001', code: '3001', grade: 'lop-3', gradeName: 'Lớp 3', status: 'Hoạt động' },
            { id: 4, name: 'Hoàng Minh T', username: 'HOANGMINHT2001', code: '2001', grade: 'lop-2', gradeName: 'Lớp 2', status: 'Hoạt động' },
            { id: 5, name: 'Phạm Thị C', username: 'PHAMTHIC1001', code: '1001', grade: 'lop-1', gradeName: 'Lớp 1', status: 'Hoạt động' },
            { id: 6, name: 'Vương Minh M', username: 'VUONGMINHM0001', code: '0001', grade: 'mam-non', gradeName: 'Mầm Non (4-5t)', status: 'Hoạt động' }
        ]
    },

    // Quizzes Mock Data
    quizzes: {
        'Thách thức IQ Hôm nay': {
            question: 'Tìm số tiếp theo trong dãy: 2, 6, 12, 20, 30, ...?',
            options: ['36', '40', '42', '45'],
            correct: 2,
            explanation: 'Quy luật: Số thứ n bằng n × (n + 1). Với n = 6: 6 × 7 = 42.'
        },
        'Đố Vui Toán Học': {
            question: 'Con gà rưỡi đẻ trong một ngày rưỡi được một quả trứng rưỡi. Hỏi 6 con gà đẻ trong 6 ngày được bao nhiêu quả trứng?',
            options: ['12 quả', '24 quả', '36 quả', '18 quả'],
            correct: 1,
            explanation: '1 con gà trong 1.5 ngày đẻ 1 quả. Vậy 1 con gà trong 6 ngày đẻ 4 quả. Do đó 6 con gà trong 6 ngày đẻ: 6 × 4 = 24 quả.'
        },
        'Toán Tư Duy IQ': {
            question: 'Hình tròn có 0 góc, Hình tam giác có 3 góc, Hình vuông có 4 góc. Hỏi Hình ngôi sao 5 cánh có bao nhiêu góc?',
            options: ['5 góc', '10 góc', '8 góc', '12 góc'],
            correct: 1,
            explanation: 'Ngôi sao 5 cánh có 5 đỉnh góc nhọn ở ngoài và 5 góc lõm ở trong, tổng cộng là 10 góc!'
        },
        'Góc Tìm Tòi Sáng Tạo': {
            question: 'Có 9 viên bi giống hệt nhau, trong đó có 1 viên bi nhẹ hơn các viên còn lại. Với chiếc cân đĩa không có quả cân, cần ít nhất bao nhiêu lần cân để tìm ra viên bi nhẹ hơn đó?',
            options: ['1 lần', '2 lần', '3 lần', '4 lần'],
            correct: 1,
            explanation: 'Chia 9 viên thành 3 nhóm (3,3,3). Lần 1: Cân 2 nhóm bất kỳ. Nhóm nhẹ hơn chứa viên bị lỗi. Lần 2: Cân 2 viên bất kỳ trong nhóm 3 viên đó.'
        },
        'Lớp Toán Mầm Nông': {
            question: 'Bạn An có 3 quả táo, mẹ cho An thêm 2 quả táo nữa. Hỏi An có tất cả bao nhiêu quả táo?',
            options: ['4 quả', '5 quả', '6 quả', '3 quả'],
            correct: 1,
            explanation: 'Phép tính đơn giản: 3 + 2 = 5 quả táo.'
        },
        'Lớp 1 - Toán Tư Duy': {
            question: 'Số lớn nhất có một chữ số cộng với số nhỏ nhất có một chữ số khác 0 bằng bao nhiêu?',
            options: ['9', '10', '11', '8'],
            correct: 1,
            explanation: 'Số lớn nhất có 1 chữ số là 9. Số nhỏ nhất có 1 chữ số khác 0 là 1. Tổng = 9 + 1 = 10.'
        },
        'Lớp 2 - Toán Nâng Cao': {
            question: 'Tính nhanh tổng dãy số: 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 = ?',
            options: ['50', '55', '60', '65'],
            correct: 1,
            explanation: 'Ghép cặp: (1+10) + (2+9) + (3+8) + (4+7) + (5+6) = 11 × 5 = 55.'
        },
        'Lớp 3 - Giải Toán Có Lời Văn': {
            question: 'Một lớp học có 35 học sinh. Số học sinh nữ nhiều hơn số học sinh nam là 5 bạn. Hỏi lớp đó có bao nhiêu học sinh nữ?',
            options: ['15 bạn', '20 bạn', '25 bạn', '18 bạn'],
            correct: 1,
            explanation: 'Số lớn = (Tổng + Hiệu) / 2 = (35 + 5) / 2 = 20 bạn nữ.'
        },
        'Lớp 4 - Toán Chuyên Đề': {
            question: 'Trung bình cộng của 3 số là 45. Biết số thứ nhất là 30, số thứ hai là 50. Tìm số thứ ba?',
            options: ['40', '55', '60', '50'],
            correct: 1,
            explanation: 'Tổng 3 số = 45 × 3 = 135. Số thứ ba = 135 - 30 - 50 = 55.'
        },
        'Lớp 5 - Luyện Thi Cấp 2': {
            question: 'Hai ô tô cùng khởi hành từ A và B cách nhau 180 km đi ngược chiều nhau. Ô tô thứ nhất đi với vận tốc 40 km/h, ô tô thứ hai đi với vận tốc 50 km/h. Hỏi sau bao lâu hai xe gặp nhau?',
            options: ['1.5 giờ', '2 giờ', '2.5 giờ', '3 giờ'],
            correct: 1,
            explanation: 'Tổng vận tốc 2 xe = 40 + 50 = 90 km/h. Thời gian gặp nhau = 180 / 90 = 2 giờ.'
        }
    },

    // Initialization
    async init() {
        this.applyTheme(this.state.theme);
        console.log('⚡ MATHX Enterprise App Engine Initialized!');
        
        // Fetch Realtime Leads from Supabase
        if (supabase) {
            try {
                const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
                if (data && data.length > 0) {
                    this.state.leads = data.map(item => ({
                        id: item.id,
                        name: item.parent_name || 'Học sinh',
                        phone: item.phone || '',
                        grade: item.grade || 'Mầm Non',
                        created_at: new Date(item.created_at).toLocaleString('vi-VN')
                    }));
                }
            } catch (err) {
                console.warn('Notice loading leads:', err.message);
            }
        }
    },

    // Theme Handler
    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('mathx_theme', this.state.theme);
        this.applyTheme(this.state.theme);
    },

    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    },

    // Grade Category Filtering
    filterGrade(category) {
        this.state.activeGradeFilter = category;
        const buttons = document.querySelectorAll('.grade-tab-btn');
        buttons.forEach(btn => {
            if (btn.getAttribute('data-grade') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const cards = document.querySelectorAll('#gradeCardsGrid .grade-card');
        cards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    },

    // Navigation Drawers
    toggleMobileDrawer() {
        const drawer = document.getElementById('mobileDrawer');
        if (drawer) drawer.classList.toggle('hidden');
    },

    toggleArchModal() {
        const modal = document.getElementById('archModal');
        if (modal) modal.classList.toggle('hidden');
    },

    // Interactive Quiz Exercise Modal
    openExerciseModal(quizName) {
        const modal = document.getElementById('exerciseModal');
        const titleEl = document.getElementById('quizTitle');
        const contentEl = document.getElementById('quizContent');
        const feedbackEl = document.getElementById('quizFeedback');

        const quiz = this.quizzes[quizName] || this.quizzes['Thách thức IQ Hôm nay'];
        this.state.currentQuiz = quiz;
        this.state.selectedAnswer = null;

        titleEl.textContent = quizName;
        feedbackEl.className = 'hidden p-3 rounded-xl text-xs font-semibold';
        feedbackEl.textContent = '';

        let optionsHTML = quiz.options.map((opt, idx) => `
            <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors">
                <input type="radio" name="quizOpt" value="${idx}" onchange="app.state.selectedAnswer = ${idx}" class="text-orange-500 focus:ring-orange-500">
                <span class="font-medium text-slate-800 dark:text-slate-200">${String.fromCharCode(65 + idx)}. ${opt}</span>
            </label>
        `).join('');

        contentEl.innerHTML = `
            <p class="font-bold text-slate-900 dark:text-slate-100 text-sm leading-relaxed">${quiz.question}</p>
            <div class="space-y-2 mt-3">${optionsHTML}</div>
        `;

        modal.classList.remove('hidden');
    },

    closeExerciseModal() {
        const modal = document.getElementById('exerciseModal');
        if (modal) modal.classList.add('hidden');
    },

    async submitQuizAnswer() {
        const feedbackEl = document.getElementById('quizFeedback');
        const quiz = this.state.currentQuiz;

        if (this.state.selectedAnswer === null) {
            alert('Vui lòng chọn 1 đáp án trước khi nộp bài!');
            return;
        }

        const isCorrect = (this.state.selectedAnswer === quiz.correct);
        feedbackEl.classList.remove('hidden');

        if (isCorrect) {
            feedbackEl.className = 'p-3 rounded-xl text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30';
            feedbackEl.innerHTML = `🎉 CHÍNH XÁC! Chúc mừng em đã giải đúng câu hỏi.<br><span class="font-normal mt-1 block">${quiz.explanation}</span>`;
        } else {
            feedbackEl.className = 'p-3 rounded-xl text-xs font-semibold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-500/30';
            feedbackEl.innerHTML = `❌ RẤT TIẾC! Đáp án chính xác là <strong>${String.fromCharCode(65 + quiz.correct)}. ${quiz.options[quiz.correct]}</strong>.<br><span class="font-normal mt-1 block">${quiz.explanation}</span>`;
        }

        // Sync Submission to Supabase
        if (supabase) {
            try {
                await supabase.from('student_submissions').insert([{
                    quiz_title: document.getElementById('quizTitle').textContent,
                    selected_option: this.state.selectedAnswer,
                    is_correct: isCorrect,
                    points: isCorrect ? 10 : 0
                }]);
            } catch (err) {
                console.warn('Sync quiz notice:', err.message);
            }
        }
    },

    // AUTH & ROLE SWITCHING LOGIC (Nút "Đăng Nhập" & Nút "Đăng Ký")
    openAuthModal(mode = 'login') {
        this.state.authMode = mode;
        const modal = document.getElementById('authModal');
        const title = document.getElementById('authModalTitle');
        const roleTabs = document.getElementById('loginRoleTabs');
        const regFields = document.getElementById('registerFields');
        const btnSubmit = document.getElementById('btnAuthSubmit');
        const fieldUsername = document.getElementById('fieldUsername');
        const fieldPassword = document.getElementById('fieldPassword');
        const quickDemoButtons = document.getElementById('quickDemoButtons');

        if (mode === 'register') {
            title.textContent = 'BẢNG ĐĂNG KÝ HỌC THỬ';
            roleTabs.classList.add('hidden');
            regFields.classList.remove('hidden');
            btnSubmit.textContent = 'ĐĂNG KÝ';
            if (quickDemoButtons) quickDemoButtons.classList.add('hidden');
            
            // Hide Username & Password fields for Register Mode
            fieldUsername.classList.add('hidden');
            fieldPassword.classList.add('hidden');
            document.getElementById('authUsername').required = false;
            document.getElementById('authPassword').required = false;

            document.getElementById('regFullName').required = true;
            document.getElementById('regPhone').required = true;
        } else {
            title.textContent = 'BẢNG ĐĂNG NHẬP HỌC VIÊN';
            roleTabs.classList.remove('hidden');
            regFields.classList.add('hidden');
            btnSubmit.textContent = 'HOÀN THÀNH';
            if (quickDemoButtons) quickDemoButtons.classList.remove('hidden');
            
            fieldUsername.classList.remove('hidden');
            fieldPassword.classList.remove('hidden');
            document.getElementById('authUsername').required = true;
            document.getElementById('authPassword').required = true;

            document.getElementById('regFullName').required = false;
            document.getElementById('regPhone').required = false;
            
            this.switchAuthRole(this.state.authRole || 'student');
        }

        modal.classList.remove('hidden');
    },

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) modal.classList.add('hidden');
    },

    // Welcome Banner Modal ("Chúc mừng bạn đến với lớp học cô Thanh Hương")
    showWelcomeBanner(subtitleText, targetGrade = null) {
        this.state.targetGradeAfterLogin = targetGrade;
        const bannerModal = document.getElementById('welcomeBannerModal');
        const subtitleEl = document.getElementById('welcomeBannerSubtitle');
        if (subtitleEl) subtitleEl.textContent = subtitleText;
        if (bannerModal) bannerModal.classList.remove('hidden');
    },

    closeWelcomeBanner() {
        const bannerModal = document.getElementById('welcomeBannerModal');
        if (bannerModal) bannerModal.classList.add('hidden');

        // Target Grade Auto Scroll & Open Class Modal
        if (this.state.targetGradeAfterLogin) {
            const gradeCat = this.state.targetGradeAfterLogin;
            this.filterGrade(gradeCat);
            this.scrollToSection('khoahoc');

            // Open Curriculum view for the class
            setTimeout(() => {
                this.viewCurriculum(gradeCat);
            }, 600);
            this.state.targetGradeAfterLogin = null;
        }
    },

    // 1-Click Auto Login Helpers
    autoLoginStudent() {
        this.switchAuthRole('student');
        document.getElementById('authUsername').value = 'NGUYENVANA4001';
        document.getElementById('authPassword').value = '4001';
        document.getElementById('authForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    },

    autoLoginAdmin() {
        this.switchAuthRole('admin');
        document.getElementById('authUsername').value = 'thanhhuongnbn84';
        document.getElementById('authPassword').value = '246357';
        document.getElementById('authForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    },

    // Switch between Student Role & Admin Role
    switchAuthRole(role) {
        this.state.authRole = role;
        const tabStudent = document.getElementById('tabRoleStudent');
        const tabAdmin = document.getElementById('tabRoleAdmin');
        const lblUsername = document.getElementById('lblUsername');
        const hintUsername = document.getElementById('hintUsername');
        const lblPassword = document.getElementById('lblPassword');
        const hintPassword = document.getElementById('hintPassword');
        const usernameInput = document.getElementById('authUsername');
        const passwordInput = document.getElementById('authPassword');

        if (role === 'admin') {
            tabAdmin.className = 'py-2 rounded-lg bg-white dark:bg-slate-700 text-amber-500 dark:text-amber-400 shadow-sm transition-all text-center';
            tabStudent.className = 'py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-all text-center';
            
            lblUsername.textContent = 'Tên đăng nhập Admin/Giáo viên';
            usernameInput.placeholder = 'thanhhuongnbn84';
            usernameInput.value = 'thanhhuongnbn84';
            hintUsername.innerHTML = 'Tài khoản Giáo viên: <strong class="text-amber-500">thanhhuongnbn84</strong>';

            lblPassword.textContent = 'Mật khẩu Admin/Giáo viên';
            passwordInput.placeholder = '246357';
            passwordInput.value = '246357';
            hintPassword.innerHTML = 'Mật khẩu Giáo viên: <strong class="text-amber-500">246357</strong>';
        } else {
            tabStudent.className = 'py-2 rounded-lg bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm transition-all text-center';
            tabAdmin.className = 'py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-all text-center';

            lblUsername.textContent = 'Mã số học sinh (Tên học sinh và mã số riêng)';
            usernameInput.placeholder = 'Ví dụ: NGUYENVANA4001';
            usernameInput.value = 'NGUYENVANA4001';
            hintUsername.innerHTML = 'Mã học sinh mẫu Lớp 4: <strong class="text-orange-500">NGUYENVANA4001</strong>';

            lblPassword.textContent = 'Mật khẩu (Mã số riêng)';
            passwordInput.placeholder = 'Ví dụ: 4001';
            passwordInput.value = '4001';
            hintPassword.innerHTML = 'Mật khẩu mẫu Lớp 4: <strong class="text-orange-500">4001</strong>';
        }
    },

    // Handle Form Submit (Xử lý Đăng Ký & Đăng Nhập)
    async handleAuthSubmit(e) {
        e.preventDefault();

        if (this.state.authMode === 'register') {
            // 1. CHẾ ĐỘ ĐĂNG KÝ (Họ tên học sinh, SĐT phụ huynh, Khối lớp)
            const studentName = document.getElementById('regFullName').value.trim();
            const parentPhone = document.getElementById('regPhone').value.trim();
            const gradeName = document.getElementById('regGrade').value;

            if (!studentName || !parentPhone) {
                alert('Vui lòng nhập đầy đủ Họ và tên học sinh và Số điện thoại phụ huynh!');
                return;
            }

            const newLead = {
                id: Date.now(),
                name: studentName,
                phone: parentPhone,
                grade: gradeName,
                created_at: new Date().toLocaleString('vi-VN')
            };

            this.state.leads.unshift(newLead);

            // Sync to Supabase Database
            if (supabase) {
                try {
                    await supabase.from('leads').insert([{
                        parent_name: studentName,
                        phone: parentPhone,
                        grade: gradeName
                    }]);
                } catch (err) {
                    console.warn('Sync notice:', err.message);
                }
            }

            this.closeAuthModal();
            this.showWelcomeBanner(`Chúc mừng học sinh ${studentName} (SĐT Phụ huynh: ${parentPhone}) đã đăng ký thành công khoá học ${gradeName}! Cô Thanh Hương sẽ liên hệ sắp xếp lớp sớm nhất.`);
            return;
        }

        // 2. CHẾ ĐỘ ĐĂNG NHẬP (Mã số riêng 4001 -> Lớp 4, 5001 -> Lớp 5)
        const username = document.getElementById('authUsername').value.trim().toUpperCase();
        const password = document.getElementById('authPassword').value.trim();

        if (this.state.authRole === 'admin') {
            // Admin Credentials: thanhhuongnbn84 / 246357
            if (username === 'THANHHUONGNBN84' && password === '246357') {
                this.closeAuthModal();
                this.updateUserUI('thanhhuongnbn84', 'Admin');
                this.showWelcomeBanner('Chào mừng Cô THANH HƯƠNG đến với Cổng Quản Lý Giáo Viên & Xuất File Excel!');
                this.openAdminModal();
            } else {
                alert('❌ Tên đăng nhập hoặc mật khẩu Admin không đúng!\n\nTài khoản mặc định: thanhhuongnbn84 / Mật khẩu: 246357');
            }
        } else {
            // Student Login Logic: Search matched student or infer grade from code number (4001 -> Lớp 4, 5001 -> Lớp 5)
            let matchedStudent = this.state.students.find(
                s => s.username.toUpperCase() === username && s.code === password
            );

            // Dynamic evaluation if code matches pattern (e.g. username ends with 4001, pass 4001)
            let targetGradeCat = 'lop-4'; // default
            let gradeTitle = 'Lớp 4';

            if (matchedStudent) {
                targetGradeCat = matchedStudent.grade;
                gradeTitle = matchedStudent.gradeName;
            } else if (password.includes('5') || username.includes('500')) {
                targetGradeCat = 'lop-5';
                gradeTitle = 'Lớp 5 (Ôn Thi Cấp 2)';
            } else if (password.includes('4') || username.includes('400')) {
                targetGradeCat = 'lop-4';
                gradeTitle = 'Lớp 4';
            } else if (password.includes('3') || username.includes('300')) {
                targetGradeCat = 'lop-3';
                gradeTitle = 'Lớp 3';
            } else if (password.includes('2') || username.includes('200')) {
                targetGradeCat = 'lop-2';
                gradeTitle = 'Lớp 2';
            } else if (password.includes('1') || username.includes('100')) {
                targetGradeCat = 'lop-1';
                gradeTitle = 'Lớp 1';
            } else if (password.includes('0') || username.includes('000')) {
                targetGradeCat = 'mam-non';
                gradeTitle = 'Mầm Non (4-5t)';
            }

            const displayName = matchedStudent ? matchedStudent.name : username;
            
            this.closeAuthModal();
            this.updateUserUI(username, 'Student', displayName);
            this.showWelcomeBanner(`Học sinh: ${displayName} (${gradeTitle}) đã đăng nhập thành công. Đang dẫn bạn tới lớp học đã đăng ký...`, targetGradeCat);
        }
    },

    // User Header UI Update
    updateUserUI(username, role = 'Student', displayName = '') {
        const authContainer = document.getElementById('userAuthState');
        if (authContainer) {
            if (role === 'Admin') {
                authContainer.innerHTML = `
                    <div class="flex items-center gap-2 bg-amber-950/80 border border-amber-500/50 px-3 py-1 rounded-xl">
                        <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        <span class="text-xs font-bold text-amber-300">👑 Admin: thanhhuongnbn84</span>
                        <button onclick="app.openAdminModal()" class="text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold px-2 py-0.5 rounded shadow">Bảng Quản Lý</button>
                        <button onclick="location.reload()" class="text-[10px] text-slate-400 hover:text-rose-400 ml-1">Thoát</button>
                    </div>
                `;
            } else {
                authContainer.innerHTML = `
                    <div class="flex items-center gap-2 bg-orange-950/80 border border-orange-500/50 px-3 py-1 rounded-xl">
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span class="text-xs font-bold text-orange-300">🎓 ${displayName || username}</span>
                        <button onclick="location.reload()" class="text-[10px] text-slate-400 hover:text-rose-400 ml-1">Đăng xuất</button>
                    </div>
                `;
            }
        }
    },

    // ADMIN PORTAL & EXCEL EXPORT LOGIC
    openAdminModal() {
        const modal = document.getElementById('adminModal');
        this.renderAdminLeads();
        this.renderAdminStudents();
        modal.classList.remove('hidden');
    },

    closeAdminModal() {
        const modal = document.getElementById('adminModal');
        if (modal) modal.classList.add('hidden');
    },

    switchAdminTab(tabName) {
        const tabLeads = document.getElementById('adminTabLeads');
        const tabStudents = document.getElementById('adminTabStudents');
        const tabCreate = document.getElementById('adminTabCreate');

        const contentLeads = document.getElementById('adminContentLeads');
        const contentStudents = document.getElementById('adminContentStudents');
        const contentCreate = document.getElementById('adminContentCreate');

        [tabLeads, tabStudents, tabCreate].forEach(t => t.className = 'px-4 py-2.5 border-b-2 border-transparent text-slate-400 hover:text-white');
        [contentLeads, contentStudents, contentCreate].forEach(c => c.classList.add('hidden'));

        if (tabName === 'students') {
            tabStudents.className = 'px-4 py-2.5 border-b-2 border-cyan-500 text-cyan-400';
            contentStudents.classList.remove('hidden');
        } else if (tabName === 'create') {
            tabCreate.className = 'px-4 py-2.5 border-b-2 border-amber-500 text-amber-400';
            contentCreate.classList.remove('hidden');
        } else {
            tabLeads.className = 'px-4 py-2.5 border-b-2 border-orange-500 text-orange-400';
            contentLeads.classList.remove('hidden');
        }
    },

    renderAdminLeads() {
        const tbody = document.getElementById('adminLeadsTableBody');
        const statLeads = document.getElementById('statTotalLeads');

        statLeads.textContent = this.state.leads.length;

        if (this.state.leads.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-500">Chưa có lượt đăng ký nào.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.state.leads.map((item, idx) => `
            <tr class="hover:bg-slate-800/50 transition-colors">
                <td class="p-3 font-mono text-slate-400">${idx + 1}</td>
                <td class="p-3 font-bold text-white">${item.name}</td>
                <td class="p-3 font-mono text-orange-400">${item.phone}</td>
                <td class="p-3"><span class="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded border border-orange-500/30 text-[11px] font-bold">${item.grade}</span></td>
                <td class="p-3 text-slate-400">${item.created_at}</td>
                <td class="p-3">
                    <a href="tel:${item.phone}" class="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded transition-colors inline-flex items-center gap-1">
                        📞 Gọi Ngay
                    </a>
                </td>
            </tr>
        `).join('');
    },

    renderAdminStudents() {
        const tbody = document.getElementById('adminStudentsTableBody');
        const statStudents = document.getElementById('statTotalStudents');

        statStudents.textContent = this.state.students.length;

        tbody.innerHTML = this.state.students.map((st, idx) => `
            <tr class="hover:bg-slate-800/50 transition-colors">
                <td class="p-3 text-slate-400">${idx + 1}</td>
                <td class="p-3 font-bold text-white">${st.name}</td>
                <td class="p-3 text-orange-400 font-bold">${st.username}</td>
                <td class="p-3 text-cyan-400 font-bold">${st.code}</td>
                <td class="p-3">${st.gradeName || st.grade}</td>
                <td class="p-3"><span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">● ${st.status}</span></td>
            </tr>
        `).join('');
    },

    handleCreateStudentCode(e) {
        e.preventDefault();
        const nameInput = document.getElementById('newStudentName');
        const gradeInput = document.getElementById('newStudentGrade');

        const name = nameInput.value.trim();
        const gradeName = gradeInput.value;

        if (!name) return;

        // Auto Generate Username & Code (E.g. 4001 for Lớp 4, 5001 for Lớp 5)
        let gradeCodePrefix = '4';
        let gradeCat = 'lop-4';

        if (gradeName.includes('5')) { gradeCodePrefix = '5'; gradeCat = 'lop-5'; }
        else if (gradeName.includes('3')) { gradeCodePrefix = '3'; gradeCat = 'lop-3'; }
        else if (gradeName.includes('2')) { gradeCodePrefix = '2'; gradeCat = 'lop-2'; }
        else if (gradeName.includes('1')) { gradeCodePrefix = '1'; gradeCat = 'lop-1'; }
        else if (gradeName.includes('Mầm')) { gradeCodePrefix = '0'; gradeCat = 'mam-non'; }

        const count = this.state.students.length + 1;
        const codeNum = `${gradeCodePrefix}00${count}`;
        const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, "").toUpperCase();
        const username = `${cleanName}${codeNum}`;

        const newStudent = {
            id: Date.now(),
            name: name,
            username: username,
            code: codeNum,
            grade: gradeCat,
            gradeName: gradeName,
            status: 'Hoạt động'
        };

        this.state.students.unshift(newStudent);
        this.renderAdminStudents();

        alert(`🎉 TẠO MÃ SỐ HỌC SINH THÀNH CÔNG!\n\n• Họ tên: ${name}\n• Tên đăng nhập: ${username}\n• Mật khẩu mã riêng: ${codeNum}\n• Khối lớp: ${gradeName}`);
        nameInput.value = '';
        this.switchAdminTab('students');
    },

    exportLeadsExcel() {
        if (typeof XLSX === 'undefined') {
            alert('Đang tải thư viện Excel, vui lòng thử lại sau 2 giây!');
            return;
        }

        const excelData = this.state.leads.map((item, idx) => ({
            'STT': idx + 1,
            'Họ và Tên Học Sinh / Phụ Huynh': item.name,
            'Số Điện Thoại Phụ Huynh': item.phone,
            'Tùy Chọn Khối Lớp': item.grade,
            'Thời Gian Đăng Ký': item.created_at,
            'Trạng Thái': 'Đã nhận thông tin'
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dang_Ky_Hoc_Thu");

        XLSX.writeFile(workbook, `Danh_Sach_Dang_Ky_Hoc_Co_Thanh_Huong_${new Date().toISOString().slice(0,10)}.xlsx`);
    },

    exportStudentsExcel() {
        if (typeof XLSX === 'undefined') {
            alert('Đang tải thư viện Excel, vui lòng thử lại sau 2 giây!');
            return;
        }

        const excelData = this.state.students.map((st, idx) => ({
            'STT': idx + 1,
            'Họ và Tên Học Sinh': st.name,
            'Tên Đăng Nhập (Username)': st.username,
            'Mật Khẩu (Mã Số Riêng)': st.code,
            'Khối Lớp Học': st.gradeName || st.grade,
            'Trạng Thái': st.status
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ma_So_Hoc_Sinh");

        XLSX.writeFile(workbook, `Danh_Sach_Ma_Hoc_Sinh_Co_Thanh_Huong_${new Date().toISOString().slice(0,10)}.xlsx`);
    },

    async handleLeadForm(e) {
        e.preventDefault();
        const form = e.target;
        const studentName = form.querySelector('input[type="text"]').value.trim();
        const phone = form.querySelector('input[type="tel"]').value.trim();
        const grade = form.querySelector('select').value;

        const newLead = {
            id: Date.now(),
            name: studentName,
            phone: phone,
            grade: grade,
            created_at: new Date().toLocaleString('vi-VN')
        };

        this.state.leads.unshift(newLead);

        if (supabase) {
            try {
                await supabase.from('leads').insert([{
                    parent_name: studentName,
                    phone: phone,
                    grade: grade
                }]);
            } catch (err) {
                console.warn('Supabase lead notice:', err.message);
            }
        }

        this.showWelcomeBanner(`Chúc mừng bạn ${studentName} (SĐT Phụ huynh: ${phone}) đã đăng ký thành công lớp học ${grade}! Cô Thanh Hương sẽ liên hệ tư vấn trong thời gian sớm nhất.`);
        form.reset();
    },

    async handleNewsletter(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;

        if (supabase) {
            try {
                await supabase.from('newsletter_subscribers').insert([{ email }]);
            } catch (err) {}
        }

        alert('📧 Cảm ơn bạn! Đề thi mẫu đã được gửi vào email của bạn.');
        form.reset();
    },

    handleSearch(query) {
        const q = query.toLowerCase().trim();
        const cards = document.querySelectorAll('#gradeCardsGrid .grade-card');
        cards.forEach(card => {
            if (card.textContent.toLowerCase().includes(q)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    },

    viewCurriculum(gradeCategory) {
        const gradeNames = {
            'mam-non': 'Chương trình Toán Mầm Nông (4 - 5 tuổi)',
            'lop-1': 'Lộ trình Toán Tư Duy Lớp 1',
            'lop-2': 'Lộ trình Toán Tính Nhanh & Logic Lớp 2',
            'lop-3': 'Lộ trình Giải Toán Có Lời Văn Lớp 3',
            'lop-4': 'Lộ trình Toán Chuyên Đề Lớp 4',
            'lop-5': 'Lộ trình Luyện Thi Vào Cấp 2 Chuyên Lớp 5'
        };
        this.openExerciseModal(gradeNames[gradeCategory] || 'Chi tiết Lộ Trình Học');
    },

    openDemoVideo() {
        alert('🎬 Đang mở Video Giảng Dạy Tương Tác 1-1 mẫu của Cô Thanh Hương trên MATHX...');
    },

    scrollToSection(id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
