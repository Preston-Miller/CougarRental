// Cougar Rental - Frontend
// API key is never hardcoded; use server-side env. Optional form field for demo only.

async function loadCougars() {
  const res = await fetch('/api/cougars');
  const data = await res.json();
  const grid = document.getElementById('cougar-grid');
  grid.innerHTML = data.map(c => `
    <div class="cougar-card">
      <h3>${escapeHtml(c.name)}</h3>
      <div class="meta">Age: ${c.age} · Rating: ${c.rating}/5</div>
      <div class="price">$${c.pricePerDay}/day</div>
    </div>
  `).join('');

  const select = document.querySelector('select[name="cougarId"]');
  select.innerHTML = '<option value="">Choose a cougar</option>' +
    data.map(c => `<option value="${c.id}">${escapeHtml(c.name)} - $${c.pricePerDay}/day</option>`).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById('booking-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const cougarId = form.cougarId.value;
  const startDate = form.startDate.value;
  const endDate = form.endDate.value;
  const apiKey = form.apiKey.value;

  const resultEl = document.getElementById('booking-result');
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['X-API-Key'] = apiKey;
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers,
      body: JSON.stringify({ cougarId: parseInt(cougarId, 10), startDate, endDate }),
    });
    const data = await res.json();
    if (!res.ok) {
      resultEl.className = 'error';
      resultEl.textContent = data.error || 'Booking failed';
      return;
    }
    resultEl.className = 'success';
    resultEl.textContent = `Booked! Confirmation: ${data.bookingId}`;
  } catch (err) {
    resultEl.className = 'error';
    resultEl.textContent = 'Network error: ' + err.message;
  }
});

loadCougars();
