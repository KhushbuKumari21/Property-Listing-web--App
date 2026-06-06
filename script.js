
// ── STATE ──
let userType = 'seller';
let currentPropertyForInterest = '';
let sellerProperties = [];
const sampleProperties = [
  { id: 1, title: 'Luxury Villa', price: 5000000, area: 3500, bedrooms: 4, bathrooms: 3, nearby: 'Hospital, School, Park' },
  { id: 2, title: 'Modern Apartment', price: 2000000, area: 1200, bedrooms: 2, bathrooms: 2, nearby: 'Mall, Metro, Gym' },
  { id: 3, title: 'Cozy Studio', price: 800000, area: 550, bedrooms: 1, bathrooms: 1, nearby: 'Cafe, Library, Bus Stop' },
  { id: 4, title: 'Penthouse Suite', price: 12000000, area: 5000, bedrooms: 5, bathrooms: 4, nearby: 'Airport, Club, Beach' },
];

// ── TOAST ──
function toast(msg, type = '') {
  const wrap = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ── TYPE SELECT ──
function selectType(type) {
  userType = type;
  document.getElementById('userType').value = type;
  document.getElementById('opt-seller').classList.toggle('active', type === 'seller');
  document.getElementById('opt-buyer').classList.toggle('active', type === 'buyer');
}

// ── REGISTER ──
function handleRegister() {
  const fn = document.getElementById('firstName').value.trim();
  const ln = document.getElementById('lastName').value.trim();
  const em = document.getElementById('email').value.trim();
  const ph = document.getElementById('phone').value.trim();
  if (!fn || !ln || !em || !ph) { toast('Please fill in all fields.', 'danger'); return; }
  if (!em.includes('@')) { toast('Enter a valid email.', 'danger'); return; }

  document.getElementById('step1').style.display = 'none';
  if (userType === 'seller') {
    document.getElementById('sellerSection').classList.remove('section-hidden');
  } else {
    document.getElementById('buyerSection').classList.remove('section-hidden');
    loadProperties(sampleProperties);
  }
  toast(`Welcome, ${fn}! 👋`, 'success');
}

// ── POST PROPERTY ──
function postProperty() {
  const title = document.getElementById('propertyTitle').value.trim();
  const price = document.getElementById('price').value;
  const area = document.getElementById('area').value;
  const bedrooms = document.getElementById('bedrooms').value;
  const bathrooms = document.getElementById('bathrooms').value;
  const nearby = document.getElementById('nearbyFacilities').value.trim();

  if (!title || !price || !area || !bedrooms || !bathrooms) {
    toast('Please fill in all fields.', 'danger'); return;
  }

  const prop = { id: Date.now(), title, price: Number(price), area: Number(area), bedrooms: Number(bedrooms), bathrooms: Number(bathrooms), nearby };
  sellerProperties.push(prop);
  renderSellerProperties();

  document.getElementById('propertyTitle').value = '';
  document.getElementById('price').value = '';
  document.getElementById('area').value = '';
  document.getElementById('bedrooms').value = '';
  document.getElementById('bathrooms').value = '';
  document.getElementById('nearbyFacilities').value = '';
  toast('Property posted successfully! ✅', 'success');
}

function renderSellerProperties() {
  const list = document.getElementById('sellerPropertiesList');
  if (sellerProperties.length === 0) {
    list.innerHTML = '<div class="empty"><span class="empty-icon">📋</span><p>No properties posted yet.</p></div>';
    return;
  }
  list.innerHTML = sellerProperties.map(p => buildPropertyCard(p, true)).join('');
}

// ── LOAD / FILTER BUYER PROPERTIES ──
function loadProperties(props) {
  const list = document.getElementById('propertyList');
  if (!props.length) {
    list.innerHTML = '<div class="empty"><span class="empty-icon">🔍</span><p>No properties match your filters.</p></div>';
    return;
  }
  list.innerHTML = props.map(p => buildPropertyCard(p, false)).join('');
}

function applyFilters() {
  const maxP = document.getElementById('filterPrice').value;
  const minB = document.getElementById('filterBedrooms').value;
  let filtered = sampleProperties.filter(p => {
    if (maxP && p.price > Number(maxP)) return false;
    if (minB && p.bedrooms < Number(minB)) return false;
    return true;
  });
  loadProperties(filtered);
  toast(`Showing ${filtered.length} propert${filtered.length === 1 ? 'y' : 'ies'}`, 'success');
}

function resetFilters() {
  document.getElementById('filterPrice').value = '';
  document.getElementById('filterBedrooms').value = '';
  loadProperties(sampleProperties);
}

// ── BUILD CARD HTML ──
function buildPropertyCard(p, isSeller) {
  const nearbyTags = p.nearby ? p.nearby.split(',').map(n => `<span>${n.trim()}</span>`).join('') : '';
  const sellerBtns = isSeller ? `
    <button class="btn btn-outline btn-sm" onclick="editProperty(${p.id})">✏ Edit</button>
    <button class="btn btn-danger btn-sm" onclick="deleteProperty(${p.id})">✕ Delete</button>
  ` : '';
  return `
  <div class="property-card" id="card-${p.id}">
    <div class="property-header">
      <h3>${p.title}</h3>
      <span class="price-badge">₹${p.price.toLocaleString('en-IN')}</span>
    </div>
    <div class="property-meta">
      <span class="meta-pill">
        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        ${p.bedrooms} Bed
      </span>
      <span class="meta-pill">
        <svg viewBox="0 0 24 24"><path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2"/></svg>
        ${p.bathrooms} Bath
      </span>
      <span class="meta-pill">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
        ${p.area.toLocaleString()} sq ft
      </span>
    </div>
    ${nearbyTags ? `<div class="nearby-tag">Nearby: ${nearbyTags}</div>` : ''}
    <div class="property-actions">
      <button class="btn btn-success btn-sm" onclick="openInterestModal('${p.title.replace(/'/g,'')}')">🤝 I'm Interested</button>
      <button class="btn btn-outline btn-sm like-btn" id="like-${p.id}" onclick="likeProperty(${p.id}, this)">♡ Like</button>
      <span class="like-count" id="lc-${p.id}">0 likes</span>
      ${sellerBtns}
    </div>
  </div>`;
}

// ── LIKE ──
function likeProperty(id, btn) {
  const lc = document.getElementById('lc-' + id);
  const card = btn.closest('.property-card');
  let count = parseInt(lc.dataset.count || '0') + 1;
  lc.dataset.count = count;
  lc.textContent = count + (count === 1 ? ' like' : ' likes');
  btn.textContent = '♥ Liked';
  btn.style.color = '#e05252';
  btn.style.borderColor = 'rgba(224,82,82,0.3)';
  btn.disabled = true;
}

// ── EDIT / DELETE ──
function editProperty(id) {
  const idx = sellerProperties.findIndex(p => p.id === id);
  if (idx === -1) return;
  const p = sellerProperties[idx];
  document.getElementById('propertyTitle').value = p.title;
  document.getElementById('price').value = p.price;
  document.getElementById('area').value = p.area;
  document.getElementById('bedrooms').value = p.bedrooms;
  document.getElementById('bathrooms').value = p.bathrooms;
  document.getElementById('nearbyFacilities').value = p.nearby;
  sellerProperties.splice(idx, 1);
  renderSellerProperties();
  toast('Editing property — update and repost.', '');
}

function deleteProperty(id) {
  sellerProperties = sellerProperties.filter(p => p.id !== id);
  renderSellerProperties();
  toast('Property removed.', 'danger');
}

// ── INTEREST MODAL ──
function openInterestModal(title) {
  currentPropertyForInterest = title;
  document.getElementById('modalPropertyName').textContent = 'Interested in: ' + title;
  document.getElementById('modalName').value = '';
  document.getElementById('modalEmail').value = '';
  document.getElementById('interestModal').classList.remove('section-hidden');
}
function closeModal() {
  document.getElementById('interestModal').classList.add('section-hidden');
}
function submitInterest() {
  const name = document.getElementById('modalName').value.trim();
  const email = document.getElementById('modalEmail').value.trim();
  if (!name || !email || !email.includes('@')) { toast('Enter a valid name and email.', 'danger'); return; }
  console.log(`Interest: ${name} <${email}> → ${currentPropertyForInterest}`);
  closeModal();
  toast(`Request sent! Seller will contact you at ${email}`, 'success');
}
// Close modal on overlay click
document.getElementById('interestModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
