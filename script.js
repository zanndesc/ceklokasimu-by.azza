const btn = document.getElementById('btn-get');
const reset = document.getElementById('btn-reset');
const statusEl = document.getElementById('status');
const coordsEl = document.getElementById('coords');
const accEl = document.getElementById('accuracy');

let map;
let marker;

function showStatus(txt){ statusEl.textContent = txt; }

btn.addEventListener('click', () => {
  if (!navigator.geolocation){
    showStatus('geolocation tidak didukung di browser ini.');
    return;
  }

  showStatus('meminta izin lokasi...');
  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const acc = pos.coords.accuracy;

    showStatus('lokasi diterima.');
    coordsEl.textContent = `${lat.toFixed(6)} , ${lon.toFixed(6)}`;
    accEl.textContent = `${Math.round(acc)} meter`;

    if (!map) {
      map = L.map('map').setView([lat, lon], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
    } else {
      map.setView([lat, lon], 16);
    }

    if (marker) marker.remove();
    marker = L.marker([lat, lon]).addTo(map)
      .bindPopup("kamu sedang berada di sini")
      

  }, (err) => {
    showStatus('pencet yang izinkan: ' + (err.message || err.code));
  }, {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  });
});

reset.addEventListener('click', () => {
  showStatus('menunggu aksi...');
  coordsEl.textContent = '- , -';
  accEl.textContent = '- meter';
  if (map) map.remove();
  map = null;
  marker = null;
});
