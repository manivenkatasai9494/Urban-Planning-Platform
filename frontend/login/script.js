document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log("wiee");
      if (!response.ok) {
        const errorMessage = await response.text();
        window.location.href = '/error-pages/index.html'
        throw new Error(errorMessage);
      }

      // Successfully logged in
      const responseData = await response.json();
      // Store the access token
      localStorage.setItem('accessToken', responseData.accessToken);
      // Redirect to home page or any other authenticated route
      window.location.href = '/home'; // Change to appropriate route
    } catch (error) {
      console.error('Login failed:', error.message);
      // Handle error, e.g., display error message to user
    }
  });