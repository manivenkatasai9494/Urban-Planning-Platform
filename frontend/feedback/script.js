document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".success").style.display = "none"; 
})

document.addEventListener("DOMContentLoaded", () => {
    const feedbackForm = document.querySelector(".feedback-form");

    feedbackForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission

        const message = document.getElementById("comments").value;

        try {
            const response = await fetch('http://localhost:5000/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error("Failed to submit feedback");
            }

            const feedback = await response.json();
            console.log("Feedback submitted successfully:", feedback);
            document.querySelector(".success").style.display = "block";
            setTimeout(() => {
              window.location.href = "/feedback"
            }, 1000);
            // Clear the form after successful submission
            feedbackForm.reset();
        } catch (error) {
            console.error("Error submitting feedback:", error.message);
            // Handle error, e.g., display error message to user
            alert("Failed to submit feedback. Please try again later.");
        }
    });
});
