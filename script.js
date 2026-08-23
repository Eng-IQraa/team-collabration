/* =========================================================
   MERN TEAM PROJECT
   Main JavaScript
========================================================= */

"use strict";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const toastContainer = document.getElementById("toastContainer");

const contactForm = document.getElementById("contactForm");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const currentYear = document.getElementById("currentYear");

const logoutButton = document.getElementById("logoutButton");
const dashboardUser = document.getElementById("dashboardUser");


/* =========================================================
   CURRENT YEAR
========================================================= */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

/**
 * Opens and closes the mobile navigation menu.
 */
function toggleMobileMenu() {

    if (!menuToggle || !navMenu) {
        return;
    }

    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

}


/**
 * Closes the mobile menu.
 */
function closeMobileMenu() {

    if (!navMenu || !menuToggle) {
        return;
    }

    navMenu.classList.remove("open");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

}


if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        toggleMobileMenu
    );

}


/* Close menu when a navigation link is clicked */

navLinks.forEach((link) => {

    link.addEventListener(
        "click",
        closeMobileMenu
    );

});


/* Close mobile menu with Escape */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {
            closeMobileMenu();
        }

    }
);


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

function updateNavbarOnScroll() {

    if (!siteHeader) {
        return;
    }

    if (window.scrollY > 20) {

        siteHeader.classList.add("scrolled");

    } else {

        siteHeader.classList.remove("scrolled");

    }

}


window.addEventListener(
    "scroll",
    updateNavbarOnScroll,
    { passive: true }
);

updateNavbarOnScroll();


/* =========================================================
   ACTIVE NAVIGATION LINKS
========================================================= */

const sections = document.querySelectorAll(
    "main section[id]"
);


/**
 * Updates the active navigation link
 * based on the section currently visible.
 */
function updateActiveNavigation() {

    const scrollPosition =
        window.scrollY +
        window.innerHeight * 0.35;

    let currentSection = "home";

    sections.forEach((section) => {

        const sectionTop = section.offsetTop;
        const sectionBottom =
            sectionTop + section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionBottom
        ) {

            currentSection = section.id;

        }

    });


    navLinks.forEach((link) => {

        const href = link.getAttribute("href");

        link.classList.toggle(
            "active",
            href === `#${currentSection}`
        );

    });

}


window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);

updateActiveNavigation();


/* =========================================================
   SMOOTH SCROLLING
========================================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach((link) => {

    link.addEventListener(
        "click",
        (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

});


/* =========================================================
   DARK / LIGHT MODE
========================================================= */

const savedTheme =
    localStorage.getItem("mern-theme");


/**
 * Applies the selected theme.
 */
function applyTheme(theme) {

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

    if (themeIcon) {

        themeIcon.textContent =
            theme === "dark"
                ? "☀"
                : "☾";

    }

}


/* Use saved theme, otherwise use light theme */

applyTheme(
    savedTheme === "dark"
        ? "dark"
        : "light"
);


/**
 * Toggles between light and dark mode.
 */
function toggleTheme() {

    const currentTheme =
        document.documentElement.getAttribute(
            "data-theme"
        );

    const newTheme =
        currentTheme === "dark"
            ? "light"
            : "dark";

    applyTheme(newTheme);

    localStorage.setItem(
        "mern-theme",
        newTheme
    );

}


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        toggleTheme
    );

}


/* =========================================================
   SCROLL REVEAL ANIMATIONS
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });

} else {

    /*
     * Fallback for older browsers.
     */
    revealElements.forEach((element) => {

        element.classList.add("visible");

    });

}


/* =========================================================
   TOAST NOTIFICATIONS
========================================================= */

/**
 * Displays a toast notification.
 *
 * @param {string} message - Message to display.
 * @param {"success"|"error"|"info"} type - Notification type.
 */
function showToast(
    message,
    type = "info"
) {

    if (!toastContainer) {
        return;
    }


    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`;


    let icon = "i";

    if (type === "success") {
        icon = "✓";
    }

    if (type === "error") {
        icon = "!";
    }


    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>

        <span class="toast-message">
            ${escapeHTML(message)}
        </span>
    `;


    toastContainer.appendChild(toast);


    setTimeout(() => {

        toast.classList.add("removing");

        setTimeout(() => {

            toast.remove();

        }, 250);

    }, 3500);

}


/**
 * Prevents HTML injection when displaying
 * user-controlled text inside notifications.
 */
function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* Make showToast available for simple inline UI actions. */

window.showToast = showToast;


/* =========================================================
   VALIDATION HELPERS
========================================================= */

/**
 * Validates email format.
 */
function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


/**
 * Displays a field error.
 */
function setFieldError(
    input,
    errorElement,
    message
) {

    if (input) {
        input.classList.add("invalid");
    }

    if (errorElement) {
        errorElement.textContent = message;
    }

}


/**
 * Clears a field error.
 */
function clearFieldError(
    input,
    errorElement
) {

    if (input) {
        input.classList.remove("invalid");
    }

    if (errorElement) {
        errorElement.textContent = "";
    }

}


/* =========================================================
   CONTACT FORM
========================================================= */

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "contactName"
                );

            const email =
                document.getElementById(
                    "contactEmail"
                );

            const subject =
                document.getElementById(
                    "contactSubject"
                );

            const message =
                document.getElementById(
                    "contactMessage"
                );


            const nameError =
                document.getElementById(
                    "contactNameError"
                );

            const emailError =
                document.getElementById(
                    "contactEmailError"
                );

            const subjectError =
                document.getElementById(
                    "contactSubjectError"
                );

            const messageError =
                document.getElementById(
                    "contactMessageError"
                );


            let isValid = true;


            /* Name validation */

            if (name.value.trim().length < 2) {

                setFieldError(
                    name,
                    nameError,
                    "Please enter your full name."
                );

                isValid = false;

            } else {

                clearFieldError(
                    name,
                    nameError
                );

            }


            /* Email validation */

            if (!isValidEmail(email.value.trim())) {

                setFieldError(
                    email,
                    emailError,
                    "Please enter a valid email."
                );

                isValid = false;

            } else {

                clearFieldError(
                    email,
                    emailError
                );

            }


            /* Subject validation */

            if (subject.value.trim().length < 3) {

                setFieldError(
                    subject,
                    subjectError,
                    "Please enter a subject."
                );

                isValid = false;

            } else {

                clearFieldError(
                    subject,
                    subjectError
                );

            }


            /* Message validation */

            if (message.value.trim().length < 10) {

                setFieldError(
                    message,
                    messageError,
                    "Message must contain at least 10 characters."
                );

                isValid = false;

            } else {

                clearFieldError(
                    message,
                    messageError
                );

            }


            if (!isValid) {

                showToast(
                    "Please correct the highlighted fields.",
                    "error"
                );

                return;

            }


            /* Loading state */

            const submitButton =
                document.getElementById(
                    "contactSubmit"
                );


            submitButton.classList.add(
                "is-loading"
            );

            submitButton.disabled = true;


            /*
             * Simulated frontend request.
             *
             * IMPORTANT:
             * This does NOT send data to a backend.
             * Replace this section later with fetch()
             * when the Express API is available.
             */

            await wait(1200);


            submitButton.classList.remove(
                "is-loading"
            );

            submitButton.disabled = false;


            contactForm.reset();


            showToast(
                "Message submitted successfully!",
                "success"
            );

        }
    );

}


/* =========================================================
   LOGIN FORM
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                );

            const password =
                document.getElementById(
                    "loginPassword"
                );


            const emailError =
                document.getElementById(
                    "loginEmailError"
                );

            const passwordError =
                document.getElementById(
                    "loginPasswordError"
                );


            let isValid = true;


            /* Email */

            if (!isValidEmail(email.value.trim())) {

                setFieldError(
                    email,
                    emailError,
                    "Enter a valid email address."
                );

                isValid = false;

            } else {

                clearFieldError(
                    email,
                    emailError
                );

            }


            /* Password */

            if (password.value.length < 6) {

                setFieldError(
                    password,
                    passwordError,
                    "Password must be at least 6 characters."
                );

                isValid = false;

            } else {

                clearFieldError(
                    password,
                    passwordError
                );

            }


            if (!isValid) {

                showToast(
                    "Please check your login details.",
                    "error"
                );

                return;

            }


            /*
             * Frontend-only demonstration.
             *
             * There is intentionally NO fake backend
             * authentication here.
             */

            const emailName =
                email.value
                    .split("@")[0]
                    .trim();


            if (dashboardUser) {

                dashboardUser.textContent =
                    emailName || "Team Member";

            }


            showToast(
                "Login form validated successfully. Backend authentication is not connected yet.",
                "success"
            );


            setTimeout(() => {

                const dashboard =
                    document.getElementById(
                        "dashboard"
                    );

                if (dashboard) {

                    dashboard.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }, 700);

        }
    );

}


/* =========================================================
   REGISTER FORM
========================================================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "registerName"
                );

            const email =
                document.getElementById(
                    "registerEmail"
                );

            const password =
                document.getElementById(
                    "registerPassword"
                );

            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                );


            const nameError =
                document.getElementById(
                    "registerNameError"
                );

            const emailError =
                document.getElementById(
                    "registerEmailError"
                );

            const passwordError =
                document.getElementById(
                    "registerPasswordError"
                );

            const confirmPasswordError =
                document.getElementById(
                    "confirmPasswordError"
                );


            let isValid = true;


            /* Full name */

            if (name.value.trim().length < 2) {

                setFieldError(
                    name,
                    nameError,
                    "Please enter your full name."
                );

                isValid = false;

            } else {

                clearFieldError(
                    name,
                    nameError
                );

            }


            /* Email */

            if (!isValidEmail(email.value.trim())) {

                setFieldError(
                    email,
                    emailError,
                    "Please enter a valid email."
                );

                isValid = false;

            } else {

                clearFieldError(
                    email,
                    emailError
                );

            }


            /* Password */

            if (password.value.length < 6) {

                setFieldError(
                    password,
                    passwordError,
                    "Password must be at least 6 characters."
                );

                isValid = false;

            } else {

                clearFieldError(
                    password,
                    passwordError
                );

            }


            /* Confirm password */

            if (
                confirmPassword.value !==
                password.value
            ) {

                setFieldError(
                    confirmPassword,
                    confirmPasswordError,
                    "Passwords do not match."
                );

                isValid = false;

            } else {

                clearFieldError(
                    confirmPassword,
                    confirmPasswordError
                );

            }


            if (!isValid) {

                showToast(
                    "Please fix the validation errors.",
                    "error"
                );

                return;

            }


            /*
             * Frontend-only registration.
             *
             * No user is actually stored in MongoDB yet.
             */

            showToast(
                "Registration validated successfully. Backend registration is not connected yet.",
                "success"
            );


            registerForm.reset();


            setTimeout(() => {

                const login =
                    document.getElementById(
                        "login"
                    );

                if (login) {

                    login.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }, 800);

        }
    );

}


/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

const passwordButtons =
    document.querySelectorAll(
        ".password-toggle"
    );


passwordButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const targetId =
                button.dataset.target;

            const passwordInput =
                document.getElementById(
                    targetId
                );


            if (!passwordInput) {
                return;
            }


            const isPassword =
                passwordInput.type === "password";


            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";


            button.textContent =
                isPassword
                    ? "Hide"
                    : "Show";


            button.setAttribute(
                "aria-label",
                isPassword
                    ? "Hide password"
                    : "Show password"
            );

        }
    );

});


/* =========================================================
   LOGOUT
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            showToast(
                "You have been logged out of the frontend demo.",
                "info"
            );

            window.location.hash =
                "home";

        }
    );

}


/* =========================================================
   DASHBOARD NAVIGATION
========================================================= */

const dashboardLinks =
    document.querySelectorAll(
        ".dashboard-link"
    );


dashboardLinks.forEach((link) => {

    link.addEventListener(
        "click",
        () => {

            dashboardLinks.forEach(
                (item) => {
                    item.classList.remove(
                        "active"
                    );
                }
            );


            link.classList.add(
                "active"
            );

        }
    );

});


/* =========================================================
   UTILITY
========================================================= */

/**
 * Creates a small delay for frontend loading states.
 *
 * @param {number} milliseconds
 * @returns {Promise<void>}
 */
function wait(milliseconds) {

    return new Promise(
        (resolve) => {
            setTimeout(
                resolve,
                milliseconds
            );
        }
    );

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateNavbarOnScroll();
        updateActiveNavigation();

    }
);