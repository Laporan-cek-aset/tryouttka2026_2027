'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tglLahir, setTglLahir] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  // Ambil Data Sesi & Redirect Jika Sesi Masih Aktif
  useEffect(() => {
    const savedUser = localStorage.getItem('cbt_user');
    if (savedUser) { window.location.href = '/index.html'; return; }

    const fetchPublicData = async () => {
      try {
        const res = await fetch('/api/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getPublicData', args: [] })
        });
        const result = await res.json();
        if (result.status === 'success') {
          setSessions(result.data.sessions);
        }
      } catch (err) { console.error('Gagal memuat jadwal sesi'); }
    };
    fetchPublicData();

    // Timer Countdown Mockup Ke Hari Esok Jam 08:00
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(8, 0, 0, 0);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference > 0) {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, tglLahir })
      });
      const result = await res.json();
      if (result.status === 'success') {
        const user = result.data;
        user.LogoUrl = result.logo;
        localStorage.setItem('cbt_user', JSON.stringify(user));
        window.location.href = '/index.html';
      } else { alert('Gagal Login: ' + result.msg); }
    } catch (err) { alert('Terjadi kesalahan jaringan.'); } 
    finally { setLoading(false); }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />

      <div style={{
        fontFamily: "'Poppins', sans-serif", minHeight: '100vh', width: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '20px',
        background: "linear-gradient(135deg, #115e3c 0%, #15803d 50%, #d4af37 100%)"
      }}>
        
        <div className="container" style={{ maxWidth: '1100px' }}>
          {/* Header Title Offline Screen */}
          <div className="text-white mb-4">
            <p className="m-0" style={{ fontSize: '1.2rem', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
              Selamat datang di Aplikasi Computer Based Test (CBT) resmi Kabupaten Tangerang.
            </p>
          </div>

          <div className="row g-4">
            {/* BAGIAN KIRI (INFO & JADWAL) */}
            <div className="col-lg-7 d-flex flex-column gap-4">
              
              {/* Box Aturan */}
              <div className="bg-white text-dark p-4 rounded-4 shadow-sm" style={{ opacity: 0.98 }}>
                <h5 className="fw-bold mb-3" style={{ color: '#115e3c' }}><i className="fas fa-list-check me-2"></i>Aturan & Cara Mengerjakan</h5>
                <ul className="mb-0 small text-muted" style={{ paddingLeft: '1.2rem', lineHeight: '1.8' }}>
                  <li className="mb-2">Pastikan koneksi internet Anda stabil sebelum mulai ujian.</li>
                  <li className="mb-2">Sistem akan otomatis beralih ke mode <strong className="text-dark">Layar Penuh (Fullscreen)</strong>.</li>
                  <li className="mb-2"><strong className="text-danger">DILARANG</strong> membuka tab baru, aplikasi lain, atau membagi layar (Split Screen). Pelanggaran maksimal 3 kali akan membuat jawaban otomatis terkirim.</li>
                  <li>Tombol <strong className="text-dark">Selesai Ujian</strong> hanya akan muncul di soal nomor terakhir. Gunakan tombol <strong className="text-warning text-darken">Ragu-ragu</strong> jika ingin menandai soal yang belum yakin.</li>
                </ul>
              </div>

              {/* Box Jadwal & Countdown */}
              <div className="bg-white text-dark p-4 rounded-4 shadow-sm" style={{ opacity: 0.98 }}>
                <h5 className="fw-bold mb-4" style={{ color: '#115e3c' }}><i className="fas fa-calendar-alt me-2"></i>Jadwal Pelaksanaan</h5>
                
                <div className="border border-success rounded-4 p-4 text-center mx-auto" style={{ maxWidth: '500px' }}>
                    <h5 className="fw-bold text-primary mb-3">PELAKSANAAN UJIAN (1 HARI)</h5>
                    
                    <div className="d-flex justify-content-center gap-3 mb-4">
                        <div className="text-center">
                            <div className="bg-success text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '60px', height: '60px', fontSize: '24px', fontWeight: 'bold' }}>{String(timeLeft.d).padStart(2, '0')}</div>
                            <small className="text-muted fw-bold d-block mt-1" style={{fontSize: '10px'}}>HARI</small>
                        </div>
                        <div className="text-center">
                            <div className="bg-success text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '60px', height: '60px', fontSize: '24px', fontWeight: 'bold' }}>{String(timeLeft.h).padStart(2, '0')}</div>
                            <small className="text-muted fw-bold d-block mt-1" style={{fontSize: '10px'}}>JAM</small>
                        </div>
                        <div className="text-center">
                            <div className="bg-success text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '60px', height: '60px', fontSize: '24px', fontWeight: 'bold' }}>{String(timeLeft.m).padStart(2, '0')}</div>
                            <small className="text-muted fw-bold d-block mt-1" style={{fontSize: '10px'}}>MENIT</small>
                        </div>
                        <div className="text-center">
                            <div className="bg-success text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '60px', height: '60px', fontSize: '24px', fontWeight: 'bold' }}>{String(timeLeft.s).padStart(2, '0')}</div>
                            <small className="text-muted fw-bold d-block mt-1" style={{fontSize: '10px'}}>DETIK</small>
                        </div>
                    </div>

                    <hr className="text-muted my-4" />
                    
                    <h6 className="fw-bold text-dark mb-3">Rundown Sesi Ujian:</h6>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        {sessions.length > 0 ? (
                            sessions.map((s, idx) => (
                                <span key={idx} className="badge bg-success py-2 px-3 fs-6 shadow-sm rounded-pill">
                                    Sesi {s.SesiID}: {s.JamMulai} - {s.JamSelesai}
                                </span>
                            ))
                        ) : (
                            <div className="spinner-border spinner-border-sm text-success"></div>
                        )}
                    </div>
                </div>

              </div>
            </div>

            {/* BAGIAN KANAN (LOGIN FORM) */}
            <div className="col-lg-5">
              <div style={{
                background: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                padding: '40px', width: '100%', position: 'relative'
              }}>
                
                <div className="text-center mb-4">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1SCvmdQxuqmX_f0gBaYt0Ob53Tws97Hnq" 
                    className="mx-auto d-block mb-2" 
                    width="100" 
                    alt="Logo Daerah" 
                  />
                  <h4 className="fw-bold text-center mt-3" style={{ color: '#115e3c', fontSize: '20px' }}>
                    MASUK UJIAN
                  </h4>
                </div>

                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                  
                  <div className="mb-3">
                    <div className="form-floating shadow-sm rounded-4 overflow-hidden">
                      <input 
                        type="text" 
                        className="form-control border-0" 
                        style={{ backgroundColor: '#f1f5f9' }}
                        placeholder="User" 
                        required 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                      />
                      <label className="text-muted small">Username</label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-floating shadow-sm rounded-4 overflow-hidden position-relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="form-control border-0" 
                        style={{ backgroundColor: '#f1f5f9' }}
                        placeholder="Pass" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                      />
                      <label className="text-muted small">Password</label>
                      <i 
                        className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute top-50 end-0 translate-middle-y me-3 text-muted`} 
                        style={{ cursor: 'pointer', zIndex: 10, fontSize: '1.2rem' }}
                        onClick={() => setShowPassword(!showPassword)}
                      ></i>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="form-floating shadow-sm rounded-4 overflow-hidden">
                      <input 
                        type="date" 
                        className="form-control border-0 text-muted" 
                        style={{ backgroundColor: '#f1f5f9' }}
                        value={tglLahir} 
                        onChange={(e) => setTglLahir(e.target.value)} 
                      />
                      <label className="text-muted small">Tanggal Lahir (Peserta Wajib Isi)</label>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn w-100 py-3 fw-bold shadow text-white mt-2"
                    style={{ background: '#115e3c', border: 'none', fontSize: '16px', borderRadius: '12px' }}
                  >
                    {loading ? 'MEMPROSES...' : 'MASUK SEKARANG'}
                  </button>
                </form>

                <div className="text-center mt-5 small text-muted">
                  © 2026 CATBCKS - KAB. TANGERANG<br/>@support by Belajar Inovasi
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
