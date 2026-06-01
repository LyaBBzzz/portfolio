document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation & Scrolling
    const initNavigation = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    };

    // 2. Intersection Observer (Fade-in animations)
    const initAnimations = () => {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.1 });

        document.querySelectorAll('.section-container, .glass-panel').forEach(section => {
            section.classList.add('fade-in');
            observer.observe(section);
        });
    };

    // 3. Typewriter Effect
    const initTypewriter = () => {
        const typewriterTitle = document.getElementById('typewriter-title');
        if (!typewriterTitle) return;

        const titleLeft = typewriterTitle.querySelector('.title-left');
        const titleRight = typewriterTitle.querySelector('.title-right');
        const heroImage = typewriterTitle.querySelector('.hero-3d-object');
        
        const wrapLetters = (element) => {
            const text = element.textContent.trim();
            element.textContent = '';
            return Array.from(text).map(char => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.cssText = 'opacity: 0; transform: translateY(10px); display: inline-block; transition: opacity 0.15s ease, transform 0.2s cubic-bezier(0.2, 0, 0, 1);';
                element.appendChild(span);
                return span;
            });
        };

        const leftLetters = wrapLetters(titleLeft);
        const rightLetters = wrapLetters(titleRight);
        
        if (heroImage) {
            heroImage.style.cssText = 'opacity: 0; transition: opacity 1.5s ease;';
        }
        
        typewriterTitle.style.visibility = 'visible';

        let currentIndex = 0;
        const typeSpeed = 40;

        const revealNext = () => {
            if (currentIndex < leftLetters.length) {
                leftLetters[currentIndex].style.opacity = '1';
                leftLetters[currentIndex].style.transform = 'translateY(0)';
                currentIndex++;
                setTimeout(revealNext, typeSpeed);
            } else if (currentIndex === leftLetters.length) {
                if (heroImage) heroImage.style.opacity = '1';
                currentIndex++;
                setTimeout(revealNext, 300);
            } else if (currentIndex <= leftLetters.length + rightLetters.length) {
                const rightIndex = currentIndex - leftLetters.length - 1;
                if (rightIndex < rightLetters.length) {
                    rightLetters[rightIndex].style.opacity = '1';
                    rightLetters[rightIndex].style.transform = 'translateY(0)';
                }
                currentIndex++;
                setTimeout(revealNext, typeSpeed);
            }
        };

        setTimeout(revealNext, 300);
    };

    // 4. Local Clock (Optimized timezone caching)
    const initLocalClock = () => {
        const clockEl = document.getElementById('local-clock');
        if (!clockEl) return;
        
        const pad = num => String(num).padStart(2, '0');
        const tzOffsetMs = new Date().getTimezoneOffset() * 60000;
        const vladivostokOffsetMs = 3600000 * 10; // UTC+10

        const tick = () => {
            const now = new Date();
            const devTime = new Date(now.getTime() + tzOffsetMs + vladivostokOffsetMs);
            clockEl.textContent = `${pad(devTime.getHours())}:${pad(devTime.getMinutes())}:${pad(devTime.getSeconds())}`;
        };
        
        setInterval(tick, 1000);
        tick();
    };

    // 5. Terminal Form Formspree Logic
    const initTerminalForm = () => {
        const chips = document.querySelectorAll('.topic-chip');
        const subjectInput = document.getElementById('terminal-subject');
        
        if (subjectInput) {
            chips.forEach(chip => {
                chip.addEventListener('click', () => {
                    chips.forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    subjectInput.value = chip.dataset.topic;
                });
            });
        }

        const form = document.getElementById('terminal-form');
        const statusOutput = document.getElementById('terminal-status-output');
        const submitBtn = form?.querySelector('.terminal-submit-btn');
        if (!form || !statusOutput || !submitBtn) return;

        const appendLog = (text, delay) => new Promise(resolve => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = 'status-log-line';
                line.textContent = `>> ${text}`;
                statusOutput.appendChild(line);
                statusOutput.scrollTop = statusOutput.scrollHeight;
                resolve();
            }, delay);
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (submitBtn.disabled) return; // Prevent double-clicks
            
            submitBtn.disabled = true;
            statusOutput.innerHTML = '';
            
            await appendLog('visitor@kdv:~$ post-message --send', 100);
            await appendLog('[STATUS] Establishing connection with kdvttt@gmail.com...', 500);
            await appendLog('[STATUS] Resolving secure payload...', 600);
            await appendLog('[STATUS] Dispatching packet metadata...', 600);
            
            const data = new FormData(form);
            if (subjectInput) data.append('subject_topic', subjectInput.value);
            
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
    };

    // 6. Process Cards Flip Logic
    const initCards = () => {
        document.querySelectorAll('.process-card-wrapper').forEach(card => {
            card.addEventListener('click', () => card.classList.toggle('flipped'));
        });
    };

    // Initialize all modules
    initNavigation();
    initAnimations();
    initTypewriter();
    initLocalClock();
    initTerminalForm();
    initCards();
});
