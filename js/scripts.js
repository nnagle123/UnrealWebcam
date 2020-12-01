const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// Get the video
function getVideo () {
    navigator.mediaDevices.getUserMedia({video : true, audio : false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error(`Tabernak!`, err);
        })
}

// Play video in large screen
function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

   return setInterval (() => {
        ctx.drawImage(video, 0, 0, width, height);
        //Take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        //Mess with the pixels
        // pixels = redEffect(pixels);
        
        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.75;
        pixels = greenScreen(pixels);

        //Put the pixels back in
        ctx.putImageData(pixels, 0, 0)
    }, 16);
}

// Take photo
function takePhoto(){
    // play camera sound
    snap.currentTime = 0;
    snap.play();
    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Beast"/>`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels){
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i+0] + 100;   //red pixels
        pixels.data[i + 1] = pixels.data[i+1] - 50;   //green pixels
        pixels.data[i + 2] = pixels.data[i+2] * 0.5;    //blue pixels  -- no need to change alpha pixels    
    }
    return pixels;
}

function rgbSplit(pixels){
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i+0];   //red pixels
        pixels.data[i + 100] = pixels.data[i+1];   //green pixels
        pixels.data[i - 150] = pixels.data[i+2];    //blue pixels  -- no need to change alpha pixels    
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }

// Get video on page load
getVideo();

// Add large video on page load
video.addEventListener('canplay', paintToCanvas);