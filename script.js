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
  scratchSlots[0].innerHTML = `<div class="project-media"><video controls preload="metadata" aria-label="Space Shooter Scratch game"><source src="assets/scratch-space-shooter.mp4" type="video/mp4" />Your browser does not support this video.</video></div><div class="project-info"><span>Project 02</span><h4>Space Shooter Game</h4><p>Learn to create a shooter game with projectiles.</p></div>`;
}
if (scratchSlots[1]) {
  scratchSlots[1].classList.remove('empty-project');
  scratchSlots[1].classList.add('featured');
  scratchSlots[1].innerHTML = `<div class="project-media"><video controls preload="metadata" aria-label="Pingpong Scratch game"><source src="assets/scratch-pingpong.mp4" type="video/mp4" />Your browser does not support this video.</video></div><div class="project-info"><span>Project 03</span><h4>Pingpong Game</h4><p>Understand how to use physics in code to make a pingpong-like function!</p></div>`;
}
const marioDescription = document.querySelector('#scratch-projects .project-card:first-of-type .project-info p');
if (marioDescription) marioDescription.textContent = 'Create a game where you control a character on its adventure.';

const bookingForm = document.querySelector('#trial-booking-form');
bookingForm?.addEventListener('submit', event => {
  event.preventDefault();
  const details = new FormData(bookingForm);
  const name = details.get('name');
  const age = details.get('age');
  const programme = details.get('programme') || 'Not sure yet';
  const project = details.get('message') || 'Not sure yet';
  const message = `Hi Codewarts Academy! I’d like to book a free 30-minute trial for my child.\n\nParent / guardian: ${name}\nChild’s age: ${age}\nInterested in: ${programme}\nThey would love to make: ${project}`;
  window.open(`https://wa.me/60177090340?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});
