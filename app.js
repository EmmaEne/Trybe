// Initialize Lucide Icons
lucide.createIcons();

// Mock Data for Educational Videos (Micro-lessons)
const lessons = [
    {
        id: 1,
        username: 'ScienceSimp',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-11663-large.mp4',
        caption: 'Why is the sky blue? It\'s actually Rayleigh scattering! #science #physics #learning',
        likes: '45.2k',
        comments: '1,203',
        shares: '12.1k',
        topic: 'Physics'
    },
    {
        id: 2,
        username: 'HistoryBuff',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mysterious-ancient-ruins-in-the-jungle-40625-large.mp4',
        caption: 'The Library of Alexandria wasn\'t destroyed in one day. It was a slow decline. #history #archives #facts',
        likes: '120k',
        comments: '4,500',
        shares: '30k',
        topic: 'Ancient History'
    },
    {
        id: 3,
        username: 'CodeWithCass',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-40618-large.mp4',
        caption: 'Python list comprehensions will save you hours of work. Here is how. #coding #python #tutorial',
        likes: '89k',
        comments: '3,211',
        shares: '15k',
        topic: 'Programming'
    },
    {
        id: 4,
        username: 'EcoExplorers',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
        caption: 'Fungi are not plants. They are more closely related to animals! #biology #nature #wow',
        likes: '234k',
        comments: '8,900',
        shares: '56k',
        topic: 'Biology'
    }
];

const videoFeed = document.getElementById('video-feed');
const commentDrawer = document.getElementById('commentDrawer');
let activeVideo = null;

// Function to create video slides
function createVideoSlide(lesson) {
    const slide = document.createElement('div');
    slide.className = 'video-slide';
    slide.innerHTML = `
        <video class="video-element" loop playsinline>
            <source src="${lesson.videoUrl}" type="video/mp4">
        </video>
        
        <div class="video-progress">
            <div class="progress-fill"></div>
        </div>

        <div class="side-actions">
            <div class="educator-avatar-container">
                <img src="${lesson.avatar}" class="educator-avatar" alt="${lesson.username}">
                <div class="follow-plus">
                    <i data-lucide="plus" style="width: 12px; height: 12px; color: white;"></i>
                </div>
            </div>
            
            <div class="action-item" onclick="toggleLike(this)">
                <div class="action-icon">
                    <i data-lucide="heart" class="heart-icon"></i>
                </div>
                <span>${lesson.likes}</span>
            </div>

            <div class="action-item" onclick="toggleComments()">
                <div class="action-icon">
                    <i data-lucide="message-circle"></i>
                </div>
                <span>${lesson.comments}</span>
            </div>

            <div class="action-item">
                <div class="action-icon">
                    <i data-lucide="bookmark"></i>
                </div>
                <span>Save</span>
            </div>

            <div class="action-item">
                <div class="action-icon">
                    <i data-lucide="share-2"></i>
                </div>
                <span>${lesson.shares}</span>
            </div>
        </div>

        <div class="overlay-content">
            <div class="educator-name">
                @${lesson.username}
                <i data-lucide="check-circle-2" class="verify-badge"></i>
            </div>
            <p class="caption">${lesson.caption}</p>
            <div class="topic-tag">
                <i data-lucide="book-open"></i>
                ${lesson.topic}
            </div>
        </div>

        <div class="heart-pop">
            <i data-lucide="heart" fill="currentColor" style="width: 80px; height: 80px;"></i>
        </div>
    `;

    // Handle Tap to Play/Pause
    const video = slide.querySelector('video');
    slide.addEventListener('click', (e) => {
        // Don't pause if clicking on buttons
        if (e.target.closest('.side-actions') || e.target.closest('.overlay-content')) return;

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    // Double Tap to Like
    let lastTap = 0;
    slide.addEventListener('touchstart', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            handleDoubleTap(slide, e);
        }
        lastTap = currentTime;
    });

    return slide;
}

// Double tap animation
function handleDoubleTap(slide, event) {
    const heartPop = slide.querySelector('.heart-pop');
    heartPop.classList.add('animate');
    setTimeout(() => {
        heartPop.classList.remove('animate');
    }, 600);

    const likeIcon = slide.querySelector('.heart-icon');
    likeIcon.setAttribute('fill', '#ff0050');
    likeIcon.style.color = '#ff0050';
}

function toggleLike(element) {
    const icon = element.querySelector('.heart-icon');
    const isLiked = icon.getAttribute('fill') === '#ff0050';

    if (isLiked) {
        icon.setAttribute('fill', 'none');
        icon.style.color = 'currentColor';
    } else {
        icon.setAttribute('fill', '#ff0050');
        icon.style.color = '#ff0050';
    }
}

function toggleComments() {
    commentDrawer.classList.toggle('open');
}

// Feed Observer to handle autoplay
const observerOptions = {
    threshold: 0.8
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        const progressFill = entry.target.querySelector('.progress-fill');

        if (entry.isIntersecting) {
            video.play();
            activeVideo = video;
            updateProgress(video, progressFill);
        } else {
            video.pause();
            video.currentTime = 0;
        }
    });
}, observerOptions);

function updateProgress(video, fill) {
    if (!video || video.paused) return;

    const progress = (video.currentTime / video.duration) * 100;
    fill.style.width = `${progress}%`;

    requestAnimationFrame(() => updateProgress(video, fill));
}

// Initialize Feed
function initFeed() {
    videoFeed.innerHTML = '';
    lessons.forEach(lesson => {
        const slide = createVideoSlide(lesson);
        videoFeed.appendChild(slide);
        observer.observe(slide);
    });
    lucide.createIcons();
}

// Navigation logic
const navItems = document.querySelectorAll('.nav-item');
const mainContent = document.getElementById('video-feed');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const tabText = item.querySelector('span')?.textContent.toLowerCase() || '';

        // Update Active State
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        if (tabText === 'home' || item.classList.contains('add-btn')) {
            showHome();
        } else if (tabText === 'discover') {
            showDiscover();
        } else if (tabText === 'profile') {
            showProfile();
        }
    });
});

function showHome() {
    mainContent.className = 'video-feed';
    initFeed();
    document.querySelector('.top-nav').style.display = 'flex';
}

function showDiscover() {
    document.querySelector('.top-nav').style.display = 'none';
    mainContent.className = 'discover-view p-3';
    mainContent.innerHTML = `
        <div class="search-bar-container mb-4 mt-2">
            <div class="search-input-wrapper">
                <i data-lucide="search"></i>
                <input type="text" placeholder="Explain this again...">
            </div>
        </div>
        
        <h5 class="section-title mb-3" style="font-weight: 800;">Trending topics</h5>
        <div class="trending-grid">
            <div class="trend-card" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1509228468518-180dd482100c?w=400&h=400&fit=crop')">
                <span>#QuantumPhysics</span>
            </div>
            <div class="trend-card" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop')">
                <span>#CodeTips</span>
            </div>
            <div class="trend-card" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop')">
                <span>#WorldHistory</span>
            </div>
            <div class="trend-card" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop')">
                <span>#GeoScience</span>
            </div>
        </div>

        <h5 class="section-title mt-4 mb-3" style="font-weight: 800;">Micro-lesson of the day</h5>
        <div class="featured-lesson">
            <div class="lesson-banner" style="position: relative; z-index: 1;">
                <div class="badge bg-danger mb-2">LIVE NOW</div>
                <h6 style="font-weight: 800; font-size: 1.2rem;">Advanced Calculus with @DrDeriv</h6>
                <p class="mb-0 text-white-50">25k people learning together</p>
            </div>
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&fit=crop') center/cover; opacity: 0.4;"></div>
        </div>
    `;
    lucide.createIcons();
}

function showProfile() {
    document.querySelector('.top-nav').style.display = 'none';
    mainContent.className = 'profile-view p-0';
    mainContent.innerHTML = `
        <div class="profile-header text-center pt-5 pb-4">
            <div class="profile-avatar mb-3">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" class="rounded-circle border border-3 border-dark shadow">
            </div>
            <h5 class="fw-bold mb-0">Alex Lerner</h5>
            <p class="text-secondary small">@PassiveLearner_101</p>
            
            <div class="stats-row d-flex justify-content-center gap-4 my-4">
                <div class="stat-item text-center">
                    <div class="num fw-bold">128</div>
                    <div class="label text-secondary small">Got it</div>
                </div>
                <div class="stat-item border-start border-end px-4 text-center">
                    <div class="num fw-bold">1.2k</div>
                    <div class="label text-secondary small">Learners</div>
                </div>
                <div class="stat-item text-danger text-center">
                    <div class="num fw-bold">7 🔥</div>
                    <div class="label text-secondary small text-white-50">Streak</div>
                </div>
            </div>

            <button class="btn btn-outline-light btn-sm px-5 rounded-pill fw-bold">Edit Profile</button>
        </div>

        <div class="tab-scroller border-top border-bottom border-dark d-flex justify-content-around py-2">
            <i data-lucide="grid" class="active"></i>
            <i data-lucide="lock" class="text-secondary text-white-50"></i>
            <i data-lucide="heart" class="text-secondary text-white-50"></i>
        </div>

        <div class="video-grid p-1">
            <div class="grid-item" style="background: url('https://images.unsplash.com/photo-1509228468518-180dd482100c?w=200&h=200&fit=crop') center/cover;"></div>
            <div class="grid-item" style="background: url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop') center/cover;"></div>
            <div class="grid-item" style="background: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop') center/cover;"></div>
            <div class="grid-item"></div>
            <div class="grid-item"></div>
            <div class="grid-item"></div>
        </div>

        <div class="passive-progress p-4 text-center text-white-50">
            <p class="small mb-0">"You understood 5 new concepts today. Keep going! 🚀"</p>
        </div>
    `;
    lucide.createIcons();
}

// Handle Skeleton Loader
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(initFeed, 1500);
});
