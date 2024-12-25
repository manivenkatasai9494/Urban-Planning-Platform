async function submitConcern(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const location = document.getElementById("loc").value;
    const desc = document.getElementById("desc").value;
    const level = document.getElementById("security-level").value;
    const phone = document.getElementById("phone").value;

    try {
        const response = await fetch("http://localhost:5000/api/concerns/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify({ location, desc, level, phone })
        });
        if (!response.ok) {
            throw new Error("Failed to create concern");
        }
        const concern = await response.json();
        console.log("Concern created successfully:", concern);
        window.location.href = "/security";
        // Optionally, display a success message or redirect the user
    } catch (error) {
        console.error("Error creating concern:", error.message);
        // Handle error, e.g., display error message to user
    }
}

document.querySelector(".submit").addEventListener("click", submitConcern);
