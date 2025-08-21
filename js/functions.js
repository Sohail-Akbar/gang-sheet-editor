const l = console.log;

// #region adding items to editor
function addItemToEditor(item, properties = {}, options = {}, cp = null) {
    let shape = 0,
        { src, type, fileType } = item,
        id = createNewId();
    if (!fileType)
        fileType = type;
    // Item class
    if (!item.class) {
        let itemClasses = {
            'svg': 'shape'
        },
            itemClass = fileType in itemClasses ? itemClasses[fileType] : fileType;
        item.class = itemClass;
    }

    properties.id = id;
    properties.name = item.type;
    item.id = id;
    item.fileType = fileType;
    properties.options = options;
    properties.originalItem = item;

    if (fileType == "svg") {
        properties = {
            ...properties,
        };
        fabric.loadSVGFromURL(src, function (objects, options) {
            obj = fabric.util.groupSVGElements(objects, options);
            if (item.type === "mask") {
                // add mask on active object
                let activeObj = canvas.getActiveObject();
                if (!activeObj) return false;
                let svgObj = obj,
                    { width, height } = activeObj;
                svgObj.set({
                    left: -(width / 2),
                    top: -(height / 2),
                })
                let scale = width / svgObj.width;
                svgObj.scaleX = scale;
                scale = height / svgObj.height;
                svgObj.scaleY = scale;

                activeObj.dirty = true;
                activeObj.clipPath = svgObj;
                canvas.renderAll();
                return true;
            }
            // add svg icon
            obj.set(properties)
                .setCoords();
            if (!options.beforeRender) {
                obj.scaleToWidth(200);
            }
            // Add item to Editor
            canvas.add(obj);
            addItemToEditorCallback(id);
            if (cp) cp(obj)
        });
    } else if (fileType == "text") {
        properties = {
            fontFamily: 'sans-serif',
            fill: '#333',
            erasable: false,
            ...properties,
        };
        shape = new fabric.IText(src, properties);
        canvas.add(shape);
        addItemToEditorCallback(id);
        if (cp) cp(shape);
    } else if (fileType == "image") {
        fabric.Image.fromURL(src, function (img) {
            img.set(properties);
            // Add item to Editor
            canvas.add(img);
            addItemToEditorCallback(id);
            if (cp) cp(img);
        });
    }
}


// add layers, etc of editor object
function addItemToEditorCallback(objId) {
    let obj = getObjById(objId);
    if (!obj) return false;
    let options = obj.options || {},
        centerObject = "centerObject" in options ? options.centerObject : true,
        selected = "selected" in options ? options.selected : true;

    // Make obj active
    canvas.setActiveObject(obj);
    canvas.renderAll();
}


// Get editor object id
function createNewId() {
    return getRand(30);
}

// Generate random string
function getRand(length = 30, type = 'string') {
    let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (type === 'integer') {
        characters = '0123456789';
    }
    let charactersLength = characters.length,
        randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return randomString;
}

// Get canvas object by id
function getObjById(id) {
    let targetObj = null;
    // let obj = canvas._objects.find(obj => obj.id == id);
    let targetObject = null;
    canvas._objects.forEach(obj => {
        if (targetObject) return true;
        if (obj.id == id) {
            targetObject = obj;
        }
        else if (obj._objects) {
            let groupObj = obj._objects.find(object => object.id == id);
            if (groupObj) {
                targetObject = groupObj;
            }
        }
    });
    return targetObject;
}

// Set Object Alignment
function alignmentObject(val, activeObj) {
    let canvasWidth = canvasDimensions.resizedWidth,
        canvasHeight = canvasDimensions.resizedHeight;
    switch (val) {
        case 'left':
            activeObj.set({
                left: 0,
            });
            break;
        case 'right':
            activeObj.set({
                left: canvasWidth - activeObj.getWidth(),
            });
            break;
        case 'top':
            activeObj.set({
                top: 0,
            });
            break;
        case 'bottom':
            activeObj.set({
                top: canvasHeight - activeObj.getHeight(),
            });
            break;
        case 'centerH':
            activeObj.set({
                left: (canvasWidth / 2) - (activeObj.getWidth() / 2),
            });
            break;
        case 'centerV':
            activeObj.set({
                top: (canvasHeight / 2) - (activeObj.getHeight() / 2),
            });
            break;
    }
}

// Canvas active object fn
function activeObject() {
    return canvas.getActiveObject();
}

// Export canvas
function exportCanvasFile(type, options = {}) {
    if (!type) return false;
    startDownloadCanvas();
    let downloadLink,
        downloadFile = ("downloadFile" in options) ? options.downloadFile : true;

    if (type == "svg") {
        let svgStr = canvas.toSVG(),
            svg64 = btoa(svgStr);
        b64Start = 'data:image/svg+xml;base64,';
        downloadLink = b64Start + svg64;
    } else if (type == "png") {
        downloadLink = canvas.toDataURL("image/png");
    } else {
        let bgColor = canvas.backgroundColor;
        if (!bgColor)
            canvas.backgroundColor = "#fff";
        downloadLink = canvas.toDataURL("image/jpeg");
        canvas.backgroundColor = bgColor;
    }
    if (downloadFile) {
        var anchor = document.createElement('a');
        anchor.href = downloadLink;
        anchor.target = '_blank';
        anchor.download = "image." + type;
        anchor.click();
    }

    finishDownloadCanvas();
    return downloadLink;
}


// create Layer html
function createLayerHtml(object, svgIcon, id = "", subGroup = false) {
    let isSubGroup = subGroup ? "sub-group" : "";
    $html = `<div class="single-layer ${isSubGroup}" data-parent="${id}" data-object-id="${object.id}">
        <div class="d-flex ml-3">
          <span class="icon mr-2">${svgIcon}</span>
          <p class="ml-2">Layer</p>
        </div>
        <div class="action">
            <button title="Delete Object" class="deleteObj" data-object-id="${object.id}"><?xml version="1.0" encoding="utf-8"?><svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M960 160h-291.2a160 160 0 0 0-313.6 0H64a32 32 0 0 0 0 64h896a32 32 0 0 0 0-64zM512 96a96 96 0 0 1 90.24 64h-180.48A96 96 0 0 1 512 96zM844.16 290.56a32 32 0 0 0-34.88 6.72A32 32 0 0 0 800 320a32 32 0 1 0 64 0 33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-10.56-6.72zM832 416a32 32 0 0 0-32 32v96a32 32 0 0 0 64 0v-96a32 32 0 0 0-32-32zM832 640a32 32 0 0 0-32 32v224a32 32 0 0 1-32 32H256a32 32 0 0 1-32-32V320a32 32 0 0 0-64 0v576a96 96 0 0 0 96 96h512a96 96 0 0 0 96-96v-224a32 32 0 0 0-32-32z" fill="#231815" /><path d="M384 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM544 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM704 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0z" fill="#231815" /></svg></button>
        </div>
      </div>`;
    return $html;
}
// add Layer fn
function addLayer(object, layerUpdate = false) {
    let type = object.type;
    let svgIcon = "";
    if (type == "i-text")
        svgIcon = '<svg id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M497,90c8.291,0,15-6.709,15-15V15c0-8.291-6.709-15-15-15h-60c-8.291,0-15,6.709-15,15v15H90V15c0-8.401-6.599-15-15-15 H15C6.599,0,0,6.599,0,15v60c0,8.399,6.599,15,15,15h15v332H15c-8.291,0-15,6.709-15,15v60c0,8.291,6.709,15,15,15h60 c8.291,0,15-6.709,15-15v-15h332v15c0,8.399,6.599,15,15,15h60c8.401,0,15-6.601,15-15v-60c0-8.401-6.599-15-15-15h-15V90H497z  M452,422h-15c-8.401,0-15,6.599-15,15v15H90v-15c0-8.291-6.709-15-15-15H60V90h15c8.401,0,15-6.601,15-15V60h332v15 c0,8.291,6.709,15,15,15h15V422z"></path></g></g><g><g><path d="M361,105H151c-8.291,0-15,6.709-15,15v60c0,6.064,3.647,11.543,9.258,13.857c5.625,2.329,12.056,1.04,16.348-3.252 L187.211,165H226v176.459l-27.48,42.221c-3.062,4.6-3.354,10.518-0.747,15.396S205.463,407,211,407h90 c5.537,0,10.62-3.047,13.228-7.925c2.608-4.878,2.314-10.796-0.747-15.396L286,341.459V165h38.789l25.605,25.605 c4.307,4.307,10.781,5.596,16.348,3.252c5.61-2.314,9.258-7.793,9.258-13.857v-60C376,111.709,369.291,105,361,105z"></path></g></g></svg>';
    // // Drag and drop
    if (type == "image" || type == "path" || object.svgPathExt == "svg")
        svgIcon = `<img src="${object.svgPath}" / class="img-fuild w-100">`;

    if (!svgIcon) return false;
    let $html = createLayerHtml(object, svgIcon);
    $(".layer-container").prepend($html);
}


// layer poisiton change
function layerPositionChange(canvas, layerUpdate = false) {
    setTimeout(() => {
        let objects = canvas._objects;
        let layerContainer = $(`.layer-container`);
        layerContainer.html('');
        if (objects.length < 1) return false;
        objects.forEach(obj => {
            addLayer(obj, layerUpdate);
        });
        // active object with layer
        let activeObj = canvas.getActiveObject();
        if (activeObj) {
            let layer = $(`.layer-container .single-layer[data-object-id="${activeObj.id}"]`);
            layer.addClass('active').siblings().removeClass('active');
        }
    }, 100);
}


// // Handle file function
// function handleFile(fileData, fileType) {
//     if (fileType.match('image.*')) {
//         fabric.Image.fromURL(fileData, function (img) {
//             img.scaleToWidth(clip.width / 4); // Resize to fit half the canvas width
//             img.left = clip.width
//             img.top = 100
//             canvas.add(img);
//             canvas.clipPath = clip;
//             canvas.renderAll();
//         });
//     } else if (fileType === 'image/svg+xml') {
//         // Handle SVG files
//         fabric.loadSVGFromString(fileData, function (objects, options) {
//             var svgObj = fabric.util.groupSVGElements(objects, options);
//             svgObj.scaleToWidth(clip.width / 4); // Resize to fit half the canvas width
//             svgObj.left = clip.width
//             svgObj.top = 100
//             canvas.add(svgObj);
//             canvas.clipPath = clip;
//             canvas.renderAll();
//         });
//     } else if (fileType === 'application/pdf') {
//         // Handle PDF files using pdf.js
//         var loadingTask = pdfjsLib.getDocument(fileData);
//         loadingTask.promise.then(function (pdf) {
//             // Get the first page of the PDF
//             pdf.getPage(1).then(function (page) {
//                 var scale = 1.5;
//                 var viewport = page.getViewport({ scale: scale });

//                 // Prepare canvas using PDF page dimensions
//                 var pdfCanvas = document.createElement('canvas');
//                 var context = pdfCanvas.getContext('2d');
//                 pdfCanvas.width = viewport.width;
//                 pdfCanvas.height = viewport.height;

//                 // Render PDF page into canvas context
//                 var renderContext = {
//                     canvasContext: context,
//                     viewport: viewport
//                 };
//                 page.render(renderContext).promise.then(function () {
//                     // Add the rendered PDF page as an image on Fabric.js canvas
//                     fabric.Image.fromURL(pdfCanvas.toDataURL(), function (img) {
//                         img.scaleToWidth(clip.width / 3); // Resize to fit half the canvas width
//                         img.left = clip.width
//                         img.top = 100
//                         canvas.add(img);
//                         canvas.clipPath = clip;
//                         canvas.renderAll();
//                     });
//                 });
//             });
//         });
//     };
// }

// Append file to container
function appendFileToContainer(file) {
    var reader = new FileReader();

    reader.onload = function (event) {
        let content = ''; // Variable to store inner content (image or PDF)
        const fileType = file.type;

        // Check the file type to determine the content
        if (fileType.startsWith('image/')) {
            // If it's an image, show it
            content = `<img src="${event.target.result}" class="w-full h-full object-contain add-imag-obj" draggable="true" alt="">`;
        } else if (fileType === 'application/pdf') {
            // If it's a PDF, create a canvas to render it
            content = `<canvas class="pdf-canvas w-full h-full add-imag-obj"></canvas>`;
        }

        // Single HTML structure for all file types
        var fileHtml = `
            <div class="border single-img-obj aspect-square flex items-center relative cursor-pointer transparent-pattern" data-file="${event.target.result}" data-fileType="${fileType}" style="--cell-size: 8px;">
                ${content} <!-- This will be either the image or the PDF placeholder -->
                <div class="rounded-full remove-img-obj bg-red-500 h-4 w-4 absolute right-px top-px flex items-center justify-center cursor-pointer z-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" class="text-white text-xs" style="--sx: 1; --sy: 1; --r: 0deg;">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path>
                    </svg>
                </div>
                <div class="btn-builder px-0 rounded-sm text-white h-4 min-w-[16px] absolute bottom-0 right-0 justify-center items-center flex text-xs">
                    <span>${fileType === 'application/pdf' ? 'PDF' : ''}</span>
                </div>
            </div>`;

        // Append the new file div to the container
        $('.file-container').append(fileHtml);

        // If it's a PDF, render it after appending to the DOM
        if (fileType === 'application/pdf') {
            const canvasElement = $('.file-container .pdf-canvas').last()[0]; // Get the last canvas element
            renderPDF(event.target.result, canvasElement); // Pass canvas to render the PDF
        }
    };

    reader.readAsDataURL(file); // Convert file to a base64 URL
}

// Function to render PDF using PDF.js and attempt to hide background
function renderPDF(dataUrl, canvas) {
    const loadingTask = pdfjsLib.getDocument(dataUrl);

    loadingTask.promise.then(function (pdf) {
        // Get the first page of the PDF
        pdf.getPage(1).then(function (page) {
            const viewport = page.getViewport({ scale: 1.0 });
            const context = canvas.getContext('2d');

            // Set canvas dimensions to match the PDF page
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Ensure the canvas is cleared (transparent)
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Custom background color for the PDF page rendering (transparent background)
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
                background: 'rgba(0, 0, 0, 0)' // Set background to fully transparent
            };

            // Render the PDF page onto the canvas
            page.render(renderContext);
        });
    }).catch(function (error) {
        console.error('Error rendering PDF:', error);
    });
}



// Toggle Flip object
function toggle(flipType, object) {
    if (flipType === 'flipX') {
        object.flipX = !object.flipX;
    } else if (flipType === 'flipY') {
        object.flipY = !object.flipY;
    }
}