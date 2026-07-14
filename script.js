document.addEventListener('DOMContentLoaded', () => {
    // Dynamically manage the copyright layout element context
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const links = document.querySelectorAll('.link-item');
    const orbs = document.querySelectorAll('.bg-orb');
    const avatar = document.querySelector('.avatar-wrapper');

    // Touch press feedback — card sinks into the page
    links.forEach(link => {
        link.addEventListener('touchstart', () => {
            link.classList.add('is-pressed');
        }, { passive: true });
        link.addEventListener('touchend', () => {
            link.classList.remove('is-pressed');
        }, { passive: true });
    });

    if (hasFinePointer && !reduceMotion) {
        // Per-card 3D tilt toward the cursor
        links.forEach(link => {
            link.addEventListener('mousemove', (e) => {
                const rect = link.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;
                const rotateX = (-py * 4).toFixed(2);
                const rotateY = (px * 4).toFixed(2);
                link.style.transform = `translateY(-4px) translateZ(10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
            });
        });

        // Whole-page ambient parallax: orbs drift opposite to cursor, avatar tilts subtly
        let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

        window.addEventListener('mousemove', (e) => {
            targetX = (e.clientX / window.innerWidth - 0.5);
            targetY = (e.clientY / window.innerHeight - 0.5);
        });

        function animateParallax() {
            currentX += (targetX - currentX) * 0.06;
            currentY += (targetY - currentY) * 0.06;

            orbs.forEach((orb, i) => {
                const depth = (i + 1) * 8;
                orb.style.transform = `translate(${-currentX * depth}px, ${-currentY * depth}px)`;
            });

            if (avatar) {
                avatar.style.transform = `rotateY(${currentX * 6}deg) rotateX(${-currentY * 6}deg)`;
            }

            requestAnimationFrame(animateParallax);
        }
        requestAnimationFrame(animateParallax);
    }
});
