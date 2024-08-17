// Get modal elements
var modal = document.getElementById("new-course-modal");
var btn = document.getElementById("new-course-button");
var span = document.getElementsByClassName("close")[0];

// Get content elements
var noCourseContent = document.getElementById("no-course-content");
var profileSection = document.getElementById("profile-section");

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Handle the form submission
document.getElementById("new-course-form").onsubmit = function(event) {
    event.preventDefault();
    // Close the modal
    modal.style.display = "none";
    // Hide the no-course-content and show the profile-section
    noCourseContent.style.display = "none";
    profileSection.style.display = "block";

    // Get form values
    var courseTitle = document.getElementById("course-title").value;
    var courseDescription = document.getElementById("course-description").value;
    var courseLink = document.getElementById("course-link").value;
    var courseMode = document.getElementById("course-mode").value;

   // Create a new course card
var courseCard = `
<div class="course-card">
    <div class="course-image">
        <img src="still-life-with-scales-justice.jpg" alt="Course Thumbnail">
    </div>
    <div class="course-info">
        <h3>${courseTitle}</h3>
        <p>${courseDescription}</p>
        <p><strong>رابط الزووم:</strong> <a href="${courseLink}" target="_blank">${courseLink}</a></p>
        <p><strong>وضع الدورة:</strong> ${courseMode === 'online' ? 'أون لاين' : 'وجاهي'}</p>
    </div>
</div>
`;


    // Append the new course card to the profile section
    profileSection.insertAdjacentHTML('beforeend', courseCard);
}
