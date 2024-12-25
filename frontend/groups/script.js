// No need for DOMContentLoaded event if script is at the bottom of the HTML file

const createForm = document.getElementById("createForm");

createForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get form inputs
  const name = document.getElementById("name").value;
  const location = document.getElementById("location").value;
  const desc = document.getElementById("desc").value;

  try {
    // Send a POST request to create the group
    const response = await fetch("http://localhost:5000/api/groups/my-groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ name, location, desc }),
    });

    if (!response.ok) {
      throw new Error("Failed to create group");
    }

    const createdGroup = await response.json();
    console.log("Created group:", createdGroup);

    // Optionally, redirect to a new page or show a success message
    // For example, redirect to the group page:
    window.location.href = `/groups`;
  } catch (error) {
    console.error("Error creating group:", error.message);
    // Handle error, e.g., display error message to user
  }
});

const joinForm = document.getElementById("joinForm");

joinForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Get groupId from the form input
  const groupId = document.getElementById("groupId").value;

  try {
    const response = await fetch("http://localhost:5000/api/users/group", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ groupId }),
    });

    if (!response.ok) {
      throw new Error("Failed to join group");
    }
    localStorage.setItem("currentGroup", groupId);
    // Redirect to home page or show success message
    window.location.href = "/home"; // Redirect to home page
  } catch (error) {
    console.error("Error joining group:", error.message);
    // Handle error, e.g., display error message to user
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("http://localhost:5000/api/groups/my-groups", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch admin groups");
    }

    const adminGroups = await response.json();
    displayAdminGroups(adminGroups);
  } catch (error) {
    console.error("Error fetching admin groups:", error.message);
    // Handle error, e.g., display error message to user
  }
});

function displayAdminGroups(adminGroups) {
  const adminGroupsContainer = document.querySelector(".group-list");

  adminGroups.forEach((group) => {
    const groupElement = document.createElement("div");
    groupElement.classList.add("group-item");
    groupElement.classList.add("group-admin");
    groupElement.innerHTML = `
        <h5>${group.name}</h5>
        <p>id: ${group._id}</p>
      `;
    adminGroupsContainer.appendChild(groupElement);
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch(
      "http://localhost:5000/api/groups/" +
        localStorage.getItem("currentGroup"),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch admin groups");
    }

    const group = await response.json();
    displayGroup(group);
  } catch (error) {
    console.error("Error fetching admin groups:", error.message);
    // Handle error, e.g., display error message to user
  }
});

function displayGroup(group) {
  const adminGroupsContainer = document.querySelector(".current");

  const groupElement = document.createElement("div");
  groupElement.classList.add("group-item");
  groupElement.innerHTML = `
        <h5>${group.name}</h5>
        <p>id: ${group._id}</p>
      `;
  adminGroupsContainer.appendChild(groupElement);
}

document.querySelector(".overlay").addEventListener("click", () => {
  document.querySelector(".overlay").style.display = "none";

  document.querySelector(".admin-page").style.display = "none";
});

document.addEventListener("click", (event) => {
  // Check if the clicked element or any of its ancestors have the class 'group-admin'
  let targetElement = event.target;
  while (targetElement) {
    if (
      targetElement.classList &&
      targetElement.classList.contains("current")
    ) {
      // Handle the click event
      const overlay = document.querySelector(".overlay");
      overlay.style.display = "block";

      const adminPage = document.querySelector(".admin-page");
      adminPage.style.display = "block";
      return; // Exit the loop if a 'group-admin' element is found
    }
    // Move up to the parent element
    targetElement = targetElement.parentElement;
  }
});
