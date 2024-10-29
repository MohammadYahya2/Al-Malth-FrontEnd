const userRole = JSON.parse(localStorage.getItem("currentUser"))?.role;

document.addEventListener("DOMContentLoaded", async () => {
  const addCourseButton = document.getElementById("new-course-button");

  addCourseButton.style.display = userRole !== "admin" ? "none" : "block";
  // Fetch and display courses on initial load
  await displayCourses();
});

// Function to fetch and display courses
async function displayCourses() {
  try {
    const response = await fetch("https://malath-backend.almalath.ps/courses", {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("currentUser"))?.token
        }`, // Assuming you are using a token for authorization
      },
    });

    if (response.ok) {
      const courses = await response.json();
      const profileSection = document.getElementById("profile-section");

      // Clear the profile section before adding new courses
      //   profileSection.innerHTML = "";

      if (courses.length === 0) {
        document.getElementById("no-course-content").style.display = "block";
        profileSection.style.display = "none";
      } else {
        document.getElementById("no-course-content").style.display = "none";
        profileSection.style.display = "block";

        // Create course cards and append to the profile section
        courses.forEach((course) => {
          const courseCard = `
            <div class="course-card" id="course-${course.id}">
                <div class="course-image">
                    <img src="assets/still-life-with-scales-justice.jpg" alt="Course Thumbnail">
                </div>
                <div class="course-info">
                    <h3>${course.name}</h3>
                    <p>${course.description}</p>
                    <p><strong>رابط الزووم:</strong> <a href="${
                      course.zoomLink
                    }" target="_blank">${course.zoomLink}</a></p>
                    <p><strong>وضع الدورة:</strong> ${
                      course.location === "online" ? "أون لاين" : "وجاهي"
                    }</p>
                    ${
                      userRole === "admin"
                        ? `<button class="delete-course-button" data-id="${course.id}">حذف الدورة</button>`
                        : ""
                    }
                </div>
            </div>
          `;
          profileSection.insertAdjacentHTML("beforeend", courseCard);
        });
      }

      profileSection.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-course-button")) {
          const courseId = event.target.dataset.id; // Get the course ID from the button

          // Confirm deletion
          const confirmDelete = confirm("هل أنت متأكد من حذف هذه الدورة؟");
          if (confirmDelete) {
            try {
              const response = await fetch(
                `https://malath-backend.almalath.ps/courses/${courseId}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${
                      JSON.parse(localStorage.getItem("currentUser"))?.token
                    }`, // Assuming you're using a token for authorization
                  },
                }
              );

              if (response.ok) {
                // Remove the course card from the UI
                const courseCard = document.getElementById(
                  `course-${courseId}`
                );
                courseCard.remove();

                alert("تم حذف الدورة بنجاح");
              } else {
                alert("فشل حذف الدورة. يرجى المحاولة مرة أخرى.");
              }
            } catch (error) {
              console.error("Error deleting course:", error);
              alert("حدث خطأ. يرجى المحاولة مرة أخرى.");
            }
          }
        }
      });
    } else {
      console.error("Failed to fetch courses");
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
}

// Get modal elements
var modal = document.getElementById("new-course-modal");
var btn = document.getElementById("new-course-button");
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Handle the form submission
document.getElementById("new-course-form").onsubmit = async function (event) {
  event.preventDefault();
  // Close the modal
  modal.style.display = "none";

  // Get form values
  var courseTitle = document.getElementById("course-title").value;
  var courseDescription = document.getElementById("course-description").value;
  var courseLink = document.getElementById("course-link").value;
  var courseMode = document.getElementById("course-mode").value;

  // Send course data to backend API
  try {
    const response = await fetch("https://malath-backend.almalath.ps/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you are using a token for authorization
      },
      body: JSON.stringify({
        name: courseTitle,
        description: courseDescription,
        zoomLink: courseLink,
        location: courseMode, // "online" or "onsite"
      }),
    });

    if (response.ok) {
      // Reload the page to display the new course
      window.location.reload();
    } else {
      alert("Failed to add the course. Please try again.");
    }
  } catch (error) {
    console.error("Error adding course:", error);
    alert("An error occurred. Please try again.");
  }
};
