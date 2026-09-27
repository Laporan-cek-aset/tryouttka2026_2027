'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tglLahir, setTglLahir] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [sessions, setSessions] = useState([
    { SesiID: '1', JamMulai: '07:30', JamSelesai: '09:00' },
    { SesiID: '2', JamMulai: '09:30', JamSelesai: '11:00' },
    { SesiID: '3', JamMulai: '11:30', JamSelesai: '13:00' },
    { SesiID: '4', JamMulai: '13:30', JamSelesai: '15:00' }
  ]);
  
  const TARGET_DATE = new Date("2026-10-15T07:30:00").getTime();

  useEffect(() => {
    const savedUser = localStorage.getItem('cbt_user');
    if (savedUser) { window.location.href = '/index.html'; }

    // Ambil Jam Sesi dari Database
    fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getPublicSessions', args: [] })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success' && data.data && data.data.length > 0) {
            setSessions(data.data);
        }
    })
    .catch(e => console.log('Gagal memuat sesi', e));

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
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
      } else {
        alert('Gagal Login: ' + result.msg);
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan atau server tidak merespons.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulseEffect {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(21, 128, 61, 0.4); }
          50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(21, 128, 61, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(21, 128, 61, 0); }
        }
        .pulse-box {
          animation: pulseEffect 2s infinite;
          border: 2px solid #15803d !important;
        }
        .countdown-box {
          background: linear-gradient(135deg, #15803d 0%, #064e3b 100%);
        }
      `}} />

      <div style={{
        fontFamily: "'Poppins', sans-serif",
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: "linear-gradient(135deg, #064e3b 0%, #15803d 50%, #d4af37 100%)",
        padding: '20px'
      }}>
        
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div className="row g-4 align-items-center">
            
            <div className="col-lg-7 text-white pe-lg-4 mb-4 mb-lg-0">
              <h2 className="fw-bold mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>CATBCKS - Kab. Tangerang</h2>
              <p className="lead mb-4" style={{ fontSize: '1.1rem', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                Selamat datang di Aplikasi Computer Based Test (CBT) resmi Kabupaten Tangerang.
              </p>
              
              <div className="bg-white text-dark p-4 rounded-4 shadow-sm mb-4" style={{ opacity: 0.95 }}>
                <h5 className="fw-bold text-success mb-3"><i className="fas fa-list-check me-2"></i>Aturan & Cara Mengerjakan</h5>
                <ol className="mb-0 small text-muted" style={{ paddingLeft: '1.2rem', lineHeight: '1.7' }}>
                  <li className="mb-1">Pastikan koneksi internet Anda stabil sebelum mulai ujian.</li>
                  <li className="mb-1">Sistem akan otomatis beralih ke mode <strong className="text-dark">Layar Penuh (Fullscreen)</strong>.</li>
                  <li className="mb-1"><strong className="text-danger">DILARANG</strong> membuka tab baru, aplikasi lain, atau membagi layar (Split Screen). Pelanggaran maksimal 3 kali akan membuat jawaban otomatis terkirim.</li>
                  <li>Tombol <strong className="text-dark">Selesai Ujian</strong> hanya akan muncul di soal nomor terakhir. Gunakan tombol <strong className="text-warning text-darken">Ragu-ragu</strong> jika ingin menandai soal yang belum yakin.</li>
                </ol>
              </div>

              <div className="bg-white text-dark p-4 rounded-4 shadow-sm" style={{ opacity: 0.95 }}>
                <h5 className="fw-bold text-success mb-3"><i className="fas fa-calendar-alt me-2"></i>Jadwal Pelaksanaan</h5>
                
                <div className="p-3 bg-light rounded-4 h-100 shadow-sm pulse-box mb-3">
                  <h6 className="fw-bold text-primary mb-2 text-center fs-5">
                    PELAKSANAAN UJIAN (1 HARI)
                  </h6>
                  
                  <div className="d-flex justify-content-center gap-2 gap-md-3 my-3">
                    <div className="text-center">
                        <div className="countdown-box text-white rounded-3 px-3 py-2 fs-3 fw-bold shadow-sm">{timeLeft.d}</div>
                        <small className="text-muted fw-bold" style={{fontSize:'11px'}}>HARI</small>
                    </div>
                    <div className="text-center">
                        <div className="countdown-box text-white rounded-3 px-3 py-2 fs-3 fw-bold shadow-sm">{timeLeft.h}</div>
                        <small className="text-muted fw-bold" style={{fontSize:'11px'}}>JAM</small>
                    </div>
                    <div className="text-center">
                        <div className="countdown-box text-white rounded-3 px-3 py-2 fs-3 fw-bold shadow-sm">{timeLeft.m}</div>
                        <small className="text-muted fw-bold" style={{fontSize:'11px'}}>MENIT</small>
                    </div>
                    <div className="text-center">
                        <div className="countdown-box text-white rounded-3 px-3 py-2 fs-3 fw-bold shadow-sm">{timeLeft.s}</div>
                        <small className="text-muted fw-bold" style={{fontSize:'11px'}}>DETIK</small>
                    </div>
                  </div>

                  <div className="text-center mt-3 mb-2 small text-muted border-top pt-3">
                      <strong>Rundown Sesi Ujian:</strong>
                  </div>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {sessions.map((s, idx) => (
                      <span key={idx} className="badge bg-success text-white px-3 py-2 shadow-sm fs-6">Sesi {s.SesiID}: {s.JamMulai} - {s.JamSelesai}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                width: '100%',
                padding: '40px',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch'
              }}>
                
                <div className="text-center mb-4">
                  <img src="https://lh3.googleusercontent.com/d/1IWNmSpAZfMOYOU0uNK2RIiD83Zr63ye9" className="mx-auto d-block mb-3 rounded" width="90" alt="Logo CATBCKS" />
                  <h4 className="fw-bold text-center" style={{ color: '#064e3b', fontSize: '22px' }}>MASUK UJIAN</h4>
                </div>

                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                  <div className="form-floating mb-3">
                    <input type="text" className="form-control bg-light border-0" placeholder="User" required value={username} onChange={(e) => setUsername(e.target.value)} />
                    <label>Username</label>
                  </div>

                  <div className="form-floating mb-3 position-relative">
                    <input type={showPassword ? "text" : "password"} className="form-control bg-light border-0" placeholder="Pass" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label>Password</label>
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute top-50 end-0 translate-middle-y me-3 text-muted`} style={{ cursor: 'pointer', zIndex: 10, fontSize: '1.2rem' }} onClick={() => setShowPassword(!showPassword)}></i>
                  </div>

                  <div className="form-floating mb-4">
                    <input type="date" className="form-control bg-light border-0" value={tglLahir} onChange={(e) => setTglLahir(e.target.value)} />
                    <label>Tanggal Lahir (Peserta Wajib Isi)</label>
                  </div>

                  <button type="submit" disabled={loading} className="btn w-100 py-3 fw-bold shadow-sm text-white" style={{ background: 'linear-gradient(90deg, #064e3b 0%, #15803d 100%)', border: 'none', fontSize: '16px', borderRadius: '10px' }}>
                    {loading ? 'MEMPROSES...' : 'MASUK SEKARANG'}
                  </button>
                </form>

                <div className="text-center mt-4 small text-muted">
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
