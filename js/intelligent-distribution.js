// Variables for grid-based motif placement
let gridColumns = 3; // Number of objects per row
let spacing = 10; // Space between motifs
let placedObjects = []; // Array to store added objects and their positions

// Function to calculate the next position for an object
function getNextPosition(objectWidth, objectHeight) {
    let row = 0, col = 0;

    // Loop through the grid to find the next available spot
    for (let i = 0; i < placedObjects.length; i++) {
        col++;
        if (col >= gridColumns) {
            col = 0;
            row++;
        }
    }

    let availableWidth = clip.width - (spacing * (gridColumns - 1)); // Adjust for spacing
    let objectPerRowWidth = availableWidth / gridColumns;

    let objectLeft = clip.left + (col * (objectPerRowWidth + spacing));
    let objectTop = clip.top + (row * (objectHeight + spacing));

    // Check if the object exceeds the clipping area height
    if ((objectTop + objectHeight) > (clip.top + clip.height)) {
        return null; // No more space available
    }

    return { left: objectLeft, top: objectTop };
}

// Updated handleFile function for adding files
function handleFile(fileData, fileType) {
    if (fileType.match('image.*')) {
        fabric.Image.fromURL(fileData, function (img) {
            // Scale image to fit within a column
            let availableWidth = clip.width - (spacing * (gridColumns - 1));
            let objectWidth = availableWidth / gridColumns;

            img.scaleToWidth(objectWidth);

            // Calculate position using the scaled dimensions
            let position = getNextPosition(img.getScaledWidth(), img.getScaledHeight());
            if (position) {
                img.set(position);
                // Add to canvas and clip within the area
                canvas.add(img);
                placedObjects.push({ obj: img, width: img.getScaledWidth(), height: img.getScaledHeight() }); // Store the object and its dimensions
                canvas.renderAll();
            }
        });
    } else if (fileType === 'image/svg+xml') {
        fabric.loadSVGFromString(fileData, function (objects, options) {
            let svgObj = fabric.util.groupSVGElements(objects, options);

            // Scale SVG to fit within a column
            let availableWidth = clip.width - (spacing * (gridColumns - 1));
            let objectWidth = availableWidth / gridColumns;

            svgObj.scaleToWidth(objectWidth);

            // Calculate position using the scaled dimensions
            let position = getNextPosition(svgObj.getScaledWidth(), svgObj.getScaledHeight());
            if (position) {
                svgObj.set(position);
                // Add to canvas and clip within the area
                canvas.add(svgObj);
                placedObjects.push({ obj: svgObj, width: svgObj.getScaledWidth(), height: svgObj.getScaledHeight() }); // Store the object and its dimensions
                canvas.renderAll();
            }
        });
    } else if (fileType === 'application/pdf') {
        // Handle PDF files using pdf.js
        var loadingTask = pdfjsLib.getDocument(fileData);
        loadingTask.promise.then(function (pdf) {
            pdf.getPage(1).then(function (page) {
                var scale = 1.5;
                var viewport = page.getViewport({ scale: scale });

                var pdfCanvas = document.createElement('canvas');
                var context = pdfCanvas.getContext('2d');
                pdfCanvas.width = viewport.width;
                pdfCanvas.height = viewport.height;

                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext).promise.then(function () {
                    fabric.Image.fromURL(pdfCanvas.toDataURL(), function (img) {
                        // Scale PDF to fit within a column
                        let availableWidth = clip.width - (spacing * (gridColumns - 1));
                        let objectWidth = availableWidth / gridColumns;

                        img.scaleToWidth(objectWidth);

                        // Calculate position using the scaled dimensions
                        let position = getNextPosition(img.getScaledWidth(), img.getScaledHeight());
                        if (position) {
                            img.set(position);
                            // Add to canvas and clip within the area
                            canvas.add(img);
                            placedObjects.push({ obj: img, width: img.getScaledWidth(), height: img.getScaledHeight() }); // Store the object and its dimensions
                            canvas.renderAll();
                        }
                    });
                });
            });
        });
    }
}

// Function to remove an object and reorganize the grid
function removeObject(obj) {
    canvas.remove(obj); // Remove from canvas

    // Find and remove the object from placedObjects
    placedObjects = placedObjects.filter(item => item.obj !== obj);

    // Clear the canvas and re-add all remaining objects in correct order
    canvas.clear();
    currentRow = 0;
    currentColumn = 0;
    for (let item of placedObjects) {
        let position = getNextPosition(item.width, item.height);
        if (position) {
            item.obj.set(position);
            canvas.add(item.obj);
        }
    }
    canvas.renderAll();
}
