async function fetchCurrentUser() {
    try {
        const response = await fetch("http://localhost:5000/api/users/current", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user information");
        }
        const userData = await response.json();
        updateUserInfo(userData);
    } catch (error) {
        console.error("Error fetching user information:", error.message);
        // Handle error, e.g., display error message to user
    }
}

function updateUserInfo(userData) {
    const userNameElement = document.getElementById("userName");
    const emailElement = document.getElementById("email");
    const phoneNumberElement = document.getElementById("phoneNumber");
    const groupIdElement = document.getElementById("groupId");

    userNameElement.textContent = `Username: ${userData.username}`;
    emailElement.textContent = `Email: ${userData.email}`;
    phoneNumberElement.textContent = `Phone Number: ${userData.phone}`;
    groupIdElement.textContent = `Current Group: ${userData.currentGroup}`;
}

// Fetch current user information when the page loads
document.addEventListener("DOMContentLoaded", fetchCurrentUser);
