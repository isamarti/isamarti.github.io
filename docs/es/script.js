document.addEventListener('DOMContentLoaded', () => {
    const passwordOverlay = document.getElementById('password-overlay');
    const content = document.getElementById('main-content');
    const passwordInput = document.getElementById('password-input');
    const submitBtn = document.getElementById('submit-password');
    const errorMessage = document.getElementById('error-message');

    // If no password overlay exists, we are on a public page
    if (!passwordOverlay) return;

    // Check if this page requires a password
    // We can define the password in a data attribute on the body or script tag
    // For simplicity, we'll look for a global variable or data attribute
    const requiredPassword = document.body.dataset.password;
    const lessonId = document.body.dataset.lessonId; // e.g., 'lesson1'

    // Check sessionStorage to see if already unlocked
    if (sessionStorage.getItem(`unlocked_${lessonId}`) === 'true') {
        unlockPage();
        return;
    }

    submitBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPassword();
    });

    function checkPassword() {
        const input = passwordInput.value;
        if (input === requiredPassword) {
            sessionStorage.setItem(`unlocked_${lessonId}`, 'true');
            unlockPage();
        } else {
            errorMessage.textContent = "Incorrect password. Please try again.";
            errorMessage.style.color = "#ef4444";
            passwordInput.value = '';
            passwordInput.focus();

            // Shake animation
            const box = document.querySelector('.password-box');
            box.style.animation = 'none';
            box.offsetHeight; /* trigger reflow */
            box.style.animation = 'shake 0.5s';
        }
    }

    function unlockPage() {
        passwordOverlay.style.opacity = '0';
        setTimeout(() => {
            passwordOverlay.style.display = 'none';
            content.classList.remove('hidden-content');
            // Trigger any animations that were waiting
            document.querySelectorAll('.animate-on-load').forEach(el => {
                el.classList.add('visible');
            });
        }, 500);
    }
});

// Shake animation style injection
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    75% { transform: translateX(-10px); }
    100% { transform: translateX(0); }
}
`;
document.head.appendChild(styleSheet);
