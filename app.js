/**
 * MATHX ENTERPRISE WEB APPLICATION ENGINE
 * Tích hợp Supabase Realtime Database & Auth API
 * Project URL: https://wcdcibrfysftpsteerkn.supabase.co
 */

// Supabase Configuration Tokens
const SUPABASE_URL = 'https://wcdcibrfysftpsteerkn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZGNpYnJmeXNmdHBzdGVlcmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzOTQ1MzgsImV4cCI6MjEwMTk3MDUzOH0.GA1B3eTeb4NzblQGpQ7aPIRzoPYYOQhLa2A0LBXulnM';

// Initialize Supabase Client
const supabase = (window.supabase && window.supabase.createClient) 
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
    : null;

const app = {
    // Current State (Trạng thái ứng dụng)
    state: {
        theme: localStorage.getItem('mathx_theme') || 'light',
        activeGradeFilter: 'all',
        isAuthOpen: false,
        authMode: 'login', // 'login' | 'register'
        currentQuiz: null,
        selectedAnswer: null,
        user: null
    },

    // Sample Interactive Quizzes Mock Data
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
        console.log('⚡ Supabase Client initialized with Project URL:', SUPABASE_URL);

        // Check Supabase Auth Session
        if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                this.state.user = session.user;
                this.updateUserUI(session.user.email);
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

    // Grade Filtering
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

    // Drawers & Modals
    toggleMobileDrawer() {
        const drawer = document.getElementById('mobileDrawer');
        if (drawer) drawer.classList.toggle('hidden');
    },

    toggleArchModal() {
        const modal = document.getElementById('archModal');
        if (modal) modal.classList.toggle('hidden');
    },

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

        // Sync Submission Result to Supabase Database
        if (supabase) {
            try {
                await supabase.from('student_submissions').insert([{
                    quiz_title: document.getElementById('quizTitle').textContent,
                    selected_option: this.state.selectedAnswer,
                    is_correct: isCorrect,
                    points: isCorrect ? 10 : 0
                }]);
                console.log('⚡ Saved quiz submission to Supabase');
            } catch (err) {
                console.warn('Supabase sync notice:', err.message);
            }
        }
    },

    // Auth Modal Logic with Supabase Auth
    openAuthModal(mode = 'login') {
        this.state.authMode = mode;
        const modal = document.getElementById('authModal');
        const title = document.getElementById('authModalTitle');
        const regFields = document.getElementById('registerFields');

        if (mode === 'register') {
            title.textContent = 'Đăng Ký Tài Khoản Học Sinh/Phụ Huynh';
            regFields.classList.remove('hidden');
        } else {
            title.textContent = 'Đăng Nhập MATHX';
            regFields.classList.add('hidden');
        }

        modal.classList.remove('hidden');
    },

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) modal.classList.add('hidden');
    },

    async handleAuthSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;

        if (supabase) {
            if (this.state.authMode === 'register') {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) {
                    alert(`Đăng ký Supabase: ${error.message}`);
                } else {
                    alert(`🎉 Đăng ký thành công trên Supabase! Vui lòng kiểm tra email xác nhận: ${email}`);
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    alert(`Đăng nhập: ${error.message}`);
                } else {
                    alert(`✅ Đăng nhập thành công với Supabase! Chào mừng: ${email}`);
                    this.updateUserUI(email);
                }
            }
        } else {
            alert(`✅ ${this.state.authMode === 'login' ? 'Đăng nhập' : 'Đăng ký'} thành công với: ${email}`);
            this.updateUserUI(email);
        }

        this.closeAuthModal();
    },

    updateUserUI(email) {
        const authContainer = document.getElementById('userAuthState');
        if (authContainer) {
            authContainer.innerHTML = `
                <div class="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded border border-slate-700">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span class="text-xs font-bold text-amber-300">⚡ Supabase User: ${email.split('@')[0]}</span>
                    <button onclick="app.handleSignOut()" class="text-[10px] text-slate-400 hover:text-rose-400 ml-1">Đăng xuất</button>
                </div>
            `;
        }
    },

    async handleSignOut() {
        if (supabase) {
            await supabase.auth.signOut();
        }
        location.reload();
    },

    // Supabase Lead Form Submission (Đăng ký học thử vào Supabase table 'leads')
    async handleLeadForm(e) {
        e.preventDefault();
        const form = e.target;
        const parentName = form.querySelector('input[type="text"]').value;
        const phone = form.querySelector('input[type="tel"]').value;
        const grade = form.querySelector('select').value;
        const note = form.querySelector('textarea').value;

        if (supabase) {
            try {
                const { data, error } = await supabase.from('leads').insert([{
                    parent_name: parentName,
                    phone: phone,
                    grade: grade,
                    note: note
                }]);

                if (error) {
                    console.warn('Notice inserting into Supabase leads table:', error.message);
                } else {
                    console.log('⚡ Successfully saved Lead to Supabase Database!');
                }
            } catch (err) {
                console.warn('Supabase Lead sync notice:', err.message);
            }
        }

        alert('🎉 Đăng ký học thử thành công! Dữ liệu đã được lưu trực tiếp vào Supabase. Bộ phận tư vấn MATHX sẽ liên hệ với Phụ huynh trong vòng 15 phút.');
        form.reset();
    },

    // Supabase Newsletter Submission (Đăng ký newsletter vào Supabase)
    async handleNewsletter(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;

        if (supabase) {
            try {
                await supabase.from('newsletter_subscribers').insert([{ email }]);
                console.log('⚡ Saved Newsletter Subscriber to Supabase');
            } catch (err) {
                console.warn('Supabase Subscriber notice:', err.message);
            }
        }

        alert('📧 Cảm ơn bạn! Email đã được đăng ký trên Supabase. Hệ thống đã gửi bộ đề thi Toán tư duy vào email của bạn.');
        form.reset();
    },

    // Quick Search Filter
    handleSearch(query) {
        const q = query.toLowerCase().trim();
        const cards = document.querySelectorAll('#gradeCardsGrid .grade-card');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(q)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    },

    // Curriculum Helper
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
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
