# Landing Page: ebook PRP, guia para pacientes (Proregen)

Página estática: captura de lead (nome, WhatsApp, e-mail, cidade, queixa, detalhe opcional,
consentimento obrigatório e desmarcado) e entrega do PDF `assets/Ebook-Proregen-PRP-Guia-Pacientes.pdf`.

## Fluxo
Formulário -> `app.js` valida -> POST urlencoded (no-cors) para `config.js > appsScriptUrl`
(Google Apps Script Web App) -> `apps-script/Code.gs` grava uma linha na planilha
**Leads - Ebook PRP Proregen** -> página mostra o agradecimento e o botão de download.

Com `appsScriptUrl` vazio a página roda em modo teste (não envia nada).

## Planilha
https://docs.google.com/spreadsheets/d/1cfcHaUQelwNmGrEfqD4_i6BgRycQfxY6FJNOnxtzkfY/edit
Colunas: Data/hora, Nome, WhatsApp, E-mail, Cidade, Queixa principal, Detalhe da queixa, Consentimento mensagens, Origem.

## Ligar o Apps Script (uma vez, no navegador logado em kruel.andre@gmail.com)
1. Abrir a planilha > Extensões > Apps Script.
2. Apagar o conteúdo e colar `apps-script/Code.gs`. Salvar.
3. Implantar > Nova implantação > App da Web. Executar como: **Eu**. Acesso: **Qualquer pessoa**.
4. Autorizar (tela "app não verificado" > Avançado > Acessar). Copiar a URL que termina em `/exec`.
5. Colar em `config.js > appsScriptUrl`, commit e push.
6. Testar: enviar um lead "TESTE" e conferir a linha na planilha. Apagar a linha de teste.

## Segurança
Sem segredos no repo (a URL /exec só aceita gravar linhas). Honeypot `website` contra bots,
sanitização contra injeção de fórmula, LockService contra escrita concorrente.

## Marca
#66B2E0 · #3A3C38 · #FFFFFF · Sora. Contato: Dr. André Kruel, CRM-RS 23627, RQE 14323, WhatsApp (54) 99689-1295.
