(function () {
  var hdr = document.getElementById('hdr');
  var burger = document.querySelector('.burger');
  var mnav = document.getElementById('mnav');

  function setMenu(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mnav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 1040) setMenu(false); });

  function onScroll() { hdr.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // quote form: builds an e-mail in the visitor's mail program
  var form = document.getElementById('cform');
  if (form) {
    var err = form.querySelector('.f-err');
    var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };
    // clear the red state while the visitor fixes the fields
    form.addEventListener('input', function (e) {
      var f = form.elements, el = e.target;
      if (el === f.name && f.name.value.trim()) f.name.classList.remove('bad');
      if (el === f.phone || el === f.email) {
        var ph = f.phone.value.trim(), em = f.email.value.trim();
        if (em ? emailOk(em) : ph) { f.phone.classList.remove('bad'); f.email.classList.remove('bad'); }
        else if (ph && !em) f.phone.classList.remove('bad');
      }
      if (!form.querySelector('.bad')) err.hidden = true;
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, bad = [];
      [f.name, f.phone, f.email].forEach(function (el) { el.classList.remove('bad'); });
      if (!f.name.value.trim()) bad.push(f.name);
      var phone = f.phone.value.trim(), email = f.email.value.trim();
      if (!phone && !email) { bad.push(f.phone, f.email); }
      else if (email && !emailOk(email)) bad.push(f.email);
      if (bad.length) {
        bad.forEach(function (el) { el.classList.add('bad'); });
        err.textContent = !f.name.value.trim() ? 'Podaj imię i nazwisko oraz telefon lub e-mail.' : 'Podaj telefon lub poprawny adres e-mail, żebyśmy mogli odpowiedzieć.';
        err.hidden = false; bad[0].focus(); return;
      }
      err.hidden = true;
      var place = f.place.value.trim(), size = f.size.value.trim(), msg = f.msg.value.trim();
      var details = [
        'Imię i nazwisko: ' + f.name.value.trim(),
        phone ? 'Telefon: ' + phone : '',
        email ? 'E-mail: ' + email : '',
        place ? 'Lokalizacja działki: ' + place : '',
        size ? 'Powierzchnia lub wymiary: ' + size : ''
      ].filter(function (l) { return l !== ''; });
      var lines = ['Dzień dobry,', '', 'proszę o wycenę: ' + f.type.value + '.', ''].concat(details);
      if (msg) lines.push('', msg);
      var body = lines.join('\n');
      var subject = 'Zapytanie o wycenę: ' + f.type.value;
      window.location.href = 'mailto:' + form.getAttribute('data-mail') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
