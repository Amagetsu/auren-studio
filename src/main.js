import './style.css';
import { projects, studioConfig } from './config.js';
import { translations } from './translations.js';

const languages = ['de', 'en', 'ru'];
let currentLanguage = localStorage.getItem('auren-language') || 'de';
if (!languages.includes(currentLanguage)) currentLanguage = 'de';
let activeFaq = 0;
let menuIsOpen = false;

const get = (path) => path.split('.').reduce((value, key) => value?.[key], translations[currentLanguage]);
const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const icon = (name) => ({ arrow: '<span aria-hidden="true">↗</span>', plus: '<span aria-hidden="true">+</span>', check: '<span aria-hidden="true">✓</span>' }[name] || '');
const telegramIcon = '<svg class="telegram-icon" aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M21.5 3.5 18.2 20c-.25 1.17-.9 1.46-1.82.91l-5.02-3.7-2.42 2.33c-.27.27-.5.5-1.03.5l.37-5.12 9.32-8.42c.41-.37-.09-.58-.64-.21L5.44 13.9.55 12.37c-1.06-.33-1.08-1.06.22-1.57L19.87 3.2c.9-.33 1.69.21 1.63.3Z" /></svg>';
let scrollAnimationFrame;

function smoothScrollTo(top) { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { window.scrollTo(0, top); return; } cancelAnimationFrame(scrollAnimationFrame); const start = window.scrollY; const distance = top - start; const duration = Math.min(760, Math.max(420, Math.abs(distance) * 0.42)); const startedAt = performance.now(); const ease = (progress) => 1 - Math.pow(1 - progress, 4); const step = (now) => { const progress = Math.min(1, (now - startedAt) / duration); window.scrollTo(0, start + distance * ease(progress)); if (progress < 1) scrollAnimationFrame = requestAnimationFrame(step); }; scrollAnimationFrame = requestAnimationFrame(step); }

function header() {
  const n = get('navigation');
  return `<header class="site-header" id="site-header"><a class="logo" href="#top" aria-label="AUREN Studio">AUREN <small>Studio</small></a><button class="menu-toggle" aria-expanded="false" aria-controls="main-nav"><span></span><span></span><span></span><span class="sr-only">${n.menu}</span></button><nav class="main-nav" id="main-nav" aria-label="${n.menu}"><a href="#projects">${n.projects}</a><a href="#services">${n.services}</a><a href="#process">${n.process}</a><a href="#studio">${n.studio}</a><a href="#contact">${n.contact}</a><div class="language-switcher" role="group" aria-label="Language"><button data-lang="de" class="${currentLanguage === 'de' ? 'active' : ''}">DE</button><button data-lang="en" class="${currentLanguage === 'en' ? 'active' : ''}">EN</button><button data-lang="ru" class="${currentLanguage === 'ru' ? 'active' : ''}">RU</button></div><a class="button button-small button-light nav-cta" href="#contact-form">${n.cta} ${icon('arrow')}</a></nav></header>`;
}

function hero() { const h = get('hero'); const p = get('projects'); return `<section class="hero" id="top"><div class="hero-grid container"><div class="hero-copy"><p class="eyebrow">${h.eyebrow}</p><h1>${h.title}</h1><p class="hero-text">${h.text}</p><div class="hero-actions"><a class="button button-primary" href="#contact-form">${h.primary} ${icon('arrow')}</a><a class="text-link" href="#projects">${h.secondary} ${icon('arrow')}</a></div><p class="trust-line">${h.trust}</p></div><div class="hero-visual" aria-label="${h.browserLabel}" data-parallax-root><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="case-study-card" data-parallax="0.35"><div class="case-study-top"><span>${p.concept}</span><span>01 / 01</span></div><div class="case-study-art"><span class="art-kicker">Klaro</span><strong>Sauberkeit,<br /><em>die bleibt.</em></strong><div class="art-circle">K</div><span class="art-tag">Reinigung · Kassel</span></div><div class="case-study-footer"><strong>Klaro Kassel</strong><span>${h.cardLabel}</span></div></div><div class="float-card float-card-top" data-parallax="-0.25"><span>01</span><strong>Klaro Kassel</strong><small>${p.concept}</small></div><div class="float-card float-card-bottom" data-parallax="0.18"><span class="mini-mark">A</span><strong>${h.cardLabel}</strong><small>${h.localLabel}</small></div></div></div><div class="hero-bottom container"><span>${h.scroll}</span><span class="line"></span><span>01 / 06</span></div></section>`; }

function projectPreview(project) { if (project.id === 'flowers') return `<div class="project-art flower-project-art"><span class="art-kicker">With Love Flowers</span><strong>Blumen,<br /><em>die fühlen.</em></strong><div class="flower-mark">✽</div><span class="art-tag">Floristik · persönlich · Kassel</span></div>`; return `<div class="project-art"><span class="art-kicker">Klaro</span><strong>Sauberkeit,<br /><em>die bleibt.</em></strong><div class="art-circle">K</div><span class="art-tag">Reinigung · Kassel</span></div>`; }

function projectCard(project, index, p) { const projectLink = `href="${esc(project.href)}" target="_blank" rel="noopener noreferrer"`; const copy = { category: p[`${project.id}Category`], status: p[`${project.id}Concept`] || p.concept, description: p[`${project.id}Description`] || project.description }; const domain = new URL(project.href).hostname; return `<article class="project-feature reveal ${project.id === 'flowers' ? 'project-feature-secondary' : ''}" style="--delay:${index * 80}ms"><a class="project-preview project-preview-link" ${projectLink} aria-label="${esc(project.name)} — ${esc(project.demoLabel)}"><div class="project-window"><div class="window-top"><span>${domain}</span><span>↗</span></div>${projectPreview(project)}</div></a><div class="project-info"><div class="project-meta"><span class="project-demo-label">${esc(project.demoLabel)}</span><span>${project.id === 'flowers' ? '2026' : '2024'}</span></div><h3><a class="project-title-link" ${projectLink}>${esc(project.name)}</a></h3><p class="project-category">${copy.category}</p><p>${esc(copy.description)}</p><p class="project-disclaimer">${esc(project.demoDisclaimer)}</p><div class="task-list"><span>${p.tasks}</span>${project.tasks.map((task) => `<b>${icon('check')} ${task}</b>`).join('')}</div><a class="button button-outline" ${projectLink}>${p.view} ${icon('arrow')}</a></div></article>`; }

function projectsSection() { const p = get('projects'); return `<section class="section projects-section" id="projects"><div class="container"><div class="section-heading reveal"><div><p class="eyebrow">${p.eyebrow}</p><h2>${p.title}</h2></div><p>${p.intro}</p></div><div class="projects-list">${projects.map((project, index) => projectCard(project, index, p)).join('')}</div><div class="next-project reveal"><span class="next-number">03</span><div><p class="eyebrow">${p.next}</p><p>${p.nextText}</p></div><span class="next-dash">—</span></div></div></section>`; }

function servicesSection() { const s = get('services'); const primary = s.items.slice(0, 3); const secondary = s.items.slice(3); return `<section class="section cream-section" id="services"><div class="container"><div class="section-heading reveal"><div><p class="eyebrow">${s.eyebrow}</p><h2>${s.title}</h2></div><p>${s.intro}</p></div><div class="service-grid primary-services">${primary.map((item, i) => `<article class="service-card reveal" style="--delay:${i * 60}ms"><span class="card-index">0${i + 1}</span><h3>${item.title}</h3><p>${item.text}</p><span class="card-arrow">↗</span></article>`).join('')}</div><div class="secondary-services reveal"><span class="secondary-label">${s.secondaryLabel}</span>${secondary.map((item) => `<span class="secondary-service"><b>${item.title}</b><small>${item.text}</small></span>`).join('')}</div></div></section>`; }

function advantagesSection() { const a = get('advantages'); return `<section class="section dark-section advantages-section"><div class="container advantage-layout"><div class="advantage-intro reveal"><p class="eyebrow">${a.eyebrow}</p><h2>${a.title}</h2><p>${a.text}</p></div><div class="advantage-list">${a.items.map((item, i) => `<div class="advantage-item reveal" style="--delay:${i * 70}ms"><span>0${i + 1}</span><div><h3>${item.title}</h3><p>${item.text}</p></div><b>↗</b></div>`).join('')}</div></div></section>`; }

function processSection() { const p = get('process'); return `<section class="section process-section" id="process"><div class="container"><div class="section-heading reveal"><div><p class="eyebrow">${p.eyebrow}</p><h2>${p.title}</h2></div></div><div class="process-timeline">${p.steps.map((step, i) => `<article class="process-step reveal" style="--delay:${i * 70}ms"><div class="timeline-marker"><span>${step.n}</span></div><div class="process-step-copy"><h3>${step.title}</h3><p>${step.text}</p></div></article>`).join('')}</div></div></section>`; }

function aboutSection() { const a = get('about'); return `<section class="section about-section" id="studio"><div class="container about-layout"><div class="about-mark reveal"><span>A</span><small>${studioConfig.country}</small></div><div class="about-copy reveal"><p class="eyebrow">${a.eyebrow}</p><h2>${a.title}</h2><p class="large-copy">${a.text}</p><p>${a.detail}</p><p>${a.extra}</p><div class="about-signature"><span class="signature-line"></span><span>${a.city}</span></div></div></div></section>`; }

function faqSection() { const f = get('faq'); return `<section class="section cream-section faq-section"><div class="container faq-layout"><div class="section-heading reveal"><div><p class="eyebrow">${f.eyebrow}</p><h2>${f.title}</h2></div></div><div class="faq-list">${f.items.map((item, i) => `<div class="faq-item reveal ${activeFaq === i ? 'open' : ''}" style="--delay:${i * 45}ms"><button aria-expanded="${activeFaq === i}" aria-controls="faq-answer-${i}" data-faq="${i}"><span>${item.q}</span><b>${activeFaq === i ? '−' : '+'}</b></button><div class="faq-answer" id="faq-answer-${i}" role="region" ${activeFaq === i ? '' : 'hidden'}><p>${item.a}</p></div></div>`).join('')}</div></div></section>`; }

function contactSection() { const c = get('contact'); return `<section class="contact-wrap" id="contact"><div class="contact-cta reveal"><div class="container contact-cta-inner"><p class="eyebrow">${c.eyebrow}</p><h2>${c.title}</h2><p>${c.text}</p><a class="button button-primary" href="#contact-form">${c.cta} ${icon('arrow')}</a><small>${c.note}</small></div></div><div class="section contact-section"><div class="container form-layout"><div class="form-intro reveal"><p class="eyebrow">${c.formTitle}</p><h2>${c.formTitle}</h2><p>${c.formText}</p><div class="contact-direct"><a href="mailto:${esc(studioConfig.email)}">${esc(studioConfig.email)}</a><a href="tel:${esc(studioConfig.phone.replace(/\s/g, ''))}">${esc(studioConfig.phone)}</a><a class="button button-dark contact-telegram" href="${esc(studioConfig.telegramUrl)}" target="_blank" rel="noopener noreferrer">${telegramIcon}<span>Telegram ${esc(studioConfig.telegramUsername)}</span>${icon('arrow')}</a></div></div><form class="contact-form reveal" id="contact-form" novalidate><div class="form-grid"><label>${c.name} *<input name="name" required autocomplete="name" /></label><label>${c.company}<input name="company" autocomplete="organization" /></label><label>${c.email} *<input name="email" type="email" required autocomplete="email" /></label><label>${c.phone}<input name="phone" type="tel" autocomplete="tel" /></label></div><label>${c.type} *<select name="projectType" required><option value="">${c.select}</option>${c.options.map((option) => `<option>${option}</option>`).join('')}</select></label><label>${c.website}<input name="website" type="url" placeholder="https://" /></label><label>${c.message} *<textarea name="message" required rows="5"></textarea></label><label class="honeypot" aria-hidden="true">Website<input name="companyWebsite" tabindex="-1" autocomplete="off" /></label><label class="checkbox-label"><input name="privacy" type="checkbox" required /><span>${c.privacy} *</span></label><div class="form-footer"><button class="button button-dark" type="submit">${c.send} ${icon('arrow')}</button><p class="form-status" role="status" aria-live="polite"></p></div></form></div></div></section>`; }

function footer() { const f = get('footer'); const n = get('navigation'); return `<footer class="site-footer"><div class="container footer-grid"><div><a class="logo footer-logo" href="#top">AUREN <small>Studio</small></a><p>${f.tagline}</p><p>${esc(studioConfig.ownerName)} · ${esc(studioConfig.city)}, ${esc(studioConfig.country)}</p></div><div><p class="footer-label">${f.nav}</p><a href="#projects">${n.projects}</a><a href="#services">${n.services}</a><a href="#process">${n.process}</a><a href="#contact">${n.contact}</a></div><div><p class="footer-label">${f.legal}</p><a href="/impressum">${f.imprint}</a><a href="/datenschutz">${f.privacy}</a><a href="mailto:${esc(studioConfig.email)}">${esc(studioConfig.email)}</a><a href="tel:${esc(studioConfig.phone.replace(/\s/g, ''))}">${esc(studioConfig.phone)}</a></div><div><p class="footer-label">${currentLanguage.toUpperCase()}</p><div class="language-switcher footer-languages"><button data-lang="de" class="${currentLanguage === 'de' ? 'active' : ''}">DE</button><button data-lang="en" class="${currentLanguage === 'en' ? 'active' : ''}">EN</button><button data-lang="ru" class="${currentLanguage === 'ru' ? 'active' : ''}">RU</button></div></div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} ${studioConfig.studioName}. ${f.rights}</span><span>${esc(studioConfig.city)} · ${studioConfig.country}</span></div></footer>`; }

let revealObserver;

function observeReveals() { if (!revealObserver) revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }), { threshold: 0.12 }); document.querySelectorAll('.reveal:not(.is-visible)').forEach((element) => revealObserver.observe(element)); }

function setMenuOpen(open, { focus = false } = {}) {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuIsOpen = Boolean(open);
  nav?.classList.toggle('open', menuIsOpen);
  menuButton?.classList.toggle('is-open', menuIsOpen);
  menuButton?.setAttribute('aria-expanded', String(menuIsOpen));
  document.body.classList.toggle('menu-open', menuIsOpen);
  if (!menuIsOpen && focus && menuButton) menuButton.focus({ preventScroll: true });
}

function closeMenu(options = {}) { setMenuOpen(false, options); }

function render() {
  closeMenu({ focus: false });
  document.documentElement.lang = currentLanguage;
  document.title = currentLanguage === 'de' ? 'AUREN Studio – Webdesign & Entwicklung für lokale Unternehmen' : currentLanguage === 'en' ? 'AUREN Studio – Web design & development for local businesses' : 'AUREN Studio — веб-дизайн и разработка для локального бизнеса';
  document.querySelector('#app').innerHTML = `${header()}${hero()}${projectsSection()}${servicesSection()}${advantagesSection()}${processSection()}${aboutSection()}${faqSection()}${contactSection()}${footer()}`;
  bindInteractions();
  observeReveals();
}

function bindInteractions() {
  document.querySelectorAll('[data-lang]').forEach((button) => button.addEventListener('click', () => {
    const preservedScroll = window.scrollY;
    closeMenu({ focus: false });
    currentLanguage = button.dataset.lang;
    localStorage.setItem('auren-language', currentLanguage);
    activeFaq = 0;
    render();
    requestAnimationFrame(() => window.scrollTo({ top: preservedScroll, behavior: 'auto' }));
  }));
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuButton?.addEventListener('click', () => setMenuOpen(!menuIsOpen));
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    if (menuIsOpen) closeMenu({ focus: false });
  }));
  nav?.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menuIsOpen) closeMenu({ focus: true }); });
  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => { const selector = link.getAttribute('href'); const target = selector && document.querySelector(selector); if (!target) return; event.preventDefault(); const headerHeight = document.querySelector('#site-header')?.offsetHeight || 0; const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18; smoothScrollTo(Math.max(0, top)); history.replaceState(null, '', selector); if (nav.classList.contains('open')) closeMenu(); }));
  document.querySelectorAll('[data-faq]').forEach((button) => button.addEventListener('click', () => { const next = Number(button.dataset.faq); const beforeTop = button.getBoundingClientRect().top; activeFaq = activeFaq === next ? -1 : next; document.querySelectorAll('.faq-item').forEach((item, index) => { const itemButton = item.querySelector('[data-faq]'); const answer = item.querySelector('.faq-answer'); const isOpen = index === activeFaq; item.classList.toggle('open', isOpen); itemButton.setAttribute('aria-expanded', String(isOpen)); itemButton.querySelector('b').textContent = isOpen ? '−' : '+'; answer.hidden = !isOpen; }); requestAnimationFrame(() => { window.scrollBy({ top: button.getBoundingClientRect().top - beforeTop, behavior: 'auto' }); button.focus({ preventScroll: true }); }); }));
  const form = document.querySelector('#contact-form'); form.addEventListener('submit', handleSubmit);
  const parallaxRoot = document.querySelector('[data-parallax-root]');
  if (parallaxRoot && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) parallaxRoot.addEventListener('pointermove', (event) => { const bounds = parallaxRoot.getBoundingClientRect(); const x = (event.clientX - bounds.left) / bounds.width - 0.5; const y = (event.clientY - bounds.top) / bounds.height - 0.5; parallaxRoot.querySelectorAll('[data-parallax]').forEach((element) => { const strength = Number(element.dataset.parallax); element.style.setProperty('--parallax-x', `${x * strength * 18}px`); element.style.setProperty('--parallax-y', `${y * strength * 18}px`); }); });
}

async function handleSubmit(event) { event.preventDefault(); const form = event.currentTarget; const status = form.querySelector('.form-status'); const c = get('contact'); const data = Object.fromEntries(new FormData(form).entries()); if (data.companyWebsite) return; let valid = true; form.querySelectorAll('[required]').forEach((field) => { field.classList.toggle('invalid', !field.checkValidity()); if (!field.checkValidity()) valid = false; }); if (!valid) { status.textContent = data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? c.invalidEmail : c.required; status.className = 'form-status error'; return; } status.textContent = c.sending; status.className = 'form-status'; form.querySelector('button[type="submit"]').disabled = true; try { const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (!response.ok) throw new Error('Request failed'); status.textContent = c.success; status.className = 'form-status success'; form.reset(); } catch (error) { status.textContent = c.error; status.className = 'form-status error'; } finally { form.querySelector('button[type="submit"]').disabled = false; } }

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'auto' });
render();
window.addEventListener('scroll', () => document.querySelector('#site-header')?.classList.toggle('scrolled', window.scrollY > 24), { passive: true });
const mobileViewport = window.matchMedia('(max-width: 900px)');
const handleViewportChange = (event) => { if (!event.matches) closeMenu({ focus: false }); };
if (mobileViewport.addEventListener) mobileViewport.addEventListener('change', handleViewportChange);
else mobileViewport.addListener(handleViewportChange);
