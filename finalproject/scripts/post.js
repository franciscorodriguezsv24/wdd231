const DRAFT_KEY = 'skillconnect-draft';

// ===== DOM Elements =====
const form = document.getElementById('postForm');
const charCount = document.getElementById('charCount');
const skillsInput = document.getElementById('skills');

// ===== Form Fields to Save =====
const fields = ['fullName', 'email', 'phone', 'category', 'skills', 'experience', 'hourlyRate', 'serviceArea'];

// ===== Load Draft from localStorage =====
function loadDraft() {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
    if (!draft) return;

    fields.forEach(field => {
        const el = document.getElementById(field);
        if (el && draft[field]) {
            el.value = draft[field];
        }
    });

    // Load radio button
    if (draft.availability) {
        const radio = document.querySelector(`input[name="availability"][value="${draft.availability}"]`);
        if (radio) radio.checked = true;
    }

    // Update char count
    if (skillsInput && charCount) {
        charCount.textContent = skillsInput.value.length;
    }
}

// ===== Save Draft to localStorage =====
function saveDraft() {
    const draft = {};
    fields.forEach(field => {
        const el = document.getElementById(field);
        if (el) draft[field] = el.value;
    });

    const selectedRadio = document.querySelector('input[name="availability"]:checked');
    if (selectedRadio) draft.availability = selectedRadio.value;

    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

// ===== Character Counter =====
if (skillsInput && charCount) {
    skillsInput.addEventListener('input', () => {
        charCount.textContent = skillsInput.value.length;
    });
}

// ===== Auto-save on input =====
if (form) {
    form.addEventListener('input', saveDraft);
    form.addEventListener('change', saveDraft);
}

// ===== Form Validation =====
function validateForm() {
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    // Full Name
    const fullName = document.getElementById('fullName');
    if (!fullName.value.trim()) {
        showError('fullName');
        isValid = false;
    }

    // Email
    const email = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        showError('email');
        isValid = false;
    }

    // Phone
    const phone = document.getElementById('phone');
    if (!phone.value.trim()) {
        showError('phone');
        isValid = false;
    }

    // Category
    const category = document.getElementById('category');
    if (!category.value) {
        showError('category');
        isValid = false;
    }

    // Skills
    if (!skillsInput.value.trim()) {
        showError('skills');
        isValid = false;
    }

    // Experience
    const experience = document.getElementById('experience');
    if (!experience.value || experience.value < 0 || experience.value > 50) {
        showError('experience');
        isValid = false;
    }

    // Hourly Rate
    const hourlyRate = document.getElementById('hourlyRate');
    if (!hourlyRate.value || hourlyRate.value < 1) {
        showError('hourlyRate');
        isValid = false;
    }

    // Availability
    const availability = document.querySelector('input[name="availability"]:checked');
    if (!availability) {
        const radioGroup = document.querySelector('.radio-group').closest('.form-group');
        if (radioGroup) radioGroup.classList.add('error');
        isValid = false;
    }

    // Service Area
    const serviceArea = document.getElementById('serviceArea');
    if (!serviceArea.value.trim()) {
        showError('serviceArea');
        isValid = false;
    }

    // Terms
    const terms = document.getElementById('terms');
    if (!terms.checked) {
        const termsGroup = terms.closest('.form-group');
        if (termsGroup) termsGroup.classList.add('error');
        isValid = false;
    }

    return isValid;
}

function showError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        const group = field.closest('.form-group');
        if (group) group.classList.add('error');
    }
}

// ===== Form Submit =====
if (form) {
    form.addEventListener('submit', (e) => {
        if (!validateForm()) {
            e.preventDefault();
            const firstError = form.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
            if (firstError) firstError.focus();
            return;
        }
        // Clear draft on successful submit
        localStorage.removeItem(DRAFT_KEY);
    });
}

// ===== Initialize =====
loadDraft();
