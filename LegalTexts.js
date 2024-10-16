document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("nav ul li a");
  const sections = document.querySelectorAll("main section");

  function showSection(id) {
    sections.forEach((section) => {
      if (section.id === id) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });
  }

  const uploadButtons = document.querySelectorAll(".fixed-upload-btn");

  const userRole = JSON.parse(localStorage.getItem("currentUser"))?.role;

  uploadButtons.forEach((button) => {
    button.style.display = userRole !== "admin" ? "none" : "block";
  });

  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const target = link.getAttribute("data-target");
      showSection(target);
    });
  });

  // Show the first section by default
  if (sections.length > 0) {
    sections[0].classList.add("active");
  }

  const firstSectionId = sections[0].id;

  // Fetch and render uploaded documents for the default section
  fetchUploadedDocsByType(firstSectionId);

  function fetchUploadedDocsByType(type) {
    fetch(`http://localhost:5001/docs/type/${type}`) // Adjust URL to match your backend
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        renderUploadedDocs(type, data);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  }

  function renderUploadedDocs(type, docs) {
    const uploadsContainer = document.getElementById(`${type}-uploads`);
    const token = JSON.parse(localStorage.getItem("currentUser"))?.token;
    // Clear previous files
    uploadsContainer.innerHTML = "";

    if (docs.length === 0) {
      const noFilesMessage = document.createElement("div");
      noFilesMessage.classList.add("no-files");
      noFilesMessage.innerHTML = `
            <img src="assets/9318707.jpg" alt="No Files" />
            <p>لا يوجد ملفات مرفعة</p>
        `;
      uploadsContainer.appendChild(noFilesMessage);
      return;
    }

    docs.forEach((doc) => {
      const fileContainer = document.createElement("div");
      fileContainer.classList.add("file-container");

      // Create an iframe to display the document
      const fileIframe = document.createElement("iframe");
      fileIframe.src = `data:application/pdf;base64,${doc.file}`; // Assuming the file is returned as Base64
      fileIframe.width = "100%";
      fileIframe.height = "500px";
      fileContainer.appendChild(fileIframe);

      // const fileName = document.createElement("p");
      // fileName.textContent = `اسم الملف: ${doc.name}`; // Assuming `name` is part of the document data
      // fileContainer.appendChild(fileName);

      const fileDate = document.createElement("p");
      fileDate.textContent = `تاريخ الرفع: ${new Date(
        doc.createdAt
      ).toLocaleDateString()}`; // Adjust according to your date format
      fileContainer.appendChild(fileDate);

      const commentSection = document.createElement("div");
      const commentsDiv = document.createElement("div");

      commentSection.classList.add("comment-section");

      fetch(`http://localhost:5001/comments/doc/${doc.id}`)
        .then((response) => {
          return response.json();
        })
        .then((comments) => {
          if (comments.length > 0) {
            comments.forEach((comment) => {
              console.log(comment);

              const commentDiv = document.createElement("div");
              commentDiv.classList.add("comment");
              commentDiv.innerHTML = `
              <h3>${comment.user?.username}:</h3>
              <p>${comment.text}</p>
              <small>تم التعليق في: ${new Date(
                comment.createdAt
              ).toLocaleString()}</small>
            `;
              commentsDiv.appendChild(commentDiv);
            });
          }
        });

      const commentTitle = document.createElement("h3");
      commentTitle.textContent = "تعليق:";
      commentTitle.classList.add("comments-section-title");
      const commentTextarea = document.createElement("textarea");
      const commentButton = document.createElement("button");
      const commentVisibilityButton = document.createElement("button");
      const commentBox = document.createElement("div");
      commentBox.classList.add("commentBox");

      commentBox.style.display = userRole ? "flex" : "none";
      commentTitle.style.display = userRole ? "block" : "none";
      let isVisibleComments = false;
      commentsDiv.style.display = isVisibleComments ? "block" : "none";

      commentVisibilityButton.textContent = "عرض التعليقات";
      commentVisibilityButton.classList.add("comments-visibility-button");
      commentVisibilityButton.addEventListener("click", () => {
        commentVisibilityButton.textContent = !isVisibleComments
          ? "اخفاء التعليقات"
          : "عرض التعليقات";
        commentsDiv.style.display = !isVisibleComments ? "block" : "none";
        isVisibleComments = !isVisibleComments;
      });

      commentButton.textContent = "إرسال";
      commentButton.classList.add("comment-section-send-button");
      commentBox.append(commentTextarea);
      commentBox.append(commentButton);

      commentButton.addEventListener("click", function () {
        const commentText = commentTextarea.value;
        if (commentText) {
          fetch(`http://localhost:5001/comments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ docId: doc.id, text: commentText }), // Sending docId and comment
          })
            .then((response) => response.json())
            .then((newComment) => {
              // Display the new comment without refreshing the page
              const newCommentDiv = document.createElement("div");
              newCommentDiv.classList.add("comment");
              newCommentDiv.innerHTML = `
                <p>${newComment.comment}</p>
                <small>تم التعليق في: ${new Date(
                  newComment.createdAt
                ).toLocaleString()}</small>
              `;
              commentTextarea.value = ""; // Clear the textarea
              location.reload();
            })
            .catch((error) => {
              console.error("Error posting comment:", error);
              alert("فشل في إرسال التعليق");
            });
        } else {
          alert("يرجى كتابة تعليق قبل الإرسال.");
        }
      });

      commentSection.appendChild(commentTitle);
      commentSection.appendChild(commentBox);
      commentSection.appendChild(commentVisibilityButton);
      commentSection.appendChild(commentsDiv);

      fileContainer.appendChild(commentSection);

      const downloadLink = document.createElement("a");
      downloadLink.href = `data:application/pdf;base64,${doc.file}`; // Adjust based on your file serving
      downloadLink.download = doc.name;
      downloadLink.textContent = "تحميل";
      fileContainer.appendChild(downloadLink);

      uploadsContainer.appendChild(fileContainer);
    });
  }
});

function toggleUploadForm(formId) {
  const uploadForm = document.getElementById(formId);
  if (uploadForm) {
    uploadForm.style.display =
      uploadForm.style.display === "none" ? "block" : "none";
  } else {
    console.error(`Element with ID '${formId}' not found.`);
  }
}

function uploadFile(sectionId, formId) {
  //   const passwordInput = document.getElementById(`${sectionId}-password`);
  const fileInput = document.getElementById(`${sectionId}-file`);
  const file = fileInput.files[0];
  //   const correctPassword = "2985614";

  //   if (passwordInput.value !== correctPassword) {
  //     alert("كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.");
  //     return;
  //   }

  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", sectionId);
    // formData.append("password", passwordInput.value);
    // formData.append(
    //   "email",
    //   JSON.parse(localStorage.getItem("currentUser")).email
    // );

    // Send file to the backend via POST request
    fetch("http://localhost:5001/docs/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          toggleUploadForm(formId);
          location.reload();
          // displayUploadedFile(sectionId, file, data.file);
        } else {
          alert("File upload failed: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("Failed to upload file");
      });
  } else {
    alert("يرجى اختيار ملف أولاً.");
  }
}

function displayUploadedFile(sectionId, file, uploadedFile) {
  const uploadedFiles = document.getElementById(`${sectionId}-uploads`);

  // Create a file container to display the uploaded file
  const fileContainer = document.createElement("div");
  fileContainer.classList.add("file-container");

  // Decode the Base64 string and create a blob for displaying
  const byteCharacters = atob(uploadedFile); // Decode Base64
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create a blob from the binary data
  const blob = new Blob([byteArray], { type: "application/pdf" }); // Adjust MIME type if necessary
  const url = URL.createObjectURL(blob);

  const fileIframe = document.createElement("iframe");
  fileIframe.src = url; // Set the src to the blob URL
  fileIframe.width = "100%"; // Set the width of the iframe
  fileIframe.height = "500px"; // Set the height of the iframe
  fileContainer.appendChild(fileIframe);

  const fileName = document.createElement("p");
  fileName.textContent = `اسم الملف: ${file.name}`;
  fileContainer.appendChild(fileName);

  const fileDate = document.createElement("p");
  fileDate.textContent = `تاريخ الرفع: ${new Date().toLocaleDateString()}`;
  fileContainer.appendChild(fileDate);

  const downloadLink = document.createElement("a");
  downloadLink.href = url; // Use the blob URL for downloading
  downloadLink.download = file.name;
  downloadLink.textContent = "تحميل";
  fileContainer.appendChild(downloadLink);

  uploadedFiles.appendChild(fileContainer);
}

function setRating(ratingContainer, rating) {
  const stars = ratingContainer.querySelectorAll("span");
  stars.forEach((star) => {
    if (star.dataset.rating <= rating) {
      star.classList.add("selected");
    } else {
      star.classList.remove("selected");
    }
  });
}
