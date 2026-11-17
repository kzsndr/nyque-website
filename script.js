// NYQUE - interactivity

// Small helper: show a message popup
function toast(text) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = text;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 2200);
}

// Safe storage (works even if the browser blocks it)
function load(key, fallback) {
  try { var v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
  catch (e) { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

// INTERACTION 1: Add to cart (counter and total are remembered between pages)
var cart = load('nyqueCart', { count: 0, total: 0 });
function showCart() {
  var c = document.getElementById('cartCount');
  if (c) c.textContent = cart.count;
  var s = document.getElementById('cartSummary');
  if (s) s.textContent = cart.count + ' item(s) in cart. Total: $' + cart.total.toFixed(2);
}
document.querySelectorAll('.add-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    cart.count += 1;
    cart.total += parseFloat(btn.dataset.price);
    save('nyqueCart', cart);
    showCart();
    toast(btn.dataset.name + ' added to cart');
  });
});
var clear = document.getElementById('clearCart');
if (clear) clear.addEventListener('click', function () {
  cart = { count: 0, total: 0 }; save('nyqueCart', cart); showCart(); toast('Cart cleared');
});
showCart();

// INTERACTION 2: Filter products by label (Shop page)
document.querySelectorAll('.filters button').forEach(function (b) {
  b.addEventListener('click', function () {
    document.querySelectorAll('.filters button').forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on');
    document.querySelectorAll('.card').forEach(function (card) {
      var show = b.dataset.filter === 'all' || card.dataset.tag === b.dataset.filter;
      card.classList.toggle('hide', !show);
    });
  });
});

// INTERACTION 3: Wishlist hearts
document.querySelectorAll('.heart').forEach(function (h) {
  h.addEventListener('click', function () {
    h.classList.toggle('on');
    h.textContent = h.classList.contains('on') ? '\u2665' : '\u2661';
    toast(h.classList.contains('on') ? 'Saved to wishlist' : 'Removed from wishlist');
  });
});

// INTERACTION 4: Form validation (newsletter + contact)
function checkForm(form, msgEl, okText) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = null;
    form.querySelectorAll('input[required], textarea[required]').forEach(function (f) {
      if (!bad && f.value.trim() === '') bad = 'Please fill in the ' + f.dataset.label + '.';
      if (!bad && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) bad = 'Please enter a valid email address.';
    });
    msgEl.textContent = bad || okText;
    msgEl.className = 'msg ' + (bad ? 'err' : 'ok');
    if (!bad) form.reset();
  });
}
var nf = document.getElementById('newsForm');
if (nf) checkForm(nf, document.getElementById('newsMsg'), 'Thanks! You are on the list.');
var cf = document.getElementById('contactForm');
if (cf) checkForm(cf, document.getElementById('contactMsg'), 'Message sent. We reply within 24 hours.');

// INTERACTION 5: Mobile menu button
var mb = document.getElementById('menuBtn');
if (mb) mb.addEventListener('click', function () {
  document.getElementById('nav').classList.toggle('open');
});
