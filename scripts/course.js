// ============================================================
// WDD 231 — Course list, filters, credits, and detail dialog
// ============================================================

const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Introduction to programming concepts using Python including variables, data types, control structures, functions, and basic algorithms.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Foundations of HTML and CSS, accessibility, responsive design, and using developer tools.',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Programming using functions, modules, libraries, file I/O, lists, dictionaries, and testing in Python.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Object-oriented programming using classes, inheritance, polymorphism and abstraction in C#.',
        technology: ['C#'],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'Dynamic web pages using JavaScript, DOM manipulation, events, and using browser APIs.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Web Frontend Development I',
        credits: 3,
        certificate: 'Web and Computer Programming',
        description: 'Intermediate web frontend development using HTML, CSS, JavaScript, the fetch API, JSON data, and responsive design.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    }
];

const coursesList = document.getElementById('coursesList');
const creditsSection = document.getElementById('creditsSection');
const filterButtons = document.querySelectorAll('.resources button');
const dialog = document.getElementById('course-details');

function renderCourses(filter = 'all') {
    let filtered = courses;
    if (filter === 'wdd') filtered = courses.filter(c => c.subject === 'WDD');
    if (filter === 'cse') filtered = courses.filter(c => c.subject === 'CSE');

    coursesList.innerHTML = '';
    filtered.forEach(course => {
        const div = document.createElement('button');
        div.type = 'button';
        div.className = 'course' + (course.completed ? ' completed' : '');
        div.textContent = `${course.subject} ${course.number}`;
        div.setAttribute('aria-label',
            `${course.subject} ${course.number}: ${course.title}` +
            (course.completed ? ' — completed' : ' — not completed yet'));
        div.addEventListener('click', () => showCourseDetails(course));
        coursesList.appendChild(div);
    });

    const totalCredits = filtered.reduce((sum, c) => sum + c.credits, 0);
    creditsSection.innerHTML =
        `<p>Total credits shown: <strong>${totalCredits}</strong> (${filtered.length} courses)</p>`;
}

function showCourseDetails(course) {
    dialog.innerHTML = `
        <div class="dialog-inner">
            <button class="close-btn" aria-label="Close dialog">&times;</button>
            <h3>${course.subject} ${course.number}</h3>
            <h4>${course.title}</h4>
            <p><strong>Credits:</strong> ${course.credits}</p>
            <p><strong>Certificate:</strong> ${course.certificate}</p>
            <p><strong>Description:</strong> ${course.description}</p>
            <p><strong>Technology:</strong> ${course.technology.join(', ')}</p>
            <p><strong>Status:</strong> ${course.completed ? '✅ Completed' : '⏳ In progress / Pending'}</p>
        </div>
    `;
    dialog.showModal();
    dialog.querySelector('.close-btn').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close();
    });
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCourses(btn.id);
    });
});

// Initial render
renderCourses('all');
