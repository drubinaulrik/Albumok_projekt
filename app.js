async function betoltAlbumok() {
    const res = await fetch('/albumok');
    const albumok = await res.json();
    const container = document.getElementById('albumok');
    container.innerHTML = '';
    albumok.forEach(album => {
      const div = document.createElement('div');
      div.className = 'album';
      div.innerHTML = `
        <img src="https://m.blog.hu/au/audiolife/image/kepek/Cs%C3%B6vek/tumblr_mir5epOXxe1rmgj27o1_500.gif">
        <div class="album-content">
          <strong>${album.zenekar}</strong> - ${album.cim} (${album.ev})<br>
          Műfaj: ${album.mufaj}
        </div>
        <div class="actions">
          <button onclick="modositAlbum(${album.id})">✎</button>
          <button onclick="torolAlbum(${album.id})">-</button>
        </div>
      `;
      container.appendChild(div);
    });
  }
  
  document.getElementById('album-form').addEventListener('submit', async e => {
    e.preventDefault();
    const ujAlbum = {
      zenekar: document.getElementById('zenekar').value,
      cim: document.getElementById('cim').value,
      ev: document.getElementById('ev').value,
      mufaj: document.getElementById('mufaj').value
    };
    await fetch('/albumok', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(ujAlbum)
    });
    e.target.reset();
    betoltAlbumok();
  });
  
  async function torolAlbum(id) {
    await fetch(`/albumok/${id}`, { method: 'DELETE' });
    betoltAlbumok();
  }
  
  async function modositAlbum(id) {
    const res = await fetch(`/albumok/${id}`);
    const album = await res.json();
    const zenekar = prompt('Új zenekar:', album.zenekar);
    const cim = prompt('Új cím:', album.cim);
    const ev = prompt('Új év:', album.ev);
    const mufaj = prompt('Új műfaj:', album.mufaj);
    if (zenekar && cim && ev && mufaj) {
      await fetch(`/albumok/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ zenekar, cim, ev, mufaj })
      });
      betoltAlbumok();
    }
  }
  
  betoltAlbumok();
  