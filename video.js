// حدد الفيديو والقسم الذي يحتوي عليه
const video = document.getElementById("myVideo");
const videoSection = document.getElementById("videoSection");

// إلغاء كتم الصوت بشكل افتراضي
video.muted = false;

// دالة التحقق من ظهور الفيديو على الشاشة
function checkVideoVisibility() {
    const rect = videoSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
        if (video.paused) {
            video.play();  // تشغيل الفيديو بالصوت عند ظهور القسم
        }
    } else {
        if (!video.paused) {
            video.pause(); // إيقاف الفيديو عند التمرير بعيدًا عن القسم
        }
    }
}

// إضافة حدث التمرير وتغيير الحجم للتحقق من ظهور الفيديو
window.addEventListener("scroll", checkVideoVisibility);
window.addEventListener("resize", checkVideoVisibility);

// استدعاء الدالة مرة واحدة للتأكد من تشغيل الفيديو عند التحميل إذا كان مرئيًا
checkVideoVisibility();
