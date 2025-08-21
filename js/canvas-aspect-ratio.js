
// Get Ratio
function getRatio(width, height) {

    let _gcd = gcd(width, height),
        widthRatio = width / _gcd,
        heightRatio = height / _gcd;

    return {
        width: widthRatio,
        height: heightRatio
    }
}

// Gcd Value fn
function gcd(a, b) {
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}

// Get Width|height of image
function getMissingValue(dimensions, ratio) {
    let result;
    if (!dimensions.width) {
        result = (dimensions.height / ratio.height) * ratio.width;
    } else {
        result = (dimensions.width / ratio.width) * ratio.height;
    }
    return Math.round(result);
}

let canvasDimensions = {};
$(document).ready(function () {
    canvasDimensions = {
        orgWidth: canvas.getWidth(),
        orgHeight: canvas.getHeight(),
        resizedWidth: canvas.getWidth(),
        resizedHeight: canvas.getHeight(),
        adjustedWidth: canvas.getWidth(),
        adjustedHeight: canvas.getHeight(),
        zoom: canvas.getZoom(),
        defaultZoom: canvas.getZoom(),
    };
    // if (editor_resolution) {
    //     resizeCanvas({
    //         width: editor_resolution.width,
    //         height: editor_resolution.height,
    //     })
    // }
    /* canvasDimensions = {
        orgWidth: 500,
        orgHeight: 500,
        resizedWidth: 500,
        resizedHeight: 500
    }; */
});
// Canvas resized callback
function canvasResized() {
    // $canvasDiv.css({
    //     width: canvas.getWidth(),
    //     height: canvas.getHeight(),
    //     left: $(".canvas-container").position().left
    // });
}
// Change canvas width
function setCanvasDimensions(data) {
    let { width, height, zoom } = data;
    canvas.setWidth(width);
    canvas.setHeight(height);
    canvas.setZoom(zoom);
    canvasDimensions.adjustedWidth = width;
    canvasDimensions.adjustedHeight = height;
    canvasDimensions.zoom = zoom;
    canvas.renderAll();
    canvasResized();
}
// Resize Canvas
function resizeCanvas(data) {
    let isZoomResized = data.isZoomResized || false;
    let width = parseInt(data.width),
        height = parseInt(data.height),
        ratio = getRatio(width, height),
        newHeight = canvasDimensions.orgHeight,
        newWidth = canvasDimensions.orgWidth;
    if (height > newHeight) {
        newWidth = getMissingValue({ height: newHeight }, ratio);
    }
    if (width > newWidth) {
        newHeight = getMissingValue({ width: newWidth }, ratio);
    }
    if (width <= newWidth && height <= newHeight) {
        newWidth = width;
        newHeight = height;
    }
    let decreaseImagePercentage = ((newWidth / width) * 100),
        zoomPercentage = (decreaseImagePercentage / 100) * 1;
    // Set Canvas Dimensions Val
    canvasDimensions.resizedWidth = width;
    canvasDimensions.resizedHeight = height;
    canvasDimensions.adjustedWidth = newWidth;
    canvasDimensions.adjustedHeight = newHeight;
    canvasDimensions.zoom = zoomPercentage;
    if (!isZoomResized)
        canvasDimensions.defaultZoom = zoomPercentage;
    // Set Properties
    canvas.setZoom(zoomPercentage);
    canvas.setWidth(newWidth);
    canvas.setHeight(newHeight);
    canvas.renderAll();
    canvasResized();

    // Canvas Items
    $('.editor-con-header .tc-cn-items').css({
        width: canvasDimensions.adjustedWidth,
    });
}

// Load Image to canvas as window
function loadImageInCavnasAsWindow(imgSrc, properties = {}, imgHeight = 0) {
    let img = new Image();
    img.src = imgSrc;
    let objId = createNewId();
    properties = {
        top: 0,
        left: 0,
        id: objId,
        ...properties,
        originalItem: {
            id: objId,
            src: imgSrc,
        }
    };

    img.onload = function () {

        // #region Load image to canvas
        let fImage = new fabric.Image(img);

        fImage.set(properties);
        canvas.add(fImage);
        let imageHeight = img.height,
            imageWidth = img.width;
        if (imgHeight > 0) {
            imageHeight = imageHeight + imgHeight;
        }
        resizeCanvas({
            width: imageWidth,
            height: imageHeight
        });
    }
}

// #region Resize canvas when downloading
function startDownloadCanvas() {
    let zoom = canvas.getZoom();
    canvasDimensions.tmpZoom = zoom;
    canvas.setWidth(canvasDimensions.resizedWidth);
    canvas.setHeight(canvasDimensions.resizedHeight);
    canvas.setZoom(1);
    canvas.renderAll();
}

function finishDownloadCanvas() {
    canvas.setZoom(canvasDimensions.tmpZoom);
    canvas.setWidth(canvasDimensions.adjustedWidth);
    canvas.setHeight(canvasDimensions.adjustedHeight);
    canvas.renderAll();
}
// #endregion Resize canvas when downloading
