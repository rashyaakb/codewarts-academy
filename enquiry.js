const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton?.setAttribute('aria-expanded', 'false');
}));
const form = document.querySelector('#trial-booking-form');
const mobileCta = document.querySelector('.mobile-trial-cta');
if ('IntersectionObserver' in window && form && mobileCta) {
  new IntersectionObserver(entries => {
    mobileCta.hidden = entries[0].isIntersecting;
  }).observe(document.querySelector('#contact'));
}
const courseNames = {scratch: 'Scratch', minecraft: 'Minecraft Education', python: 'Python'};
const params = new URLSearchParams(location.search);
const course = params.get('course');
if (courseNames[course]) form.elements.programme.value = courseNames[course];
document.querySelectorAll('[data-course]').forEach(link => link.addEventListener('click', () => {
  form.elements.programme.value = courseNames[link.dataset.course];
  if (!document.querySelector('#message-result').hidden) prepareMessage();
}));
// Campaign labels travel in the parent's draft; this is not conversion tracking.
// No cookies, analytics service, storage or background submission is used.
function campaignLabel() {
  return ['utm_source','utm_medium','utm_campaign','utm_content']
    .map(key => [key, (params.get(key) || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64)])
    .filter(([,value]) => value).map(([key,value]) => `${key}=${value}`).join('; ');
}
function prepareMessage() {
  const age = form.elements.age.value;
  if (!age) return;
  const message = `Hi Codewarts Academy! I'd like to ask about a free 30-minute coding trial.\n\nChild's age range: ${age}\nInterested in: ${form.elements.programme.value}\n\nPlease send the course fees, setup requirements and available trial times.`;
  const source = campaignLabel();
  const complete = message + (source ? `\n\nFound you through: ${source}` : '');
  document.querySelector('#prepared-message').value = complete;
  document.querySelector('#email-message').href = `mailto:codewarts@gmail.com?subject=${encodeURIComponent('Free 30-minute coding trial enquiry')}&body=${encodeURIComponent(complete)}`;
  document.querySelector('#message-result').hidden = false;
  document.querySelector('#copy-status').textContent = '';
}
form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  prepareMessage();
  const messageField = document.querySelector('#prepared-message');
  messageField.focus();
  messageField.setSelectionRange(0, 0);
  messageField.scrollTop = 0;
});
form?.addEventListener('change', () => {
  if (!document.querySelector('#message-result').hidden) prepareMessage();
});
document.querySelector('#copy-message')?.addEventListener('click', async () => {
  const field = document.querySelector('#prepared-message');
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(field.value);
    status.textContent = 'Copied. Open Instagram or Facebook, tap Message, then paste and send.';
  } catch {
    field.focus(); field.select();
    status.textContent = 'Please copy the selected text, then paste it into your message.';
  }
});
