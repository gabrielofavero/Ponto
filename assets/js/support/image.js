function _loadProfilePicture() {
    const profilePic = localStorage.getItem('profilePic');
    if (profilePic) {
        const storedImageData = JSON.parse(profilePic); 
        if (storedImageData && storedImageData.base64Data) {
            const profilePicElement = document.getElementById('profilePic');
            if (profilePicElement) {
                profilePicElement.src = storedImageData.base64Data;
            }
        }
    }
}


async function _getImage() {
    const imageInput = document.getElementById('inputImage');
    if (imageInput && imageInput.files && imageInput.files[0]) {
        try {
            return await _convertImageToBase64(imageInput.files[0]);
        } catch (error) {
            console.error("Error converting image to base64:", error);
            return "";
        }
    } else {
        return "";
    }
}

async function _convertImageToBase64(file) {
    return new Promise(async (resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const resizedCanvas = _resizeImage(img);
                const croppedCanvas = _cropImage(resizedCanvas);

                const base64Data = croppedCanvas.toDataURL();
                const imageFormat = base64Data.split(',')[0].split(':')[1].split(';')[0];

                resolve({ base64Data, imageFormat });
            };

            img.onerror = function (err) {
                reject(err);
            };
        };

        reader.readAsDataURL(file);
    });
}

function _resizeImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let newWidth, newHeight;

    if (img.width > 50) {
        const aspectRatio = img.height / img.width;
        newWidth = 50;
        newHeight = 50 * aspectRatio;
    } else {
        newWidth = img.width;
        newHeight = img.height;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    return canvas;
}

function _cropImage(canvas) {
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');

    cropCanvas.width = 50;
    cropCanvas.height = 50;

    const offsetX = (canvas.width - 50) / 2;
    const offsetY = (canvas.height - 50) / 2;

    cropCtx.drawImage(canvas, offsetX, offsetY, 50, 50, 0, 0, 50, 50);

    return cropCanvas;
}