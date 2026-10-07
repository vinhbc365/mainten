(function () {
  'use strict';

  /*
   * CHỈNH THỜI GIAN BẢO TRÌ TẠI ĐÂY.
   * Ví dụ: '2026-10-08T22:30:00+07:00'
   * Để null nếu chưa muốn hiển thị ngày hoàn tất.
   */
  var MAINTENANCE_END = null;

  var el = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    target: document.getElementById('targetText'),
    year: document.getElementById('year'),
    liveTime: document.getElementById('liveTime'),
    refresh: document.getElementById('refreshBtn'),
    statusBtn: document.getElementById('statusBtn'),
    statusPanel: document.getElementById('statusPanel')
  };

  el.year.textContent = new Date().getFullYear();

  function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

  function updateClock() {
    var now = new Date();
    el.liveTime.textContent = now.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit', second:'2-digit'});

    if (!MAINTENANCE_END) {
      el.target.textContent = 'đang cập nhật';
      return;
    }

    var end = new Date(MAINTENANCE_END).getTime();
    var diff = end - now.getTime();

    if (!Number.isFinite(end) || diff <= 0) {
      el.days.textContent = '00';
      el.hours.textContent = '00';
      el.minutes.textContent = '00';
      el.seconds.textContent = '00';
      el.target.textContent = 'đã đến thời gian dự kiến';
      return;
    }

    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    el.days.textContent = pad(days);
    el.hours.textContent = pad(hours);
    el.minutes.textContent = pad(minutes);
    el.seconds.textContent = pad(seconds);

    el.target.textContent = new Date(end).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  el.refresh.addEventListener('click', function () {
    el.refresh.querySelector('.refresh-icon').classList.remove('spin-once');
    void el.refresh.offsetWidth;
    el.refresh.querySelector('.refresh-icon').classList.add('spin-once');
    setTimeout(function () { window.location.reload(); }, 180);
  });

  el.statusBtn.addEventListener('click', function () {
    var hidden = el.statusPanel.hasAttribute('hidden');
    if (hidden) {
      el.statusPanel.removeAttribute('hidden');
      el.statusBtn.textContent = 'Ẩn trạng thái';
    } else {
      el.statusPanel.setAttribute('hidden', '');
      el.statusBtn.textContent = 'Xem trạng thái';
    }
  });

  updateClock();
  setInterval(updateClock, 1000);
})();
