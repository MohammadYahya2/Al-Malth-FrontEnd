$(document).ready(function() {
    var current_fs, next_fs, previous_fs; // fieldsets
    var animating; // flag to prevent quick multi-click glitches

    function showFieldset(fieldset) {
        fieldset.show();
        fieldset.css('position', 'relative');
        fieldset.css('opacity', 1);
    }

    $(".next").click(function() {
        if (animating) return false;
        animating = true;

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        if (!validateFields(current_fs)) {
            animating = false;
            return false;
        }

        // Activate next step on progress bar using the index of next_fs
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        // Show the next fieldset and hide the current one
        next_fs.show();
        current_fs.animate({ opacity: 0 }, {
            step: function(now, mx) {
                current_fs.css('position', 'absolute');
                next_fs.css('opacity', 1);
            },
            duration: 800,
            complete: function() {
                current_fs.hide();
                animating = false;
            },
            easing: 'easeInOutBack'
        });
    });

    $(".previous").click(function() {
        if (animating) return false;
        animating = true;

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        // Deactivate current step on progress bar
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        // Show the previous fieldset and hide the current one
        previous_fs.show();
        current_fs.animate({ opacity: 0 }, {
            step: function(now, mx) {
                current_fs.css('left', '');
                previous_fs.css('opacity', 1);
            },
            duration: 800,
            complete: function() {
                current_fs.hide();
                animating = false;
            },
            easing: 'easeInOutBack'
        });
    });

    $("form").on('submit', function(e) {
        var invalidElements = $(':invalid', this);
        if (invalidElements.length > 0) {
            e.preventDefault(); // Prevent form submission
            invalidElements.each(function() {
                $(this).closest('fieldset').show(); // Show the fieldset containing the invalid element
                $(this).siblings('.error-message').show(); // Show the error message
            });
            invalidElements.first().focus(); // Focus the first invalid input
        }
    });

    $("#upload-button").click(function() {
        var file = document.getElementById("file-upload").files[0];
        if (file) {
            var formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "my_preset_1"); // Replace with your upload preset name

            $.ajax({
                url: "https://api.cloudinary.com/v1_1/dr5eedjks/upload",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    // Add the uploaded file URL to a hidden input field
                    $('<input>').attr({
                        type: 'hidden',
                        name: 'uploaded_file_url',
                        value: response.secure_url
                    }).appendTo('#msform');

                    // Show success message
                    $("#upload-status").show();
                },
                error: function(response) {
                    alert("File upload failed. Please try again.");
                }
            });
        } else {
            alert("Please select a file to upload.");
        }
    });

    function validateFields(fieldset) {
        var isValid = true;
        $(fieldset).find(':input[required]').each(function() {
            var errorMessage = $(this).siblings('.error-message');
            if (!this.checkValidity()) {
                errorMessage.show();
                isValid = false;
            } else {
                errorMessage.hide();
            }
        });
        return isValid;
    }
});

function showSubOptions(select) {
    var services = {
        civil_litigation: [
            "التعويض والتعليق والبطان",
            "نزاعات العقود وتبديدها"
        ],
        corporate_law: [
            "تأسيس الشركات",
            "تسجيل العلامات التجارية"
        ],
        personal_status: [
            "دعاوى الطلاق والخلع",
            "دعاوى نفقة بأنواعها: أ. نفقة زوجة. ب. نفقة مطر، وأجرة مسكن، وأجرة حضانة، وأجرة رضاعه. ج. مصاريف التعليم. د. مصاريف العلاج.",
            "دعاوى الحضانة والمشاهدة",
            "دعاوى العضل",
            "دعاوى المهر",
            "دعاوى النشوز",
            "صياغة الاتفاقيات وبنودها وتوثيقها وفق القانون أمام المحاكم المختصة",
            "كافة معاملات المحاكم الشرعية: مصادقة، حجة، حجة وصاية، حجة عريفة، حجة ترمل",
            "تصديق وترجمة الوكالات الشرعية وتصديقها في فلسطين لاستخدامها في الخارج وتصديق كافة المعاملات المنظمة حسب الأصول والقانون",
            "إصدار وتنفيذ الأحكام الأجنبية حسب القانون"
        ],
        contract_drafting: [
            "صياغة العقود القانونية",
            "تقديم المشورة القانونية"
        ],
        criminal_law: [
            "الجنح",
            "الجنايات"
        ],
        employment_law: [
            "قضايا العمل 1",
            "قضايا العمل 2"
        ],
        insurance_law: [
            "قضايا التأمين 1",
            "قضايا التأمين 2"
        ]
    };
    var subServiceMenu = document.getElementById('sub_service');
    subServiceMenu.innerHTML = '';

    if (select.value && services[select.value]) {
        var subOptions = services[select.value];
        subOptions.forEach(function(option) {
            var newOption = document.createElement('option');
            newOption.value = option.toLowerCase();
            newOption.text = option;
            subServiceMenu.appendChild(newOption);
        });
        document.getElementById('sub_options').style.display = 'block';  
    } else {
        subServiceMenu.innerHTML = '<option value="">Please select a service first</option>';
        document.getElementById('sub_options').style.display = 'none';  
    }
}

$('#service_type').change(function() {
    showSubOptions(this);
});
