document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to elements we want to animate
    const sections = document.querySelectorAll('.section-container, .glass-panel');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Background dynamic effects removed as per user request

    // Typewriter Effect for Hero Title
    const typewriterTitle = document.getElementById('typewriter-title');
    if (typewriterTitle) {
        const titleLeft = typewriterTitle.querySelector('.title-left');
        const titleRight = typewriterTitle.querySelector('.title-right');
        const heroImage = typewriterTitle.querySelector('.hero-3d-object');
        
        function wrapLetters(element) {
            const text = element.textContent.trim();
            element.textContent = '';
            const letters = [];
            for (let char of text) {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.opacity = '0';
                span.style.transform = 'translateY(10px)';
                span.style.display = 'inline-block';
                span.style.transition = 'opacity 0.15s ease, transform 0.2s cubic-bezier(0.2, 0, 0, 1)';
                element.appendChild(span);
                letters.push(span);
            }
            return letters;
        }

        const leftLetters = wrapLetters(titleLeft);
        const rightLetters = wrapLetters(titleRight);
        
        if (heroImage) {
            heroImage.style.opacity = '0';
            heroImage.style.transition = 'opacity 1.5s ease';
        }
        
        typewriterTitle.style.visibility = 'visible';

        let currentIndex = 0;
        const typeSpeed = 40; // ms per letter (faster)

        function revealNext() {
            if (currentIndex < leftLetters.length) {
                leftLetters[currentIndex].style.opacity = '1';
                leftLetters[currentIndex].style.transform = 'translateY(0)';
                currentIndex++;
                setTimeout(revealNext, typeSpeed);
            } else if (currentIndex === leftLetters.length) {
                if (heroImage) heroImage.style.opacity = '1';
                currentIndex++;
                setTimeout(revealNext, 300); // wait before typing FOLIO
            } else if (currentIndex <= leftLetters.length + rightLetters.length) {
                const rightIndex = currentIndex - leftLetters.length - 1;
                if (rightIndex < rightLetters.length) {
                    rightLetters[rightIndex].style.opacity = '1';
                    rightLetters[rightIndex].style.transform = 'translateY(0)';
                }
                currentIndex++;
                setTimeout(revealNext, typeSpeed);
            }
        }

        setTimeout(revealNext, 300); // Start delay
    }


    // Real-time local clock (GMT+10)
    function initLocalClock() {
        const pad = (num) => String(num).padStart(2, '0');
        const clockEl = document.getElementById('local-clock');
        if (!clockEl) return;
        
        function tick() {
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const devTime = new Date(utc + (3600000 * 10)); // UTC+10
            clockEl.textContent = `${pad(devTime.getHours())}:${pad(devTime.getMinutes())}:${pad(devTime.getSeconds())}`;
        }
        setInterval(tick, 1000);
        tick();
    }
    initLocalClock();

    // Music player removed as per user request

    // Terminal Chips Selection
    function initTerminalChips() {
        const chips = document.querySelectorAll('.topic-chip');
        const subjectInput = document.getElementById('terminal-subject');
        if (!subjectInput) return;

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                subjectInput.value = chip.getAttribute('data-topic');
            });
        });
    }
    initTerminalChips();

    // Interactive Terminal Form Submission Logs
    function initTerminalForm() {
        const form = document.getElementById('terminal-form');
        const statusOutput = document.getElementById('terminal-status-output');
        const submitBtn = form?.querySelector('.terminal-submit-btn');
        if (!form || !statusOutput || !submitBtn) return;

        function appendLog(text, delay) {
            return new Promise(resolve => {
                setTimeout(() => {
                    const line = document.createElement('div');
                    line.className = 'status-log-line';
                    line.textContent = `>> ${text}`;
                    statusOutput.appendChild(line);
                    statusOutput.scrollTop = statusOutput.scrollHeight;
                    resolve();
                }, delay);
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            statusOutput.innerHTML = '';
            
            await appendLog('visitor@kdv:~$ post-message --send', 100);
            await appendLog('[STATUS] Establishing connection with kdvttt@gmail.com...', 500);
            await appendLog('[STATUS] Resolving secure payload...', 600);
            await appendLog('[STATUS] Dispatching packet metadata...', 600);
            
            // Perform actual background formspree send
            const data = new FormData(form);
            data.append('subject_topic', document.getElementById('terminal-subject').value);
            
            try {
                const response = await fetch('https://formspree.io/f/xdajvpba', {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    await appendLog('[SUCCESS] Message successfully delivered. 200 OK', 400);
                    form.reset();
                } else {
                    await appendLog('[ERROR] Transmission failed. Fallback to direct mailto.', 400);
                }
            } catch (err) {
                await appendLog('[ERROR] Connection interrupted. Simulated sending complete.', 400);
            }
            
            submitBtn.disabled = false;
        });
    }
    initTerminalForm();

    // Process Cards Flip Logic
    const processCards = document.querySelectorAll('.process-card-wrapper');
    processCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
});
