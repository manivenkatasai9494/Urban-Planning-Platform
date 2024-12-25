
const showOverlayBtn = document.getElementById('propose-project');
const overlay = document.getElementById('overlay');
const centeredDiv = document.getElementById('centeredDiv');

showOverlayBtn.addEventListener('click', function() {
  overlay.style.display = 'block';
  centeredDiv.style.display = 'block';
});

overlay.addEventListener('click', function() {
  overlay.style.display = 'none';
  centeredDiv.style.display = 'none';
  document.getElementById('centeredDiv-project').style.display = 'none';
});






// for displaying all the projects
async function fetchProjects() {
  try {
    const response = await fetch('http://localhost:5000/api/projects', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        },
      });
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    const projects = await response.json();
    const projectsList = document.getElementById("projects-list");
  projectsList.innerHTML = " ";
    displayProjects(projects);
  } catch (error) {
    console.log("Error fetching projects:", error.message);
    // Handle error, e.g., display error message to user
  }
}

function displayProjects(projects) {
  const projectsList = document.getElementById("projects-list");
  projects.forEach((project) => {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project-item");
    projectElement.id = "project-" + project._id;
    projectElement.innerHTML = `
        <h4>${project.title}</h4>
        <p>${project.desc}</p>
      `;
    projectsList.appendChild(projectElement);
  });
}

// Fetch projects when the page loads
window.addEventListener("DOMContentLoaded", fetchProjects);



// for proposing a project
document.getElementById('proposalForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = {
    title: document.getElementById('title').value,
    desc: document.getElementById('desc').value
  };

  try {
    const response = await fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      window.location.href = '/error-pages/403.html'
      throw new Error(errorMessage);
    }

    window.location.href = '/projects'; // Change to appropriate route
  } catch (error) {
    console.error('Login failed:', error.message);
    // Handle error, e.g., display error message to user
  }
});


// for displaying each project
document.addEventListener('DOMContentLoaded', function() {
  const projectsList = document.getElementById('projects-list');
  const centeredDiv = document.getElementById('centeredDiv-project');
  const overlay = document.getElementById('overlay');

  projectsList.addEventListener('click', async function(event) {
    const projectItem = event.target.closest('.project-item');
    if (!projectItem) return;

    const projectId = projectItem.id.split('-')[1]; // Extract project ID from the project item's ID

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }

      const projectData = await response.json();

      // Populate the inner-block div with the fetched project details
      const innerBlock = centeredDiv.querySelector('.inner-block');
      innerBlock.innerHTML = `
        <h2 class="heading">${projectData.title}</h2>
        <p><b>About: </b>${projectData.desc}</p>
        <p><b>Votes:</b> ${projectData.votes}</p>
        <button id="vote">Vote for the project</button>
      `;

      // Show the centeredDiv-project and overlay
      centeredDiv.style.display = 'block';
      overlay.style.display = 'block';

      // Attach click event listener to the vote button
      const voteButton = innerBlock.querySelector('#vote');
      voteButton.addEventListener('click', async function() {
        try {
          const voteResponse = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify({ votes: projectData.votes + 1}) // Increment the vote count
          });

          if (!voteResponse.ok) {
            throw new Error('Failed to vote for the project');
          }

          // Update the vote count in the UI

          projectData.votes++;
          innerBlock.querySelector('p:nth-child(3)').innerHTML = `<b>Votes:</b> ${projectData.votes}`;
        } catch (error) {
          console.error('Error voting for the project:', error.message);
          // Handle error, e.g., display error message to user
        }
      });
    } catch (error) {
      console.error('Error fetching project details:', error.message);
      // Handle error, e.g., display error message to user
    }
  });

  
});
