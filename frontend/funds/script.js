document.addEventListener('DOMContentLoaded', async function() {
    try {
      // Fetch funds data from the backend
      const response = await fetch('http://localhost:5000/api/funds', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch funds data');
      }
  
      const fundsData = await response.json();
  
      // Update the <p> tags with the fetched funds data
      const totalFundsElement = document.querySelector('.total-funds p');
      const fundsUsedElement = document.querySelector('.completed-funds p');
      const remainingFundsElement = document.querySelector('.remaining-funds p');
      const rem = (fundsData.totalFunds - fundsData.allocatedFunds) || 0;
      console.log(rem);
      localStorage.setItem("remainingFunds", rem || 0);
      localStorage.setItem("allocatedFunds", fundsData.allocatedFunds || 0);
      totalFundsElement.textContent = fundsData.totalFunds || 'N/A';
      fundsUsedElement.textContent = fundsData.allocatedFunds || 'N/A';
      remainingFundsElement.textContent = fundsData.totalFunds - (fundsData.allocatedFunds || 0) || 'N/A';
    } catch (error) {
      console.error('Error fetching funds data:', error.message);
      // Handle error, e.g., display error message to user
    }
    try {
      const response = await fetch("http://localhost:5000/api/projects/funds", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const projects = await response.json();
      localStorage.setItem("totalProjects", projects.length);
      displayApprovedProjects(projects);
    } catch (error) {
      console.log("Error fetching projects:", error.message);
      // Handle error, e.g., display error message to user
    }
  });
  

  // async function fetchApprovedProjects(event) {
    
  // }
  
  function displayApprovedProjects(projects) {
    const projectsList = document.querySelector(".projects-list");
    projects.forEach((project) => {
      const projectElement = document.createElement("div");
      projectElement.classList.add("project-item");
      projectElement.id = "project-" + project._id;
      projectElement.innerHTML = `
      <h4>${project.title}</h4>
      <p>${project.desc}</p>
      <p>Funds: ${project.funds}</p>
          `;
      projectsList.appendChild(projectElement);
    });
  }
document.querySelector(".push").addEventListener("click", (event) => {
  if(document.querySelector("#donut-chart").style.padding !== "20px") {
    document.querySelector("#donut-chart").style.padding = "20px";
    document.querySelector("#donut-chart").style.height = "400px";
  } else {
    document.querySelector("#donut-chart").style.padding = "0";
    document.querySelector("#donut-chart").style.height = "0";
  }
})