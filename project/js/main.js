// Footer Year & Last Modified
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Navigation toggle (mobile)
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Course Data Array
const courses = [
  { id: 1, name: 'Calculus I', subject: 'math', credits: 3, completed: true },
  { id: 2, name: 'Algebra II', subject: 'math', credits: 3, completed: false },
  { id: 3, name: 'Intro to CS', subject: 'cs', credits: 4, completed: true },
  { id: 4, name: 'Data Structures', subject: 'cs', credits: 3, completed: false },
];

// Elements
const courseList = document.getElementById('courseList');
const totalCreditsEl = document.getElementById('totalCredits');

// Render courses
function renderCourses(filter = 'all') {
  courseList.innerHTML = '';
  const filtered = filter === 'all' ? courses : courses.filter(c => c.subject === filter);

  filtered.forEach(course => {
    const card = document.createElement('div');
    card.className = 'course-card' + (course.completed ? ' completed' : '');
    card.innerHTML = `
      <h3>${course.name}</h3>
      <p>Subject: ${course.subject}</p>
      <p>Credits: ${course.credits}</p>
      <p>${course.completed ? '✅ Completed' : 'In Progress'}</p>
    `;
    courseList.appendChild(card);
  });

  // Total credits with reduce
  const totalCredits = filtered.reduce((sum, c) => sum + c.credits, 0);
  totalCreditsEl.textContent = totalCredits;
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    renderCourses(btn.dataset.subject);
  });
});

// Initial render
renderCourses();
