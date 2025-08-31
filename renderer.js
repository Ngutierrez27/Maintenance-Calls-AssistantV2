// renderer.js
document.addEventListener('DOMContentLoaded', () => {
  const { clipboard, shell, ipcRenderer } = require('electron');
  const SHEET_ID = '1-WtCTPVObLauvUkp7TxoOvkN_lu6M7_LQjqdRWXhfQI';
  const SHEET_GID = '1978167661'; // the tab you specified

  let history = [];
  let idCounter = 1;

  window.copyInfo = function () {
    const community = document.getElementById('community').value;
    const unit      = document.getElementById('unit').value;
    const name      = document.getElementById('name').value;
    const phone     = document.getElementById('phone').value;
    const issue     = document.getElementById('issue').value;
    const type      = document.getElementById('type').value;

    const formatted = `Answered by Happy Force\n\nCommunity: ${community}\nUnit: ${unit}\nName: ${name}\nPhone: ${phone}\nIssue: ${issue}\nCall Type: ${type}`;

    clipboard.writeText(formatted);
    alert('Info copied to clipboard. It will be cleared in 10 hours.');

    const entry = {
      id: idCounter++,
      text: formatted,
      timestamp: Date.now()
    };
    history.push(entry);
    renderHistory();

    // auto-remove history entry after 10 hours
    setTimeout(() => {
      history = history.filter(item => item.id !== entry.id);
      renderHistory();
    }, 10 * 60 * 60 * 1000); // 36,000,000 ms

    // auto-clear the fields now
    document.getElementById('community').value = '';
    document.getElementById('unit').value      = '';
    document.getElementById('name').value      = '';
    document.getElementById('phone').value     = '';
    document.getElementById('issue').value     = '';
  };

  window.clearNotes = function () {
    const notes = document.getElementById('notes');
    if (notes) notes.value = '';
  };

  window.toggleHistory = function () {
    const panel = document.getElementById('historyPanel');
    const btn   = document.getElementById('btnHistory');
    const willShow = (panel.style.display === 'none' || panel.style.display === '');
    panel.style.display = willShow ? 'block' : 'none';
    btn.classList.toggle('toggle-on', willShow);
    btn.setAttribute('aria-pressed', willShow ? 'true' : 'false');
  };

  window.toggleScript = function () {
    const panel = document.getElementById('scriptPanel');
    const btn   = document.getElementById('btnScript');
    const willShow = (panel.style.display === 'none' || panel.style.display === '');
    panel.style.display = willShow ? 'block' : 'none';
    btn.classList.toggle('toggle-on', willShow);
    btn.setAttribute('aria-pressed', willShow ? 'true' : 'false');
  };

  window.toggleNonBasicScript = function () {
    const panel = document.getElementById('nonBasicScriptPanel');
    const btn   = document.getElementById('btnNonBasic');
    const willShow = (panel.style.display === 'none' || panel.style.display === '');
    panel.style.display = willShow ? 'block' : 'none';
    btn.classList.toggle('toggle-on', willShow);
    btn.setAttribute('aria-pressed', willShow ? 'true' : 'false');
  };

  window.clearFields = function () {
    document.getElementById('community').value = '';
    document.getElementById('unit').value      = '';
    document.getElementById('name').value      = '';
    document.getElementById('phone').value     = '';
    document.getElementById('issue').value     = '';
  };

  window.copyAgain = function (id) {
    const item = history.find(h => h.id === id);
    if (item) {
      clipboard.writeText(item.text);
      alert(`Copied #${item.id} to clipboard again.`);
    }
  };

  window.openGoogleSheet = () => {
    shell.openExternal('https://docs.google.com/spreadsheets/d/1-WtCTPVObLauvUkp7TxoOvkN_lu6M7_LQjqdRWXhfQI/edit?gid=1303079433#gid=1303079433&fvid=1556270402');
  };

  // Listen for menu shortcut to copy compact line
  ipcRenderer.on('copy-compact', () => {
    if (window.copyCompactLine) {
      window.copyCompactLine();
    } else {
      alert('Compact line function not available.');
    }
  });

  // ---- LINK OPENERS (use Electron shell so it's always external) ----
  const SOP_URL   = 'https://docs.google.com/spreadsheets/d/1-WtCTPVObLauvUkp7TxoOvkN_lu6M7_LQjqdRWXhfQI/edit?gid=1303079433#gid=1303079433&fvid=1556270402';
  const TASK_URL  = 'https://manage.happyco.com/next/b/39898/s/prop/l/99966/task/tasks/01K3KE5RTDWFMMEBR9GV8KBWKE';
  const CC_URL    = 'https://stage-portal.callcomplete.com/happy-nights';

  window.openSOP  = () => shell.openExternal(SOP_URL);
  window.openTask = () => shell.openExternal(TASK_URL);
  window.openCC   = () => shell.openExternal(CC_URL);

  // ---- DROPDOWN TOGGLER (chevron) ----
  window.toggleLinkDropdown = (ev, id) => {
    ev.preventDefault();     // don't do form-submit defaults
    ev.stopPropagation();    // don't trigger parent "open link" click
    const panel = document.getElementById(id);
    const chevron = ev.currentTarget;
    const show = !panel.classList.contains('show');
    panel.classList.toggle('show', show);
    chevron.setAttribute('aria-expanded', show ? 'true' : 'false');
  };

  // ---- COPY TEXT HELPER ----
  window.copyText = (text) => {
    clipboard.writeText((text || '').trim());
    alert('Link copied to clipboard.');
  };

  function renderHistory() {
    const panel = document.getElementById('historyPanel');
    panel.innerHTML = '';
    history.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'historyItem';
      const timeString = new Date(entry.timestamp).toLocaleTimeString();
      div.innerHTML = `<small style="color:gray;">${timeString}</small><br>
        <pre style="display:inline;">${entry.text}</pre>
        <br><button onclick="copyAgain(${entry.id})">Copy Again</button>`;
      panel.appendChild(div);
    });
  }

  document.body.classList.add('dark');
});
