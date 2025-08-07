// renderer.js
document.addEventListener('DOMContentLoaded', () => {
  const { clipboard } = require('electron');
  let history = [];
  let idCounter = 1;
  let lastFormData = null;  // ← store the last values for Undo

  window.copyInfo = function () {
    const community = document.getElementById('community').value;
    const unit      = document.getElementById('unit').value;
    const name      = document.getElementById('name').value;
    const phone     = document.getElementById('phone').value;
    const issue     = document.getElementById('issue').value;
    const type      = document.getElementById('type').value;

    // snapshot for Undo
    lastFormData = { community, unit, name, phone, issue };

    const formatted = `Answered by Happy Force\n\nCommunity: ${community}\nUnit: ${unit}\nName: ${name}\nPhone: ${phone}\nIssue: ${issue}\nCall Type: ${type}`;

    clipboard.writeText(formatted);
    alert('Info copied to clipboard. It will be cleared in 2 hours.');

    const entry = {
      id: idCounter++,
      text: formatted,
      timestamp: Date.now()
    };
    history.push(entry);
    renderHistory();

    // auto-remove history entry after 2 hours
    setTimeout(() => {
      history = history.filter(item => item.id !== entry.id);
      renderHistory();
    }, 2 * 60 * 60 * 1000);

    // auto-clear the fields now
    document.getElementById('community').value = '';
    document.getElementById('unit').value      = '';
    document.getElementById('name').value      = '';
    document.getElementById('phone').value     = '';
    document.getElementById('issue').value     = '';
  };

  // NEW: restore lastFormData into the inputs
  window.undoClear = function () {
    if (!lastFormData) {
      return alert('Nothing to undo.');
    }
    document.getElementById('community').value = lastFormData.community;
    document.getElementById('unit').value      = lastFormData.unit;
    document.getElementById('name').value      = lastFormData.name;
    document.getElementById('phone').value     = lastFormData.phone;
    document.getElementById('issue').value     = lastFormData.issue;
    lastFormData = null;
  };

  window.clearNotes = function () {
    const notes = document.getElementById('notes');
    if (notes) notes.value = '';
  };

  window.toggleHistory = function () {
    const panel = document.getElementById('historyPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  };

  window.clearFields = function () {
    document.getElementById('community').value = '';
    document.getElementById('unit').value      = '';
    document.getElementById('name').value      = '';
    document.getElementById('phone').value     = '';
    document.getElementById('issue').value     = '';
  };

  window.toggleScript = function () {
    const panel = document.getElementById('scriptPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  };

  window.toggleNonBasicScript = function () {
    const panel = document.getElementById('nonBasicScriptPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  };

  window.copyAgain = function (id) {
    const item = history.find(h => h.id === id);
    if (item) {
      clipboard.writeText(item.text);
      alert(`Copied #${item.id} to clipboard again.`);
    }
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
