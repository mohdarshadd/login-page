// Background & Theme Customizer Engine
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const body = document.body;
    const themeButtons = document.querySelectorAll('.theme-btn');
    const settingsToggleBtn = document.getElementById('settingsToggleBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const blurSlider = document.getElementById('blurSlider');
    const blurValueDisplay = document.getElementById('blurValue');
    const opacitySlider = document.getElementById('opacitySlider');
    const opacityValueDisplay = document.getElementById('opacityValue');
    const particleToggle = document.getElementById('particleToggle');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('passwordInput');
    const loginForm = document.getElementById('loginForm');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const bgCanvas = document.getElementById('bgCanvas');

    // Default Configuration
    const DEFAULT_CONFIG = {
        theme: 'aurora',
        blur: 16,
        opacity: 0.25,
        particles: true
    };

    // Load saved settings or use defaults
    let config = { ...DEFAULT_CONFIG };
    try {
        const saved = localStorage.getItem('login_theme_customizer_config');
        if (saved) {
            config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.warn('Unable to access localStorage', e);
    }

    // Apply Settings
    function applyTheme(themeName) {
        // Remove all existing theme classes
        body.classList.remove(
            'theme-aurora',
            'theme-cyberpunk',
            'theme-dark-glass',
            'theme-sunset',
            'theme-wallpaper'
        );
        body.classList.add(`theme-${themeName}`);
        config.theme = themeName;

        // Update active state on buttons
        themeButtons.forEach(btn => {
            if (btn.dataset.theme === themeName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        saveConfig();
    }

    function applyBlur(val) {
        document.documentElement.style.setProperty('--glass-blur', `${val}px`);
        if (blurValueDisplay) blurValueDisplay.textContent = `${val}px`;
        config.blur = parseInt(val, 10);
        saveConfig();
    }

    function applyOpacity(val) {
        const decimal = (val / 100).toFixed(2);
        document.documentElement.style.setProperty('--glass-opacity', decimal);
        if (opacityValueDisplay) opacityValueDisplay.textContent = `${val}%`;
        config.opacity = parseFloat(decimal);
        saveConfig();
    }

    function applyParticles(enabled) {
        config.particles = enabled;
        if (bgCanvas) {
            bgCanvas.style.display = enabled ? 'block' : 'none';
        }
        if (particleToggle) {
            particleToggle.checked = enabled;
        }
        saveConfig();
    }

    function saveConfig() {
        try {
            localStorage.setItem('login_theme_customizer_config', JSON.stringify(config));
        } catch (e) {
            // ignore
        }
    }

    // Initialize UI controls
    applyTheme(config.theme);
    if (blurSlider) {
        blurSlider.value = config.blur;
        applyBlur(config.blur);
    }
    if (opacitySlider) {
        const opacityPercent = Math.round(config.opacity * 100);
        opacitySlider.value = opacityPercent;
        applyOpacity(opacityPercent);
    }
    applyParticles(config.particles);

    // Event Listeners for Theme Selection
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            applyTheme(theme);
            showToast(`Theme switched to ${btn.title || theme.toUpperCase()}`);
        });
    });

    // Settings Panel Toggle
    if (settingsToggleBtn && settingsPanel) {
        settingsToggleBtn.addEventListener('click', () => {
            settingsPanel.classList.toggle('open');
        });
    }

    if (closeSettingsBtn && settingsPanel) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsPanel.classList.remove('open');
        });
    }

    // Close settings if clicked outside
    document.addEventListener('click', (e) => {
        if (settingsPanel && settingsPanel.classList.contains('open')) {
            if (!settingsPanel.contains(e.target) && !settingsToggleBtn.contains(e.target)) {
                settingsPanel.classList.remove('open');
            }
        }
    });

    // Sliders & Checkbox Listeners
    if (blurSlider) {
        blurSlider.addEventListener('input', (e) => applyBlur(e.target.value));
    }
    if (opacitySlider) {
        opacitySlider.addEventListener('input', (e) => applyOpacity(e.target.value));
    }
    if (particleToggle) {
        particleToggle.addEventListener('change', (e) => applyParticles(e.target.checked));
    }

    // Password Show / Hide Toggle
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            togglePasswordBtn.classList.toggle('visible', isPassword);
            togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    }

    // Form Submission & Toast alert
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            showToast(`Authenticating ${email}...`);
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner"></span> Logging in...`;

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                showToast(`Welcome back, ${email.split('@')[0]}! 🎉`);
            }, 1200);
        });
    }

    function showToast(message) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Reset Defaults Button
    const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');
    if (resetDefaultsBtn) {
        resetDefaultsBtn.addEventListener('click', () => {
            applyTheme(DEFAULT_CONFIG.theme);
            if (blurSlider) {
                blurSlider.value = DEFAULT_CONFIG.blur;
                applyBlur(DEFAULT_CONFIG.blur);
            }
            if (opacitySlider) {
                opacitySlider.value = DEFAULT_CONFIG.opacity * 100;
                applyOpacity(DEFAULT_CONFIG.opacity * 100);
            }
            applyParticles(DEFAULT_CONFIG.particles);
            showToast('Reset settings to default');
        });
    }

    // ============================================
    // Dynamic Interactive Canvas Particle System
    // ============================================
    if (bgCanvas) {
        const ctx = bgCanvas.getContext('2d');
        let width = bgCanvas.width = window.innerWidth;
        let height = bgCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = bgCanvas.width = window.innerWidth;
            height = bgCanvas.height = window.innerHeight;
            initParticles();
        });

        const mouse = { x: null, y: null, radius: 120 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 20) + 5;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
            }

            draw(color) {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update(color) {
                // Gentle drift
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                // Mouse interaction (repel gently)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const maxDistance = mouse.radius;
                        const force = (maxDistance - distance) / maxDistance;
                        const directionX = forceDirectionX * force * this.density * 0.4;
                        const directionY = forceDirectionY * force * this.density * 0.4;
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }

                this.draw(color);
            }
        }

        let particlesArray = [];

        function initParticles() {
            particlesArray = [];
            const count = Math.min(Math.floor((width * height) / 14000), 75);
            for (let i = 0; i < count; i++) {
                particlesArray.push(new Particle());
            }
        }

        initParticles();

        function getParticleThemeColor() {
            if (body.classList.contains('theme-cyberpunk')) return 'rgba(0, 240, 255, 0.7)';
            if (body.classList.contains('theme-sunset')) return 'rgba(255, 175, 120, 0.7)';
            if (body.classList.contains('theme-dark-glass')) return 'rgba(255, 255, 255, 0.5)';
            if (body.classList.contains('theme-wallpaper')) return 'rgba(255, 255, 255, 0.4)';
            // Default Aurora
            return 'rgba(56, 239, 125, 0.6)';
        }

        function getLineThemeColor(opacity) {
            if (body.classList.contains('theme-cyberpunk')) return `rgba(255, 0, 128, ${opacity})`;
            if (body.classList.contains('theme-sunset')) return `rgba(247, 107, 28, ${opacity})`;
            if (body.classList.contains('theme-dark-glass')) return `rgba(255, 255, 255, ${opacity * 0.7})`;
            if (body.classList.contains('theme-wallpaper')) return `rgba(255, 255, 255, ${opacity * 0.5})`;
            // Aurora
            return `rgba(17, 153, 142, ${opacity})`;
        }

        function connectParticles() {
            const maxDist = 110;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a + 1; b < particlesArray.length; b++) {
                    const dx = particlesArray[a].x - particlesArray[b].x;
                    const dy = particlesArray[a].y - particlesArray[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const opacity = (1 - (dist / maxDist)) * 0.35;
                        ctx.strokeStyle = getLineThemeColor(opacity);
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            if (config.particles) {
                const color = getParticleThemeColor();
                for (let i = 0; i < particlesArray.length; i++) {
                    particlesArray[i].update(color);
                }
                connectParticles();
            }
            requestAnimationFrame(animate);
        }

        animate();
    }
});
