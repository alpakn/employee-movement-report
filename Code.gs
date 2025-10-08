const CONFIG = {
  // Slack webhook kodda tutulmaz. Apps Script > Project Settings > Script properties:
  // Key: SLACK_WEBHOOK_URL, Value: <your webhook>
  SHEETS: {
    HR: "HR Onboarding",
    IT: "IT Onboarding",
    EXIT: "Employee Exit List",
    OFFBOARD: "Offboarding Checklist",
  },
  TRIGGERS: {
    HR: 7,    // G
    IT: 14,   // N
    EXIT: 5,  // E
    OFFBOARD: 12, // L
  },
  REQUIRED_CHECKBOXES: {
    IT: [15, 16, 17],   // O, P, Q (1-based)
    OFFBOARD: [13, 14], // M, N (1-based)
  },
  SYNC_GROUPS: [
    ["HR Onboarding", "IT Onboarding"],
    ["Employee Exit List", "Offboarding Checklist"],
  ],
  // Paylaşım için placeholder adresler — istersen kendi ekibini eklersin
  PROTECTED_EDITORS: [
    "it-admin@example.com",
    "hr-admin@example.com",
    "it-lead@example.com",
    "admin@example.com",
  ],
};

// ---- Secrets ----
function getSecret(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

// 1) Main trigger
function onEdit(e) {
  if (!e || !e.range) return;

  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();
  const range = e.range;
  const row = range.getRow();
  const col = range.getColumn();

  // A) Name sync across grouped sheets (add/remove)
  if (col === 1 && row > 1) {
    if (e.value) {
      syncNameWithinGroup(e.source, row, e.value, sheetName);
    } else {
      deleteNameFromGroup(e.source, row, sheetName);
    }
  }

  // B) Business triggers
  handleTriggers(sheet, sheetName, range, row, col);
}

// 2) Sync helpers
function syncNameWithinGroup(ss, row, value, sourceSheetName) {
  const group = CONFIG.SYNC_GROUPS.find(g => g.includes(sourceSheetName));
  const withHeader = ["IT Onboarding"]; // has an extra header row

  if (!group) return;

  group.forEach(name => {
    if (name === sourceSheetName) return;
    const sh = ss.getSheetByName(name);
    if (!sh) return;
    const targetRow = withHeader.includes(name) ? row + 1 : row;
    sh.getRange(targetRow, 1).setValue(value);
  });
}

function deleteNameFromGroup(ss, row, sourceSheetName) {
  const group = CONFIG.SYNC_GROUPS.find(g => g.includes(sourceSheetName));
  const withHeader = ["IT Onboarding"];
  if (!group) return;

  group.forEach(name => {
    if (name === sourceSheetName) return;
    const sh = ss.getSheetByName(name);
    if (!sh) return;
    const targetRow = withHeader.includes(name) ? row + 1 : row;
    sh.getRange(targetRow, 1).clearContent();
  });
}

// 3) Trigger router
function handleTriggers(sheet, sheetName, range, row, col) {
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

  // HR
  if (sheetName === CONFIG.SHEETS.HR && col === CONFIG.TRIGGERS.HR && range.getValue() === true) {
    sendSlackNotification({
      text: "🎉 NEW EMPLOYEE (HR)",
      color: "#36a64f",
      fields: [
        { title: "Full Name", value: rowData[0] || "-" },
        { title: "Preferred Name", value: rowData[1] || "-" },
        { title: "Department", value: rowData[2] || "-" },
        { title: "Employment Type", value: rowData[3] || "-" },
        { title: "Start Date", value: formatDate(rowData[4]) || "-" },
        { title: "Notes", value: rowData[5] || "None" },
      ],
    });
    lockRow(sheet, row);
  }

  // IT
  else if (sheetName === CONFIG.SHEETS.IT && col === CONFIG.TRIGGERS.IT && range.getValue() === true) {
    if (!checkRequirements(rowData, CONFIG.REQUIRED_CHECKBOXES.IT)) {
      showToast("❌ Liste IT ekibi tarafından onaylanmalı!");
      return;
    }
    sendSlackNotification({
      text: "💻 IT SETUP CHECKLIST",
      color: "#2968c8",
      fields: [
        { title: "Name-Surname", value: rowData[0] || "-" },
        { title: "Username", value: rowData[1] || "-" },
        { title: "Temp Pass (W)", value: rowData[2] || "-" },
        { title: "Email", value: rowData[3] || "-" },
        { title: "Temp Pass (@)", value: rowData[4] || "-" },
        { title: "Slack Invited", value: rowData[5] ? "✅" : "❌" },
        { title: "VPN", value: rowData[6] ? "✅" : "❌" },
        { title: "Issue Tracker Username", value: rowData[7] || "-" },
        { title: "Temp Pass (Issue Tracker)", value: rowData[8] || "-" },
        { title: "Game Platform Access", value: rowData[9] ? "✅" : "❌" },
        { title: "Folder Access", value: rowData[10] || "-" },
        { title: "PC Ready", value: rowData[11] ? "✅" : "❌" },
        { title: "Notes", value: rowData[12] || "None" },
      ],
    });
    lockRow(sheet, row);
  }

  // EXIT
  else if (sheetName === CONFIG.SHEETS.EXIT && col === CONFIG.TRIGGERS.EXIT && range.getValue() === true) {
    sendSlackNotification({
      text: "🚪 EMPLOYEE EXIT",
      color: "#ff0000",
      fields: [
        { title: "Name-Surname", value: rowData[0] || "-" },
        { title: "Department", value: rowData[1] || "-" },
        { title: "Exit Date", value: formatDate(rowData[2]) || "-" },
        { title: "Notes", value: rowData[3] || "None" },
      ],
    });
    lockRow(sheet, row);
  }

  // OFFBOARD
  else if (sheetName === CONFIG.SHEETS.OFFBOARD && col === CONFIG.TRIGGERS.OFFBOARD && range.getValue() === true) {
    if (!checkRequirements(rowData, CONFIG.REQUIRED_CHECKBOXES.OFFBOARD)) {
      showToast("❌ Lütfen tüm offboarding adımlarını tamamlayın!");
      return;
    }
    sendSlackNotification({
      text: "📦 OFFBOARDING COMPLETED",
      color: "#ff8000",
      fields: [
        { title: "Name-Surname", value: rowData[0] || "-" },
        { title: "Domain Disabled", value: rowData[1] ? "✅" : "❌" },
        { title: "Email Deactivated", value: rowData[2] ? "✅" : "❌" },
        { title: "Slack Removed", value: rowData[3] ? "✅" : "❌" },
        { title: "VPN Revoked", value: rowData[4] ? "✅" : "❌" },
        { title: "Source Control Disabled", value: rowData[5] ? "✅" : "❌" },     // neutral
        { title: "Issue Tracker Deactivated", value: rowData[6] ? "✅" : "❌" },   // neutral
        { title: "Game Platform Removed", value: rowData[7] ? "✅" : "❌" },       // neutral
        { title: "Community Platform Removed", value: rowData[8] ? "✅" : "❌" },  // neutral
        { title: "PC Returned", value: rowData[9] ? "✅" : "❌" },
        { title: "Notes", value: rowData[10] || "None" },
      ],
    });
    lockRow(sheet, row);
  }
}

// 4) Lock processed row
function lockRow(sheet, row) {
  try {
    const range = sheet.getRange(row, 1, 1, sheet.getLastColumn());
    const protection = range.protect()
      .setDescription(`Locked_${sheet.getName()}_Row${row}_${new Date().toISOString()}`);

    CONFIG.PROTECTED_EDITORS.forEach(email => {
      try { protection.addEditor(email); } catch (_) {}
    });

    protection.getEditors().forEach(ed => {
      if (!CONFIG.PROTECTED_EDITORS.includes(ed.getEmail())) protection.removeEditor(ed);
    });

    range.setBackground("#FFF8E1")
         .setNote("🔒 " + new Date().toLocaleString() + " tarihinde kilitlendi");
  } catch (err) {
    console.error("Satır kilitlenirken hata:", err);
    SpreadsheetApp.getActiveSpreadsheet().toast(
      "Satır kilitlenemedi! Lütfen IT ile iletişime geçin.",
      "Hata",
      5
    );
  }
}

// 5) Utils
function checkRequirements(rowData, requiredColumns) {
  return requiredColumns.every(c => rowData[c - 1] === true);
}

function showToast(message) {
  SpreadsheetApp.getActive().toast(message, "Uyarı", 5);
}

function sendSlackNotification(params) {
  const webhook = getSecret("SLACK_WEBHOOK_URL");
  if (!webhook) throw new Error("Missing Script Property: SLACK_WEBHOOK_URL");

  const allFieldsText = params.fields.map(f => `*${f.title}:* ${f.value}`).join("\n");
  const payload = {
    text: params.text,
    attachments: [{
      color: params.color,
      text: allFieldsText,
      footer: "Last update: " + formatDate(new Date()),
      ts: Math.floor(Date.now() / 1000),
    }],
  };

  UrlFetchApp.fetch(webhook, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  });
}

function formatDate(date) {
  if (!date) return "-";
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "dd/MM/yyyy");
}
