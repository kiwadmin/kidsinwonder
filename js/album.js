/* =====================================================================
   여행 사진첩 — 앨범 렌더러 (제네바 · 런던 공용)

   페이지에서 해야 할 일은 두 가지뿐입니다.
     1) <div id="album-root" data-feed="london-camp-feed.json"></div>
     2) parent.html 과 같은 게이트 마크업 (#gate, #gate-form, #pw, #feed …)

   매니페스트 형식:
     { title, subtitle, dates, cover, video?, days: [ { date, items } ] }
   video: { provider: "youtube", id: "<영상 ID>", title: "<제목>" }  — 앨범 맨 위에 재생
   item : { type: "image"|"video", id: "<Drive 파일 ID>", label?: "<랜드마크 이름>" }

   ※ 사진이 보이려면 Drive 폴더가 '링크가 있는 모든 사용자 - 뷰어'여야 합니다.
   ===================================================================== */

var GATE_PASSWORD = 'kiw2026';

(function () {
  'use strict';

  var gate    = document.getElementById('gate');
  var feed    = document.getElementById('feed');
  var form    = document.getElementById('gate-form');
  var input   = document.getElementById('pw');
  var errorEl = document.getElementById('gate-error');
  var root    = document.getElementById('album-root');
  var signout = document.getElementById('signout');
  var STORE_KEY = 'kiw-parent-auth';
  var loaded = false;
  var shots = [];

  if (!root) { return; }

  function thumb(id, w) { return 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w' + w; }
  function driveEmbed(id) { return 'https://drive.google.com/file/d/' + encodeURIComponent(id) + '/preview'; }
  function ytEmbed(id) { return 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?rel=0'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
  }); }

  var WD = ['일', '월', '화', '수', '목', '금', '토'];
  function dayParts(iso) {
    var p = String(iso).split('-');
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    return {
      num: parseInt(p[2], 10),
      title: parseInt(p[1], 10) + '월 ' + parseInt(p[2], 10) + '일 ' + WD[d.getUTCDay()] + '요일'
    };
  }

  function render(data) {
    var days = (data && data.days) || [];
    if (!days.length) {
      root.innerHTML = '<p class="album-empty">아직 등록된 사진이 없습니다.</p>';
      return;
    }
    var photoCount = 0, clipCount = 0;
    days.forEach(function (d) {
      d.items.forEach(function (it) { it.type === 'video' ? clipCount++ : photoCount++; });
    });

    var html = '';

    if (data.cover) {
      html += '<div class="album-hero">' +
        '<img src="' + thumb(data.cover, 1600) + '" alt="">' +
        '<div class="veil"></div>' +
        '<div class="cap">' +
          '<p class="eyebrow"><span class="dot">·</span> 학부모 전용 사진첩</p>' +
          '<h1>' + esc(data.title || '') + '</h1>' +
          '<p class="sub">' + esc(data.subtitle || '') + '</p>' +
        '</div></div>';
    }

    /* 앨범 맨 위 — 여행 영상 */
    if (data.video && data.video.id) {
      html += '<section class="album-film">' +
        '<div class="film-head">' +
          '<p class="eyebrow"><span class="dot">·</span> 여행 영상</p>' +
          '<h2 class="film-title">' + esc(data.video.title || '') + '</h2>' +
        '</div>' +
        '<div class="film-frame">' +
          '<iframe src="' + ytEmbed(data.video.id) + '" title="' + esc(data.video.title || '영상') + '"' +
          ' loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"' +
          ' allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>' +
        '</div></section>';
    }

    html += '<div class="album-meta">' +
      '<span><b>' + photoCount + '</b>장의 사진</span>' +
      (clipCount ? '<span><b>' + clipCount + '</b>개의 영상</span>' : '') +
      '<span>' + esc(data.dates || '') + '</span>' +
      '</div>';

    shots = [];
    days.forEach(function (d) {
      var p = dayParts(d.date);
      var np = d.items.filter(function (i) { return i.type !== 'video'; }).length;
      var nv = d.items.length - np;
      var count = np + '장' + (nv ? ' · 영상 ' + nv + '개' : '');
      html += '<section class="day"><div class="day-head">' +
        '<span class="day-num">' + p.num + '</span>' +
        '<span class="day-title">' + esc(p.title) + '</span>' +
        '<span class="day-count">' + count + '</span>' +
        '</div><div class="day-rule"></div><div class="shots">';

      d.items.forEach(function (it) {
        if (it.type === 'video') {
          html += '<figure class="clip"><div class="frame">' +
            '<iframe src="' + driveEmbed(it.id) + '" title="영상" loading="lazy" allow="autoplay" allowfullscreen></iframe>' +
            '</div></figure>';
          return;
        }
        var i = shots.length;
        shots.push({ id: it.id, label: it.label || '' });
        html += '<figure class="shot' + (it.label ? ' mark' : '') + '">' +
          '<button type="button" data-i="' + i + '" aria-label="사진 크게 보기">' +
          '<img loading="lazy" src="' + thumb(it.id, 600) + '" alt="' + esc(it.label || '') + '">' +
          '</button>' +
          (it.label ? '<figcaption>' + esc(it.label) + '</figcaption>' : '') +
          '</figure>';
      });
      html += '</div></section>';
    });
    root.innerHTML = html;
  }

  /* ---- 라이트박스 ---- */
  var lbox  = document.getElementById('lbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbNum = document.getElementById('lb-count');
  var at = 0;

  function show(i) {
    if (!shots.length) { return; }
    at = (i + shots.length) % shots.length;
    var s = shots[at];
    lbImg.src = thumb(s.id, 2048);
    lbImg.alt = s.label || '';
    lbCap.textContent = s.label || '';
    lbNum.textContent = (at + 1) + ' / ' + shots.length;
  }
  function openBox(i) { show(i); lbox.classList.add('on'); document.body.style.overflow = 'hidden'; }
  function closeBox() { lbox.classList.remove('on'); lbImg.src = ''; document.body.style.overflow = ''; }

  if (lbox) {
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]');
      if (b) { openBox(parseInt(b.getAttribute('data-i'), 10)); }
    });
    document.getElementById('lb-close').addEventListener('click', closeBox);
    document.getElementById('lb-prev').addEventListener('click', function () { show(at - 1); });
    document.getElementById('lb-next').addEventListener('click', function () { show(at + 1); });
    lbox.addEventListener('click', function (e) {
      if (e.target === lbox || e.target.className === 'stage') { closeBox(); }
    });
    document.addEventListener('keydown', function (e) {
      if (!lbox.classList.contains('on')) { return; }
      if (e.key === 'Escape') { closeBox(); }
      else if (e.key === 'ArrowLeft') { show(at - 1); }
      else if (e.key === 'ArrowRight') { show(at + 1); }
    });
  }

  function loadFeed() {
    if (loaded) { return; }
    loaded = true;
    var src = root.getAttribute('data-feed');
    fetch(src, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) { throw new Error('no manifest'); } return r.json(); })
      .then(render)
      .catch(function () {
        root.innerHTML = '<p class="album-empty">사진첩을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>';
      });
  }

  function unlock() {
    if (gate) { gate.style.display = 'none'; }
    if (feed) { feed.classList.add('open'); }
    loadFeed();
  }
  function lock() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
    if (feed) { feed.classList.remove('open'); }
    if (gate) { gate.style.display = ''; }
    if (input) { input.value = ''; }
    if (errorEl) { errorEl.textContent = ''; }
  }

  try {
    if (localStorage.getItem(STORE_KEY) === GATE_PASSWORD) { unlock(); }
  } catch (e) {}

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value === GATE_PASSWORD) {
        try { localStorage.setItem(STORE_KEY, input.value); } catch (e) {}
        errorEl.textContent = '';
        unlock();
      } else {
        errorEl.textContent = '접속 코드가 올바르지 않습니다.';
        input.select();
      }
    });
  }

  if (signout) { signout.addEventListener('click', lock); }
})();
