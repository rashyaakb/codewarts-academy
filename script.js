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
const scratchSlots = document.querySelectorAll('#scratch-projects .empty-project');
if (scratchSlots[0]) {
  scratchSlots[0].classList.remove('empty-project');
  scratchSlots[0].classList.add('featured');
  scratchSlots[0].innerHTML = `<div class="project-media"><video controls preload="metadata" aria-label="Space Shooter Scratch game"><source src="assets/scratch-space-shooter.mp4" type="video/mp4" />Your browser does not support this video.</video></div><div class="project-info"><span>Project 02</span><h4>Space Shooter Game</h4><p>A fast-paced Scratch game built by a young Codewarts creator.</p></div>`;
}
