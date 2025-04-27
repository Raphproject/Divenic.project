document.addEventListener("DOMContentLoaded", function () {
  const intro = document.querySelector('.intro');
  const mainContent = document.querySelector('.main-content');
  const introShown = localStorage.getItem("introShown");
  const nav = document.querySelector('nav');
  const logo = document.getElementById("logo");
  const navLinks = document.querySelectorAll('.navlink');
  const sections = document.querySelectorAll('section');
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots-container");
  const sliderBackground = document.querySelector(".slider-background");
  const buttonsCard = document.querySelector('.buttons-card');
  const scrollLeftBtn = document.querySelector('.scroll-btn.left');
  const scrollRightBtn = document.querySelector('.scroll-btn.right');

  if (!introShown) {
    // Jika intro belum pernah ditampilkan, tampilkan intro
    intro.style.display = "flex";
    mainContent.style.display = "none";
    nav.style.opacity = 0;

    // Tambahkan event listener pada akhir animasi intro
    intro.addEventListener("animationend", () => {
      intro.style.opacity = 0; // Fade out intro
      setTimeout(() => {
        intro.style.display = "none"; // Hilangkan intro dari layar
        mainContent.style.display = "block"; // Tampilkan main content
        nav.style.opacity = 1; // Tampilkan navbar
        setTimeout(() => {
          mainContent.style.opacity = 1; // Fade in main content
        }, 100);

        // Simpan status bahwa intro sudah ditampilkan
        localStorage.setItem("introShown", "true");
      }, 3000); // Beri jeda agar transisi halus
    });
  } else {
    // Jika intro sudah ditampilkan, langsung tampilkan main content
    intro.style.display = "none";
    mainContent.style.display = "block";
    nav.style.opacity = 1;
    mainContent.style.opacity = 1;
  }

  // Reset intro ketika logo diklik
  logo.addEventListener("click", () => {
    localStorage.removeItem("introShown");
    location.reload();
  });

  window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.style.opacity = "0";
      preloader.style.pointerEvents = "none";
      setTimeout(() => {
        preloader.remove();
      }, 500); // hilangkan setelah 0.5 detik
    }
  });

  function scrollNavbar() {
    const navbar = document.querySelector("nav");
    const scrollHeight = window.scrollY;

    if (scrollHeight > 30) {
      navbar.classList.add("Scrolled");
    } else {
      navbar.classList.remove("Scrolled");
    }
  }

  window.addEventListener("scroll", scrollNavbar);

  // Fungsi untuk mengubah warna tombol yang aktif
  function setActiveLink(targetId) {
    navLinks.forEach(link => {
      if (link.getAttribute("href").substring(1) === targetId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // untuk mendeteksi konten benar-benar terlihat
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.73 // 73% dari elemen terlihat
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // Event listener untuk tombol navbar
  navLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      // Scroll ke section dengan smooth effect
      window.scrollTo({
        top: targetSection.offsetTop - 60,
        behavior: "smooth"
      });
    });
  });

  // Event listener untuk hamburger menu (☰)
  menuBtn.addEventListener("click", () => {
    // Tambahkan class rotasi pada hamburger
    menuBtn.classList.add("rotate-right");

    // Tampilkan sidebar dan tombol close
    sidebar.classList.add("show-sidebar");

    // Sembunyikan hamburger setelah rotasi
    setTimeout(() => {
      menuBtn.style.visibility = "hidden";
      menuBtn.classList.remove("rotate-right"); // Reset animasi
      closeBtn.style.visibility = "visible";
      closeBtn.classList.add("rotate-in"); // Tambahkan animasi pada tombol close
      closeBtn.style.opacity = "1";
    }, 300);
  });

  let slideIndex = 0;
  let autoSlideInterval;

  // Membuat dots sesuai jumlah slide
  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    dot.setAttribute("data-index", index);
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  // Fungsi utama menampilkan slide
  function showSlide(n) {
    slideIndex = n;

    slides.forEach((slide, i) => {
      slide.style.display = i === n ? "block" : "none";
    });

    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[n]) dots[n].classList.add("active");

    // Ganti background blur (khusus mobile) 
    const imgBackground = slides[n].querySelector("img");

    // gambar ngebug di atas, fungsi berjalan baik-baik saja
    if (window.innerWidth <= 476 && sliderBackground && imgBackground && imgBackground.src) {
      sliderBackground.style.display = "block";
      sliderBackground.style.backgroundImage = `url(${imgBackground.src})`;
    } else {
      sliderBackground.style.display = "none";
    }
  }

  // Fungsi next
  function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }

  // Fungsi prev
  function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
  }

  // Reset auto-slide setiap user klik
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Event prev/next
  document.querySelector(".prev").addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });
  document.querySelector(".next").addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  // Event dots
  dots.forEach(dot => {
    dot.addEventListener("click", e => {
      slideIndex = parseInt(e.target.getAttribute("data-index"));
      showSlide(slideIndex);
      resetAutoSlide();
    });
  });

  // Auto-slide dengan jeda 5 detik
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      if (slideIndex === slides.length - 1) {
        setTimeout(() => {
          slideIndex = 0;
          showSlide(slideIndex);
        }, 5000);
      } else {
        nextSlide();
      }
    }, 5000);
  }

  // Inisialisasi awal
  showSlide(slideIndex);
  startAutoSlide();

  function updateScrollButtons() {
  const scrollLeft = buttonsCard.scrollLeft;
  const scrollWidth = buttonsCard.scrollWidth;
  const clientWidth = buttonsCard.clientWidth;

  // Tombol kiri muncul kalau sudah tidak di posisi paling kiri
  if (scrollLeft > 2) {
    scrollLeftBtn.classList.add('show');
  } else {
    scrollLeftBtn.classList.remove('show');
  }

  // Tombol kanan muncul kalau masih ada yang belum terlihat di kanan
  if (scrollLeft + clientWidth < scrollWidth - 2) {
    scrollRightBtn.classList.add('show');
  } else {
    scrollRightBtn.classList.remove('show');
  }
}

  // Scroll saat tombol diklik
  scrollLeftBtn.addEventListener('click', () => {
    buttonsCard.scrollBy({ left: -150, behavior: 'smooth' });
  });

  scrollRightBtn.addEventListener('click', () => {
    buttonsCard.scrollBy({ left: 150, behavior: 'smooth' });
  });

  buttonsCard.addEventListener('scroll', updateScrollButtons);
  window.addEventListener('resize', updateScrollButtons);

  // Jalankan pertama kali
  updateScrollButtons();

  function loadContent(file) {
    fetch(file)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Gagal memuat ${file}`);
        }
        return response.text();
      })
      .then((html) => {
        const contentDiv = document.getElementById('content');
        console.log("konten bisa dimuat");
        contentDiv.innerHTML = html;
  
        // Update tombol aktif setelah konten dimuat
        setActiveButton(file);
      })
      .catch((error) => {
        console.error('Error saat memuat file:', error);
      });
  }
  
  function setActiveButton(activeFile) {
    document.querySelectorAll('.button-card').forEach((link) => {
      if (link.getAttribute('data-file') === activeFile) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  document.querySelectorAll('.nav-card').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const file = link.getAttribute('data-file');
      loadContent(file);
    });
  });
});