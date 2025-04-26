// Base URL for API
const API_URL = 'http://localhost:5000/api';

// DOM elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');

// Initialize auth
function initAuth() {
  // Setup login form
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Setup register form
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  // Check if user is already logged in
  const token = localStorage.getItem('token');
  if (token) {
    // If on login or register page, redirect to home
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('register.html')) {
      window.location.href = 'index.html';
    }
  }
}

// Handle login form submission
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.token) {
      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin
      }));
      
      // Redirect to home page
      window.location.href = 'index.html';
    } else {
      // Show error message
      showError(data.message || 'Invalid email or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('An error occurred during login');
  }
}

// Handle register form submission
async function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  // Check if passwords match
  if (password !== confirmPassword) {
    showError('Passwords do not match');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (data.token) {
      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin
      }));
      
      // Redirect to home page
      window.location.href = 'index.html';
    } else {
      // Show error message
      showError(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    showError('An error occurred during registration');
  }
}

// Show error message
function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 5000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);