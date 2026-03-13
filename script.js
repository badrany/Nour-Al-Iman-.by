// ======================================================
// نور الإيمان - النسخة المحسنة بالكامل
// جميع البيانات تُحفظ في localStorage بشكل دائم
// ======================================================

// ---------- 1. المتغيرات العامة ----------
let currentUser = {
    id: generateNumericId(),
    username: 'ضيف',
    email: '',
    password: '',
    coins: 0,
    profilePic: 'icons/default-avatar.png',
    settings: {
        darkMode: false,
        country: 'EG', // افتراضي
        city: 'القاهرة',
    },
    stats: {
        totalTasbeeh: 0,
        totalAzkar: 0,
        totalPrayers: 0,
    },
    tasbeehCounts: {}, // لكل ذكر على حدة
    loggedIn: false,
    lastLogin: new Date().toISOString()
};

let usersDB = [];

// ---------- 2. بيانات الأذكار (مصدر موثوق وموسع جداً) ----------
const azkarData = {
    morning: [
        { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ", count: 1 },
        { text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ", count: 1 },
        { text: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ فَمِنْكَ وَحْدَكَ", count: 1 },
        { text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي", count: 3 },
        { text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", count: 7 },
        { text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ وَعَذَابِ الْقَبْرِ", count: 3 },
        { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: مِائَةَ مَرَّةٍ", count: 100 },
        { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10 },
        { text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً، وَرِزْقاً طَيِّباً، وَعَمَلاً مُتَقَبَّلاً", count: 1 },
        { text: "أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ", count: 3 },
    ],
    evening: [
        { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ", count: 1 },
        { text: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ", count: 1 },
        { text: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ فَمِنْكَ وَحْدَكَ", count: 1 },
        { text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي", count: 3 },
        { text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", count: 7 },
        { text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ وَعَذَابِ الْقَبْرِ", count: 3 },
        { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: مِائَةَ مَرَّةٍ", count: 100 },
        { text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3 },
        { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", count: 1 },
        { text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ", count: 1 },
    ],
    dua: [
        { text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", count: 1 },
        { text: "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي", count: 1 },
        { text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", count: 1 },
        { text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ وَمِنْ عَذَابِ الْقَبْرِ", count: 3 },
        { text: "اللَّهُمَّ أَصْلِحْ لِي دِينِيَ الَّذِي هُوَ عِصْمَةُ أَمْرِي", count: 1 },
        { text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ", count: 3 },
        { text: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ", count: 33 },
        { text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", count: 10 },
        { text: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ", count: 3 },
        { text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ", count: 1 },
    ],
    sleep: [
        { text: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا", count: 1 },
        { text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", count: 1 },
        { text: "سُبْحَانَ اللَّهِ (٣٣) وَالْحَمْدُ لِلَّهِ (٣٣) وَاللَّهُ أَكْبَرُ (٣٤)", count: 100 },
        { text: "آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ", count: 1 },
    ],
    waking: [
        { text: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", count: 1 },
        { text: "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي وَرَدَّ عَلَيَّ رُوحِي", count: 1 },
    ]
};

// قائمة المدن (يمكن توسيعها)
const citiesByCountry = {
    'EG': ['القاهرة', 'الإسكندرية', 'الجيزة', 'شبين الكوم', 'طنطا', 'المنصورة', 'أسيوط', 'الأقصر', 'أسوان', 'بورسعيد', 'السويس', 'دمياط', 'الزقازيق', 'بنها', 'كفر الشيخ', 'المنيا', 'بني سويف', 'الفيوم', 'سوهاج', 'قنا', 'الغردقة'],
    'SA': ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'تبوك', 'بريدة', 'الطائف', 'حائل', 'نجران', 'جيزان'],
    'AE': ['دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'رأس الخيمة', 'الفجيرة', 'أم القيوين', 'العين'],
    'KW': ['الكويت العاصمة', 'حولي', 'الفروانية', 'الأحمدي', 'الجهراء', 'مبارك الكبير'],
    'QA': ['الدوحة', 'الريان', 'الوكرة', 'الخور', 'الشمال', 'أم صلال'],
    // أضف باقي الدول بنفس الطريقة...
};

// ---------- 3. دوال مساعدة ----------
function generateNumericId() {
    // ينتج رقماً عشوائياً طويلاً (مثلاً 1612345678901)
    return Date.now() + Math.floor(Math.random() * 1000);
}

function encodePassword(password) {
    return btoa(password);
}

function decodePassword(encoded) {
    return atob(encoded);
}

function isRamadan() {
    const hijriMonth = moment().format('iM');
    return hijriMonth === '9';
}

function calculateCoins(baseCoins) {
    return isRamadan() ? baseCoins * 70 : baseCoins;
}

// تنسيق الساعة بنظام 12 ساعة
function formatTime12(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12;
    hours = hours ? hours : 12; // الساعة 0 تصبح 12
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
}

// ---------- 4. تحميل وحفظ البيانات ----------
function loadUserData() {
    // تحميل المستخدم الحالي
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            const parsed = JSON.parse(savedUser);
            // دمج مع القيم الافتراضية لضمان وجود كل الحقول
            currentUser = { ...currentUser, ...parsed };
        } catch (e) {
            console.error('خطأ في تحميل بيانات المستخدم', e);
        }
    }
    
    // تحميل قاعدة بيانات المستخدمين
    const savedUsers = localStorage.getItem('usersDB');
    if (savedUsers) {
        try {
            usersDB = JSON.parse(savedUsers);
        } catch (e) {}
    }
    
    // تأكد من أن loggedIn محفوظ بشكل صحيح
    if (currentUser.loggedIn && currentUser.username !== 'ضيف') {
        // مستخدم حقيقي مسجل الدخول
    } else {
        currentUser.loggedIn = false;
        currentUser.username = 'ضيف';
    }
    
    applyUserSettings();
    updateUIForUser();
    
    // تحميل عدادات التسبيح في الواجهة
    loadTasbeehCountsToUI();
}

function saveUserData() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
}

function applyUserSettings() {
    if (currentUser.settings.darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle').checked = true;
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    if (currentUser.settings.country) {
        document.getElementById('country-select').value = currentUser.settings.country;
        updateCitiesDropdown(currentUser.settings.country);
        if (currentUser.settings.city) {
            // تأخير بسيط لضمان تحديث القائمة
            setTimeout(() => {
                document.getElementById('city-select').value = currentUser.settings.city;
            }, 300);
        }
    }
}

function updateUIForUser() {
    document.getElementById('username-header').textContent = currentUser.username;
    document.getElementById('profile-name').textContent = currentUser.username;
    document.getElementById('user-id-display').textContent = currentUser.id;
    document.getElementById('profile-email').textContent = currentUser.email ? `البريد: ${currentUser.email}` : 'البريد: غير محدد';
    document.getElementById('coin-balance').textContent = currentUser.coins;
    document.getElementById('coin-balance-footer').textContent = currentUser.coins;
    document.getElementById('total-tasbeeh').textContent = currentUser.stats.totalTasbeeh;
    document.getElementById('total-azkar').textContent = currentUser.stats.totalAzkar;
    document.getElementById('total-prayers').textContent = currentUser.stats.totalPrayers;
    
    if (currentUser.profilePic) {
        document.getElementById('profile-picture').src = currentUser.profilePic;
    }
    
    // تحديث واجهة تسجيل الدخول
    if (currentUser.loggedIn && currentUser.username !== 'ضيف') {
        document.getElementById('logged-out-view').style.display = 'none';
        document.getElementById('logged-in-view').style.display = 'block';
        document.getElementById('logged-in-user').textContent = currentUser.username;
    } else {
        document.getElementById('logged-out-view').style.display = 'block';
        document.getElementById('logged-in-view').style.display = 'none';
    }
}

// تحميل عدادات التسبيح من الكائن إلى الواجهة
function loadTasbeehCountsToUI() {
    if (currentUser.tasbeehCounts) {
        for (const [thikr, count] of Object.entries(currentUser.tasbeehCounts)) {
            const item = document.querySelector(`.tasbeeh-item[data-thikr="${thikr}"] .thikr-count`);
            if (item) item.textContent = count;
        }
    }
}

// ---------- 5. التنقل بين الصفحات ----------
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.dataset.page + '-page';
            pages.forEach(p => p.classList.remove('active'));
            navItems.forEach(n => n.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            item.classList.add('active');
        });
    });
}

// ---------- 6. الساعة والتاريخ (12 ساعة) ----------
function updateDateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = formatTime12(now);
    
    const gregorian = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('gregorian-date').textContent = gregorian;
    
    const hijriYear = moment().format('iYYYY');
    const hijriMonth = moment().format('iMMMM');
    const hijriDay = moment().format('iD');
    document.getElementById('hijri-date').textContent = `هـ ${hijriDay} ${hijriMonth} ${hijriYear}`;
    
    if (isRamadan()) {
        document.getElementById('ramadan-multiplier').style.display = 'block';
    } else {
        document.getElementById('ramadan-multiplier').style.display = 'none';
    }
}

// ---------- 7. مواقيت الصلاة والعد التنازلي ----------
let prayerTimesCache = null;

async function fetchPrayerTimes(countryCode, city) {
    if (!countryCode || !city) return;
    
    try {
        const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${countryCode}&method=5`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === 200) {
            prayerTimesCache = data.data.timings;
            displayPrayerTimes(prayerTimesCache);
            schedulePrayerNotifications(prayerTimesCache);
            startPrayerCountdown(prayerTimesCache); // بدء العد التنازلي
        }
    } catch (error) {
        console.error('فشل جلب مواقيت الصلاة', error);
        // بيانات افتراضية
        const defaultTimings = {
            Fajr: '04:30', Sunrise: '06:00', Dhuhr: '12:00', Asr: '15:30', Maghrib: '18:15', Isha: '19:45'
        };
        prayerTimesCache = defaultTimings;
        displayPrayerTimes(defaultTimings);
        startPrayerCountdown(defaultTimings);
    }
}

function displayPrayerTimes(timings) {
    const container = document.getElementById('prayer-times-container');
    container.innerHTML = '';
    const prayers = [
        { name: 'الفجر', key: 'Fajr' },
        { name: 'الشروق', key: 'Sunrise' },
        { name: 'الظهر', key: 'Dhuhr' },
        { name: 'العصر', key: 'Asr' },
        { name: 'المغرب', key: 'Maghrib' },
        { name: 'العشاء', key: 'Isha' }
    ];
    
    prayers.forEach(prayer => {
        const div = document.createElement('div');
        div.className = 'prayer-item';
        div.innerHTML = `<div class="prayer-name">${prayer.name}</div><div class="prayer-time">${timings[prayer.key]}</div>`;
        container.appendChild(div);
    });
}

// العثور على الصلاة القادمة
function findNextPrayer(timings) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
        { name: 'الفجر', key: 'Fajr' },
        { name: 'الشروق', key: 'Sunrise' },
        { name: 'الظهر', key: 'Dhuhr' },
        { name: 'العصر', key: 'Asr' },
        { name: 'المغرب', key: 'Maghrib' },
        { name: 'العشاء', key: 'Isha' }
    ];
    
    let nextPrayer = null;
    let minDiff = Infinity;
    
    prayers.forEach(prayer => {
        const [hours, minutes] = timings[prayer.key].split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;
        let diff = prayerMinutes - currentTime;
        if (diff < 0) diff += 24 * 60;
        
        if (diff < minDiff) {
            minDiff = diff;
            nextPrayer = { ...prayer, diffMinutes: diff, prayerTime: timings[prayer.key] };
        }
    });
    
    return nextPrayer;
}

// بدء العد التنازلي للصلاة القادمة
function startPrayerCountdown(timings) {
    const countdownElement = document.getElementById('prayer-countdown');
    if (!countdownElement) return;
    
    function updateCountdown() {
        const next = findNextPrayer(timings);
        if (!next) return;
        
        const now = new Date();
        const [hours, minutes] = next.prayerTime.split(':').map(Number);
        let prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);
        
        if (prayerDate < now) {
            prayerDate.setDate(prayerDate.getDate() + 1);
        }
        
        const diffMs = prayerDate - now;
        const diffSec = Math.floor(diffMs / 1000);
        const hoursLeft = Math.floor(diffSec / 3600);
        const minutesLeft = Math.floor((diffSec % 3600) / 60);
        const secondsLeft = diffSec % 60;
        
        countdownElement.innerHTML = `
            <div class="next-prayer-name">${next.name}</div>
            <div class="countdown-timer">${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}</div>
        `;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ---------- 8. الإشعارات ----------
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
}

function schedulePrayerNotifications(timings) {
    if (Notification.permission !== 'granted') return;
    
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const prayerNames = { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
    
    prayers.forEach(prayer => {
        const prayerTime = timings[prayer];
        if (!prayerTime) return;
        
        const [hours, minutes] = prayerTime.split(':').map(Number);
        let notificationTime = new Date();
        notificationTime.setHours(hours, minutes - 5, 0, 0); // قبل 5 دقائق
        
        if (notificationTime < new Date()) {
            notificationTime.setDate(notificationTime.getDate() + 1);
        }
        
        const timeUntilNotification = notificationTime - new Date();
        
        if (timeUntilNotification > 0) {
            setTimeout(() => {
                new Notification('موعد الصلاة', {
                    body: `صلَّى الله عليك، اقترب موعد صلاة ${prayerNames[prayer]}`,
                    icon: 'icons/icon-192.png'
                });
                
                // بعد 35 دقيقة (5+30) اسأل عن الصلاة
                setTimeout(() => {
                    showPrayerCheckModal(prayerNames[prayer]);
                }, 35 * 60 * 1000);
                
            }, timeUntilNotification);
        }
    });
}

function showPrayerCheckModal(prayerName) {
    document.getElementById('prayer-check-title').textContent = `هل صليت ${prayerName}؟`;
    document.getElementById('prayer-check-modal').style.display = 'flex';
}

// ---------- 9. التسبيح والكوينز ----------
function initTasbeeh() {
    // تحميل العدادات المحفوظة
    loadTasbeehCountsToUI();
    
    document.querySelectorAll('.thikr-plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.tasbeeh-item');
            const thikr = item.dataset.thikr;
            const countSpan = item.querySelector('.thikr-count');
            let count = parseInt(countSpan.textContent) || 0;
            count++;
            countSpan.textContent = count;
            
            // تحديث التخزين
            if (!currentUser.tasbeehCounts) currentUser.tasbeehCounts = {};
            currentUser.tasbeehCounts[thikr] = count;
            
            // إضافة كوينز
            const coinsEarned = calculateCoins(1);
            currentUser.coins += coinsEarned;
            currentUser.stats.totalTasbeeh++;
            
            updateUIForUser();
            saveUserData();
        });
    });
    
    // أزرار الأذكار السريعة
    document.querySelectorAll('.azkar-quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const thikr = this.dataset.zekr;
            const targetItem = document.querySelector(`.tasbeeh-item[data-thikr="${thikr}"]`);
            if (targetItem) {
                targetItem.querySelector('.thikr-plus').click();
            } else {
                // إذا لم يكن موجوداً في القائمة، نضيف كوين مباشرة
                currentUser.coins += calculateCoins(1);
                currentUser.stats.totalTasbeeh++;
                updateUIForUser();
                saveUserData();
                alert(`تمت إضافة كوين لذكر: ${thikr}`);
            }
        });
    });
}

// ---------- 10. عرض الأذكار (مع تبويبات إضافية) ----------
function initAzkarTabs() {
    const tabs = document.querySelectorAll('.azkar-tab');
    const contentDiv = document.getElementById('azkar-content');
    
    function renderTab(tabId) {
        let html = '';
        let data = [];
        if (tabId === 'morning') data = azkarData.morning;
        else if (tabId === 'evening') data = azkarData.evening;
        else if (tabId === 'dua') data = azkarData.dua;
        else if (tabId === 'sleep') data = azkarData.sleep;
        else if (tabId === 'waking') data = azkarData.waking;
        
        data.forEach(z => {
            html += `<div class="azkar-content-item"><div class="azkar-text">${z.text}</div><div class="azkar-count">${z.count} مرة</div></div>`;
        });
        contentDiv.innerHTML = html;
    }
    
    // إضافة تبويبات جديدة إذا أردت (يمكن إضافتها في HTML)
    // حالياً نفترض أن التبويبات الموجودة هي: morning, evening, dua
    // يمكن إضافة المزيد في HTML يدوياً
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTab(tab.dataset.tab);
        });
    });
    
    renderTab('morning');
}

// ---------- 11. نظام تسجيل الدخول المحسن ----------
function initAuth() {
    const loginBtn = document.getElementById('show-login-btn');
    const registerBtn = document.getElementById('show-register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    loginBtn.addEventListener('click', () => loginModal.style.display = 'flex');
    registerBtn.addEventListener('click', () => registerModal.style.display = 'flex');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });
    
    document.getElementById('login-submit').addEventListener('click', () => {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const user = usersDB.find(u => u.username === username && u.password === encodePassword(password));
        
        if (user) {
            currentUser = { ...user, loggedIn: true };
            saveUserData();
            updateUIForUser();
            loginModal.style.display = 'none';
            alert('تم تسجيل الدخول بنجاح');
        } else {
            alert('اسم المستخدم أو كلمة السر غير صحيحة');
        }
    });
    
    document.getElementById('register-submit').addEventListener('click', () => {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        
        if (password !== confirm) {
            alert('كلمة السر غير متطابقة');
            return;
        }
        
        if (usersDB.some(u => u.username === username)) {
            alert('اسم المستخدم موجود بالفعل');
            return;
        }
        
        const newUser = {
            id: generateNumericId(),
            username: username,
            email: email,
            password: encodePassword(password),
            coins: 0,
            profilePic: 'icons/default-avatar.png',
            settings: { darkMode: currentUser.settings.darkMode, country: currentUser.settings.country, city: currentUser.settings.city },
            stats: { totalTasbeeh: 0, totalAzkar: 0, totalPrayers: 0 },
            tasbeehCounts: {},
            loggedIn: true
        };
        
        usersDB.push(newUser);
        currentUser = newUser;
        saveUserData();
        updateUIForUser();
        registerModal.style.display = 'none';
        alert('تم إنشاء الحساب بنجاح');
    });
    
    logoutBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            // نسخ الاحتياطي قبل المسح
            currentUser = {
                id: generateNumericId(),
                username: 'ضيف',
                email: '',
                password: '',
                coins: 0,
                profilePic: 'icons/default-avatar.png',
                settings: { darkMode: currentUser.settings.darkMode, country: currentUser.settings.country, city: currentUser.settings.city },
                stats: { totalTasbeeh: 0, totalAzkar: 0, totalPrayers: 0 },
                tasbeehCounts: {},
                loggedIn: false
            };
            saveUserData();
            updateUIForUser();
            // إعادة تعيين العدادات في الواجهة
            document.querySelectorAll('.thikr-count').forEach(el => el.textContent = '0');
        }
    });
}

// ---------- 12. الإعدادات ----------
function initSettings() {
    document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
        currentUser.settings.darkMode = e.target.checked;
        saveUserData();
    });
    
    document.getElementById('country-select').addEventListener('change', (e) => {
        const country = e.target.value;
        currentUser.settings.country = country;
        updateCitiesDropdown(country);
        saveUserData();
        if (country && currentUser.settings.city) {
            fetchPrayerTimes(country, currentUser.settings.city);
        }
    });
    
    document.getElementById('city-select').addEventListener('change', (e) => {
        const city = e.target.value;
        currentUser.settings.city = city;
        saveUserData();
        fetchPrayerTimes(currentUser.settings.country, city);
    });
    
    document.getElementById('support-btn').addEventListener('click', () => {
        document.getElementById('support-modal').style.display = 'flex';
    });
    
    document.querySelectorAll('#support-modal .close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('support-modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // معالجة خيارات الصلاة
    document.querySelectorAll('.prayer-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const place = e.target.dataset.place;
            let baseCoins = 0;
            switch(place) {
                case 'mosque-congregation': baseCoins = 100; break;
                case 'mosque-alone': baseCoins = 50; break;
                case 'home-congregation': baseCoins = 10; break;
                case 'home-alone': baseCoins = 5; break;
            }
            const finalCoins = calculateCoins(baseCoins);
            currentUser.coins += finalCoins;
            currentUser.stats.totalPrayers++;
            saveUserData();
            updateUIForUser();
            document.getElementById('prayer-check-modal').style.display = 'none';
            alert(`أحسنت! تم إضافة ${finalCoins} كوين لرصيدك. أكمل وصلي في المسجد`);
        });
    });
}

function updateCitiesDropdown(countryCode) {
    const citySelect = document.getElementById('city-select');
    citySelect.innerHTML = '<option value="">-- اختر المدينة --</option>';
    if (countryCode && citiesByCountry[countryCode]) {
        citiesByCountry[countryCode].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// ---------- 13. الصورة الشخصية ----------
function initProfilePicture() {
    const editBtn = document.getElementById('edit-profile-pic');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    editBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('profile-picture').src = event.target.result;
                currentUser.profilePic = event.target.result;
                saveUserData();
            };
            reader.readAsDataURL(file);
        }
    });
}

// ---------- 14. إضافة عنصر العد التنازلي في HTML (إذا لم يكن موجوداً) ----------
function ensureCountdownElement() {
    if (!document.getElementById('prayer-countdown')) {
        const nextPrayerDiv = document.getElementById('next-prayer');
        if (nextPrayerDiv) {
            const countdownDiv = document.createElement('div');
            countdownDiv.id = 'prayer-countdown';
            countdownDiv.className = 'countdown-container';
            nextPrayerDiv.parentNode.insertBefore(countdownDiv, nextPrayerDiv.nextSibling);
        }
    }
}

// ---------- 15. تهيئة التطبيق ----------
document.addEventListener('DOMContentLoaded', () => {
    // شاشة التحميل
    setTimeout(() => {
        document.getElementById('splash-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('splash-screen').style.display = 'none';
            document.getElementById('app').style.display = 'block';
        }, 500);
    }, 1500);
    
    ensureCountdownElement();
    
    loadUserData();
    initNavigation();
    initTasbeeh();
    initAzkarTabs();
    initAuth();
    initSettings();
    initProfilePicture();
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    requestNotificationPermission();
    
    if (currentUser.settings.country && currentUser.settings.city) {
        fetchPrayerTimes(currentUser.settings.country, currentUser.settings.city);
    } else {
        // افتراضي
        fetchPrayerTimes('EG', 'القاهرة');
    }
});