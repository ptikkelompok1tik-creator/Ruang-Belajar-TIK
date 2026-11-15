const MATERI=[
{t:"Teknik Pomodoro",k:"Manajemen Waktu",i:"⏱️",d:"Belajar 25 menit, istirahat 5 menit agar fokus terjaga.",ok:1},
{t:"Membuat Catatan Efektif",k:"Teknik Belajar",i:"📝",d:"Metode Cornell dan peta konsep untuk merangkum materi kuliah.",ok:1},
{t:"Menyusun Jadwal Belajar",k:"Manajemen Waktu",i:"📅",d:"Cara membagi waktu antara kuliah, tugas, dan istirahat.",ok:1},
{t:"Dasar Berpikir Algoritma",k:"Dasar TI",i:"💡",d:"Mengenal langkah berurutan untuk menyelesaikan masalah.",ok:1},
{t:"Belajar dari Sumber Digital",k:"Dasar TI",i:"🌐",d:"Memilih sumber belajar online yang tepercaya.",ok:0},
{t:"Persiapan Ujian",k:"Teknik Belajar",i:"🎯",d:"Strategi mengulang materi menjelang UTS dan UAS.",ok:0}];
const $=s=>document.querySelector(s);
const nav=$("nav"),bg=$("#burger");
if(bg)bg.onclick=()=>nav.classList.toggle("open");
document.querySelectorAll("nav a").forEach(a=>{if(a.getAttribute("href")===location.pathname.split("/").pop()||(!location.pathname.split("/").pop()&&a.getAttribute("href")==="index.html"))a.classList.add("on")});
const list=$("#list");
if(list){const q=$("#q"),f=$("#f");
const draw=()=>{const s=q.value.toLowerCase(),c=f.value;
const r=MATERI.filter(m=>(!c||m.k===c)&&(m.t+m.d).toLowerCase().includes(s));
list.innerHTML=r.length?r.map(m=>`<div class="card${m.ok?"":" off"}"><div class="ic">${m.i}</div><span class="tag">${m.k}</span> ${m.ok?"":'<span class="tag s">Segera hadir</span>'}<h3>${m.t}</h3><p>${m.d}</p></div>`).join(""):'<p class="note">Materi tidak ditemukan.</p>'};
q.oninput=draw;f.onchange=draw;draw()}
const form=$("#kontak");
if(form)form.onsubmit=e=>{e.preventDefault();let ok=true;
const chk=(id,bad,msg)=>{const el=$("#"+id);$("#e-"+id).textContent=bad(el.value.trim())?msg:"";if(bad(el.value.trim()))ok=false};
chk("nama",v=>v.length<3,"Nama minimal 3 karakter.");
chk("email",v=>!/^\S+@\S+\.\S+$/.test(v),"Format email belum benar.");
chk("pesan",v=>v.length<10,"Pesan minimal 10 karakter.");
$("#hasil").textContent=ok?"Terima kasih! (Simulasi: pesan tidak dikirim ke server.)":"";if(ok)form.reset()};
