# Employee Movement Report Automation (Google Sheets → Slack)

*A Google Apps Script that helps HR and IT teams automate employee onboarding and offboarding notifications from Google Sheets to Slack.*

---

## Overview (EN)
This script automatically:
- Tracks HR, IT, Exit, and Offboarding Sheets in Google Sheets.
- Sends formatted Slack messages when rows are approved or marked as complete.
- Locks processed rows to prevent accidental edits.
- Simplifies process tracking for HR and IT teams.
> *Note:* The script includes generic fields for disabling access to various internal systems (e.g., version control, issue tracking, communication tools).  
> Specific tool names have been anonymized for security reasons.

### Key Features
- ✅ Automatic Slack notifications for HR & IT changes  
- ✅ Google Sheets integration via Apps Script  
- ✅ Row locking to prevent accidental edits  
- ✅ Easy to adapt for different teams and workflows  

## Quick Setup (EN)
1. In **Apps Script → Project Settings → Script properties**, add:
   - `SLACK_WEBHOOK_URL` = (your Slack Incoming Webhook URL)
2. Adjust sheet names or columns in the `CONFIG` section if needed.
3. The trigger runs automatically on **onEdit** events.

---

## Genel Bakış (TR)
Bu script, HR ve IT ekiplerinin iş yükünü azaltmak için:
- HR, IT, Exit ve Offboarding listelerini izler.
- Satır onaylandığında Slack’e biçimlendirilmiş bildirim gönderir.
- İşlenen satırları kilitleyerek yanlışlıkla değişiklikleri önler.
- HR ve IT ekipleri için süreç takibini kolaylaştırır.
> *Not:* Script, kurum içi sistemlere (ör. sürüm kontrolü, görev yönetimi, iletişim araçları vb.) erişimi kapatmaya yönelik genel alanlar içerir.  
> Güvenlik nedeniyle belirli araç isimleri anonimleştirilmiştir.

### Temel Özellikler
- ✅ HR ve IT değişikliklerinde otomatik Slack bildirimi  
- ✅ Google Sheets entegrasyonu (Apps Script ile)  
- ✅ Yanlışlıkla düzenlemeleri önlemek için satır kilitleme  
- ✅ Farklı ekip ve süreçlere kolayca uyarlanabilir  

## Hızlı Kurulum (TR)
1. **Apps Script → Project Settings → Script properties** bölümüne ekleyin:
   - `SLACK_WEBHOOK_URL` = (Slack Webhook adresiniz)
2. Gerekirse `CONFIG` bölümünde sayfa adlarını veya sütun numaralarını düzenleyin.
3. Script otomatik olarak **onEdit** tetikleyicisiyle çalışır.

---

**License:** MIT
