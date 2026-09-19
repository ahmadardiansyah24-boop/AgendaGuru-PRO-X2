const KEY='ag_pro_x2';
let db=JSON.parse(localStorage.getItem(KEY)||'null')||{meta:{app:'AgendaGuru PRO X 2.0',version:'2.0-premium'},school:{name:'',npsn:'',addr:'',teacher:'',nip:'',head:'',year:'2025/2026',semester:'1',logo:''},users:[],classes:[],students:[],schedules:[],journals:[],attendance:[],grades:[],koko:[],seats:{}};
db.users=db.users||[];
let currentUser=null;
const $=id=>document.getElementById(id);
function persist(){localStorage.setItem(KEY,JSON.stringify(db));updateDash()}
function toast(s){$('toast').textContent=s;$('toast').style.display='block';setTimeout(()=>$('toast').style.display='none',1800)}
async function hashText(text){const data=new TextEncoder().encode(text);const hash=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function login(){
 const email=$('loginUser').value.trim().toLowerCase(), pass=$('loginPass').value;
 if(!db.users.length){$('setupModal').style.display='grid';return}
 if(!email||!pass)return toast('Email dan password wajib diisi');
 const h=await hashText(pass),u=db.users.find(x=>x.email===email&&x.passwordHash===h&&x.active!==false);
 if(!u)return toast('Email/password salah');
 currentUser={id:u.id,name:u.name,email:u.email,role:u.role};
 sessionStorage.setItem('ag_current_user',JSON.stringify(currentUser));
 $('loginView').style.display='none';$('setupModal').style.display='none';$('app').style.display='flex';init();
}
function logout(){currentUser=null;sessionStorage.removeItem('ag_current_user');$('app').style.display='none';$('loginView').style.display='grid';refreshLoginBrand()}
function togglePass(){$('loginPass').type=$('loginPass').type==='password'?'text':'password'}
async function createAdmin(){
 const name=$('setupName').value.trim(),email=$('setupEmail').value.trim().toLowerCase(),pass=$('setupPass').value;
 if(!name||!email||pass.length<6)return toast('Lengkapi data, password minimal 6 karakter');
 const passwordHash=await hashText(pass);
 db.users.push({id:'U'+Date.now(),name,email,passwordHash,role:'admin',active:true});
 persist();$('setupModal').style.display='none';toast('Admin berhasil dibuat');$('loginUser').value=email;
}
function refreshLoginBrand(){let s=db.school||{};$('loginSchool').textContent=s.name||'Premium Gold Dark';$('loginLogo').src=s.logo||'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" rx="60" fill="#171c22"/><text x="60" y="70" text-anchor="middle" fill="#f1d889" font-size="34" font-family="Arial">AG</text></svg>')}

function toggleSide(){$('side').classList.toggle('open')}

function isAdmin(){return currentUser?.role==='admin'}
function guardAdmin(){if(!isAdmin()){toast('Fitur ini hanya untuk Admin');return false}return true}
function applyRole(){
 const admin=isAdmin();$('navUsers').style.display=admin?'block':'none';
 $('userBadge').textContent=currentUser?`${currentUser.name} • ${currentUser.role.toUpperCase()}`:'Belum login';
}
async function addTeacherAccount(){
 if(!guardAdmin())return;
 const name=prompt('Nama guru:');if(!name)return;const email=prompt('Email guru:');if(!email)return;const pass=prompt('Password awal (min. 6 karakter):');if(!pass||pass.length<6)return toast('Password minimal 6 karakter');
 if(db.users.some(u=>u.email===email.toLowerCase()))return toast('Email sudah digunakan');
 db.users.push({id:'U'+Date.now(),name,email:email.toLowerCase(),passwordHash:await hashText(pass),role:'guru',active:true});persist();renderUsers();toast('Akun guru dibuat');
}
function renderUsers(){
 if(!isAdmin())return;
 $('userRows').innerHTML=db.users.map((u,i)=>`<tr><td>${i+1}</td><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${u.active===false?'Nonaktif':'Aktif'}</td><td><button class="btn" onclick="toggleUser('${u.id}')">${u.active===false?'Aktifkan':'Nonaktifkan'}</button></td></tr>`).join('')||'<tr><td colspan="5" class="empty">Belum ada akun guru.</td></tr>';
}
function toggleUser(id){if(!guardAdmin())return;let u=db.users.find(x=>x.id===id);if(u){u.active=u.active===false;persist();renderUsers()}}

function showPage(id,btn){if(id==='users'&&!guardAdmin())return;document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));$(id).classList.add('active');document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));btn?.classList.add('active');$('pageTitle').textContent=btn?.textContent.replace(/^.\s*/,'')||id;renderAll()}
function saveSchool(){db.school={name:$('schoolName').value,npsn:$('npsn').value,addr:$('schoolAddr').value,teacher:$('teacher').value,nip:$('nip').value,head:$('head').value,year:$('year').value,semester:$('semester').value,logo:db.school.logo};persist();$('schoolSub').textContent=db.school.name||'AgendaGuru PRO X 2.0';refreshLoginBrand();toast('Identitas tersimpan')}
function loadLogo(e){let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{db.school.logo=r.result;$('logoPreview').src=r.result;persist()};r.readAsDataURL(f)}
function init(){currentUser=currentUser||JSON.parse(sessionStorage.getItem('ag_current_user')||'null');refreshLoginBrand();applyRole();loadSchool();populateSelects();$('attDate').value=new Date().toISOString().slice(0,10);renderAll();renderUsers()}
function loadSchool(){let s=db.school;['schoolName','npsn','schoolAddr','teacher','nip','head','year','semester'].forEach((id,i)=>$(id).value=[s.name,s.npsn,s.addr,s.teacher,s.nip,s.head,s.year,s.semester][i]??'');if(s.logo)$('logoPreview').src=s.logo;$('schoolSub').textContent=s.name||'AgendaGuru PRO X 2.0'}
function populateSelects(){let opts='<option value="">Pilih kelas</option>'+db.classes.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');['classSelect','attClass','gradeClass','seatClass'].forEach(id=>$(id).innerHTML=opts)}
function addClass(){let n=prompt('Nama kelas:');if(!n)return;db.classes.push({id:'C'+Date.now(),name:n});persist();populateSelects();toast('Kelas ditambahkan')}
function addStudent(){let cid=$('classSelect').value;if(!cid)return toast('Pilih kelas');let name=prompt('Nama siswa:');if(!name)return;let nis=prompt('NIS/NISN:')||'',jk=prompt('Jenis kelamin (L/P):')||'';db.students.push({id:'S'+Date.now(),cid,name,nis,jk});persist();renderStudents()}
function importStudents(){let input=document.createElement('input');input.type='file';input.accept='.csv,.txt';input.onchange=()=>{let f=input.files[0];if(!f)return;let cid=$('classSelect').value;if(!cid)return toast('Pilih kelas');let r=new FileReader();r.onload=()=>{String(r.result).split(/\\r?\\n/).slice(1).forEach(line=>{let a=line.split(',');if(a[0]?.trim())db.students.push({id:'S'+Date.now()+Math.random(),cid,name:a[0].trim(),nis:(a[1]||'').trim(),jk:(a[2]||'').trim()})});persist();renderStudents();toast('Import selesai')};r.readAsText(f)};input.click()}
function renderStudents(){let cid=$('classSelect').value,q=($('studentSearch').value||'').toLowerCase();let a=db.students.filter(s=>s.cid===cid&&(s.name+' '+s.nis).toLowerCase().includes(q));$('studentRows').innerHTML=a.length?a.map((s,i)=>`<tr><td>${i+1}</td><td>${esc(s.name)}</td><td>${esc(s.nis)}</td><td>${esc(s.jk)}</td><td><button class="btn danger" onclick="delStudent('${s.id}')">Hapus</button></td></tr>`).join(''):`<tr><td colspan="5" class="empty">Belum ada siswa.</td></tr>`}
function delStudent(id){if(!confirm('Hapus siswa?'))return;db.students=db.students.filter(s=>s.id!==id);persist();renderStudents()}
function addSchedule(){let day=prompt('Hari:'),time=prompt('Jam:'),cid=$('classSelect').value||db.classes[0]?.id,sub=prompt('Mata pelajaran:'),room=prompt('Ruang:')||'';if(!day||!sub)return;db.schedules.push({id:Date.now(),day,time,cid,sub,room});persist();renderSchedules()}
function renderSchedules(){$('scheduleRows').innerHTML=db.schedules.length?db.schedules.map(x=>`<tr><td>${esc(x.day)}</td><td>${esc(x.time)}</td><td>${esc(db.classes.find(c=>c.id===x.cid)?.name||'-')}</td><td>${esc(x.sub)}</td><td>${esc(x.room)}</td><td><button class="btn danger" onclick="delBy('schedules',${x.id})">Hapus</button></td></tr>`).join(''):`<tr><td colspan="6" class="empty">Belum ada jadwal.</td></tr>`}
function addJournal(){let date=prompt('Tanggal (YYYY-MM-DD):')||new Date().toISOString().slice(0,10),cid=$('classSelect').value||db.classes[0]?.id,sub=prompt('Mata pelajaran:'),mat=prompt('Materi:'),model=prompt('Model/pendekatan:')||'Deep Learning';if(!sub||!mat)return;db.journals.push({id:Date.now(),date,cid,sub,mat,model});persist();renderJournals()}
function renderJournals(){$('journalRows').innerHTML=db.journals.length?db.journals.map(x=>`<tr><td>${x.date}</td><td>${esc(db.classes.find(c=>c.id===x.cid)?.name||'-')}</td><td>${esc(x.sub)}</td><td>${esc(x.mat)}</td><td>${esc(x.model)}</td><td><button class="btn danger" onclick="delBy('journals',${x.id})">Hapus</button></td></tr>`).join(''):`<tr><td colspan="6" class="empty">Belum ada jurnal.</td></tr>`}
function renderAttendance(){let cid=$('attClass').value,a=db.students.filter(s=>s.cid===cid);$('attRows').innerHTML=a.length?a.map((s,i)=>{let old=db.attendance.find(x=>x.date===$('attDate').value&&x.sid===s.id);return `<tr><td>${i+1}</td><td>${esc(s.name)}</td><td><select data-sid="${s.id}"><option value="H" ${old?.status==='H'?'selected':''}>Hadir</option><option value="S" ${old?.status==='S'?'selected':''}>Sakit</option><option value="I" ${old?.status==='I'?'selected':''}>Izin</option><option value="A" ${old?.status==='A'?'selected':''}>Alpa</option></select></td></tr>`}).join(''):`<tr><td colspan="3" class="empty">Pilih kelas yang memiliki siswa.</td></tr>`}
function setAll(v){document.querySelectorAll('#attRows select').forEach(x=>x.value=v)}
function saveAttendance(){let date=$('attDate').value,cid=$('attClass').value;if(!cid)return toast('Pilih kelas');db.attendance=db.attendance.filter(x=>x.date!==date||!db.students.some(s=>s.id===x.sid&&s.cid===cid));document.querySelectorAll('#attRows select').forEach(x=>db.attendance.push({date,cid,sid:x.dataset.sid,status:x.value}));persist();toast('Absensi tersimpan')}
function renderGrades(){let cid=$('gradeClass').value,type=$('gradeType').value,a=db.students.filter(s=>s.cid===cid);$('gradeRows').innerHTML=a.length?a.map((s,i)=>{let g=db.grades.find(x=>x.sid===s.id&&x.type===type);let n=g?.value??'';return `<tr><td>${i+1}</td><td>${esc(s.name)}</td><td><input class="gradeInput" data-sid="${s.id}" type="number" min="0" max="100" value="${n}" style="width:90px"></td><td>${pred(n)}</td></tr>`}).join(''):`<tr><td colspan="4" class="empty">Belum ada siswa.</td></tr>`}
function saveGrades(){let type=$('gradeType').value;document.querySelectorAll('.gradeInput').forEach(i=>{let v=i.value;if(v==='')return;let old=db.grades.find(x=>x.sid===i.dataset.sid&&x.type===type);if(old)old.value=+v;else db.grades.push({sid:i.dataset.sid,type,value:+v})});persist();renderGrades();toast('Nilai tersimpan')}
function pred(n){n=+n;if(!n&&n!==0)return '-';return n>=90?'A':n>=80?'B':n>=70?'C':'D'}
function addKoko(){let cid=$('classSelect').value,a=db.students.filter(s=>s.cid===cid);if(!a.length)return toast('Pilih kelas yang memiliki siswa');let sid=prompt('ID siswa: '+a.map(s=>s.id+'='+s.name).join(' | '));let st=db.students.find(s=>s.id===sid);if(!st)return toast('ID tidak ditemukan');let act=prompt('Kegiatan:'),val=prompt('Nilai:'),desc=prompt('Deskripsi:')||'';if(!act)return;db.koko.push({id:Date.now(),sid,act,val,desc});persist();renderKoko()}
function renderKoko(){$('kokoRows').innerHTML=db.koko.length?db.koko.map(x=>`<tr><td>${esc(db.students.find(s=>s.id===x.sid)?.name||'-')}</td><td>${esc(x.act)}</td><td>${esc(x.val)}</td><td>${esc(x.desc)}</td><td><button class="btn danger" onclick="delBy('koko',${x.id})">Hapus</button></td></tr>`).join(''):`<tr><td colspan="5" class="empty">Belum ada penilaian.</td></tr>`}
function generateSeats(){let cid=$('seatClass').value;if(!cid)return toast('Pilih kelas');let cols=Math.max(1,+$('seatCols').value||4),a=db.students.filter(s=>s.cid===cid);db.seats[cid]={cols,ids:a.map(s=>s.id)};persist();renderSeats()}
function renderSeats(){let cid=$('seatClass').value,x=db.seats[cid],a=db.students.filter(s=>s.cid===cid);if(!x)x={cols:+$('seatCols').value||4,ids:a.map(s=>s.id)};$('seatGrid').style.gridTemplateColumns=`repeat(${x.cols},1fr)`;$('seatGrid').innerHTML=x.ids.map((id,i)=>{let s=db.students.find(z=>z.id===id);return `<div class="card" style="text-align:center"><b style="color:var(--gold2)">Meja ${i+1}</b><div>${esc(s?.name||'-')}</div></div>`}).join('')||'<div class="empty">Belum ada siswa.</div>'}
function delBy(arr,id){db[arr]=db[arr].filter(x=>x.id!==id);persist();renderAll()}
function backup(){db.meta={app:'AgendaGuru PRO X 2.0',version:'2.0-premium',backupAt:new Date().toISOString()};persist();let blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='AgendaGuru_PRO_X2_Backup.json';a.click();URL.revokeObjectURL(a.href);toast('Backup dibuat')}
function restore(e){let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{db=JSON.parse(r.result);persist();init();toast('Restore berhasil')}catch{toast('File JSON tidak valid')}};r.readAsText(f)}
function resetData(){if(!confirm('Hapus seluruh data?'))return;localStorage.removeItem(KEY);location.reload()}
function updateDash(){$('sSiswa').textContent=db.students.length;$('sKelas').textContent=db.classes.length;$('sJurnal').textContent=db.journals.length;$('sAbs').textContent=db.attendance.length;let c={H:0,S:0,I:0,A:0};db.attendance.forEach(x=>c[x.status]=(c[x.status]||0)+1);let max=Math.max(1,...Object.values(c));$('attChart').innerHTML=Object.entries(c).map(([k,v])=>`<div class="bar" style="height:${Math.max(4,v/max*150)}px"><span>${k}</span></div>`).join('');$('attLegend').textContent=`Hadir ${c.H} • Sakit ${c.S} • Izin ${c.I} • Alpa ${c.A}`;let today=new Date().toLocaleDateString('id-ID',{weekday:'long'});let rows=db.schedules.filter(x=>x.day.toLowerCase()===today.toLowerCase());$('todaySchedule').innerHTML=rows.length?rows.map(x=>`<div style="padding:8px 0;border-bottom:1px solid #252b32"><b>${esc(x.time)}</b> — ${esc(x.sub)} <span class="pill">${esc(db.classes.find(c=>c.id===x.cid)?.name||'-')}</span></div>`).join(''):'Belum ada jadwal hari ini.'}
function renderAll(){applyRole();renderUsers();let vals={classSelect:$('classSelect').value,attClass:$('attClass').value,gradeClass:$('gradeClass').value,seatClass:$('seatClass').value};populateSelects();Object.keys(vals).forEach(id=>{if(vals[id]&&[...$(id).options].some(o=>o.value===vals[id]))$(id).value=vals[id]});renderStudents();renderSchedules();renderJournals();renderAttendance();renderGrades();renderKoko();renderSeats();updateDash()}

function schoolHeader(title){
  const s=db.school||{};
  return `<div style="text-align:center;border-bottom:2px solid #222;padding-bottom:8px;margin-bottom:14px">
  ${s.logo?`<img src="${s.logo}" style="width:60px;height:60px;object-fit:contain;float:left">`:''}
  <b style="font-size:15px">${esc(s.name||'NAMA SEKOLAH')}</b><br>
  <span>${esc(s.addr||'Alamat sekolah')}</span><br>
  <span>NPSN: ${esc(s.npsn||'-')} • Tahun Ajaran: ${esc(s.year||'-')} • Semester: ${esc(s.semester||'-')}</span>
  <h2 style="margin:10px 0 0;font-size:17px">${esc(title)}</h2></div>`;
}
function printDoc(title,body){
  const w=window.open('','_blank','width=1000,height=750');
  if(!w){toast('Popup diblokir browser');return}
  w.document.write(`<!doctype html><html><head><title>${esc(title)}</title><style>
  @page{size:A4;margin:14mm}body{font-family:Arial,sans-serif;color:#111;font-size:11px}
  table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border:1px solid #777;padding:5px;text-align:left}th{background:#eee}
  .sign{display:flex;justify-content:space-between;margin-top:35px;text-align:center}.sign div{width:40%}
  </style></head><body>${schoolHeader(title)}${body}<div class="sign"><div>Mengetahui,<br>Kepala Sekolah<br><br><br><b>${esc(db.school.head||'')}</b></div><div>Guru Mata Pelajaran<br><br><br><br><b>${esc(db.school.teacher||'')}</b><br>NIP. ${esc(db.school.nip||'-')}</div></div>
  <script>window.onload=()=>window.print()<\/script></body></html>`);
  w.document.close();
}
function selectedClassName(id){return db.classes.find(c=>c.id===$(id).value)?.name||'Semua Kelas'}
function printStudentList(){
 let cid=$('classSelect').value,a=db.students.filter(s=>!cid||s.cid===cid);
 let rows=a.map((s,i)=>`<tr><td>${i+1}</td><td>${esc(s.name)}</td><td>${esc(s.nis)}</td><td>${esc(s.jk)}</td><td>${esc(db.classes.find(c=>c.id===s.cid)?.name||'-')}</td></tr>`).join('');
 printDoc('DAFTAR SISWA',`<p>Kelas: <b>${esc(selectedClassName('classSelect'))}</b></p><table><tr><th>No</th><th>Nama</th><th>NIS/NISN</th><th>JK</th><th>Kelas</th></tr>${rows||'<tr><td colspan="5">Belum ada data.</td></tr>'}</table>`);
}
function printAttendance(){
 let date=$('attDate').value,a=db.attendance.filter(x=>!date||x.date===date);
 let rows=a.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(db.students.find(s=>s.id===x.sid)?.name||'-')}</td><td>${esc(db.classes.find(c=>c.id===x.cid)?.name||'-')}</td><td>${x.date}</td><td>${esc({H:'Hadir',S:'Sakit',I:'Izin',A:'Alpa'}[x.status]||x.status)}</td></tr>`).join('');
 printDoc('REKAP ABSENSI',`<p>Tanggal: <b>${esc(date||'-')}</b></p><table><tr><th>No</th><th>Nama</th><th>Kelas</th><th>Tanggal</th><th>Status</th></tr>${rows||'<tr><td colspan="5">Belum ada data.</td></tr>'}</table>`);
}
function printGrades(){
 let cid=$('gradeClass').value,type=$('gradeType').value,a=db.students.filter(s=>!cid||s.cid===cid);
 let rows=a.map((s,i)=>{let g=db.grades.find(x=>x.sid===s.id&&x.type===type);return `<tr><td>${i+1}</td><td>${esc(s.name)}</td><td>${esc(g?.value??'-')}</td><td>${esc(pred(g?.value))}</td></tr>`}).join('');
 printDoc('DAFTAR NILAI',`<p>Kelas: <b>${esc(selectedClassName('gradeClass'))}</b> • Jenis: <b>${esc(type)}</b></p><table><tr><th>No</th><th>Nama</th><th>Nilai</th><th>Predikat</th></tr>${rows||'<tr><td colspan="4">Belum ada data.</td></tr>'}</table>`);
}
function printJournal(){
 let rows=db.journals.map((x,i)=>`<tr><td>${i+1}</td><td>${x.date}</td><td>${esc(db.classes.find(c=>c.id===x.cid)?.name||'-')}</td><td>${esc(x.sub)}</td><td>${esc(x.mat)}</td><td>${esc(x.model)}</td></tr>`).join('');
 printDoc('JURNAL MENGAJAR',`<table><tr><th>No</th><th>Tanggal</th><th>Kelas</th><th>Mapel</th><th>Materi</th><th>Model</th></tr>${rows||'<tr><td colspan="6">Belum ada data.</td></tr>'}</table>`);
}
function printSchedule(){
 let rows=db.schedules.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.day)}</td><td>${esc(x.time)}</td><td>${esc(db.classes.find(c=>c.id===x.cid)?.name||'-')}</td><td>${esc(x.sub)}</td><td>${esc(x.room)}</td></tr>`).join('');
 printDoc('JADWAL PELAJARAN',`<table><tr><th>No</th><th>Hari</th><th>Jam</th><th>Kelas</th><th>Mapel</th><th>Ruang</th></tr>${rows||'<tr><td colspan="6">Belum ada data.</td></tr>'}</table>`);
}
function printKoko(){
 let rows=db.koko.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(db.students.find(s=>s.id===x.sid)?.name||'-')}</td><td>${esc(x.act)}</td><td>${esc(x.val)}</td><td>${esc(x.desc)}</td></tr>`).join('');
 printDoc('REKAP KOKURIKULER',`<table><tr><th>No</th><th>Nama</th><th>Kegiatan</th><th>Nilai</th><th>Deskripsi</th></tr>${rows||'<tr><td colspan="5">Belum ada data.</td></tr>'}</table>`);
}
function printSeats(){
 let cid=$('seatClass').value,a=db.students.filter(s=>!cid||s.cid===cid),x=db.seats[cid]||{cols:4,ids:a.map(s=>s.id)};
 let cells=x.ids.map((id,i)=>`<td style="height:55px;text-align:center"><b>Meja ${i+1}</b><br>${esc(db.students.find(s=>s.id===id)?.name||'-')}</td>`);
 let cols=x.cols||4,trs='';for(let i=0;i<cells.length;i+=cols)trs+=`<tr>${cells.slice(i,i+cols).join('')}</tr>`;
 printDoc('DENAH TEMPAT DUDUK',`<p>Kelas: <b>${esc(selectedClassName('seatClass'))}</b></p><table>${trs||'<tr><td>Belum ada siswa.</td></tr>'}</table>`);
}
function printSchool(){
 let s=db.school;
 printDoc('IDENTITAS SEKOLAH & GURU',`<table><tr><th>Item</th><th>Data</th></tr>
 <tr><td>Nama Sekolah</td><td>${esc(s.name)}</td></tr><tr><td>NPSN</td><td>${esc(s.npsn)}</td></tr><tr><td>Alamat</td><td>${esc(s.addr)}</td></tr>
 <tr><td>Guru</td><td>${esc(s.teacher)}</td></tr><tr><td>NIP</td><td>${esc(s.nip)}</td></tr><tr><td>Kepala Sekolah</td><td>${esc(s.head)}</td></tr>
 <tr><td>Tahun Ajaran</td><td>${esc(s.year)}</td></tr><tr><td>Semester</td><td>${esc(s.semester)}</td></tr></table>`);
}
function printFullReport(){
 printDoc('REKAP ADMINISTRASI GURU',`<div class="kpi"><b>Jumlah Kelas</b><span>${db.classes.length}</span></div>
 <div class="kpi"><b>Jumlah Siswa</b><span>${db.students.length}</span></div><div class="kpi"><b>Jadwal</b><span>${db.schedules.length}</span></div>
 <div class="kpi"><b>Jurnal</b><span>${db.journals.length}</span></div><div class="kpi"><b>Catatan Absensi</b><span>${db.attendance.length}</span></div>
 <div class="kpi"><b>Data Nilai</b><span>${db.grades.length}</span></div><div class="kpi"><b>Kokurikuler</b><span>${db.koko.length}</span></div>`);
}

function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
refreshLoginBrand();
