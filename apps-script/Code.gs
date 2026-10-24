/**
 * Proregen: recebe leads da LP do ebook PRP e grava na planilha.
 * Colar em: planilha "Leads - Ebook PRP Proregen" > Extensões > Apps Script.
 * Implantar > Nova implantação > Tipo: App da Web
 *   Executar como: Eu (kruel.andre@gmail.com) | Quem pode acessar: Qualquer pessoa
 * Copiar a URL /exec para config.js > appsScriptUrl.
 */
var SHEET_NAME = ''; // vazio = primeira aba

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.website) return out_({ ok: true }); // honeypot anti-bot
  if (!p.nome || !p.email || !p.whatsapp || p.consentimento !== 'Sim') return out_({ ok: false, error: 'campos' });
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
    sh.appendRow([
      Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd HH:mm:ss'), clean_(p.nome), clean_(p.whatsapp), clean_(p.email), clean_(p.cidade),
      clean_(p.queixa), clean_(p.detalhe), p.consentimento, clean_(p.origem)
    ]);
  } finally { lock.releaseLock(); }
  return out_({ ok: true });
}

function doGet() { return out_({ ok: true, service: 'proregen-lp-ebook-prp' }); }

// evita injeção de fórmula na planilha
function clean_(v) { v = String(v || '').slice(0, 500); return /^[=+\-@]/.test(v) ? "'" + v : v; }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
