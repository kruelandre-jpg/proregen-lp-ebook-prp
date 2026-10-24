# E-book Leigo Proregen: processo reutilizável

Do pedido do André ("quero um e-book para pacientes sobre X") até o PDF entregue e a landing
page captando leads numa planilha. Base: e-books de joelho, coluna e PRP (out/2026).

## 0. Entradas (perguntar antes de começar)
- Tema e áreas que entram (ex.: "todas que aparecem na revisão").
- Tamanho (PRP: 8 a 10 páginas; coluna: 24).
- Campos do formulário (padrão: nome, WhatsApp, e-mail, cidade, queixa em lista + texto livre opcional, caixinha de consentimento desmarcada e obrigatória).
- Fonte científica inicial (revisão SciSpace, papers do Calímaco, análise do Orfeu).
- Onde guardar os leads (padrão: Google Sheets na conta kruel.andre@gmail.com).

## 1. Pesquisa e evidência
1. Salvar as fontes em `/workspace/ebook-<tema>-leigo/` (ex.: `scispace-p1-usos.md`).
2. Montar uma tabela área x força da evidência (0 a 5 bolinhas) x frase-resumo.
3. Conferir no PubMed os números e estudos que vão para o texto (E-utilities é grátis e rápido):
   `esearch.fcgi?db=pubmed&term=Autor[au]+tema` e `efetch...&rettype=abstract` para checar o dado.
   Nunca inventar citação ou número. Se não conferiu, não cita o número.
4. Classificar cada área em: boa evidência / moderada / conflitante / em estudo / sem benefício consistente.

## 2. Regras do texto leigo
- PT-BR, caloroso, frases curtas, "você". Termo técnico em negrito e explicado na hora.
- Sem travessão (em-dash). Conferir: `grep -c "—" ebook.html` deve dar 0.
- Sem promessa de cura, sem garantia, sem preço, sem antes e depois, sem depoimento (CFM).
- Honestidade: dizer onde não mostrou benefício. "Em estudo, com perspectivas promissoras" só quando há dado inicial favorável.
- Sempre: o que é, como é feito, o que esperar, segurança, quem é e quem não é candidato, FAQ, CTA (Bento Gonçalves ou online, WhatsApp (54) 99689-1295), referências curtas, aviso "não substitui consulta", CRM-RS 23627 · RQE 14323.
- Revisão de ética e precisão pela Têmis antes de entregar ao André.

## 2b. Regra de escopo CFM (obrigatória para material leigo e publicidade)
- PRP: a Resolução CFM nº 2.464/2026 (DOU 15/07/2026) autoriza só 4 indicações, como procedimento adjuvante:
  osteoartrite de joelho, discopatia lombar, epicondilite lateral do cotovelo e reparo meniscal.
- Material para paciente ou divulgação aborda SÓ as indicações autorizadas, com detalhe (como é feito, o que esperar, reabilitação).
- Demais áreas: um único bloco "Em pesquisa, fora das indicações autorizadas pelo CFM", só com nomes. Sem bolinhas, rótulos de força ou números.
- Art. 13: vedado prometer cura, garantir resultado, "regeneração assegurada", substituir cirurgia indicada ou alegar superioridade universal.
- Frase obrigatória: "procedimento médico auxiliar e complementar, não substitui tratamento clínico, reabilitação ou cirurgia indicada".
- Coluna (art. 7): dizer que é feito em hospital ou hospital-dia, guiado por imagem, por especialista com RQE habilitado.
- Antes de qualquer tema novo (não só PRP), procurar a resolução CFM vigente no portal.cfm.org.br / DOU e aplicar a mesma regra.
- No código (`src/build.py`): cada área tem `cfm=True/False`. Padrão = só CFM; `FULL=1 python3 src/build.py` gera a versão completa (uso interno).

## 2c. Pré-voo Têmis (antes de mostrar ao André)
Checklist: (1) só indicações autorizadas em destaque; (2) nenhum rótulo de evidência ou número fora delas;
(3) nenhuma promessa/garantia/superioridade; (4) frase de procedimento auxiliar presente; (5) sem preço, antes e depois, depoimento;
(6) CRM/RQE e aviso "não substitui consulta"; (7) referências conferidas (PubMed/Crossref: ano, volume, DOI); (8) zero travessões;
(9) a LP também segue (1) a (4) no texto, meta description e og:description.

## 3. Design (marca)
- Fonte da verdade: `/workspace/marca/LEIA-ME.md` e o manual em PDF. #66B2E0, #3A3C38, #FFFFFF, Sora, sem logo de IA.
- Reaproveitar o kit: `src/style.css`, `src/svgs.py` (arcos da capa), `assets/` (Sora TTF + logos SVG `logo-h-dark` para fundo escuro, `logo-h-light` para fundo claro).
- Componentes: `.page` A4, `.eyebrow`, `h1 .b` (destaque azul), `.card`, `.chip` (`warn` em estudo, `out` sem benefício), `dots(n)`, `.step`, `.faq`, `.redflag`, `.callout`, `.toc`.
- Estrutura de 10 páginas usada no PRP: capa escura / boas-vindas + sumário / como é feito / mapa da evidência / 3 páginas por região / segurança e candidatos / FAQ + CTA / referências + contato.

## 4. Gerar e checar o PDF
```
cd src && python3 build.py            # gera ebook.html
google-chrome --headless=new --no-sandbox --no-pdf-header-footer \
  --print-to-pdf=../out/Ebook-Proregen-<Tema>.pdf file://$PWD/ebook.html
pdfinfo ../out/*.pdf | grep Pages
pdftoppm -r 50 -png ../out/*.pdf ../out/preview
```
Montar um contact sheet (PIL) e olhar: texto cortado no rodapé, card estourando, página em branco, logo errado no fundo.

## 5. Landing page
1. Copiar a LP anterior: `cp -r /workspace/proregen-lp-ebook-prp /workspace/proregen-lp-ebook-<tema>`.
2. Trocar títulos, meta, cards de benefícios, nome do PDF e mensagens de WhatsApp em `index.html`.
3. `config.js`: `appsScriptUrl`, `ebookUrl`, `origem`.
4. Nota LGPD curta sob o botão. Consentimento desmarcado e obrigatório.
5. Screenshot desktop (1280) e mobile (390) com Chrome headless para revisar.

## 6. Planilha + Apps Script
1. Criar a planilha pelo conector Google Drive (`create_file`, CSV com cabeçalho, targetMimeType spreadsheet).
2. O conector não implanta Apps Script. Passo de navegador (André ou bot no desktop logado):
   Extensões > Apps Script > colar `apps-script/Code.gs` > Implantar > App da Web > Executar como Eu, Acesso Qualquer pessoa > autorizar > copiar URL `/exec`.
3. Colar a URL em `config.js` e dar push.
Alternativa já usada (joelho/coluna): Google Forms + entry IDs (sem script, mas sem visual de marca no Form; a LP posta no `formResponse`).

## 7. Publicar
- Repo `kruelandre-jpg/proregen-lp-ebook-<tema>` (gh já autenticado no box).
- GitHub Pages grátis exige repo público: `gh repo edit --visibility public --accept-visibility-change-consequences`, depois
  `gh api repos/kruelandre-jpg/<repo>/pages -X POST -f "source[branch]=main" -f "source[path]=/"`.
- Só publicar depois do teste ponta a ponta (ou com aviso claro ao André).

## 8. Testar
- Enviar um lead "TESTE" pela página publicada; conferir a linha na planilha; baixar o PDF; apagar a linha de teste.
- Testar validação: sem consentimento não envia; WhatsApp sem DDD dá erro.

## 9. Entrega
- Para o André: PDF, prévias, link da LP, link da planilha, pendências.
- Leads: Peitho trata (WhatsApp de negócio é dela). CRM pode ser ligado depois à planilha.
- Registrar no Ledger/Notion e no proregen-cerebro (wiki/marca ou wiki/produtos).

## Lições aprendidas
- CFM 2.464/2026: a primeira versão do e-book de PRP cobria 13 áreas com rótulos de evidência; foi refeita para as 4 autorizadas. Checar a resolução ANTES de escrever.
- Páginas com poucos cards ficam vazias: completar com caixas "como é feito / depois" e callouts (candidatos, o que não faz, reabilitação, sinais de alerta).
- Em build.py, não reutilizar o nome `A` (caminho dos assets) para função: quebrou o logo da última página.
- Conferir números no PubMed custa segundos e evita erro (ex.: Meznerics 2022, OR 5,32 para fechamento completo de ferida: conferido no resumo).
- Revisões do SciSpace citam fontes antigas (2007, 2012); priorizar 2018 em diante e marcar o que é antigo.
- Aplicações perioperatórias (manguito, LCA) e Aquiles: dizer com clareza "sem benefício consistente".
- O Chrome headless já vem no box; não precisa Playwright para PDF.
- `git config user.name/email` local no repo novo (copiar do proregen-cerebro: Fausto, noreply).
- Apps Script é o único passo que exige navegador logado; deixar o modo teste ativo enquanto a URL está vazia.
