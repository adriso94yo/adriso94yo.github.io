/**
 * CV & PORTFOLIO - ADRIAN SOTOLONGO RODRÍGUEZ
 * Client-side dynamic rendering & language switcher (ES / EN)
 */

(function () {
  'use strict';

  // Dictionaries for interface labels
  const UI_TEXT = {
    es: {
      'nav.role': 'Coordinador BIM · Arquitecto',
      'nav.experience': 'Experiencia',
      'nav.projects': 'Proyectos',
      'nav.education': 'Formación',
      'nav.skills': 'Habilidades',
      'actions.downloadPdf': 'Descargar PDF',
      'actions.printA4': 'Imprimir A4',
      'actions.backToTop': 'Subir al inicio',
      'hero.available': 'Disponible para proyectos de alta complejidad',
      'metrics.experience': 'Años de experiencia',
      'metrics.coordination': 'Coordinación & Clash Detection',
      'tags.career': 'Trayectoria',
      'sections.experience': 'Experiencia Profesional',
      'sections.experienceDesc': 'Liderazgo en coordinación BIM, modelado interdisciplinar de instalaciones complejas y automatización de procesos.',
      'tags.impact': 'Impacto',
      'sections.collabs': 'Proyectos y Colaboraciones Destacadas',
      'sections.collabsDesc': 'Participación técnica en infraestructuras críticas, centros de datos, hospitales y proyectos de escala internacional.',
      'tags.academic': 'Académico',
      'sections.education': 'Formación Académica',
      'tags.credentials': 'Acreditaciones',
      'sections.certifications': 'Certificaciones Profesionales',
      'tags.stack': 'Stack Técnico',
      'sections.skills': 'Software, Competencias e Idiomas',
      'sections.skillsDesc': 'Ecosistema tecnológico y competencias clave en arquitectura e ingeniería.',
      'skills.software': 'Software y Herramientas BIM / CAD',
      'skills.competencies': 'Competencias Clave',
      'skills.languages': 'Idiomas',
      'labels.specialties': 'Especialidades',
      'labels.tools': 'Herramientas',
      'labels.present': 'Actualidad',
      'page.title': 'Adrian Sotolongo Rodríguez · CV y Portafolio'
    },
    en: {
      'nav.role': 'Senior BIM Coordinator · Architect',
      'nav.experience': 'Experience',
      'nav.projects': 'Projects',
      'nav.education': 'Education',
      'nav.skills': 'Skills',
      'actions.downloadPdf': 'Download PDF',
      'actions.printA4': 'Print A4',
      'actions.backToTop': 'Back to top',
      'hero.available': 'Available for high-complexity projects',
      'metrics.experience': 'Years of Experience',
      'metrics.coordination': 'Coordination & Clash Detection',
      'tags.career': 'Career Path',
      'sections.experience': 'Professional Experience',
      'sections.experienceDesc': 'Leadership in BIM coordination, interdisciplinary MEP modeling, and automated engineering workflows.',
      'tags.impact': 'Impact',
      'sections.collabs': 'Featured Projects & External Collaborations',
      'sections.collabsDesc': 'Technical contributions to critical infrastructure, data centers, hospitals, and international projects.',
      'tags.academic': 'Academic',
      'sections.education': 'Academic Background',
      'tags.credentials': 'Credentials',
      'sections.certifications': 'Professional Certifications',
      'tags.stack': 'Tech Stack',
      'sections.skills': 'Software, Core Skills & Languages',
      'sections.skillsDesc': 'Technological ecosystem and core competencies in architecture and engineering.',
      'skills.software': 'BIM / CAD Software & Tools',
      'skills.competencies': 'Core Competencies',
      'skills.languages': 'Languages',
      'labels.specialties': 'Specialties',
      'labels.tools': 'Tools',
      'labels.present': 'Present',
      'page.title': 'Adrian Sotolongo Rodríguez · CV & Portfolio'
    }
  };

  let cvData = null;
  let currentLang = 'es';

  // Helper to safely escape HTML
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Get field localized value
  function getLocalized(obj, lang) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['en'] || obj['es'] || '';
  }

  // Determine initial language
  function detectInitialLanguage() {
    const saved = localStorage.getItem('preferred_cv_lang');
    if (saved === 'es' || saved === 'en') {
      return saved;
    }
    const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return navLang.startsWith('es') ? 'es' : 'en';
  }

  // Render whole view for current language
  function render() {
    if (!cvData) return;

    document.documentElement.lang = currentLang;
    document.title = UI_TEXT[currentLang]['page.title'];

    // Update static i18n nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (UI_TEXT[currentLang] && UI_TEXT[currentLang][key]) {
        el.textContent = UI_TEXT[currentLang][key];
      }
    });

    // Update Language buttons
    const btnEs = document.getElementById('btn-lang-es');
    const btnEn = document.getElementById('btn-lang-en');
    if (btnEs && btnEn) {
      btnEs.classList.toggle('active', currentLang === 'es');
      btnEs.setAttribute('aria-pressed', currentLang === 'es');
      btnEn.classList.toggle('active', currentLang === 'en');
      btnEn.setAttribute('aria-pressed', currentLang === 'en');
    }

    // Update Download PDF link
    const pdfBtn = document.getElementById('btn-download-pdf');
    if (pdfBtn && cvData.files) {
      const targetPdf = (currentLang === 'es' ? cvData.files.cv_es : cvData.files.cv_en) || cvData.files.cv_en;
      pdfBtn.setAttribute('href', targetPdf);
    }

    // Render Hero / Profile
    const profile = cvData.profile || {};
    document.getElementById('profile-name').textContent = profile.name || 'Adrian Sotolongo Rodríguez';
    document.getElementById('profile-title').textContent = getLocalized(profile.title, currentLang);
    document.getElementById('profile-headline').textContent = getLocalized(profile.headline, currentLang);
    document.getElementById('profile-summary').textContent = getLocalized(profile.summary, currentLang);

    // Profile contact chips
    const mailEl = document.getElementById('contact-mail');
    if (mailEl && profile.email) {
      mailEl.href = `mailto:${profile.email}`;
      document.getElementById('val-mail').textContent = profile.email;
    }
    const phoneEl = document.getElementById('contact-phone');
    if (phoneEl && profile.phone) {
      phoneEl.href = `tel:${profile.phone.replace(/\s+/g, '')}`;
      document.getElementById('val-phone').textContent = profile.phone;
    }
    const locEl = document.getElementById('val-location');
    if (locEl && profile.location) {
      locEl.textContent = profile.location;
    }
    const linkedinEl = document.getElementById('contact-linkedin');
    if (linkedinEl && profile.linkedin) {
      linkedinEl.href = profile.linkedin;
      document.getElementById('val-linkedin').textContent = profile.linkedinHandle || 'LinkedIn';
    }
    const githubEl = document.getElementById('contact-github');
    if (githubEl && profile.github) {
      githubEl.href = profile.github;
    }

    // Render Experience Timeline
    renderExperience();

    // Render Featured Collaborations
    renderCollaborations();

    // Render Education & Certifications
    renderEducation();
    renderCertifications();

    // Render Skills, Software & Languages
    renderSkillsAndSoftware();
  }

  function renderExperience() {
    const container = document.getElementById('experience-list');
    if (!container) return;

    const list = cvData.experience || [];
    const t = UI_TEXT[currentLang];

    container.innerHTML = list.map(item => {
      const role = escapeHtml(getLocalized(item.role, currentLang));
      const company = escapeHtml(item.company || '');
      const place = escapeHtml(item.place || '');
      const period = escapeHtml(getLocalized(item.period, currentLang));
      const isCurrent = Boolean(item.current);

      // Paragraphs
      let paragraphsHtml = '';
      if (item.paragraphs) {
        const rawP = item.paragraphs[currentLang] || item.paragraphs['en'] || item.paragraphs['es'] || [];
        if (Array.isArray(rawP)) {
          paragraphsHtml = rawP.map(p => `<p>${escapeHtml(p)}</p>`).join('');
        }
      }

      // Specialties
      const specHtml = item.specialties ? `
        <div class="meta-group">
          <span class="meta-label">${t['labels.specialties']}:</span>
          <span class="meta-value">${escapeHtml(item.specialties)}</span>
        </div>` : '';

      // Tools
      const toolsHtml = item.tools ? `
        <div class="meta-group">
          <span class="meta-label">${t['labels.tools']}:</span>
          <span class="meta-value">${escapeHtml(item.tools)}</span>
        </div>` : '';

      return `
        <article class="timeline-item ${isCurrent ? 'is-current' : ''}">
          <div class="item-top">
            <div>
              <h3 class="item-role">${role}</h3>
              <div class="item-company-meta">
                <span class="company-name">${company}</span>
                ${place ? `<span class="company-place">· ${place}</span>` : ''}
              </div>
            </div>
            <div class="item-badges">
              ${isCurrent ? `<span class="badge-current">${t['labels.present']}</span>` : ''}
              <span class="badge-period">${period}</span>
            </div>
          </div>

          <div class="item-paragraphs">
            ${paragraphsHtml}
          </div>

          ${(specHtml || toolsHtml) ? `
            <div class="item-footer-meta">
              ${specHtml}
              ${toolsHtml}
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
      <div class="collab-card">
        <div>
          <div class="collab-partner">${escapeHtml(c.partner)}</div>
          <div class="collab-project">${escapeHtml(c.project)}</div>
        </div>
        <div class="collab-location">
          <span>📍</span>
          <span>${escapeHtml(c.location || '')}</span>
        </div>
      </div>
    `).join('');
  }

  function renderEducation() {
    const container = document.getElementById('education-list');
    if (!container) return;

    const list = cvData.education || [];
    container.innerHTML = list.map(edu => {
      const title = escapeHtml(getLocalized(edu.title, currentLang));
      const school = escapeHtml(edu.school || '');
      const period = escapeHtml(getLocalized(edu.period, currentLang));

      return `
        <div class="edu-card">
          <h3 class="edu-title">${title}</h3>
          <div class="edu-school">${school}</div>
          <div class="edu-period">${period}</div>
        </div>
      `;
    }).join('');
  }

  function renderCertifications() {
    const container = document.getElementById('certifications-list');
    if (!container) return;

    const list = cvData.certifications || [];
    container.innerHTML = list.map(cert => `
      <div class="cert-card">
        <span class="cert-icon">✓</span>
        <span>${escapeHtml(cert)}</span>
      </div>
    `).join('');
  }

  function renderSkillsAndSoftware() {
    // Software
    const softContainer = document.getElementById('software-tags');
    if (softContainer && cvData.software) {
      softContainer.innerHTML = cvData.software.map(s => `
        <span class="tag-pill">${escapeHtml(s)}</span>
      `).join('');
    }

    // Skills
    const skillsContainer = document.getElementById('skills-tags');
    if (skillsContainer && cvData.skills) {
      skillsContainer.innerHTML = cvData.skills.map(s => `
        <span class="tag-pill">${escapeHtml(s)}</span>
      `).join('');
    }

    // Languages
    const langContainer = document.getElementById('languages-list');
    if (langContainer && cvData.languages) {
      const list = cvData.languages[currentLang] || cvData.languages['es'] || [];
      langContainer.innerHTML = list.map(item => `
        <div class="lang-item">
          <span class="lang-name">${escapeHtml(item.name || item)}</span>
          ${item.level ? `<span class="lang-level">${escapeHtml(item.level)}</span>` : ''}
        </div>
      `).join('');
    }
  }

  // Switch language handler
  function switchLanguage(lang) {
    if (lang !== 'es' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem('preferred_cv_lang', lang);
    render();
  }

  // Load JSON and bootstrap app
  async function init() {
    currentLang = detectInitialLanguage();

    // Set current year in footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    // Bind language buttons
    const btnEs = document.getElementById('btn-lang-es');
    const btnEn = document.getElementById('btn-lang-en');
    if (btnEs) btnEs.addEventListener('click', () => switchLanguage('es'));
    if (btnEn) btnEn.addEventListener('click', () => switchLanguage('en'));

    // Bind Print A4 button
    const printBtn = document.getElementById('btn-print-a4');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }

    try {
      const res = await fetch('data/cv.json', { cache: 'no-cache' });
      if (!res.ok) {
        throw new Error(`Error ${res.status} al cargar cv.json`);
      }
      cvData = await res.json();
      render();
    } catch (err) {
      console.error('Error cargando los datos del CV:', err);
      // Fallback message if fetch fails
      const hero = document.getElementById('profile-headline');
      if (hero) {
        hero.textContent = 'Aviso: No se pudo cargar data/cv.json automáticamente. Verifica que el archivo exista en la ruta docs/data/cv.json.';
      }
    }
  }

  // Launch when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
