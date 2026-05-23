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

    // Subtly parallax the 3D object on mouse move
    const heroObject = document.querySelector('.hero-3d-object');
    if (heroObject) {
        let isTicking = false;
        document.addEventListener('mousemove', (e) => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    const x = (window.innerWidth / 2 - e.pageX) / 50;
                    const y = (window.innerHeight / 2 - e.pageY) / 50;
                    heroObject.style.transform = `translate(${x}px, ${y}px)`;
                    isTicking = false;
                });
                isTicking = true;
            }
        });
    }

    // Network Canvas Animation
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resize, 200);
        });
        resize();
        
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 1.5 + 0.5;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fill();
            }
        }
        
        function initParticles() {
            particles = [];
            const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 120);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        const opacity = 1 - (distance / 150);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.25})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        
        initParticles();
        animate();
    }

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
        const typeSpeed = 120; // ms per letter

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

    // Contact CTA Dropdown
    const contactCta = document.getElementById('contact-cta');
    const contactDropdown = document.getElementById('contact-dropdown');
    
    if (contactCta && contactDropdown) {
        contactCta.addEventListener('click', (e) => {
            e.preventDefault();
            contactDropdown.classList.toggle('show');
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!contactCta.contains(e.target) && !contactDropdown.contains(e.target)) {
                contactDropdown.classList.remove('show');
            }
        });
    }

    // Process Cards Flip Logic
    const processCards = document.querySelectorAll('.process-card-wrapper');
    processCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
});
