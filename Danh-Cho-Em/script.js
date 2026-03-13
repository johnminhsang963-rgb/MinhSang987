// ==================== QUỸ GẶP NHAU ====================
let moneyData = JSON.parse(localStorage.getItem('moneyData')) || [];

function addMoney() {
    const amount = parseInt(document.getElementById('moneyAmount').value);
    if (!amount || amount < 0) return alert('Nhập số tiền hợp lệ!');
    
    const now = new Date();
    const dateStr = `${now.getHours()}:${now.getMinutes()} ${now.getDate()}/${now.getMonth()+1}`;
    
    moneyData.push({ amount, date: dateStr });
    localStorage.setItem('moneyData', JSON.stringify(moneyData));
    
    document.getElementById('moneyAmount').value = '';
    updateMoneyDisplay();
}

function resetMoney() {
    if (confirm('Xóa toàn bộ quỹ?')) {
        moneyData = [];
        localStorage.removeItem('moneyData');
        updateMoneyDisplay();
    }
}

function updateMoneyDisplay() {
    const historyDiv = document.getElementById('moneyHistory');
    const total = moneyData.reduce((sum, item) => sum + item.amount, 0);
    
    // Hiển thị lịch sử
    historyDiv.innerHTML = moneyData.map(item => `
        <div class="money-entry">
            <span class="date">${item.date}</span>
            <span class="amount">${item.amount.toLocaleString()} VNĐ</span>
        </div>
    `).join('');
    
    // Cập nhật các khoản
    const goCost = total >= 800000 ? 800000 : total;
    const returnCost = total >= 1600000 ? 800000 : (total > 800000 ? total - 800000 : 0);
    
    document.getElementById('goCost').innerText = goCost.toLocaleString() + ' VNĐ';
    document.getElementById('returnCost').innerText = returnCost.toLocaleString() + ' VNĐ';
    document.getElementById('totalCost').innerText = total.toLocaleString() + ' VNĐ';
    
    const progress = Math.min((total / 1600000) * 100, 100);
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('goalText').innerText = `${total.toLocaleString()} / 1.600.000 VNĐ (mục tiêu 2 chiều)`;
}

// Xử lý video
function playVideo(id) {
    alert('Chức năng đang phát triển! Anh sẽ thêm video sau nha!');
}

// Khởi tạo hiển thị quỹ
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('moneyHistory')) {
        updateMoneyDisplay();
    }
});


// ==================== SIDEBAR MENU ====================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const closeMenu = document.getElementById('closeMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mở menu
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Đóng menu bằng nút X
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Đóng menu khi click link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Cập nhật active
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Đóng menu khi click ra ngoài
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Xử lý active khi scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                if (navLink) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });
});
// Xử lý loading cho video
document.querySelectorAll('video').forEach(video => {
    const thumbnail = video.closest('.video-thumbnail');
    
    video.addEventListener('loadstart', () => {
        thumbnail.classList.add('loading');
    });
    
    video.addEventListener('canplay', () => {
        thumbnail.classList.remove('loading');
    });
    
    video.addEventListener('error', () => {
        thumbnail.classList.remove('loading');
        console.log('Video load error');
    });
});

// ==================== REACTION SYSTEM - CHỈ 1 NGƯỜI LIKE ====================
let videoReactions = JSON.parse(localStorage.getItem('videoReactions')) || {
    1: { love: 0, like: 0, haha: 0, angry: 0, sad: 0 },
    2: { love: 0, like: 0, haha: 0, angry: 0, sad: 0 },
    3: { love: 0, like: 0, haha: 0, angry: 0, sad: 0 },
    4: { love: 0, like: 0, haha: 0, angry: 0, sad: 0 },
    5: { love: 0, like: 0, haha: 0, angry: 0, sad: 0 }
};

let userReactions = JSON.parse(localStorage.getItem('userReactions')) || {};

// Format số (không có k, chỉ số thường)
function formatNumber(num) {
    return num.toString(); // Chỉ trả về số bình thường, không có k
}

// Xử lý reaction
function reactToVideo(videoId, reactionType) {
    const userId = 'currentUser';
    const key = `${videoId}_${userId}`;
    
    // Nếu đã có reaction trước đó
    if (userReactions[key]) {
        const oldReaction = userReactions[key];
        
        // Nếu click cùng cảm xúc -> BỎ reaction
        if (oldReaction === reactionType) {
            videoReactions[videoId][oldReaction] = 0; // Về 0
            delete userReactions[key];
        } 
        // Nếu click cảm xúc khác -> ĐỔI reaction
        else {
            videoReactions[videoId][oldReaction] = 0; // Cái cũ về 0
            videoReactions[videoId][reactionType] = 1; // Cái mới = 1
            userReactions[key] = reactionType;
        }
    } 
    // Chưa có reaction -> THÊM mới (chỉ =1)
    else {
        videoReactions[videoId][reactionType] = 1; // Chỉ bằng 1
        userReactions[key] = reactionType;
    }
    
    // Lưu vào localStorage
    localStorage.setItem('videoReactions', JSON.stringify(videoReactions));
    localStorage.setItem('userReactions', JSON.stringify(userReactions));
    
    // Cập nhật giao diện
    updateReactionDisplay(videoId);
    updateReactionButton(videoId);
}

// Cập nhật hiển thị số lượng
function updateReactionDisplay(videoId) {
    const reaction = videoReactions[videoId];
    
    // Cập nhật từng loại reaction
    const loveSpan = document.querySelector(`#reactionStats${videoId} .reaction-count:nth-child(1) .count-value`);
    if (loveSpan) loveSpan.textContent = formatNumber(reaction.love);
    
    const likeSpan = document.querySelector(`#reactionStats${videoId} .reaction-count:nth-child(2) .count-value`);
    if (likeSpan) likeSpan.textContent = formatNumber(reaction.like);
    
    const hahaSpan = document.querySelector(`#reactionStats${videoId} .reaction-count:nth-child(3) .count-value`);
    if (hahaSpan) hahaSpan.textContent = formatNumber(reaction.haha);
    
    const angrySpan = document.querySelector(`#reactionStats${videoId} .reaction-count:nth-child(4) .count-value`);
    if (angrySpan) angrySpan.textContent = formatNumber(reaction.angry);
    
    const sadSpan = document.querySelector(`#reactionStats${videoId} .reaction-count:nth-child(5) .count-value`);
    if (sadSpan) sadSpan.textContent = formatNumber(reaction.sad);
}

// Cập nhật nút reaction
function updateReactionButton(videoId) {
    const userId = 'currentUser';
    const key = `${videoId}_${userId}`;
    const currentReaction = userReactions[key];
    
    const btn = document.querySelector(`.reaction-btn[onclick*="handleReaction(${videoId}"]`);
    if (!btn) return;
    
    if (currentReaction) {
        const icons = {
            'like': '<i class="fas fa-thumbs-up"></i>',
            'love': '<i class="fas fa-heart"></i>',
            'haha': '<i class="fas fa-laugh"></i>',
            'sad': '<i class="fas fa-sad-tear"></i>',
            'angry': '<i class="fas fa-angry"></i>'
        };
        const texts = {
            'like': 'Thích',
            'love': 'Yêu thích',
            'haha': 'Haha',
            'sad': 'Buồn',
            'angry': 'Giận'
        };
        btn.innerHTML = `${icons[currentReaction]} <span class="btn-text">${texts[currentReaction]}</span>`;
        btn.setAttribute('data-reaction', currentReaction);
    } else {
        btn.innerHTML = '<i class="far fa-thumbs-up"></i> <span class="btn-text">Thích</span>';
        btn.removeAttribute('data-reaction');
    }
}

// Hàm xử lý reaction từ nút
function handleReaction(videoId, reactionType) {
    reactToVideo(videoId, reactionType);
}

// Khởi tạo reactions khi load trang
document.addEventListener('DOMContentLoaded', function() {
    // Xóa dữ liệu cũ nếu muốn bắt đầu lại từ 0
    // localStorage.removeItem('videoReactions');
    // localStorage.removeItem('userReactions');
    
    for (let i = 1; i <= 5; i++) {
        updateReactionDisplay(i);
        updateReactionButton(i);
    }
    
    // Log để kiểm tra
    console.log('Video Reactions:', videoReactions);
    console.log('User Reactions:', userReactions);
});
// ==================== SMOOTH SCROLL VÀ ACTIVE TAB ====================
document.addEventListener('DOMContentLoaded', function() {
    
    // Xử lý click menu
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Thêm sự kiện click cho từng link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Lấy id của section cần scroll đến
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Tính toán vị trí scroll (trừ đi chiều cao navbar)
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Cập nhật active class
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Đóng menu mobile nếu đang mở
                const navMenu = document.getElementById('navMenu');
                const menuToggle = document.getElementById('menuToggle');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    // Cập nhật active tab khi scroll
    function updateActiveTabOnScroll() {
        const scrollPosition = window.scrollY + document.querySelector('.navbar').offsetHeight + 50;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 50;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Thêm sự kiện scroll
    window.addEventListener('scroll', updateActiveTabOnScroll);
    
    // Gọi lần đầu để set active đúng
    updateActiveTabOnScroll();
    
    // Xử lý back to top
    const backToTop = document.querySelector('.back-to-top a');
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Cập nhật active tab về trang chủ
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        });
    }
});

// ==================== HIỆU ỨNG FADE-IN KHI SCROLL ====================
function checkVisibility() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionVisible = 150; // Ngưỡng hiệu ứng
        
        if (sectionTop < windowHeight - sectionVisible) {
            section.classList.add('visible');
        }
    });
}

// Thêm class scrolled cho navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hiển thị back to top
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
});

// Gọi khi load và scroll
document.addEventListener('DOMContentLoaded', checkVisibility);
window.addEventListener('scroll', checkVisibility);