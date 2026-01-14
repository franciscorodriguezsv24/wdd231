// Course display and filtering functionality

// DOM Elements
const coursesContainer = document.getElementById('coursesContainer');
const creditsTotalElement = document.getElementById('creditsTotal');
const filterButtons = document.querySelectorAll('.filter-btn');

// Current filter state
let currentFilter = 'all';

// Display courses based on filter
function displayCourses(coursesToDisplay) {
    coursesContainer.innerHTML = '';

    coursesToDisplay.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = `course-card${course.completed ? ' completed' : ''}`;
        courseCard.textContent = `${course.subject} ${course.number}`;
        courseCard.title = `${course.title} - ${course.credits} credits${course.completed ? ' (Completed)' : ''}`;
        coursesContainer.appendChild(courseCard);
    });
}

// Filter courses by subject
function filterCourses(filter) {
    currentFilter = filter;

    let filteredCourses;
    if (filter === 'all') {
        filteredCourses = courses;
    } else {
        filteredCourses = courses.filter(course => course.subject === filter);
    }

    displayCourses(filteredCourses);
    updateCreditsTotal(filteredCourses);
}

// Calculate and update total credits using reduce
function updateCreditsTotal(coursesToCount) {
    const totalCredits = coursesToCount.reduce((total, course) => total + course.credits, 0);
    creditsTotalElement.textContent = `Total Credits: ${totalCredits}`;
}

// Setup filter button event listeners
function setupFilterButtons() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter courses
            const filter = button.dataset.filter;
            filterCourses(filter);
        });
    });
}

// Initialize courses
function initCourses() {
    displayCourses(courses);
    updateCreditsTotal(courses);
    setupFilterButtons();
}
