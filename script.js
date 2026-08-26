const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
}));
const projectTabs = document.querySelectorAll('.project-tab');
const projectPanels = document.querySelectorAll('.project-panel');
function showProjectTab(tabName) {
  projectTabs.forEach(tab => { const active = tab.dataset.tab === tabName; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', active); });
  projectPanels.forEach(panel => { const active = panel.dataset.panel === tabName; panel.classList.toggle('active', active); panel.hidden = !active; });
}
projectTabs.forEach(tab => tab.addEventListener('click', () => showProjectTab(tab.dataset.tab)));
document.querySelectorAll('.project-link').forEach(link => link.addEventListener('click', () => showProjectTab(link.dataset.projectTab)));
