document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const steps = document.querySelectorAll('.step-content');
    const stepIndicators = document.querySelectorAll('.step');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const submitBtn = document.querySelector('.submit-btn');
    let currentStep = 1;

    // Password strength and visibility
    const passwordInput = document.querySelector('input[name="password"]');
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordStrength = document.querySelector('.password-strength');

    // OTP inputs
    const otpInputs = document.querySelectorAll('.otp-input');
    const resendBtn = document.querySelector('.resend-btn');

    // Add scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '<div class="scroll-progress"></div>';
    document.body.prepend(scrollIndicator);

    // Add scroll-to-top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    function updateSteps() {
        steps.forEach(step => step.classList.remove('active'));
        stepIndicators.forEach(indicator => indicator.classList.remove('active'));

        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
        stepIndicators[currentStep - 1].classList.add('active');

        prevBtn.disabled = currentStep === 1;
        
        if (currentStep === steps.length) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    function validateStep(step) {
        const inputs = steps[step - 1].querySelectorAll('input[required]');
        let valid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                showError(input, 'This field is required');
            } else {
                clearError(input);
            }
        });

        if (step === 2) {
            const password = passwordInput.value;
            const confirmPassword = document.querySelector('input[name="confirmPassword"]').value;
            
            if (password !== confirmPassword) {
                valid = false;
                showError(document.querySelector('input[name="confirmPassword"]'), 
                    'Passwords do not match');
            }
        }

        return valid;
    }

    function showError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
        input.classList.add('error');
    }

    function clearError(input) {
        const errorDiv = input.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('error');
    }

    // Navigation handlers
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateSteps();
            if (currentStep === 3) {
                sendVerificationCode();
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        currentStep--;
        updateSteps();
    });

    // Password strength checker
    passwordInput.addEventListener('input', () => {
        const strength = checkPasswordStrength(passwordInput.value);
        updatePasswordStrengthIndicator(strength);
    });

    function checkPasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }

    function updatePasswordStrengthIndicator(strength) {
        const colors = ['#ff4444', '#ffbb33', '#00C851', '#00C851'];
        const widths = ['25%', '50%', '75%', '100%'];
        
        passwordStrength.style.width = widths[strength - 1] || '0';
        passwordStrength.style.backgroundColor = colors[strength - 1] || '#ff4444';
    }

    // Password visibility toggle
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        passwordToggle.className = `fas fa-eye${type === 'password' ? '' : '-slash'} password-toggle`;
    });

    // OTP handling
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value) {
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    function sendVerificationCode() {
        // Simulate sending verification code
        const email = document.querySelector('input[name="email"]').value;
        showMessage(`Verification code sent to ${email}`, 'success');
        startResendTimer();
    }

    function startResendTimer() {
        let timeLeft = 30;
        resendBtn.disabled = true;
        
        const timer = setInterval(() => {
            resendBtn.textContent = `Resend in ${timeLeft}s`;
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(timer);
                resendBtn.textContent = 'Resend Code';
                resendBtn.disabled = false;
            }
        }, 1000);
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                showMessage('Registration successful!', 'success');
                // Redirect or show success page
            } catch (error) {
                showMessage('Registration failed. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Complete Registration';
            }
        }
    });

    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        form.insertBefore(messageDiv, form.firstChild);
        setTimeout(() => messageDiv.remove(), 5000);
    }

    // Initialize
    updateSteps();

    // Update scroll progress
    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        document.querySelector('.scroll-progress').style.width = `${progress}%`;

        // Show/hide scroll-to-top button
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    // Scroll to top function
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Scroll animation for elements
    const scrollElements = document.querySelectorAll('.scroll-content');
    
    function checkScrollAnimation() {
        scrollElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('scroll-visible');
            }
        });
    }

    // Add scroll event listeners
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        checkScrollAnimation();
    });

    // Initial check for scroll animations
    checkScrollAnimation();

    // Add this custom date picker code to your existing JavaScript

    class CustomDatePicker {
        constructor(inputElement) {
            this.input = inputElement;
            this.wrapper = document.createElement('div');
            this.wrapper.className = 'date-picker-wrapper';
            this.input.parentNode.insertBefore(this.wrapper, this.input);
            this.wrapper.appendChild(this.input);
            
            this.currentDate = new Date();
            this.selectedDate = null;
            
            this.createDatePicker();
            this.addEventListeners();
        }

        createDatePicker() {
            this.datePicker = document.createElement('div');
            this.datePicker.className = 'custom-date-picker';
            this.wrapper.appendChild(this.datePicker);
            this.renderCalendar();
        }

        renderCalendar() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            const currentMonth = this.datePicker.querySelector('.current-month');
            const calendarGrid = this.datePicker.querySelector('.calendar-grid');
            
            if (currentMonth) {
                // Smooth month transition
                currentMonth.style.opacity = '0';
                currentMonth.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    currentMonth.textContent = new Date(year, month).toLocaleString('default', { 
                        month: 'long', 
                        year: 'numeric' 
                    });
                    currentMonth.style.opacity = '1';
                    currentMonth.style.transform = 'translateY(0)';
                }, 150);

                if (calendarGrid) {
                    calendarGrid.style.opacity = '0';
                    calendarGrid.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        calendarGrid.innerHTML = this.generateCalendarDays();
                        calendarGrid.style.opacity = '1';
                        calendarGrid.style.transform = 'translateY(0)';
                    }, 150);
                }
            } else {
                // Initial render
                this.datePicker.innerHTML = `
                    <div class="date-picker-header">
                        <div class="month-nav">
                            <button class="prev-month"><i class="fas fa-chevron-left"></i></button>
                            <span class="current-month">
                                ${new Date(year, month).toLocaleString('default', { 
                                    month: 'long', 
                                    year: 'numeric' 
                                })}
                            </span>
                            <button class="next-month"><i class="fas fa-chevron-right"></i></button>
                        </div>
                    </div>
                    <div class="calendar-grid" style="transition: all 0.3s ease">
                        ${this.generateCalendarDays()}
                    </div>
                `;
            }

            // Add event listeners to navigation buttons
            this.datePicker.querySelector('.prev-month').addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigateMonth(-1);
            });
            this.datePicker.querySelector('.next-month').addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigateMonth(1);
            });
        }

        generateCalendarDays() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startingDay = firstDay.getDay();
            const totalDays = lastDay.getDate();
            
            const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            let html = weekdays.map(day => `<span>${day}</span>`).join('');
            
            for (let i = 0; i < startingDay; i++) {
                html += '<button disabled></button>';
            }
            
            for (let day = 1; day <= totalDays; day++) {
                const date = new Date(year, month, day);
                const isToday = this.isToday(date);
                const isSelected = this.isSelected(date);
                
                html += `
                    <button 
                        data-date="${date.toISOString()}"
                        class="${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}"
                    >
                        ${day}
                    </button>
                `;
            }
            
            return html;
        }

        navigateMonth(direction) {
            this.currentDate.setMonth(this.currentDate.getMonth() + direction);
            this.renderCalendar();
        }

        isToday(date) {
            const today = new Date();
            return date.toDateString() === today.toDateString();
        }

        isSelected(date) {
            return this.selectedDate && date.toDateString() === this.selectedDate.toDateString();
        }

        addEventListeners() {
            // Toggle date picker with smooth animation
            this.input.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.datePicker.classList.contains('active')) {
                    this.datePicker.style.display = 'block';
                    requestAnimationFrame(() => {
                        this.datePicker.classList.add('active');
                    });
                } else {
                    this.datePicker.classList.remove('active');
                    setTimeout(() => {
                        this.datePicker.style.display = 'none';
                    }, 300);
                }
            });

            // Handle date selection with smooth animation
            this.datePicker.addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-date')) {
                    const button = e.target;
                    const date = new Date(button.dataset.date);
                    
                    // Add selection animation
                    button.classList.add('selected');
                    this.selectedDate = date;
                    this.input.value = date.toISOString().split('T')[0];
                    
                    setTimeout(() => {
                        this.datePicker.classList.remove('active');
                        setTimeout(() => {
                            this.datePicker.style.display = 'none';
                        }, 300);
                    }, 200);
                }
            });

            // Close date picker when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.wrapper.contains(e.target)) {
                    this.datePicker.classList.remove('active');
                    setTimeout(() => {
                        this.datePicker.style.display = 'none';
                    }, 300);
                }
            });
        }
    }

    // Initialize custom date picker for date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => new CustomDatePicker(input));
});

// Add smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                inline: 'nearest'
            });
        }
    });
});