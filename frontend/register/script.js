document.getElementById('registerForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    password: document.getElementById('password').value
  };

  try {
      const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData) // Convert FormData directly to JSON
      });

      if (!response.ok) {
          const errorMessage = await response.text();
          console.error(errorMessage); // Log error message
          // Handle error, e.g., display error message to user
      } else {
          window.location.href = '/login'; // Redirect only if registration is successful
      }
  } catch (error) {
      console.error('Registration failed:', error.message);
      // Handle error, e.g., display error message to user
  }
});
