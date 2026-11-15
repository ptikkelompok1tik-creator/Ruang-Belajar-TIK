const ambilElemen = (selector) => document.querySelector(selector);

// Variabel penampung data dari JSON
let DAFTAR_MATERI = [];
let DAFTAR_TIPS = [];

// 0. Pengaturan Tema (Default Dark Mode -> Klik untuk Light Mode)
const tombolTema = ambilElemen("#theme-toggle");
const akarDokumen = document.documentElement;

const terapkanTema = (tema) => {
  akarDokumen.setAttribute("data-theme", tema);
  localStorage.setItem("tema-ruangbelajar", tema);
  if (tombolTema) {
    tombolTema.textContent = tema === "dark" ? "☀️ Light" : "🌙 Dark";
  }
};

// Selalu mulai dari "dark" kecuali user sebelumnya sudah memilih "light"
const temaTersimpan = localStorage.getItem("tema-ruangbelajar") || "dark";
terapkanTema(temaTersimpan);

if (tombolTema) {
  tombolTema.onclick = () => {
    const temaSekarang = akarDokumen.getAttribute("data-theme");
    terapkanTema(temaSekarang === "dark" ? "light" : "dark");
  };
}

// 1. Navigasi Mobile (Burger Menu)
const menuNavigasi = ambilElemen("nav");
const tombolBurger = ambilElemen("#burger");

if (tombolBurger) {
  tombolBurger.onclick = () => menuNavigasi.classList.toggle("open");
}

// 2. Menandai Halaman Aktif di Menu Navigasi
const halamanSekarang = location.pathname.split("/").pop();
document.querySelectorAll("nav a").forEach((link) => {
  const tujuanLink = link.getAttribute("href");
  if (tujuanLink === halamanSekarang || (!halamanSekarang && tujuanLink === "index.html")) {
    link.classList.add("on");
  }
});

// 3. Mengambil Data dari File JSON & Menampilkan ke Halaman
const wadahMateri = ambilElemen("#list");
const modalDetail = ambilElemen("#modal");

async function muatDataMateri() {
  if (!wadahMateri) return;

  try {
    const respon = await fetch("data.json");
    const data = await respon.json();

    DAFTAR_MATERI = data.materi;
    DAFTAR_TIPS = data.tips;

    aktifkanFiturMateri();
  } catch (error) {
    wadahMateri.innerHTML =
      '<p class="note">Gagal memuat data.json. Pastikan website dibuka melalui Live Server atau hosting.</p>';
  }
}

function aktifkanFiturMateri() {
  const inputPencarian = ambilElemen("#q");
  const filterKategori = ambilElemen("#f");

  const tampilkanDaftarMateri = () => {
    const kataKunci = inputPencarian.value.toLowerCase();
    const kategoriDipilih = filterKategori.value;

    const hasilFilter = DAFTAR_MATERI.filter((materi) => {
      const cocokKategori = !kategoriDipilih || materi.kategori === kategoriDipilih;
      const cocokTeks = (materi.judul + materi.deskripsi).toLowerCase().includes(kataKunci);
      return cocokKategori && cocokTeks;
    });

    if (hasilFilter.length === 0) {
      wadahMateri.innerHTML = '<p class="note">Materi tidak ditemukan.</p>';
      return;
    }

    wadahMateri.innerHTML = hasilFilter
      .map((materi) => {
        const indexAsli = DAFTAR_MATERI.indexOf(materi);
        const statusLabel = materi.tersedia
          ? `<span class="read-time">📖 ${materi.waktuBaca}</span>`
          : '<span class="tag s">Segera hadir</span>';

        const tombolBaca = materi.tersedia
          ? `<button class="btn btn-card" type="button" onclick="bukaDetailMateri(${indexAsli})">Baca Materi</button>`
          : "";

        return `
          <div class="card${materi.tersedia ? "" : " off"}">
            <div class="ic">${materi.ikon}</div>
            <div class="meta-row">
              <span class="tag">${materi.kategori}</span>
              ${statusLabel}
            </div>
            <h3>${materi.judul}</h3>
            <p>${materi.deskripsi}</p>
            ${tombolBaca}
          </div>
        `;
      })
      .join("");
  };

  inputPencarian.oninput = tampilkanDaftarMateri;
  filterKategori.onchange = tampilkanDaftarMateri;
  tampilkanDaftarMateri();
}

// Jalankan pengambilan data JSON
muatDataMateri();

// 4. Fungsi Buka & Tutup Pop-up Detail Materi
window.bukaDetailMateri = (indexMateri) => {
  const materi = DAFTAR_MATERI[indexMateri];
  if (!materi || !materi.tersedia) return;

  ambilElemen("#m-icon").textContent = materi.ikon;
  ambilElemen("#m-kat").textContent = materi.kategori;
  ambilElemen("#m-waktu").textContent = "📖 " + materi.waktuBaca;
  ambilElemen("#m-judul").textContent = materi.judul;
  ambilElemen("#m-isi").innerHTML = materi.isiLengkap;
  ambilElemen("#m-sumber").textContent = materi.sumberReferensi;

  modalDetail.classList.add("show");
  modalDetail.setAttribute("aria-hidden", "false");
};

if (modalDetail) {
  const tutupDetailMateri = () => {
    modalDetail.classList.remove("show");
    modalDetail.setAttribute("aria-hidden", "true");
  };

  ambilElemen("#close-modal").onclick = tutupDetailMateri;
  modalDetail.onclick = (event) => {
    if (event.target === modalDetail) tutupDetailMateri();
  };
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalDetail.classList.contains("show")) {
      tutupDetailMateri();
    }
  });
}

// 5. Fitur Tips Belajar Acak
const tombolTipsAcak = ambilElemen("#btn-tip");
if (tombolTipsAcak) {
  let indexTipsSebelumnya = -1;

  tombolTipsAcak.onclick = () => {
    if (DAFTAR_TIPS.length === 0) return;

    let indexAcak;
    do {
      indexAcak = Math.floor(Math.random() * DAFTAR_TIPS.length);
    } while (indexAcak === indexTipsSebelumnya && DAFTAR_TIPS.length > 1);

    indexTipsSebelumnya = indexAcak;
    ambilElemen("#random-tip").textContent = "💡 " + DAFTAR_TIPS[indexAcak];
  };
}

// 6. Validasi Formulir Kontak
const formKontak = ambilElemen("#kontak");
if (formKontak) {
  formKontak.onsubmit = (event) => {
    event.preventDefault();
    let semuaValid = true;

    const cekInput = (idInput, kondisiSalah, pesanError) => {
      const elemenInput = ambilElemen("#" + idInput);
      const tidakValid = kondisiSalah(elemenInput.value.trim());
      ambilElemen("#e-" + idInput).textContent = tidakValid ? pesanError : "";
      if (tidakValid) semuaValid = false;
    };

    cekInput("nama", (nilai) => nilai.length < 3, "Nama minimal 3 karakter.");
    cekInput("email", (nilai) => !/^\S+@\S+\.\S+$/.test(nilai), "Format email belum benar.");
    cekInput("pesan", (nilai) => nilai.length < 10, "Pesan minimal 10 karakter.");

    ambilElemen("#hasil").textContent = semuaValid
      ? "Terima kasih! (Simulasi: pesan tidak dikirim ke server.)"
      : "";

    if (semuaValid) formKontak.reset();
  };
}