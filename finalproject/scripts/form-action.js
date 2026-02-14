const params = new URLSearchParams(window.location.search);
const container = document.getElementById('submittedData');

const labelMap = {
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    category: 'Service Category',
    skills: 'Skills',
    experience: 'Years of Experience',
    hourlyRate: 'Hourly Rate',
    availability: 'Availability',
    serviceArea: 'Service Area'
};

if (container) {
    let html = '';
    for (const [key, label] of Object.entries(labelMap)) {
        const value = params.get(key);
        if (value) {
            const displayValue = key === 'hourlyRate' ? `$${value}/hr` : value;
            html += `<dt>${label}</dt><dd>${displayValue}</dd>`;
        }
    }

    if (!html) {
        html = '<p>No data was submitted. Please <a href="post.html">go back and fill out the form</a>.</p>';
    }

    container.innerHTML = html;
}
