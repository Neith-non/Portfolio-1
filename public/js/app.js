(function () {
  const api = (endpoint) => fetch(`api/index.php?endpoint=${endpoint}`).then(r => r.json());
  const updates = document.querySelector('#updates-list');
  if (updates) api('updates').then(({data}) => { updates.innerHTML = data.map(e => `<section class="timeline-item"><h2>${esc(e.title)}</h2><small>${esc(e.status || '')} · ${esc(e.date_info || '')}</small><a class="update-card" href="${esc(e.link || 'internship.php')}"><h3>${esc(e.description_title || '')}</h3><p>${esc(e.description || '')}</p><b>${esc(e.link_text || 'Read more')} →</b></a></section>`).join(''); }).catch(() => { updates.innerHTML = '<p>Updates are temporarily unavailable.</p>'; });
  const logs = document.querySelector('#internship-logs');
  if (logs) api('internship').then(({data}) => { document.querySelector('#internship-title').textContent = data.title; document.querySelector('#internship-intro').textContent = data.intro; logs.innerHTML = data.logs.map(l => `<section class="log"><h2>${esc(l.week)}</h2><small>${esc(l.date)}</small><h3>${esc(l.title)}</h3>${(l.content || []).map(p => `<p>${esc(p)}</p>`).join('')}${l.gif ? `<img class="log-gif" src="${esc(l.gif)}" alt="Internship illustration">` : ''}</section>`).join(''); }).catch(() => { logs.innerHTML = '<p>Internship logs are temporarily unavailable.</p>'; });
  function esc(value) { const div = document.createElement('div'); div.textContent = value == null ? '' : value; return div.innerHTML; }
}());
