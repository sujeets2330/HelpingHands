 
// Function to handle form submission
async function handleFormSubmission(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get form data
  const formData = new FormData(event.target);
  
  // Convert form data to a URL-encoded string
  const formDataString = new URLSearchParams(formData).toString();

  try {
    // Send the form data to the server using fetch
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formDataString
    });

    // Check if the response is successful
    if (response.ok) {
      const responseData = await response.text();
      console.log('Server response:', responseData);
      alert('Thank you for your submission!');
    } else {
      console.error('Server error:', response.statusText);
      alert('There was an error processing your submission. Please try again later.');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    alert('There was an error processing your submission. Please try again later.');
  }
}

// Add event listener to the form for submission handling
document.getElementById('donationForm').addEventListener('submit', handleFormSubmission);

