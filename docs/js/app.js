/**
 * ADRIAN SOTOLONGO RODRÍGUEZ · CV & PORTFOLIO ARQUITECTÓNICO HORIZONTAL
 * Dynamic Renderer, Bilingual Engine (ES/EN) & Widescreen Desktop Controller
 */

(function () {
  'use strict';

  // Architectural UI Dictionary
  const UI_TEXT = {
    es: {
      'nav.role': 'COORDINADOR BIM & ARQUITECTO',
      'nav.experience': 'Experiencia',
      'nav.projects': 'Proyectos',
      'nav.education': 'Formación',
      'nav.skills': 'Competencias',
      'actions.downloadPdf': 'Descargar PDF',
      'actions.printA4': 'Imprimir A4',
      'hero.available': 'ACTIVO · MADRID',
      'hero.profileTag': '00 / DECLARACIÓN PROFESIONAL',
      'sections.experience': 'EXPERIENCIA PROFESIONAL',
      'sections.collabs': 'INFRAESTRUCTURAS & COLABORACIONES SINGULARES',
      'sections.education': 'FORMACIÓN ACADÉMICA',
      'sections.skills': 'SOFTWARE & ECOSISTEMA BIM',
      'sections.certifications': 'CERTIFICACIONES OFICIALES',
      'skills.competencies': 'COMPETENCIAS CLAVE',
      'skills.languages': 'IDIOMAS',
      'labels.specialties': 'Especialidades',
      'labels.tools': 'Herramientas',
      'labels.present': 'Actualidad',
      'page.title': 'Adrian Sotolongo Rodríguez · Coordinador BIM Sénior & Arquitecto'
    },
    en: {
      'nav.role': 'SENIOR BIM COORDINATOR & ARCHITECT',
      'nav.experience': 'Experience',
      'nav.projects': 'Projects',
      'nav.education': 'Education',
      'nav.skills': 'Skills',
      'actions.downloadPdf': 'Download PDF',
      'actions.printA4': 'Print A4',
      'hero.available': 'ACTIVE · MADRID',
      'hero.profileTag': '00 / PROFESSIONAL STATEMENT',
      'sections.experience': 'PROFESSIONAL EXPERIENCE',
      'sections.collabs': 'INFRASTRUCTURE & MAJOR COLLABORATIONS',
      'sections.education': 'ACADEMIC BACKGROUND',
      'sections.skills': 'BIM SOFTWARE & ECOSYSTEM',
      'sections.certifications': 'OFFICIAL CERTIFICATIONS',
      'skills.competencies': 'CORE COMPETENCIES',
      'skills.languages': 'LANGUAGES',
      'labels.specialties': 'Specialties',
      'labels.tools': 'Tools',
      'labels.present': 'Present',
      'page.title': 'Adrian Sotolongo Rodríguez · Senior BIM Coordinator & Architect'
    }
  };

  let cvData = null;
  let currentLang = 'es';

  // Escape HTML helper
  function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Localized field getter
  function getLoc(obj, lang) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['en'] || obj['es'] || '';
  }

  // Detect language
  function detectLanguage() {
    const saved = localStorage.getItem('asr_cv_lang');
    if (saved === 'es' || saved === 'en') return saved;
    const nav = (navigator.language || '').toLowerCase();
    return nav.startsWith('es') ? 'es' : 'en';
  }

  // Render Full Architectural Layout
  function render() {
    if (!cvData) return;

    document.documentElement.lang = currentLang;
    document.title = UI_TEXT[currentLang]['page.title'];

    // Update static labels with [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (UI_TEXT[currentLang] && UI_TEXT[currentLang][key]) {
        el.textContent = UI_TEXT[currentLang][key];
      }
    });

    // Update Language Buttons
    document.getElementById('btn-lang-es')?.classList.toggle('active', currentLang === 'es');
    document.getElementById('btn-lang-en')?.classList.toggle('active', currentLang === 'en');

    // Update PDF Download Link
    const pdfBtn = document.getElementById('btn-download-pdf');
    if (pdfBtn && cvData.files) {
      const targetPdf = (currentLang === 'es' ? cvData.files.cv_es : cvData.files.cv_en) || cvData.files.cv_en;
      pdfBtn.setAttribute('href', targetPdf);
    }

    // Render Profile Header
    const prof = cvData.profile || {};
    document.getElementById('profile-name').textContent = prof.name || 'ADRIAN SOTOLONGO RODRÍGUEZ';
    document.getElementById('profile-title').textContent = getLoc(prof.title, currentLang);
    document.getElementById('profile-headline').textContent = getLoc(prof.headline, currentLang);
    document.getElementById('profile-summary').textContent = getLoc(prof.summary, currentLang);

    // Contact details
    const mailEl = document.getElementById('contact-mail');
    if (mailEl && prof.email) {
      mailEl.href = `mailto:${prof.email}`;
      document.getElementById('val-mail').textContent = prof.email;
    }
    const phoneEl = document.getElementById('contact-phone');
    if (phoneEl && prof.phone) {
      phoneEl.href = `tel:${prof.phone.replace(/\s+/g, '')}`;
      document.getElementById('val-phone').textContent = prof.phone;
    }
    const locEl = document.getElementById('val-location');
    if (locEl && prof.location) {
      locEl.textContent = prof.location;
    }
    const linkedinEl = document.getElementById('contact-linkedin');
    if (linkedinEl && prof.linkedin) {
      linkedinEl.href = prof.linkedin;
    }
    const githubEl = document.getElementById('contact-github');
    if (githubEl && prof.github) {
      githubEl.href = prof.github;
    }

    // Render Sub-components
    renderExperience();
    renderCollaborations();
    renderEducation();
    renderSoftwareAndSkills();
    renderCertifications();
    renderLanguages();
  }

  function renderExperience() {
    const container = document.getElementById('experience-list');
    if (!container) return;
    const list = cvData.experience || [];
    const t = UI_TEXT[currentLang];

    container.innerHTML = list.map(job => {
      const role = esc(getLoc(job.role, currentLang));
      const company = esc(job.company || '');
      const place = esc(job.place || '');
      const period = esc(getLoc(job.period, currentLang));
      const isCurrent = Boolean(job.current);

      // Paragraphs
      let paragraphsHtml = '';
      const pList = job.paragraphs?.[currentLang] || job.paragraphs?.['en'] || job.paragraphs?.['es'] || [];
      if (Array.isArray(pList)) {
        paragraphsHtml = pList.map(p => `<p>${esc(p)}</p>`).join('');
      }

      // Specialties
      const specLine = job.specialties ? `
        <div class="spec-line">
          <span class="spec-line-label">${t['labels.specialties']}:</span>
          <span class="spec-line-content">${esc(job.specialties)}</span>
        </div>` : '';

      // Tools
      const toolsLine = job.tools ? `
        <div class="spec-line">
          <span class="spec-line-label">${t['labels.tools']}:</span>
          <span class="spec-line-content">${esc(job.tools)}</span>
        </div>` : '';

      return `
        <article class="exp-card ${isCurrent ? 'is-current' : ''}">
          <div class="exp-card-header">
            <div>
              <h4 class="exp-role-heading">${role}</h4>
              <div class="exp-company-sub">
                <strong>${company}</strong>
                ${place ? ` · <span>${place}</span>` : ''}
              </div>
            </div>
            <div class="exp-badges">
              ${isCurrent ? `<span class="badge-present-pill">${t['labels.present']}</span>` : ''}
              <span class="badge-period-pill">[${period}]</span>
            </div>
          </div>

          <div class="exp-card-body">
            ${paragraphsHtml}
          </div>

          ${(specLine || toolsLine) ? `
            <div class="exp-card-footer">
              ${specLine}
              ${toolsLine}
            </div>
          ` : ''}
        </article>
      `;
    }).join('');
  }

  function renderCollaborations() {
    const container = document.getElementById('collaborations-list');
    if (!container) return;
    const list = cvData.collaborations || [];

    container.innerHTML = list.map(c => `
      <div class="collab-item">
        <div>
          <div class="collab-partner-heading">▧ ${esc(c.partner)}</div>
          <div class="collab-project-name">${esc(c.project)}</div>
        </div>
        <div class="collab-location-tag">📍 ${esc(c.location || '')}</div>
      </div>
    `).join('');
  }

  function renderEducation() {
    const container = document.getElementById('education-list');
    if (!container) return;
    const list = cvData.education || [];

    container.innerHTML = list.map(item => `
      <div class="edu-box">
        <h4 class="edu-box-title">${esc(getLoc(item.title, currentLang))}</h4>
        <div class="edu-box-school">${esc(item.school)}</div>
        <div class="edu-box-date">[${esc(getLoc(item.period, currentLang))}]</div>
      </div>
    `).join('');
  }

  function renderSoftwareAndSkills() {
    // Software
    const softContainer = document.getElementById('software-tags');
    if (softContainer && cvData.software) {
      softContainer.innerHTML = cvData.software.map(s => `
        <span class="software-tag">${esc(s)}</span>
      `).join('');
    }

    // Skills
    const skillsContainer = document.getElementById('skills-tags');
    if (skillsContainer && cvData.skills) {
      skillsContainer.innerHTML = cvData.skills.map(sk => `
        <span class="skill-tag">${esc(sk)}</span>
      `).join('');
    }
  }

  function renderCertifications() {
    const container = document.getElementById('certifications-list');
    if (!container) return;
    const list = cvData.certifications || [];

    container.innerHTML = list.map(cert => `
      <div class="cert-row">
        <span class="cert-bullet">▣</span>
        <span>${esc(cert)}</span>
      </div>
    `).join('');
  }

  function renderLanguages() {
    const container = document.getElementById('languages-list');
    if (!container) return;
    const list = cvData.languages?.[currentLang] || cvData.languages?.['es'] || [];

    container.innerHTML = list.map(item => {
      const name = item.name || item;
      const level = item.level || '';
      const isNative = level.toLowerCase().includes('nativ');
      const widthPct = isNative ? '100%' : '75%';

      return `
        <div class="lang-item-airy">
          <div class="lang-header-row">
            <span>${esc(name)}</span>
            <span class="lang-level-badge">${esc(level)}</span>
          </div>
          <div class="lang-track">
            <div class="lang-fill-bar" style="width: ${widthPct}"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Switch language
  function switchLang(lang) {
    if (lang !== 'es' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem('asr_cv_lang', lang);
    render();
  }

  // Bootstrap application
  async function init() {
    currentLang = detectLanguage();

    // Set current year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Event listeners: Language
    document.getElementById('btn-lang-es')?.addEventListener('click', () => switchLang('es'));
    document.getElementById('btn-lang-en')?.addEventListener('click', () => switchLang('en'));

    // Event listeners: Print A4
    document.getElementById('btn-print-a4')?.addEventListener('click', () => {
      window.print();
    });

    try {
      const res = await fetch('data/cv.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      cvData = await res.json();
      render();
    } catch (err) {
      console.error('Error cargando data/cv.json:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
