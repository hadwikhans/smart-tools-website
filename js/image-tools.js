var cropper = null;

window.addEventListener("DOMContentLoaded", function () {

    // ── Auto-select mode from URL param ──
    var urlParams = new URLSearchParams(window.location.search);
    var modeParam = urlParams.get("mode");
    if (modeParam) {
        var radio = document.querySelector('input[name="mode"][value="' + modeParam + '"]');
        if (radio) {
            radio.checked = true;
        }
    }

    // ── Panel switching ──
    document.querySelectorAll('input[name="mode"]').forEach(function(r) {
        r.addEventListener("change", updatePanels);
    });
    updatePanels();

    // ── Quality slider label ──
    var range = document.getElementById("qualityRange");
    var val   = document.getElementById("qualityValue");
    if (range && val) {
        range.addEventListener("input", function () {
            val.textContent = Math.round(this.value * 100) + "%";
        });
    }

    // ── Resize preset ──
    var preset = document.getElementById("resizePreset");
    if (preset) {
        preset.addEventListener("change", function () {
            if (!this.value) return;
            var p = this.value.split("x");
            document.getElementById("resizeWidth").value  = p[0];
            document.getElementById("resizeHeight").value = p[1];
        });
    }

    // ── File upload ──
    var upload = document.getElementById("uploadImage");
    if (upload) {
        upload.addEventListener("change", function () {
            if (this.files && this.files[0]) loadImage(this.files[0]);
        });
    }

    // ── Drag & drop ──
    var dropArea = document.getElementById("dropArea");
    if (dropArea) {
        dropArea.addEventListener("dragover",  function(e){ e.preventDefault(); this.style.borderColor="#5a4fcf"; });
        dropArea.addEventListener("dragleave", function()  { this.style.borderColor="#c0c5d8"; });
        dropArea.addEventListener("drop", function(e) {
            e.preventDefault(); this.style.borderColor="#c0c5d8";
            var file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) loadImage(file);
        });
    }
});

function loadImage(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var preview = document.getElementById("originalPreview");
        if (!preview) return;
        preview.src = e.target.result;
        preview.style.display = "block";
        var kb = (file.size / 1024).toFixed(1);
        var sizeEl = document.getElementById("originalSize");
        if (sizeEl) sizeEl.textContent = "Original: " + kb + " KB";
        var toolbar = document.getElementById("mainToolbar");
        if (toolbar) toolbar.style.display = "flex";
        var cropCtrl = document.getElementById("cropControls");
        if (cropCtrl) cropCtrl.style.display = "none";
        if (cropper) { cropper.destroy(); cropper = null; }
    };
    reader.readAsDataURL(file);
}

function updatePanels() {
    var checked = document.querySelector('input[name="mode"]:checked');
    if (!checked) return;
    var mode = checked.value;
    [["compress", ".compress-panel"], ["resize", ".resize-panel"], ["convert", ".convert-panel"]].forEach(function(pair) {
        var el = document.querySelector(pair[1]);
        if (el) el.style.display = pair[0] === mode ? "block" : "none";
    });
}

// ── Crop: only starts when user clicks "Crop Image" ──
function startCrop() {
    var preview = document.getElementById("originalPreview");
    if (!preview || !preview.src || preview.src === window.location.href) {
        alert("Please upload an image first."); return;
    }
    if (cropper) { cropper.destroy(); cropper = null; }
    cropper = new Cropper(preview, { viewMode: 1, autoCropArea: 0.8 });
    document.getElementById("cropControls").style.display = "block";
    document.getElementById("mainToolbar").style.display  = "none";
}

function applyCrop() {
    if (!cropper) return;
    var canvas  = cropper.getCroppedCanvas();
    var preview = document.getElementById("originalPreview");
    preview.src = canvas.toDataURL();
    cropper.destroy(); cropper = null;
    document.getElementById("cropControls").style.display = "none";
    document.getElementById("mainToolbar").style.display  = "flex";
}

function cancelCrop() {
    if (cropper) { cropper.destroy(); cropper = null; }
    document.getElementById("cropControls").style.display = "none";
    document.getElementById("mainToolbar").style.display  = "flex";
}

function zoomIn()      { if (cropper) cropper.zoom(0.1); }
function zoomOut()     { if (cropper) cropper.zoom(-0.1); }
function rotateLeft()  { if (cropper) cropper.rotate(-90); }
function rotateRight() { if (cropper) cropper.rotate(90); }
function flipH()       { if (cropper) { var d=cropper.getData(); cropper.scaleX(d.scaleX===-1?1:-1); } }
function flipV()       { if (cropper) { var d=cropper.getData(); cropper.scaleY(d.scaleY===-1?1:-1); } }

// ── Process Image ──
function processImage() {
    var preview = document.getElementById("originalPreview");
    if (!preview || !preview.src || preview.src === window.location.href) {
        alert("Please upload an image first."); return;
    }
    var mode = document.querySelector('input[name="mode"]:checked').value;
    var img  = new Image();
    img.onload = function() {
        if (mode === "compress") doCompress(img);
        else if (mode === "resize")  doResize(img);
        else if (mode === "convert") doConvert(img);
    };
    img.src = preview.src;
}

function doCompress(img) {
    var quality = parseFloat(document.getElementById("qualityRange").value) || 0.8;
    showOutput(makeCanvas(img, img.width, img.height).toDataURL("image/jpeg", quality), "compressed.jpg");
}

function doResize(img) {
    var w = parseInt(document.getElementById("resizeWidth").value);
    var h = parseInt(document.getElementById("resizeHeight").value);
    if (!w || !h) { alert("Enter width and height."); return; }
    showOutput(makeCanvas(img, w, h).toDataURL("image/jpeg", 0.92), "resized.jpg");
}

function doConvert(img) {
    var fmt = document.getElementById("formatSelect").value;
    var ext = fmt === "image/png" ? "png" : fmt === "image/webp" ? "webp" : "jpg";
    var canvas = makeCanvas(img, img.width, img.height);
    if (fmt !== "image/png") {
        canvas.getContext("2d").fillStyle = "#fff";
        canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height);
        canvas.getContext("2d").drawImage(img, 0, 0);
    }
    showOutput(canvas.toDataURL(fmt, 0.92), "converted." + ext);
}

function makeCanvas(img, w, h) {
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.getContext("2d").drawImage(img, 0, 0, w, h);
    return c;
}

function showOutput(dataUrl, filename) {
    var outCard = document.getElementById("outputCard");
    var outImg  = document.getElementById("outputPreview");
    var outSize = document.getElementById("outputSize");
    var dl      = document.getElementById("downloadLink");

    if (outImg)  outImg.src = dataUrl;
    if (outSize) outSize.textContent = "Output: ~" + ((dataUrl.length * 0.75) / 1024).toFixed(1) + " KB";
    if (dl) {
        dl.href = dataUrl; dl.download = filename;
        dl.textContent = "⬇ Download " + filename;
        dl.style.display = "inline-block";
    }
    if (outCard) outCard.style.display = "block";
}

function resetTool() {
    if (cropper) { cropper.destroy(); cropper = null; }
    var up = document.getElementById("uploadImage"); if (up) up.value = "";
    var op = document.getElementById("originalPreview"); if (op) { op.src = ""; op.style.display = "none"; }
    var ov = document.getElementById("outputPreview"); if (ov) ov.src = "";
    var mt = document.getElementById("mainToolbar");  if (mt) mt.style.display = "none";
    var cc = document.getElementById("cropControls"); if (cc) cc.style.display = "none";
    var oc = document.getElementById("outputCard");   if (oc) oc.style.display = "none";
    var os = document.getElementById("originalSize"); if (os) os.textContent = "";
}

