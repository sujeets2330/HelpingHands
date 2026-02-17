// Function to handle form submission
async function handleFormSubmission(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector("button[type='submit']");

  // 🔒 Prevent double submission
  submitBtn.disabled = true;
  const originalText = submitBtn.innerText;
  submitBtn.innerText = "Submitting...";

  // Collect form data
  const formData = new FormData(form);
  const formDataString = new URLSearchParams(formData).toString();

  try {
    // ⏱ Add timeout protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s max

    const response = await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formDataString,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Server error");
    }

    // ✅ SUCCESS UX (IMMEDIATE)
    alert("Thank you! Your donation request has been submitted.");

    // Optional: redirect instead of alert (better UX)
    window.location.href = "/thank";

  } catch (error) {
    console.error("Submission error:", error);
    alert("Submission failed. Please try again.");
  } finally {
    // Restore button (if user comes back)
    submitBtn.disabled = false;
    submitBtn.innerText = originalText;
  }
}

// Attach listener safely
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("donationForm");
  if (form) {
    form.addEventListener("submit", handleFormSubmission);
  }
});
