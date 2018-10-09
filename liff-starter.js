var wrapper = document.getElementById("signature-pad");
var clearButton = wrapper.querySelector("[data-action=clear]");
var changeColorButton = wrapper.querySelector("[data-action=change-color]");
var undoButton = wrapper.querySelector("[data-action=undo]");
var sendButton = document.getElementById("sendmessagebutton");
var closeWindowButton = document.getElementById("closewindowbutton");
var canvas = document.getElementById("mycanvas");
//var signaturePad = new SignaturePad(canvas);
var signaturePad = new SignaturePad(canvas, {
    // It's Necessary to use an opaque color when saving image as JPEG;
    // this option can be omitted if only saving as PNG or SVG
    backgroundColor: 'rgb(255, 255, 255)'
});

window.onload = function (e) {
    liff.init(function (data) {
        //window.alert(JSON.stringify(data));
        initializeApp(data);
    });
};
function initializeApp(data) {

    clearButton.addEventListener("click", function (event) {
        signaturePad.clear();
    });
      
    undoButton.addEventListener("click", function (event) {
        var data = signaturePad.toData();
      
        if (data) {
          data.pop(); // remove the last dot or line
          signaturePad.fromData(data);
        }
    });
      
    changeColorButton.addEventListener("click", function (event) {
        var r = Math.round(Math.random() * 255);
        var g = Math.round(Math.random() * 255);
        var b = Math.round(Math.random() * 255);
        var color = "rgb(" + r + "," + g + "," + b +")";
      
        signaturePad.penColor = color;
    });
    // closeWindow call
    closeWindowButton.addEventListener('click', function () {
        liff.closeWindow();
    });

    // sendMessages call
    sendButton.addEventListener('click', function () {
        if (signaturePad.isEmpty()) {
            alert("draw something");
        } else {
            var dataURL = signaturePad.toDataURL();
            Send(dataURL);
        }
    });
}

function resizeCanvas() {
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    signaturePad.clear(); // otherwise isEmpty() might return incorrect value
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function Send(dataURL){
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": 'https://api.imgur.com/3/image',
        "method": "POST",
        "datatype": "json",
        "headers": {
            "Authorization": "Client-ID " + '59891e0427c16b3'
        },
        "processData": false,
        "contentType": false,
        "data":dataURL.replace('data:image/png;base64', ''),
        success: function (res) {
            liff.sendMessages([{
                type: 'image',
                originalContentUrl: res.data.link,
                previewImageUrl: res.data.link
            }]).then(function () {
                liff.closeWindow();
            }).catch(function (error) {
                window.alert('Error sending message: ' + error.message);
            });
        },
        error: function () {
            window.alert('Error sending message: ' + error.message);
        }
    });
}