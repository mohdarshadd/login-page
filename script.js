// Modern Glassmorphism Authentication & Customizer Engine
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
    const tiltToggle = document.getElementById('tiltToggle');
    const soundToggle = document.getElementById('soundToggle');
    const accentColorPicker = document.getElementById('accentColorPicker');
    const accentHexDisplay = document.getElementById('accentHexDisplay');
    const presetColorChips = document.querySelectorAll('.preset-color-chip');
    const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');
    
    // Auth Mode & Tab Elements
    const authTabs = document.querySelectorAll('.auth-tab');
    const authViews = document.querySelectorAll('.auth-view');
    const switchToSignUp = document.getElementById('switchToSignUp');
    const switchToSignIn = document.getElementById('switchToSignIn');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotBackToSignIn = document.getElementById('forgotBackToSignIn');
    
    // Forms & Inputs
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotForm = document.getElementById('forgotForm');
    const passwordInput = document.getElementById('passwordInput');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const regPasswordInput = document.getElementById('regPasswordInput');
    const toggleRegPasswordBtn = document.getElementById('toggleRegPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');
    const matchIndicator = document.getElementById('matchIndicator');
    
    // Password Strength Elements
    const strengthBarFill = document.getElementById('strengthBarFill');
    const strengthText = document.getElementById('strengthText');
    const ruleLength = document.getElementById('ruleLength');
    const ruleUpper = document.getElementById('ruleUpper');
    const ruleNumber = document.getElementById('ruleNumber');
    const ruleSymbol = document.getElementById('ruleSymbol');

    // 3D Card & Glare Elements
    const authCard = document.getElementById('authCard');
    const cardGlare = document.getElementById('cardGlare');

    // Toast & Canvas
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const bgCanvas = document.getElementById('bgCanvas');

    // Default Configuration
    const DEFAULT_CONFIG = {
        theme: 'aurora',
        blur: 16,
        opacity: 0.25,
        particles: true,
        tilt: true,
        sound: true,
        customAccent: '#38ef7d'
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

    // ============================================
    // Web Audio Procedural Sound Synthesizer
    // ============================================
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playSound(type) {
        if (!config.sound) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            if (type === 'click') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04);
                gain.gain.setValueAtTime(0.06, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.04);
            } else if (type === 'tab') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.08);
            } else if (type === 'success') {
                [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
                    gain.gain.setValueAtTime(0.09, ctx.currentTime + i * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.28);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + i * 0.08);
                    osc.stop(ctx.currentTime + i * 0.08 + 0.28);
                });
            }
        } catch (e) {
            // Audio context not allowed before interaction
        }
    }

    // ============================================
    // Theme Engine & Style Customizer
    // ============================================
    function applyTheme(themeName) {
        body.classList.remove(
            'theme-aurora',
            'theme-cyberpunk',
            'theme-dark-glass',
            'theme-sunset',
            'theme-wallpaper'
        );
        body.classList.add(`theme-${themeName}`);
        config.theme = themeName;

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

    function applyAccentColor(hex) {
        document.documentElement.style.setProperty('--accent-color', hex);
        if (accentHexDisplay) accentHexDisplay.textContent = hex;
        if (accentColorPicker) accentColorPicker.value = hex;
        config.customAccent = hex;
        saveConfig();
    }

    function saveConfig() {
        try {
            localStorage.setItem('login_theme_customizer_config', JSON.stringify(config));
        } catch (e) {
            // ignore
        }
    }

    // Initialize UI settings
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
    if (tiltToggle) tiltToggle.checked = config.tilt;
    if (soundToggle) soundToggle.checked = config.sound;
    if (config.customAccent) applyAccentColor(config.customAccent);

    // ============================================
    // Theme & Setting Listeners
    // ============================================
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('tab');
            const theme = btn.dataset.theme;
            applyTheme(theme);
            showToast(`Theme switched to ${btn.title || theme.toUpperCase()}`);
        });
    });

    if (settingsToggleBtn && settingsPanel) {
        settingsToggleBtn.addEventListener('click', () => {
            playSound('click');
            settingsPanel.classList.toggle('open');
        });
    }

    if (closeSettingsBtn && settingsPanel) {
        closeSettingsBtn.addEventListener('click', () => {
            playSound('click');
            settingsPanel.classList.remove('open');
        });
    }

    document.addEventListener('click', (e) => {
        if (settingsPanel && settingsPanel.classList.contains('open')) {
            if (!settingsPanel.contains(e.target) && !settingsToggleBtn.contains(e.target)) {
                settingsPanel.classList.remove('open');
            }
        }
    });

    if (blurSlider) blurSlider.addEventListener('input', (e) => applyBlur(e.target.value));
    if (opacitySlider) opacitySlider.addEventListener('input', (e) => applyOpacity(e.target.value));
    if (particleToggle) particleToggle.addEventListener('change', (e) => {
        playSound('click');
        applyParticles(e.target.checked);
    });
    if (tiltToggle) tiltToggle.addEventListener('change', (e) => {
        playSound('click');
        config.tilt = e.target.checked;
        saveConfig();
        if (!config.tilt && authCard) {
            authCard.style.transform = 'none';
            if (cardGlare) cardGlare.style.opacity = '0';
        }
    });
    if (soundToggle) soundToggle.addEventListener('change', (e) => {
        config.sound = e.target.checked;
        saveConfig();
        if (config.sound) playSound('click');
    });

    if (accentColorPicker) {
        accentColorPicker.addEventListener('input', (e) => {
            applyAccentColor(e.target.value);
        });
    }

    presetColorChips.forEach(chip => {
        chip.addEventListener('click', () => {
            playSound('click');
            const color = chip.dataset.color;
            applyAccentColor(color);
            showToast(`Accent color updated to ${color}`);
        });
    });

    if (resetDefaultsBtn) {
        resetDefaultsBtn.addEventListener('click', () => {
            playSound('tab');
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
            config.tilt = DEFAULT_CONFIG.tilt;
            if (tiltToggle) tiltToggle.checked = DEFAULT_CONFIG.tilt;
            config.sound = DEFAULT_CONFIG.sound;
            if (soundToggle) soundToggle.checked = DEFAULT_CONFIG.sound;
            applyAccentColor(DEFAULT_CONFIG.customAccent);
            showToast('Settings restored to defaults ✨');
        });
    }

    // ============================================
    // Auth Mode & View State Switcher
    // ============================================
    function switchAuthView(viewName) {
        playSound('tab');
        authViews.forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Update tab header
        authTabs.forEach(tab => {
            if (tab.dataset.tab === viewName) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            }
        });
    }

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            switchAuthView(target);
        });
    });

    if (switchToSignUp) {
        switchToSignUp.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthView('signUp');
        });
    }

    if (switchToSignIn) {
        switchToSignIn.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthView('signIn');
        });
    }

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthView('forgot');
        });
    }

    if (forgotBackToSignIn) {
        forgotBackToSignIn.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthView('signIn');
        });
    }

    // ============================================
    // Password Show / Hide Toggles
    // ============================================
    function setupPasswordToggle(button, input) {
        if (!button || !input) return;
        button.addEventListener('click', () => {
            playSound('click');
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            button.classList.toggle('visible', isPassword);
            button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    }

    setupPasswordToggle(togglePasswordBtn, passwordInput);
    setupPasswordToggle(toggleRegPasswordBtn, regPasswordInput);

    // ============================================
    // Real-Time Password Strength Engine
    // ============================================
    function evaluatePasswordStrength(pwd) {
        let score = 0;
        const hasLength = pwd.length >= 8;
        const hasUpperAndLower = /[a-z]/.test(pwd) && /[A-Z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        const hasSymbol = /[^A-Za-z0-9]/.test(pwd);

        if (ruleLength) ruleLength.classList.toggle('passed', hasLength);
        if (ruleUpper) ruleUpper.classList.toggle('passed', hasUpperAndLower);
        if (ruleNumber) ruleNumber.classList.toggle('passed', hasNumber);
        if (ruleSymbol) ruleSymbol.classList.toggle('passed', hasSymbol);

        if (hasLength) score++;
        if (hasUpperAndLower) score++;
        if (hasNumber) score++;
        if (hasSymbol) score++;

        if (pwd.length === 0) {
            strengthBarFill.className = 'strength-bar-fill';
            strengthText.textContent = 'None';
            strengthText.style.color = '#fff';
            return;
        }

        strengthBarFill.className = 'strength-bar-fill';
        if (score <= 1) {
            strengthBarFill.classList.add('weak');
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#ff4757';
        } else if (score === 2) {
            strengthBarFill.classList.add('fair');
            strengthText.textContent = 'Fair';
            strengthText.style.color = '#ffa502';
        } else if (score === 3) {
            strengthBarFill.classList.add('good');
            strengthText.textContent = 'Good';
            strengthText.style.color = '#2ed573';
        } else {
            strengthBarFill.classList.add('strong');
            strengthText.textContent = 'Strong & Secure 🛡️';
            strengthText.style.color = '#00f0ff';
        }
    }

    if (regPasswordInput) {
        regPasswordInput.addEventListener('input', (e) => {
            evaluatePasswordStrength(e.target.value);
            checkPasswordMatch();
        });
    }

    function checkPasswordMatch() {
        if (!regConfirmPassword || !regPasswordInput || !matchIndicator) return;
        const pwd = regPasswordInput.value;
        const confirm = regConfirmPassword.value;

        if (!confirm) {
            matchIndicator.className = 'field-icon match-indicator';
            return;
        }

        if (pwd === confirm) {
            matchIndicator.className = 'field-icon match-indicator match';
        } else {
            matchIndicator.className = 'field-icon match-indicator mismatch';
        }
    }

    if (regConfirmPassword) {
        regConfirmPassword.addEventListener('input', checkPasswordMatch);
    }

    // ============================================
    // Social Login SSO Handlers
    // ============================================
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            const provider = btn.dataset.provider || 'Social';
            showToast(`Connecting to ${provider} SSO...`);
            setTimeout(() => {
                playSound('success');
                showToast(`Successfully authenticated with ${provider}! 🚀`);
            }, 1000);
        });
    });

    // ============================================
    // Form Submissions & Feedback
    // ============================================
    function createRipple(event, button) {
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        const rect = button.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');
        const existing = button.querySelector('.ripple');
        if (existing) existing.remove();
        button.appendChild(circle);
    }

    // Sign In Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            createRipple(e, submitBtn);
            playSound('click');

            const email = loginForm.querySelector('#emailInput').value;
            showToast(`Authenticating ${email}...`);
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner"></span> Verifying...`;

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                playSound('success');
                showToast(`Welcome back, ${email.split('@')[0]}! 🎉`);
            }, 1100);
        });
    }

    // Sign Up Submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pwd = regPasswordInput.value;
            const confirm = regConfirmPassword.value;

            if (pwd !== confirm) {
                showToast('Passwords do not match! Please check again.');
                return;
            }

            const submitBtn = signupForm.querySelector('button[type="submit"]');
            createRipple(e, submitBtn);
            playSound('click');

            const name = signupForm.querySelector('#regNameInput').value;
            const email = signupForm.querySelector('#regEmailInput').value;
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner"></span> Creating account...`;

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                playSound('success');
                showToast(`Account created for ${name}! Please sign in. ✨`);
                signupForm.reset();
                if (strengthBarFill) strengthBarFill.className = 'strength-bar-fill';
                if (strengthText) strengthText.textContent = 'None';
                switchAuthView('signIn');
            }, 1200);
        });
    }

    // Forgot Password Submission
    if (forgotForm) {
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = forgotForm.querySelector('button[type="submit"]');
            createRipple(e, submitBtn);
            playSound('click');

            const email = forgotForm.querySelector('#forgotEmailInput').value;
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner"></span> Sending link...`;

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                playSound('success');
                showToast(`Recovery link sent to ${email}! 📬`);
                forgotForm.reset();
                setTimeout(() => switchAuthView('signIn'), 2000);
            }, 1000);
        });
    }

    function showToast(message) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    // ============================================
    // 3D Tilt Physics Engine with Mouse Tracking
    // ============================================
    if (authCard) {
        let isHovered = false;

        authCard.addEventListener('mouseenter', () => {
            if (!config.tilt) return;
            isHovered = true;
            if (cardGlare) cardGlare.style.opacity = '0.8';
        });

        authCard.addEventListener('mousemove', (e) => {
            if (!config.tilt || !isHovered) return;
            const rect = authCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Maximum tilt angle (+- 10deg)
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            authCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;

            if (cardGlare) {
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                cardGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.28) 0%, transparent 60%)`;
            }
        });

        authCard.addEventListener('mouseleave', () => {
            isHovered = false;
            authCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            if (cardGlare) cardGlare.style.opacity = '0';
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
                // Drift
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                // Mouse interaction
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
            if (config.customAccent && config.customAccent !== DEFAULT_CONFIG.customAccent) {
                return config.customAccent;
            }
            if (body.classList.contains('theme-cyberpunk')) return 'rgba(0, 240, 255, 0.7)';
            if (body.classList.contains('theme-sunset')) return 'rgba(255, 175, 120, 0.7)';
            if (body.classList.contains('theme-dark-glass')) return 'rgba(255, 255, 255, 0.5)';
            if (body.classList.contains('theme-wallpaper')) return 'rgba(255, 255, 255, 0.4)';
            return 'rgba(56, 239, 125, 0.6)';
        }

        function getLineThemeColor(opacity) {
            if (body.classList.contains('theme-cyberpunk')) return `rgba(255, 0, 128, ${opacity})`;
            if (body.classList.contains('theme-sunset')) return `rgba(247, 107, 28, ${opacity})`;
            if (body.classList.contains('theme-dark-glass')) return `rgba(255, 255, 255, ${opacity * 0.7})`;
            if (body.classList.contains('theme-wallpaper')) return `rgba(255, 255, 255, ${opacity * 0.5})`;
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
