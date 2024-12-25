// Function to fetch events from the backend
async function fetchEvents() {
  console.log("wiee");
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
  
      const events = await response.json();
      displayEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error.message);
      // Handle error, e.g., display error message to user
    }
  }
  
  // Function to display events in the HTML
  function displayEvents(events) {
    const currentEventsContainer = document.getElementById('current-events');
  
    // Clear previous content
    currentEventsContainer.innerHTML = '';
  
    // Check if there are any events
    if (events.length === 0) {
      currentEventsContainer.innerHTML = '<p style="margin-top: 10px">No events available</p>';
      return;
    }
  
    // Iterate over each event and create HTML elements to display them
    events.forEach(event => {
      const eventElement = document.createElement('div');
      eventElement.classList.add('event-item');
      eventElement.innerHTML = `
        <h4>${event.title}</h4>
        <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
        <p>Description: ${event.desc}</p>
        <p>Location: ${event.location}</p>
      `;
      currentEventsContainer.appendChild(eventElement);
    });
  }
  
  // Call fetchEvents when the DOM content is loaded
  document.addEventListener('DOMContentLoaded', fetchEvents);
  


  // Function to fetch events from the backend
async function fetchNotices() {
    try {
      const response = await fetch('http://localhost:5000/api/notices', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const notices = await response.json();
      displayNotices(notices);
    } catch (error) {
      console.error('Error fetching notices:', error.message);
      // Handle error, e.g., display error message to user
    }
  }
  
  // Function to display notices in the HTML
  function displayNotices(notices) {
    const currentEventsContainer = document.getElementById('current-notices');
  
    // Clear previous content
    currentEventsContainer.innerHTML = '';
  
    // Check if there are any notices
    if (notices.length === 0) {
      currentEventsContainer.innerHTML = '<p style="margin-top: 10px">No notices available</p>';
      return;
    }
  
    // Iterate over each event and create HTML elements to display them
    notices.forEach(notice => {
      const eventElement = document.createElement('div');
      eventElement.classList.add('notice-item');
      eventElement.innerHTML = `
        <h4>${notice.title}</h4>
        <p>Description: ${notice.desc}</p>
      `;
      currentEventsContainer.appendChild(eventElement);
    });
  }
  
  // Call fetchEvents when the DOM content is loaded
  document.addEventListener('DOMContentLoaded', fetchNotices);