$(function () {
  $("a.page-scroll").bind("click", function (event) {
    var $anchor = $(this);
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: $($anchor.attr("href")).offset().top,
        },
        1500,
        "easeInOutExpo"
      );
    event.preventDefault();
  });
});

// Highlight the top nav as scrolling occurs
$("body").scrollspy({
  target: ".navbar-fixed-top",
});

// Closes the Responsive Menu on Menu Item Click
$(".navbar-collapse ul li a").click(function () {
  $(".navbar-toggle:visible").click();
});
function initMap() {
  // تحديد الموقع الجغرافي (العرض، الطول)
  const location = { lat: 31.923917, lng: 35.213333 };

  // إنشاء خريطة Google Maps
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: location,
  });

  // إضافة علامة على الموقع المحدد
  new google.maps.Marker({
    position: location,
    map: map,
    title: "هنا الموقع",
  });
}

function switchLanguage(language) {
  document.querySelectorAll("[data-en]").forEach(function (element) {
    element.textContent = element.getAttribute("data-" + language);
  });
}

// Slider functionality
document.addEventListener("DOMContentLoaded", () => {
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const slider = document.querySelector(".slider");
  const leftBtn = document.querySelector(".left-btn");
  const rightBtn = document.querySelector(".right-btn");

  let isDown = false;
  let startX;
  let scrollLeft;

  sliderWrapper.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - sliderWrapper.offsetLeft;
    scrollLeft = sliderWrapper.scrollLeft;
  });

  sliderWrapper.addEventListener("mouseleave", () => {
    isDown = false;
  });

  sliderWrapper.addEventListener("mouseup", () => {
    isDown = false;
  });

  sliderWrapper.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderWrapper.offsetLeft;
    const walk = (x - startX) * 2; // السرعة
    sliderWrapper.scrollLeft = scrollLeft - walk;
  });

  leftBtn.addEventListener("click", () => {
    sliderWrapper.scrollLeft -= 300; // تعديل كمية التمرير حسب الحاجة
  });

  rightBtn.addEventListener("click", () => {
    sliderWrapper.scrollLeft += 300; // تعديل كمية التمرير حسب الحاجة
  });
});

// Form step functionality
document.addEventListener("DOMContentLoaded", function () {
  const nextButtons = document.querySelectorAll('input[name="next"]');
  const previousButtons = document.querySelectorAll('input[name="previous"]');
  const fieldsets = document.querySelectorAll("fieldset");
  let currentIndex = 0;

  function showFieldset(index) {
    fieldsets.forEach((fieldset, i) => {
      fieldset.style.display = i === index ? "block" : "none";
    });
    document.querySelectorAll("#progressbar li").forEach((li, i) => {
      li.classList.toggle("active", i <= index);
    });
    currentIndex = index;
  }

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentIndex < fieldsets.length - 1) {
        showFieldset(currentIndex + 1);
      }
    });
  });

  previousButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentIndex > 0) {
        showFieldset(currentIndex - 1);
      }
    });
  });

  showFieldset(currentIndex);
});
document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("support-video");
  const section = document.getElementById("legal-support");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        video.play();
      }
    });
  });

  observer.observe(section);
});

$(document).ready(function () {
  i18next.use(i18nextHttpBackend).init(
    {
      lng: localStorage.getItem("selectedLang") || "en", // اللغة الافتراضية
      backend: {
        loadPath: "/locales/{{lng}}.json",
      },
    },
    function (err, t) {
      // ربط الترجمة مع عناصر الصفحة
      jqueryI18next.init(i18next, $);
      $("body").localize();
    }
  );

  function changeLanguage(lang) {
    i18next.changeLanguage(lang, function (err, t) {
      // تحديث النصوص بعد تغيير اللغة
      $("body").localize();
      localStorage.setItem("selectedLang", lang); // حفظ اللغة المختارة في localStorage
    });
  }

  // إضافة مستمع لتغيير اللغة
  $('[onclick^="changeLanguage"]').click(function () {
    var lang = $(this)
      .attr("onclick")
      .match(/'(.+)'/)[1];
    changeLanguage(lang);
  });
});
// document.addEventListener("DOMContentLoaded", function() {
//     const loginForm = document.querySelector(".signinBx form");
//     const registerForm = document.querySelector(".signupBx form");

//     loginForm.addEventListener("submit", function(event) {
//         event.preventDefault();
//         const username = loginForm.querySelector("input[type='text']").value;
//         const password = loginForm.querySelector("input[type='password']").value;

//         fetch('login.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ username: username, password: password })
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 alert("Login successful!");
//                 document.querySelector("#userDropdown").textContent = data.username;
//                 window.location.href = "index.html"; // تعديل إلى الصفحة المطلوبة
//             } else {
//                 alert(data.message);
//             }
//         })
//         .catch(error => console.error('Error:', error));
//     });

//     registerForm.addEventListener("submit", function(event) {
//         event.preventDefault();
//         const username = registerForm.querySelector("input[type='text']").value;
//         const email = registerForm.querySelector("input[type='email']").value;
//         const password = registerForm.querySelector("input[type='password']").value;
//         const confirmPassword = registerForm.querySelector("input[type='password']").value;

//         if (password !== confirmPassword) {
//             alert("Passwords do not match!");
//             return;
//         }

//         fetch('register.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ username: username, email: email, password: password })
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 alert("Registration successful!");
//                 toggleForm(); // تبديل النموذج إلى تسجيل الدخول
//             } else {
//                 alert(data.message);
//             }
//         })
//         .catch(error => console.error('Error:', error));
//     });
// });

function toggleForm() {
  const container = document.querySelector(".container");
  container.classList.toggle("active");
}
