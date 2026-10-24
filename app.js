(function () {
  'use strict';

  var cfg = window.LP_CONFIG || {};
  var form = document.getElementById('lead-form');
  var formWrap = document.getElementById('form-wrap');
  var thanks = document.getElementById('thank-you');
  var submitBtn = document.getElementById('submit-btn');
  var downloadBtn = document.getElementById('download-ebook');
  var bookCta = document.getElementById('book-cta');
  var bookCtaThanks = document.getElementById('book-cta-thanks');
  var waLinks = document.querySelectorAll('[data-wa]');

  var ebookUrl = cfg.ebookUrl || 'assets/Ebook-Proregen-PRP-Guia-Pacientes.pdf';
  var bookUrl = cfg.bookUrl || 'https://www.editoragente.com.br/doi-aqui--7520/p';
  var waNumber = (cfg.whatsappClinic || '54996891295').replace(/\D/g, '');

  if (downloadBtn) downloadBtn.href = ebookUrl;
  if (bookCta) bookCta.href = bookUrl;
  if (bookCtaThanks) bookCtaThanks.href = bookUrl;

  waLinks.forEach(function (el) {
    var msg = el.getAttribute('data-wa-msg') || 'Olá! Vi o ebook PRP e gostaria de saber mais.';
    el.href = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(msg);
  });

  document.querySelectorAll('a[href="#formulario"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById('formulario');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  function digitsOnly(v) {
    return String(v || '').replace(/\D/g, '');
  }

  function formatWhatsApp(raw) {
    var d = digitsOnly(raw).slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 7) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  var waInput = document.getElementById('whatsapp');
  if (waInput) {
    waInput.addEventListener('input', function () {
      var pos = waInput.selectionStart;
      var before = waInput.value.length;
      waInput.value = formatWhatsApp(waInput.value);
      var after = waInput.value.length;
      try { waInput.setSelectionRange(pos + (after - before), pos + (after - before)); } catch (_) {}
    });
  }

  function validate(data) {
    var errors = {};
    if (!data.nome || data.nome.trim().length < 3) errors.nome = 'Informe seu nome completo.';
    var wa = digitsOnly(data.whatsapp);
    if (wa.length < 10 || wa.length > 11) errors.whatsapp = 'Informe um WhatsApp válido com DDD.';
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Informe um e-mail válido.';
    if (!data.cidade || data.cidade.trim().length < 2) errors.cidade = 'Informe sua cidade.';
    if (!data.queixa) errors.queixa = 'Selecione uma opção.';
    if (!data.consentimento) errors.consentimento = 'Marque a autorização para receber o material.';
    return errors;
  }

  function showFieldErrors(errors) {
    ['nome', 'whatsapp', 'email', 'cidade', 'queixa', 'consentimento'].forEach(function (field) {
      var el = document.getElementById('err-' + field);
      var input = document.getElementById(field);
      if (el) { el.textContent = errors[field] || ''; el.hidden = !errors[field]; }
      if (input) {
        if (errors[field]) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      }
    });
  }

  function submitLead(data) {
    var url = (cfg.appsScriptUrl || '').trim();
    if (!url) { console.warn('[Proregen LP] appsScriptUrl vazio: modo teste, nada enviado.'); return Promise.resolve({ skipped: true }); }
    var params = new URLSearchParams();
    params.append('nome', data.nome.trim());
    params.append('whatsapp', digitsOnly(data.whatsapp));
    params.append('email', data.email.trim());
    params.append('cidade', data.cidade.trim());
    params.append('queixa', data.queixa);
    params.append('detalhe', (data.detalhe || '').trim());
    params.append('consentimento', data.consentimento ? 'Sim' : 'Nao');
    params.append('origem', cfg.origem || 'lp-ebook-prp');
    params.append('website', data.website || '');
    // text/plain-free simple request: urlencoded + no-cors avoids CORS preflight
    return fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() });
  }

  function revealThankYou() {
    if (formWrap) formWrap.hidden = true;
    if (thanks) {
      thanks.hidden = false;
      thanks.setAttribute('tabindex', '-1');
      thanks.focus({ preventScroll: true });
      thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var v = function (id) { return (document.getElementById(id) || {}).value || ''; };
      var data = {
        nome: v('nome'), whatsapp: v('whatsapp'), email: v('email'), cidade: v('cidade'),
        queixa: v('queixa'), detalhe: v('detalhe'), website: v('website'),
        consentimento: !!(document.getElementById('consentimento') || {}).checked
      };

      var errors = validate(data);
      showFieldErrors(errors);
      if (Object.keys(errors).length) {
        var firstKey = Object.keys(errors)[0];
        var firstEl = document.getElementById(firstKey);
        if (firstEl) firstEl.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando…';
      }

      submitLead(data)
        .catch(function (err) {
          console.warn('[Proregen LP] Form submit warning:', err);
        })
        .then(function () {
          revealThankYou();
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Baixar o ebook grátis';
          }
        });
    });
  }
})();
