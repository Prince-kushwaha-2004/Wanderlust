(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })

    // Dynamic Navbar scroll effect
    const navbar = document.querySelector('.main-navbar')
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          navbar.classList.add('scrolled')
        } else {
          navbar.classList.remove('scrolled')
        }
      })
    }

    // Password visibility toggle
    const passwordToggles = document.querySelectorAll('.password-toggle-btn');
    passwordToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input) {
          const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
          input.setAttribute('type', type);
          
          const icon = btn.querySelector('i');
          if (icon) {
            if (type === 'text') {
              icon.classList.remove('fa-eye');
              icon.classList.add('fa-eye-slash');
            } else {
              icon.classList.remove('fa-eye-slash');
              icon.classList.add('fa-eye');
            }
          }
        }
      });
    });

    // Real-time password match check for SignUp
    const signupForm = document.querySelector('form[action="/signup"]');
    if (signupForm) {
      const passwordInput = signupForm.querySelector('#password');
      const confirmPasswordInput = signupForm.querySelector('#confirmPassword');
      
      const validatePasswords = () => {
        if (!passwordInput || !confirmPasswordInput) return;
        const feedback = signupForm.querySelector('#confirm-password-feedback');
        
        if (passwordInput.value !== confirmPasswordInput.value) {
          confirmPasswordInput.setCustomValidity("Passwords do not match");
          if (feedback) {
            feedback.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Passwords do not match';
          }
        } else {
          confirmPasswordInput.setCustomValidity("");
          if (feedback) {
            feedback.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please confirm your password';
          }
        }
      };

      if (passwordInput && confirmPasswordInput) {
        passwordInput.addEventListener('change', validatePasswords);
        confirmPasswordInput.addEventListener('input', validatePasswords);
      }
    }
  })()