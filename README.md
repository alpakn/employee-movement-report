# Employee Movement Report (Google Sheets → Slack)

*A Google Apps Script that helps HR and IT teams automate employee onboarding and offboarding notifications from Google Sheets to Slack.*

---

## Overview (EN)
This script automatically:
- Tracks HR, IT, Exit, and Offboarding Sheets in Google Sheets.
- Sends formatted Slack messages when rows are approved or marked as complete.
- Locks processed rows to prevent accidental edits.
- Simplifies process tracking for HR and IT teams.

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

## Hızlı Kurulum (TR)
1. **Apps Script → Project Settings → Script properties** bölümüne ekleyin:
   - `SLACK_WEBHOOK_URL` = (Slack Webhook adresiniz)
2. Gerekirse `CONFIG` bölümünde sayfa adlarını veya sütun numaralarını düzenleyin.
3. Script otomatik olarak **onEdit** tetikleyicisiyle çalışır.

---

**License:** MIT
