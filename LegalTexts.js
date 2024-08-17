
document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');

    function showSection(id) {
        sections.forEach(section => {
            if (section.id === id) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = link.getAttribute('data-target');
            showSection(target);
        });
    });

    // Show the first section by default
    if (sections.length > 0) {
        sections[0].classList.add('active');
    }
});

function toggleUploadForm(formId) {
    const uploadForm = document.getElementById(formId);
    if (uploadForm) {
        uploadForm.style.display = uploadForm.style.display === 'none' ? 'block' : 'none';
    } else {
        console.error(`Element with ID '${formId}' not found.`);
    }
}

function uploadFile(sectionId) {
    const passwordInput = document.getElementById(`${sectionId}-password`);
    const fileInput = document.getElementById(`${sectionId}-file`);
    const file = fileInput.files[0];
    const correctPassword = "2985614"; // Replace with the correct password

    if (passwordInput.value !== correctPassword) {
        alert('كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.');
        return;
    }

    if (file) {
        const uploadedFiles = document.getElementById(`${sectionId}-uploads`);
        if (!uploadedFiles) {
            alert('لم يتم العثور على منطقة التحميل. يرجى التحقق من معرف القسم.');
            return;
        }
        // Hide the no-files message
        const noFilesMessage = uploadedFiles.querySelector('.no-files');
        if (noFilesMessage) {
            noFilesMessage.style.display = 'none';
        }

        const fileContainer = document.createElement('div');
        fileContainer.classList.add('file-container');
        
        // Display the file as a PDF
        const fileIframe = document.createElement('iframe');
        fileIframe.src = URL.createObjectURL(file);
        fileContainer.appendChild(fileIframe);

        const fileName = document.createElement('p');
        fileName.textContent = `اسم الملف: ${file.name}`;
        fileContainer.appendChild(fileName);

        const fileDate = document.createElement('p');
        fileDate.textContent = `تاريخ الرفع: ${new Date().toLocaleDateString()}`;
        fileContainer.appendChild(fileDate);

        const downloadLink = document.createElement('a');
        downloadLink.href = fileIframe.src;
        downloadLink.download = file.name;
        downloadLink.textContent = "تحميل";
        fileContainer.appendChild(downloadLink);

        // Add star rating
        const ratingContainer = document.createElement('div');
        ratingContainer.classList.add('rating');
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.dataset.rating = i;
            star.addEventListener('click', function() {
                setRating(ratingContainer, i);
            });
            ratingContainer.appendChild(star);
        }
        fileContainer.appendChild(ratingContainer);

        // Add comment and rating
        const commentSection = document.createElement('div');
        commentSection.classList.add('comment-section');
        const commentTitle = document.createElement('h3');
        commentTitle.textContent = 'تعليق:';
        const commentTextarea = document.createElement('textarea');
        const commentButton = document.createElement('button');
        commentButton.textContent = 'إرسال';
        commentButton.addEventListener('click', function() {
            const commentText = commentTextarea.value;
            if (commentText) {
                const comment = document.createElement('div');
                comment.classList.add('comment');
                comment.textContent = commentText;
                
                // Add edit and delete buttons
                const editButton = document.createElement('button');
                editButton.classList.add('edit-button');
                editButton.textContent = 'تعديل';
                editButton.addEventListener('click', function() {
                    commentTextarea.value = comment.textContent;
                    comment.remove();
                });

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.textContent = 'حذف';
                deleteButton.addEventListener('click', function() {
                    comment.remove();
                });

                comment.appendChild(editButton);
                comment.appendChild(deleteButton);
                fileContainer.appendChild(comment);
                commentTextarea.value = '';
            } else {
                alert('يرجى كتابة تعليق قبل الإرسال.');
            }
        });

        commentSection.appendChild(commentTitle);
        commentSection.appendChild(commentTextarea);
        commentSection.appendChild(commentButton);
        fileContainer.appendChild(commentSection);

        uploadedFiles.appendChild(fileContainer);

        // Hide the upload form after successful upload
        const uploadForm = document.getElementById(`${sectionId}-form`);
        if (uploadForm) {
            uploadForm.style.display = 'none';
        }
    } else {
        alert('يرجى اختيار ملف أولاً.');
    }
}

function setRating(ratingContainer, rating) {
    const stars = ratingContainer.querySelectorAll('span');
    stars.forEach(star => {
        if (star.dataset.rating <= rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}
