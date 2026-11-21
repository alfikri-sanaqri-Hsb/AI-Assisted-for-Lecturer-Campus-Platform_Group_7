const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

// Template email reset password (HTML) — kode tampil besar di dalam kotak.
function resetEmailHtml(code) {
  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
        <tr><td style="background-color:#1e40af;padding:24px 32px;">
          <div style="color:#ffffff;font-size:22px;font-weight:bold;">Sahabat AlFaRy</div>
          <div style="color:#bfdbfe;font-size:13px;margin-top:4px;">Platform Belajar &amp; Tryout</div>
        </td></tr>
        <tr><td style="padding:32px;">
          <h1 style="font-size:20px;color:#0f172a;margin:0 0 16px;">Reset Password</h1>
          <p style="font-size:15px;color:#334155;line-height:1.6;margin:0 0 8px;">Halo,</p>
          <p style="font-size:15px;color:#334155;line-height:1.6;margin:0 0 24px;">Kamu meminta reset password akun Sahabat AlFaRy. Masukkan kode di bawah ini di aplikasi untuk melanjutkan:</p>
          <div style="text-align:center;margin:0 0 24px;">
            <div style="display:inline-block;background-color:#eff6ff;border:2px dashed #2563eb;border-radius:10px;padding:18px 32px;">
              <span style="font-family:'Courier New',monospace;font-size:36px;font-weight:bold;letter-spacing:8px;color:#1e40af;">${code}</span>
            </div>
          </div>
          <p style="font-size:14px;color:#64748b;line-height:1.6;margin:0 0 8px;">Kode berlaku <b>10 menit</b>. Jangan berikan kode ini ke siapa pun &mdash; tim Sahabat AlFaRy tidak pernah meminta kode reset password kamu.</p>
          <p style="font-size:14px;color:#64748b;line-height:1.6;margin:0;">Kalau kamu tidak meminta reset password, abaikan email ini. Akun kamu tetap aman.</p>
        </td></tr>
        <tr><td style="background-color:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
          <p style="font-size:12px;color:#94a3b8;margin:0;">Email ini dikirim otomatis, mohon tidak dibalas.<br>&copy; 2026 Sahabat AlFaRy</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Kirim kode reset ke email. Kalau SMTP belum disetel, kode hanya tampil
// di log server (penolong darurat saat demo) — pasang SMTP sebelum dipakai beneran.
async function sendResetCode(email, code) {
  const tx = getTransporter();
  if (!tx) {
    console.log(`[RESET-CODE] ${email} -> ${code} (SMTP belum disetel, kode hanya di log)`);
    return { sent: false, demoCode: code };
  }
  await tx.sendMail({
    from: `"Sahabat AlFaRy" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Kode reset password Sahabat AlFaRy',
    text: `Kode reset password kamu: ${code}\nKode berlaku 10 menit. Jangan berikan kode ini ke siapa pun.`,
    html: resetEmailHtml(code),
  });
  return { sent: true };
}

module.exports = { sendResetCode };