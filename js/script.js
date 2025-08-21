// Hide modal
$(document).on("click", ".window-close", function () {
    let target = $(this).data("target");
    $("#" + target).first().addClass("d-none");
});

// Canvas Clipping area select
$('#headlessui-menu-items-11').on('change', function () {
    const selectedOption = $(this).find('option:selected').text();

    // Extract width and height using regular expressions
    const sizePattern = /(\d+)\s*in\s*X\s*(\d+)\s*in/;
    const match = selectedOption.match(sizePattern);

    if (match) {
        const widthInInches = parseInt(match[1], 10);
        const heightInInches = parseInt(match[2], 10);

        // Convert inches to pixels (assuming 1 inch = 96 pixels)
        const widthInPixels = widthInInches * 96;
        const heightInPixels = heightInInches * 96;
        resizeCanvas({
            width: widthInPixels,
            height: heightInInches
        });
        $('#result').text(`Width: ${widthInPixels}px, Height: ${heightInPixels}px`);
    } else {
        $('#result').text("No size found!");
    }
});

// Supported File Formats: Allows uploading of PNG, SVG, JPG, and PDF
$('#image-picker').on('change', function (e) {
    var files = e.target.files;

    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        if (file.type === 'application/pdf') {
            // Handle PDF file conversion
            convertPdfToSvg(file);
        } else {
            // For PNG, SVG, and JPG files, append directly
            appendFileToContainer(file);
        }
    }
});

// Function to check if the file type is supported
function isValidFileType(file) {
    const supportedFormats = ['image/png', 'image/svg+xml', 'image/jpeg', 'application/pdf'];
    return supportedFormats.includes(file.type);
}

// Function to convert PDF to SVG
function convertPdfToSvg(pdfFile) {
    var formData = new FormData();
    formData.append('pdfFile', pdfFile);
    formData.append('pdfToSvg', true);

    // Make a Jax request to convert PDF to SVG
    $.ajax({
        url: './controllers/pdf-to-svg.php', // Update with your controller path
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            // Assuming the response contains the SVG data
            appendSvgToContainer(response.svg); // Append the SVG to the container
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error converting PDF to SVG: ' + errorThrown);
        }
    });
}

// Event delegation for remove button
$(document).on('click', '.remove-img-obj', function () {
    let $parent = $(this).parent(".single-img-obj");
    $parent.remove();
});

// Handle drag over event
$('#file-drop-area').on('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).addClass('drag-over'); // Highlight the drag area
});

// Handle drag leave event
$('#file-drop-area').on('dragleave', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).removeClass('drag-over'); // Remove highlight
});

// Handle drop event
$('#file-drop-area').on('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).removeClass('drag-over'); // Remove highlight

    var files = e.originalEvent.dataTransfer.files; // Get dropped files
    for (var i = 0; i < files.length; i++) {
        appendFileToContainer(files[i]); // Call function to append file
    }
});