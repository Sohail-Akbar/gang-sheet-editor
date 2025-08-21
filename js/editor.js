// Global Variables
let $editorParent = $(".editor-wrap");

// Canvas init
const canvas = this.__canvas = new fabric.Canvas('canvasEditor', {
    backgroundColor: null,
    preserveObjectStacking: true,
    selectionKey: "ctrlKey",
    selection: true,
    width: $editorParent.width(),
    height: $editorParent.height(),
    controlsAboveOverlay: true,
});

let deletedPositions = []; // To keep track of deleted object positions

// Define the rectangle clip path
var clip = new fabric.Rect({
    left: 100,
    top: 50,
    width: 373.8,
    height: 407.6,
    fill: null,
    absolutePositioned: true
});
canvas.centerObject(clip);
canvas.clipPath = clip;

// Handle file upload and object placement
$(document).on("click", ".add-imag-obj", function () {
    const fileData = $(this).parent('.single-img-obj').data('file');
    const fileType = $(this).parent('.single-img-obj').data('filetype');
    handleFile(fileData, fileType);
});

function handleFile(fileData, fileType) {
    if (fileType.match('image.*')) {
        fabric.Image.fromURL(fileData, function (img) {
            img.scaleToWidth(clip.width / 3); // Resize to fit one third of the clip width
            placeNewObject(img);
        });
    } else if (fileType === 'image/svg+xml') {
        fabric.loadSVGFromString(fileData, function (objects, options) {
            var svgObj = fabric.util.groupSVGElements(objects, options);
            svgObj.scaleToWidth(clip.width / 3); // Resize to fit one third of the clip width
            placeNewObject(svgObj);
        });
    } else if (fileType === 'application/pdf') {
        // Load PDF using PDF.js
        var loadingTask = pdfjsLib.getDocument(fileData);
        loadingTask.promise.then(function (pdf) {
            pdf.getPage(1).then(function (page) {
                var scale = 1.5;
                var viewport = page.getViewport({ scale: scale });

                // Create a temporary canvas to render the PDF page
                var pdfCanvas = document.createElement('canvas');
                var context = pdfCanvas.getContext('2d');
                pdfCanvas.width = viewport.width;
                pdfCanvas.height = viewport.height;

                // Clear the canvas to ensure a transparent background
                context.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                // Render the PDF page onto the temporary canvas
                page.render(renderContext).promise.then(function () {
                    // Convert the canvas to a PNG image URL
                    var imgDataUrl = pdfCanvas.toDataURL("image/png");

                    // Ensure the image URL is properly loaded as a Fabric.js object
                    fabric.Image.fromURL(imgDataUrl, function (img) {
                        img.scaleToWidth(clip.width / 3); // Resize to fit one third of the clip width
                        placeNewObject(img); // Place the image object on the Fabric.js canvas
                    }, { crossOrigin: 'anonymous' }); // Ensure cross-origin issues don't block the loading
                });
            });
        }).catch(function (error) {
            console.error('Error loading PDF:', error);
        });
    }

}


// Function to place new object in a deleted spot or at the end if no spots are available
function placeNewObject(object) {
    if (deletedPositions.length > 0) {
        // If there's a deleted position, place the new object there
        let { left, top } = deletedPositions.shift(); // Get the first available deleted position
        object.set({
            left: left,
            top: top
        });
    } else {
        // Place the object normally in a new row/column if no deleted spots
        distributeObjects(object);
    }

    canvas.add(object);
    canvas.renderAll();
}

// Function to distribute objects in rows of 3, without affecting existing objects
function distributeObjects(object) {
    let objects = canvas.getObjects();
    let currentRowY = clip.top; // Start from the top of the clip area
    let currentX = clip.left;   // Start from the left of the clip area
    let rowMaxHeight = 0;
    let itemsInRow = 0;

    // Loop through all objects to find where to place the new object
    objects.forEach(function (existingObject) {
        if (existingObject === object) return; // Skip the object being placed

        existingObject.setCoords();  // Update object position and dimensions

        // If 3 objects are placed in the current row, move to the next row
        if (itemsInRow === 3) {
            currentRowY += rowMaxHeight;  // Move down to the next row
            currentX = clip.left;         // Reset X to the left for new row
            itemsInRow = 0;               // Reset item counter for new row
            rowMaxHeight = 0;             // Reset max height for new row
        }

        // Move X for the next object in the row
        currentX += existingObject.getScaledWidth();

        // Update the maximum height for the current row
        if (existingObject.getScaledHeight() > rowMaxHeight) {
            rowMaxHeight = existingObject.getScaledHeight();
        }

        itemsInRow++;
    });

    // Place the new object in the next available space
    if (itemsInRow === 3) {
        // Move to the next row if current row is full
        currentRowY += rowMaxHeight;
        currentX = clip.left;
    }

    // Set the position for the new object
    object.set({
        left: currentX,
        top: currentRowY
    });
}

// Handle deletion of an object and save its position
canvas.on("object:removed", function (e) {
    let removedObject = e.target;

    // Save the deleted object's position to reuse later
    deletedPositions.push({
        left: removedObject.left,
        top: removedObject.top
    });

    canvas.renderAll();
});


// Listen for mouse down event
canvas.on('mouse:down', function (event) {
    let target = canvas.findTarget(event.e),
        $objectButtonContainer = $(".object-action-buttons");
    if (target) {
        $objectButtonContainer.removeClass("d-none");
    } else {
        $objectButtonContainer.addClass("d-none");
    }
});

// Duplicate object
$(document).on("click", ".duplicate-obj-btn", function () {
    let activeObj = activeObject();
    if (!activeObj) return false;
    // Clone the active object
    activeObj.clone(function (cloned) {
        cloned.set({
            left: activeObj.left + 10,
            top: activeObj.top + 10,
        });
        canvas.add(cloned);
        canvas.renderAll();
    });
});

// Rotate Object
$(document).on("click", ".rotate-obj-btn", function () {
    let type = $(this).data("type");
    let activeObj = activeObject();
    if (!activeObj) return false;

    let rotationAngle = type === "left" ? -15 : 15;
    activeObj.rotate(activeObj.angle + rotationAngle);
    canvas.renderAll();
});

// Flip Object
$(document).on("click", ".flip-obj", function () {
    let type = $(this).data("type"); // Get the type of flip (x or y)
    let activeObj = activeObject();

    if (!activeObj) return false;

    if (type === "x") {
        toggle('flipX', activeObj);
    } else if (type === "y") {
        toggle('flipY', activeObj);
    }

    canvas.renderAll();
});

// Delete Active Object
$(document).on("click", ".delete-obj-btn", function () {
    let activeObj = activeObject();
    if (!activeObj) {
        console.warn("No active object to delete.");
        return false;
    }
    canvas.remove(activeObj);
    canvas.discardActiveObject();
    canvas.renderAll();
});


