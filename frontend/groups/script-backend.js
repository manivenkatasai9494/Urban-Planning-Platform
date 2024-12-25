// removing the currentAdminPage vvalue form te localStoreage
window.addEventListener("DOMContentLoaded", (event) => {
  event.preventDefault();
  localStorage.setItem("currentAdminPage", "");
});

// for fetching projects
async function fetchProjects() {
  document.querySelectorAll(".admin-items").forEach((item) => {
    if (!item.classList.contains("admin-projects")) {
      item.style.display = "none";
    }
  });
  try {
    const response = await fetch("http://localhost:5000/api/projects", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    const projects = await response.json();
    const currentAdminPage = localStorage.getItem("currentAdminPage");
    console.log(currentAdminPage);
    if (!currentAdminPage || currentAdminPage !== "projects") {
      localStorage.setItem("currentAdminPage", "projects");
      displayProjects(projects);
    }
  } catch (error) {
    console.log("Error fetching projects:", error.message);
    // Handle error, e.g., display error message to user
  }
}

function displayProjects(projects) {
  const projectsList = document.getElementById("projects-list");
  projectsList.innerHTML = '';
  projects.forEach((project) => {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project-item");
    projectElement.id = "project-" + project._id;
    projectElement.innerHTML = `
    <label class="project-label">
    <div class="project-info">
    <h4>${project.title}</h4>
    <p>${project.desc}</p>
    </div>
    <input type="radio" name="selectedProject" value="${project._id}" id="project-${project._id}-radio">
    <label for="project-${project._id}-radio">Select</label>
      </label>
        `;
    projectsList.appendChild(projectElement);
  });
  document.querySelector(".admin-projects").style.display = "block";
}
document.getElementById("projects").addEventListener("click", fetchProjects);

// for funds
document.getElementById("funds").addEventListener("click", updateFunds);
function updateFunds(event) {
  event.preventDefault();
  document.querySelectorAll(".admin-items").forEach((item) => {
    if (!item.classList.contains("admin-funds")) {
      item.style.display = "none";
    } else {
      localStorage.setItem("currentAdminPage", "funds");
      item.style.display = "block";
    }
  });
}

document
  .getElementById("fundsForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get form inputs
    const totalFunds = document.getElementById("totalFunds").valueAsNumber;
    const addFunds = document.getElementById("addFunds").valueAsNumber;

    try {
      // Send a PUT request to update funds
      const response = await fetch("http://localhost:5000/api/funds", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ totalFunds, addFunds }),
      });
      console.log("updaing funds");

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Failed to update funds");
      }

      // Parse the response JSON
      const updatedFunds = await response.json();

      // Handle the updated funds (e.g., display a success message)
      console.log("Updated funds:", updatedFunds);
      // You can display a success message or perform any other action here
      window.location.href = "/groups";
    } catch (error) {
      console.error("Error updating funds:", error.message);
      // Handle error, e.g., display error message to the user
    }
  });








  // Add event listener to the form
const fundsForm = document.querySelector('.buttons');
fundsForm.addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission

  // Get selected project ID
  const selectedProjectId = document.querySelector('input[name="selectedProject"]:checked').value;
  if (!selectedProjectId) {
    console.error('No project selected');
    return;
  }

  // Get the selected action (approve or reject)
  const action = document.querySelector('input[name="status"]:checked').value;
  if (!action) {
    console.error('No action selected');
    return;
  }

  // Get the funds input value
  const fundsInput = document.querySelector('input[type="number"]').valueAsNumber;

  // Call the appropriate function based on the selected action
  switch (action) {
    case 'approve':
      await approveProject(selectedProjectId, fundsInput);
      break;
    case 'reject':
      await rejectProject(selectedProjectId);
      break;
    default:
      console.error('Invalid action');
  }
});

async function approveProject(projectId, funds) {
  try {
    const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ funds }),
    });
    if (!response.ok) {
      throw new Error('Failed to approve project');
    }
    window.location.href = "/groups";
    // Handle success
  } catch (error) {
    console.error('Error approving project:', error.message);
    // Handle error
  }
}

async function rejectProject(projectId) {
  try {
    const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to reject project');
    }
    // Handle success
    window.location.href = "/groups";
  } catch (error) {
    console.error('Error rejecting project:', error.message);
    // Handle error
  }
}






  async function fetchFeedbacks() {
    try {
      const response = await fetch('http://localhost:5000/api/feedback/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      
        if (!response.ok) {
            throw new Error("Failed to fetch feedbacks");
        }
        const feedbacks = await response.json();
        displayFeedbacks(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error.message);
        // Handle error, e.g., display error message to user
    }
}

function displayFeedbacks(feedbacks) {
    const feedbacksContainer = document.getElementById("current-feedbacks");
    feedbacksContainer.innerHTML = ""; // Clear existing feedbacks

    feedbacks.forEach(feedback => {
        const feedbackElement = document.createElement("div");
        feedbackElement.classList.add("feedback-item");
        feedbackElement.innerHTML = `
        <p><b>By: </b>${feedback.userId}</p>
            <p>${feedback.message}</p>
        `;
        feedbacksContainer.appendChild(feedbackElement);
    });
    document.querySelectorAll(".admin-items").forEach((item) => {
      if (!item.classList.contains("admin-feedback")) {
        item.style.display = "none";
      } else {
        localStorage.setItem("currentAdminPage", "feedbacks");
        item.style.display = "block";
      }
    });
}

// Fetch feedbacks when the page loads
document.getElementById("feedback").addEventListener("click", fetchFeedbacks);





document.getElementById("events").addEventListener("click", (event) => {
  event.preventDefault();
  document.querySelectorAll(".admin-items").forEach((item) => {
    if (!item.classList.contains("admin-events")) {
      item.style.display = "none";
    } else {
      localStorage.setItem("currentAdminPage", "events");
      item.style.display = "block";
    }
  });
});


const eventsForm = document.getElementById('events-form');

  eventsForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form data
    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc-event').value;
    const date = document.getElementById('date').value;
    const location = document.getElementById('location-event').value;
    console.log(location);

    try {
      // Send POST request to create event
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ title, desc, date, location }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const eventData = await response.json();
      console.log('Event created successfully:', eventData);

      // Clear form fields after successful submission
      eventsForm.reset();
    } catch (error) {
      console.error('Error creating event:', error.message);
      // Handle error, e.g., display error message to user
    }
  });


  


  document.getElementById("notices").addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelectorAll(".admin-items").forEach((item) => {
      if (!item.classList.contains("admin-notices")) {
        item.style.display = "none";
      } else {
        localStorage.setItem("currentAdminPage", "notices");
        item.style.display = "block";
      }
    });
  });
  
  const noticeForm = document.getElementById('notice-form');
  
    noticeForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      // Get form data
      const title = document.getElementById('notice-title').value;
      const desc = document.getElementById('desc-notice').value;
  
      try {
        // Send POST request to create event
        const response = await fetch('http://localhost:5000/api/notices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ title, desc }),
        });
        console.log(title);
  
        if (!response.ok) {
          throw new Error('Failed to create event');
        }
  
        const eventData = await response.json();
        console.log('Event created successfully:', eventData);
  
        // Clear form fields after successful submission
        noticeForm.reset();
      } catch (error) {
        console.error('Error creating event:', error.message);
        // Handle error, e.g., display error message to user
      }
    });



    async function fetchSecurityConcerns(event) {
      document.querySelectorAll(".admin-items").forEach((item) => {
        if (!item.classList.contains("admin-security")) {
          item.style.display = "none";
        } else {
          localStorage.setItem("currentAdminPage", "security");
          item.style.display = "block";
        }
      });
      event.preventDefault();
      try {
        const response = await fetch("http://localhost:5000/api/concerns", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch security concerns");
        }
        const concernsData = await response.json();
        displaySecurityConcerns(concernsData);
      } catch (error) {
        console.error("Error fetching security concerns:", error.message);
        // Handle error, e.g., display error message to user
      }
  }
  
  function displaySecurityConcerns(concernsData) {
      const currentSecurityElement = document.getElementById("current-security");
      currentSecurityElement.innerHTML = ""; // Clear previous content
  
      concernsData.forEach((concern) => {
          const concernElement = document.createElement("div");
          concernElement.classList.add("security-item");
          concernElement.innerHTML = `
              <h4>Location: ${concern.location}</h4>
              <p>Description: ${concern.desc}</p>
              <p>Security Level: ${concern.level}</p>
              <p>Phone Number: ${concern.phone}</p>
          `;
          currentSecurityElement.appendChild(concernElement);
      });
      
  }
  
  // Fetch security concerns when the page loads
  document.getElementById("security").addEventListener("click", fetchSecurityConcerns);
  