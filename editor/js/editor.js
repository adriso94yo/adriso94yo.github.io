/**
 * EDITOR LOCAL - ADRIAN SOTOLONGO RODRÍGUEZ
 * File System Access API integration, dynamic forms, validation & JSON sync
 */

(function () {
  'use strict';

  // Global state
  let cvData = null;
  let fileHandle = null;
  let isModified = false;

  // DOM Elements
  const btnOpenFile = document.getElementById('btn-open-file');
  const btnSaveFile = document.getElementById('btn-save-file');
  const btnDownloadJson = document.getElementById('btn-download-json');
  const fallbackFileInput = document.getElementById('fallback-file-input');
  const currentFileLabel = document.getElementById('current-file-label');
  const statusIndicator = document.getElementById('save-status');
  const statusText = document.getElementById('status-text');
  const toastEl = document.getElementById('toast');

  // Show toast notification
  function showToast(message, type = 'success') {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.className = `toast ${type} show`;
    setTimeout(() => {
      toastEl.className = 'toast';
    }, 3500);
  }

  // Update modification status badge
  function setModified(modified) {
    isModified = modified;
    if (modified) {
      statusIndicator.className = 'status-indicator modified';
      statusText.textContent = 'Cambios sin guardar';
    } else {
      statusIndicator.className = 'status-indicator';
      statusText.textContent = 'Guardado';
    }
  }

  // Default initial schema template if starting empty
  const defaultTemplate = {
    profile: {
      name: "Adrian Sotolongo Rodríguez",
      title: { es: "Arquitecto y Coordinador BIM Sénior", en: "Architect & Senior BIM Coordinator" },
      headline: { es: "", en: "" },
      summary: { es: "", en: "" },
      email: "",
      phone: "",
      location: "Madrid, Spain",
      linkedin: "",
      github: "",
      portfolio: ""
    },
    files: {
      cv_en: "files/cv-en.pdf",
      cv_es: "files/cv-es.pdf"
    },
    skills: [],
    software: [],
    languages: { es: [], en: [] },
    experience: [],
    education: [],
    certifications: [],
    collaborations: [],
    projects: []
  };

  // Switch tabs
  function initTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.getAttribute('data-tab');
        const panel = document.getElementById(targetId);
        if (panel) {
          panel.classList.add('active');
          if (targetId === 'tab-raw') {
            syncToRawJson();
          }
        }
      });
    });
  }

  // Populate Profile form
  function populateProfile() {
    const p = cvData.profile || {};
    const f = cvData.files || {};

    document.getElementById('prof-name').value = p.name || '';
    document.getElementById('prof-title-es').value = p.title?.es || '';
    document.getElementById('prof-title-en').value = p.title?.en || '';
    document.getElementById('prof-head-es').value = p.headline?.es || '';
    document.getElementById('prof-head-en').value = p.headline?.en || '';
    document.getElementById('prof-sum-es').value = p.summary?.es || '';
    document.getElementById('prof-sum-en').value = p.summary?.en || '';
    document.getElementById('prof-email').value = p.email || '';
    document.getElementById('prof-phone').value = p.phone || '';
    document.getElementById('prof-loc').value = p.location || '';
    document.getElementById('prof-linkedin').value = p.linkedin || '';
    document.getElementById('prof-github').value = p.github || '';
    document.getElementById('prof-portfolio').value = p.portfolio || '';

    document.getElementById('prof-pdf-es').value = f.cv_es || 'files/cv-es.pdf';
    document.getElementById('prof-pdf-en').value = f.cv_en || 'files/cv-en.pdf';
  }

  // Read Profile inputs into state
  function readProfileFromForm() {
    if (!cvData.profile) cvData.profile = {};
    if (!cvData.files) cvData.files = {};

    cvData.profile.name = document.getElementById('prof-name').value.trim();
    cvData.profile.title = {
      es: document.getElementById('prof-title-es').value.trim(),
      en: document.getElementById('prof-title-en').value.trim()
    };
    cvData.profile.headline = {
      es: document.getElementById('prof-head-es').value.trim(),
      en: document.getElementById('prof-head-en').value.trim()
    };
    cvData.profile.summary = {
      es: document.getElementById('prof-sum-es').value.trim(),
      en: document.getElementById('prof-sum-en').value.trim()
    };
    cvData.profile.email = document.getElementById('prof-email').value.trim();
    cvData.profile.phone = document.getElementById('prof-phone').value.trim();
    cvData.profile.location = document.getElementById('prof-loc').value.trim();
    cvData.profile.linkedin = document.getElementById('prof-linkedin').value.trim();
    cvData.profile.github = document.getElementById('prof-github').value.trim();
    cvData.profile.portfolio = document.getElementById('prof-portfolio').value.trim();

    cvData.files.cv_es = document.getElementById('prof-pdf-es').value.trim();
    cvData.files.cv_en = document.getElementById('prof-pdf-en').value.trim();

    setModified(true);
  }

  // Populate Experience items
  function renderExperienceList() {
    const container = document.getElementById('experience-items-container');
    const badge = document.getElementById('count-experience');
    const list = cvData.experience || [];
    badge.textContent = list.length;

    container.innerHTML = list.map((item, idx) => {
      const pEs = (item.paragraphs?.es || []).join('\n');
      const pEn = (item.paragraphs?.en || []).join('\n');

      return `
        <div class="item-card" data-index="${idx}">
          <div class="item-card-header">
            <span class="item-card-title">#${idx + 1} · ${item.company || 'Empresa'} — ${item.role?.es || item.role?.en || 'Puesto'}</span>
            <div class="item-card-tools">
              <button type="button" class="btn btn-secondary btn-sm btn-move-exp-up" title="Subir">▲</button>
              <button type="button" class="btn btn-secondary btn-sm btn-move-exp-down" title="Bajar">▼</button>
              <button type="button" class="btn btn-danger btn-sm btn-del-exp" title="Eliminar">🗑</button>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group col-6">
              <label>Empresa / Organización</label>
              <input type="text" class="form-control exp-company" value="${item.company || ''}">
            </div>
            <div class="form-group col-4">
              <label>Ubicación / Modalidad</label>
              <input type="text" class="form-control exp-place" value="${item.place || ''}">
            </div>
            <div class="form-group col-2" style="justify-content: flex-end;">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                <input type="checkbox" class="exp-current" ${item.current ? 'checked' : ''}> Actual
              </label>
            </div>

            <div class="form-group col-6">
              <label>Periodo (Español)</label>
              <input type="text" class="form-control exp-period-es" value="${item.period?.es || ''}" placeholder="Junio 2025 – Actualidad">
            </div>
            <div class="form-group col-6">
              <label>Periodo (Inglés)</label>
              <input type="text" class="form-control exp-period-en" value="${item.period?.en || ''}" placeholder="June 2025 – Present">
            </div>

            <div class="form-group col-6">
              <label>Cargo / Rol (Español)</label>
              <input type="text" class="form-control exp-role-es" value="${item.role?.es || ''}">
            </div>
            <div class="form-group col-6">
              <label>Cargo / Rol (Inglés)</label>
              <input type="text" class="form-control exp-role-en" value="${item.role?.en || ''}">
            </div>

            <div class="form-group col-6">
              <label>Responsabilidades y Logros (Español, 1 párrafo por línea)</label>
              <textarea class="form-control exp-desc-es" rows="4">${pEs}</textarea>
            </div>
            <div class="form-group col-6">
              <label>Responsabilidades y Logros (Inglés, 1 párrafo por línea)</label>
              <textarea class="form-control exp-desc-en" rows="4">${pEn}</textarea>
            </div>

            <div class="form-group col-6">
              <label>Especialidades (ej. HVAC, FP, PLB, SAN, ELEC)</label>
              <input type="text" class="form-control exp-specialties" value="${item.specialties || ''}">
            </div>
            <div class="form-group col-6">
              <label>Herramientas y Software utilizados</label>
              <input type="text" class="form-control exp-tools" value="${item.tools || ''}">
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners for experience cards
    container.querySelectorAll('.item-card').forEach(card => {
      const idx = parseInt(card.getAttribute('data-index'), 10);

      // Input changes
      card.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
          saveExperienceCard(card, idx);
        });
      });

      // Move Up
      card.querySelector('.btn-move-exp-up').addEventListener('click', () => {
        if (idx > 0) {
          const temp = cvData.experience[idx];
          cvData.experience[idx] = cvData.experience[idx - 1];
          cvData.experience[idx - 1] = temp;
          renderExperienceList();
          setModified(true);
        }
      });

      // Move Down
      card.querySelector('.btn-move-exp-down').addEventListener('click', () => {
        if (idx < cvData.experience.length - 1) {
          const temp = cvData.experience[idx];
          cvData.experience[idx] = cvData.experience[idx + 1];
          cvData.experience[idx + 1] = temp;
          renderExperienceList();
          setModified(true);
        }
      });

      // Delete
      card.querySelector('.btn-del-exp').addEventListener('click', () => {
        if (confirm(`¿Eliminar el puesto en "${cvData.experience[idx].company || 'esta empresa'}"?`)) {
          cvData.experience.splice(idx, 1);
          renderExperienceList();
          setModified(true);
          showToast('Puesto eliminado');
        }
      });
    });
  }

  function saveExperienceCard(card, idx) {
    const item = cvData.experience[idx];
    if (!item) return;

    item.company = card.querySelector('.exp-company').value.trim();
    item.place = card.querySelector('.exp-place').value.trim();
    item.current = card.querySelector('.exp-current').checked;

    item.period = {
      es: card.querySelector('.exp-period-es').value.trim(),
      en: card.querySelector('.exp-period-en').value.trim()
    };

    item.role = {
      es: card.querySelector('.exp-role-es').value.trim(),
      en: card.querySelector('.exp-role-en').value.trim()
    };

    const linesEs = card.querySelector('.exp-desc-es').value.split('\n').map(l => l.trim()).filter(Boolean);
    const linesEn = card.querySelector('.exp-desc-en').value.split('\n').map(l => l.trim()).filter(Boolean);
    item.paragraphs = {
      es: linesEs,
      en: linesEn
    };

    item.specialties = card.querySelector('.exp-specialties').value.trim();
    item.tools = card.querySelector('.exp-tools').value.trim();

    setModified(true);
  }

  // Populate Collaborations
  function renderCollabsList() {
    const container = document.getElementById('collabs-items-container');
    const badge = document.getElementById('count-collabs');
    const list = cvData.collaborations || [];
    badge.textContent = list.length;

    container.innerHTML = list.map((item, idx) => `
      <div class="item-card" data-collab-idx="${idx}">
        <div class="item-card-header">
          <span class="item-card-title">#${idx + 1} · ${item.partner || 'Socio / Empresa'} — ${item.project || 'Proyecto'}</span>
          <button type="button" class="btn btn-danger btn-sm btn-del-collab">🗑 Eliminar</button>
        </div>
        <div class="form-grid">
          <div class="form-group col-4">
            <label>Empresa / Socio</label>
            <input type="text" class="form-control collab-partner" value="${item.partner || ''}">
          </div>
          <div class="form-group col-5">
            <label>Proyecto / Obra</label>
            <input type="text" class="form-control collab-project" value="${item.project || ''}">
          </div>
          <div class="form-group col-3">
            <label>Ubicación</label>
            <input type="text" class="form-control collab-location" value="${item.location || ''}">
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.item-card').forEach(card => {
      const idx = parseInt(card.getAttribute('data-collab-idx'), 10);
      card.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
          cvData.collaborations[idx].partner = card.querySelector('.collab-partner').value.trim();
          cvData.collaborations[idx].project = card.querySelector('.collab-project').value.trim();
          cvData.collaborations[idx].location = card.querySelector('.collab-location').value.trim();
          setModified(true);
        });
      });

      card.querySelector('.btn-del-collab').addEventListener('click', () => {
        cvData.collaborations.splice(idx, 1);
        renderCollabsList();
        setModified(true);
      });
    });
  }

  // Populate Education & Certifications
  function renderEducationAndCerts() {
    const container = document.getElementById('edu-items-container');
    const badge = document.getElementById('count-education');
    const list = cvData.education || [];
    badge.textContent = list.length;

    container.innerHTML = list.map((item, idx) => `
      <div class="item-card" data-edu-idx="${idx}">
        <div class="item-card-header">
          <span class="item-card-title">#${idx + 1} · ${item.school || 'Institución'}</span>
          <button type="button" class="btn btn-danger btn-sm btn-del-edu">🗑 Eliminar</button>
        </div>
        <div class="form-grid">
          <div class="form-group col-6">
            <label>Titulación (Español)</label>
            <input type="text" class="form-control edu-title-es" value="${item.title?.es || ''}">
          </div>
          <div class="form-group col-6">
            <label>Titulación (Inglés)</label>
            <input type="text" class="form-control edu-title-en" value="${item.title?.en || ''}">
          </div>
          <div class="form-group col-8">
            <label>Universidad / Escuela</label>
            <input type="text" class="form-control edu-school" value="${item.school || ''}">
          </div>
          <div class="form-group col-2">
            <label>Periodo (ES)</label>
            <input type="text" class="form-control edu-period-es" value="${item.period?.es || ''}">
          </div>
          <div class="form-group col-2">
            <label>Periodo (EN)</label>
            <input type="text" class="form-control edu-period-en" value="${item.period?.en || ''}">
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.item-card').forEach(card => {
      const idx = parseInt(card.getAttribute('data-edu-idx'), 10);
      card.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
          cvData.education[idx].title = {
            es: card.querySelector('.edu-title-es').value.trim(),
            en: card.querySelector('.edu-title-en').value.trim()
          };
          cvData.education[idx].school = card.querySelector('.edu-school').value.trim();
          cvData.education[idx].period = {
            es: card.querySelector('.edu-period-es').value.trim(),
            en: card.querySelector('.edu-period-en').value.trim()
          };
          setModified(true);
        });
      });

      card.querySelector('.btn-del-edu').addEventListener('click', () => {
        cvData.education.splice(idx, 1);
        renderEducationAndCerts();
        setModified(true);
      });
    });

    // Certifications textarea
    const certArea = document.getElementById('certifications-textarea');
    certArea.value = (cvData.certifications || []).join('\n');
  }

  // Populate Software & Skills
  function renderSkillsAndSoftware() {
    const softArea = document.getElementById('software-input');
    const skillsArea = document.getElementById('skills-input');

    softArea.value = (cvData.software || []).join(', ');
    skillsArea.value = (cvData.skills || []).join(', ');
  }

  // Populate Languages
  function renderLanguages() {
    const esContainer = document.getElementById('languages-es-container');
    const enContainer = document.getElementById('languages-en-container');

    const listEs = cvData.languages?.es || [];
    const listEn = cvData.languages?.en || [];

    esContainer.innerHTML = listEs.map((item, idx) => `
      <div class="lang-row" data-lang-idx="${idx}">
        <input type="text" class="form-control lang-name-es" value="${item.name || ''}" placeholder="Idioma">
        <input type="text" class="form-control lang-level-es" value="${item.level || ''}" placeholder="Nivel">
        <button type="button" class="btn btn-danger btn-sm btn-del-lang-es">✕</button>
      </div>
    `).join('');

    enContainer.innerHTML = listEn.map((item, idx) => `
      <div class="lang-row" data-lang-idx="${idx}">
        <input type="text" class="form-control lang-name-en" value="${item.name || ''}" placeholder="Language">
        <input type="text" class="form-control lang-level-en" value="${item.level || ''}" placeholder="Level">
        <button type="button" class="btn btn-danger btn-sm btn-del-lang-en">✕</button>
      </div>
    `).join('');

    // Attach listeners
    esContainer.querySelectorAll('.lang-row').forEach(row => {
      const idx = parseInt(row.getAttribute('data-lang-idx'), 10);
      row.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
          cvData.languages.es[idx] = {
            name: row.querySelector('.lang-name-es').value.trim(),
            level: row.querySelector('.lang-level-es').value.trim()
          };
          setModified(true);
        });
      });
      row.querySelector('.btn-del-lang-es').addEventListener('click', () => {
        cvData.languages.es.splice(idx, 1);
        renderLanguages();
        setModified(true);
      });
    });

    enContainer.querySelectorAll('.lang-row').forEach(row => {
      const idx = parseInt(row.getAttribute('data-lang-idx'), 10);
      row.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
          cvData.languages.en[idx] = {
            name: row.querySelector('.lang-name-en').value.trim(),
            level: row.querySelector('.lang-level-en').value.trim()
          };
          setModified(true);
        });
      });
      row.querySelector('.btn-del-lang-en').addEventListener('click', () => {
        cvData.languages.en.splice(idx, 1);
        renderLanguages();
        setModified(true);
      });
    });
  }

  // Sync to Raw JSON viewer
  function syncToRawJson() {
    gatherAllFormsData();
    const area = document.getElementById('raw-json-textarea');
    area.value = JSON.stringify(cvData, null, 2);
  }

  // Gather everything into cvData before saving or viewing
  function gatherAllFormsData() {
    // Certifications
    const certArea = document.getElementById('certifications-textarea');
    if (certArea) {
      cvData.certifications = certArea.value.split('\n').map(l => l.trim()).filter(Boolean);
    }

    // Software
    const softArea = document.getElementById('software-input');
    if (softArea) {
      cvData.software = softArea.value.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Skills
    const skillsArea = document.getElementById('skills-input');
    if (skillsArea) {
      cvData.skills = skillsArea.value.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  // Render all UI sections
  function populateAllForms() {
    populateProfile();
    renderExperienceList();
    renderCollabsList();
    renderEducationAndCerts();
    renderSkillsAndSoftware();
    renderLanguages();
    setModified(false);
  }

  // Save logic: File System Access API or fallback
  async function saveFile() {
    gatherAllFormsData();
    const jsonString = JSON.stringify(cvData, null, 2);

    try {
      if (fileHandle && typeof fileHandle.createWritable === 'function') {
        const writable = await fileHandle.createWritable();
        await writable.write(jsonString);
        await writable.close();
        setModified(false);
        showToast('¡Archivo cv.json guardado en disco con éxito!');
        return;
      }

      // If we don't have a handle yet, ask user via showSaveFilePicker
      if ('showSaveFilePicker' in window) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: 'cv.json',
          types: [{
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] }
          }]
        });
        const writable = await fileHandle.createWritable();
        await writable.write(jsonString);
        await writable.close();
        currentFileLabel.textContent = `Archivo: ${fileHandle.name}`;
        setModified(false);
        showToast('¡Archivo cv.json guardado con éxito!');
        return;
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error al guardar con File System API:', err);
      } else {
        return;
      }
    }

    // Fallback: trigger download
    downloadJsonBlob(jsonString);
    showToast('Archivo cv.json descargado. Cópialo a docs/data/cv.json', 'success');
  }

  function downloadJsonBlob(content) {
    const blob = new Blob([content || JSON.stringify(cvData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Open file logic
  async function openFile() {
    if ('showOpenFilePicker' in window) {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [{
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] }
          }],
          multiple: false
        });
        fileHandle = handle;
        const file = await handle.getFile();
        const text = await file.text();
        cvData = JSON.parse(text);
        currentFileLabel.textContent = `Archivo: ${handle.name}`;
        populateAllForms();
        showToast(`Archivo "${handle.name}" cargado`);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        } else {
          return;
        }
      }
    }

    // Fallback
    fallbackFileInput.click();
  }

  // Fallback file input change
  fallbackFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      cvData = JSON.parse(text);
      currentFileLabel.textContent = `Archivo: ${file.name}`;
      populateAllForms();
      showToast(`Archivo "${file.name}" cargado`);
    } catch (err) {
      showToast('Error al parsear el archivo JSON', 'error');
    }
  });

  // Attach button events
  function initEvents() {
    btnOpenFile.addEventListener('click', openFile);
    btnSaveFile.addEventListener('click', saveFile);
    btnDownloadJson.addEventListener('click', () => {
      gatherAllFormsData();
      downloadJsonBlob();
    });

    // Profile inputs
    document.querySelectorAll('#form-profile input, #form-profile textarea').forEach(input => {
      input.addEventListener('input', readProfileFromForm);
    });

    // Certifications textarea
    document.getElementById('certifications-textarea').addEventListener('input', () => setModified(true));
    document.getElementById('software-input').addEventListener('input', () => setModified(true));
    document.getElementById('skills-input').addEventListener('input', () => setModified(true));

    // Add Experience button
    document.getElementById('btn-add-experience').addEventListener('click', () => {
      if (!cvData.experience) cvData.experience = [];
      cvData.experience.unshift({
        id: `exp-${Date.now()}`,
        company: 'Nueva Empresa',
        role: { es: 'Cargo', en: 'Role' },
        place: 'Madrid, España',
        period: { es: 'Fecha – Actualidad', en: 'Date – Present' },
        current: false,
        paragraphs: { es: ['Responsabilidad o logro principal...'], en: ['Key achievement or duty...'] },
        specialties: '',
        tools: ''
      });
      renderExperienceList();
      setModified(true);
      showToast('Nuevo puesto añadido al inicio');
    });

    // Add Collaboration button
    document.getElementById('btn-add-collab').addEventListener('click', () => {
      if (!cvData.collaborations) cvData.collaborations = [];
      cvData.collaborations.push({
        partner: 'Nombre Empresa',
        project: 'Nombre del Proyecto',
        location: 'España'
      });
      renderCollabsList();
      setModified(true);
    });

    // Add Education button
    document.getElementById('btn-add-edu').addEventListener('click', () => {
      if (!cvData.education) cvData.education = [];
      cvData.education.push({
        id: `edu-${Date.now()}`,
        title: { es: 'Nueva Titulación', en: 'New Degree' },
        school: 'Universidad / Centro',
        period: { es: 'Año', en: 'Year' }
      });
      renderEducationAndCerts();
      setModified(true);
    });

    // Add Language buttons
    document.getElementById('btn-add-lang-es').addEventListener('click', () => {
      if (!cvData.languages) cvData.languages = { es: [], en: [] };
      if (!cvData.languages.es) cvData.languages.es = [];
      cvData.languages.es.push({ name: 'Nuevo Idioma', level: 'Intermedio' });
      renderLanguages();
      setModified(true);
    });
    document.getElementById('btn-add-lang-en').addEventListener('click', () => {
      if (!cvData.languages) cvData.languages = { es: [], en: [] };
      if (!cvData.languages.en) cvData.languages.en = [];
      cvData.languages.en.push({ name: 'New Language', level: 'Intermediate' });
      renderLanguages();
      setModified(true);
    });

    // Raw JSON action buttons
    document.getElementById('btn-format-json').addEventListener('click', () => {
      const area = document.getElementById('raw-json-textarea');
      try {
        const obj = JSON.parse(area.value);
        area.value = JSON.stringify(obj, null, 2);
        showToast('JSON formateado');
      } catch (e) {
        showToast('Error de sintaxis JSON', 'error');
      }
    });

    document.getElementById('btn-copy-json').addEventListener('click', async () => {
      const area = document.getElementById('raw-json-textarea');
      try {
        await navigator.clipboard.writeText(area.value);
        showToast('JSON copiado al portapapeles');
      } catch (e) {
        area.select();
        document.execCommand('copy');
        showToast('JSON copiado al portapapeles');
      }
    });

    document.getElementById('btn-apply-json').addEventListener('click', () => {
      const area = document.getElementById('raw-json-textarea');
      try {
        cvData = JSON.parse(area.value);
        populateAllForms();
        setModified(true);
        showToast('¡Cambios aplicados desde el JSON!');
      } catch (e) {
        showToast('JSON inválido. Revisa la sintaxis.', 'error');
      }
    });

    // Keyboard shortcut Ctrl+S
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveFile();
      }
    });
  }

  // Pre-load cv.json from ../docs/data/cv.json if accessible via fetch
  async function bootstrap() {
    initTabs();
    initEvents();

    try {
      const res = await fetch('../docs/data/cv.json', { cache: 'no-cache' });
      if (res.ok) {
        cvData = await res.json();
        currentFileLabel.textContent = 'Archivo: docs/data/cv.json (precargado)';
        populateAllForms();
        return;
      }
    } catch (e) {
      // Ignored if running on file:// protocol without local server
    }

    // Default template if fetch not available
    cvData = JSON.parse(JSON.stringify(defaultTemplate));
    populateAllForms();
  }

  // Bootstrap when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

})();
