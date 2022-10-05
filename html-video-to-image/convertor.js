(() => {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
  
    const width = 320; // We will scale the photo width to this
    let height = 0; // This will be computed based on the input stream
  
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
    let streaming = false;
  
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
  
    let video = null;
    let canvas = null;
    let photo = null;
    let startbutton = null;
  
    function showViewLiveResultButton() {
      if (window.self !== window.top) {
        // Ensure that if our document is in a frame, we get the user
        // to first open it in its own tab or window. Otherwise, it
        // won't be able to request permission for camera access.
        document.querySelector(".content-area").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener('click', () => window.open(location.href));

        // change background color of .allowed-area
        // document.querySelector(".allowed-area").style.backgroundColor = "#f0f";
        // console.log("Changed background color of .allowed-area to #f0f");

        return true;
      }
      return false;
    }
  
    function startup() {
      if (showViewLiveResultButton()) { return; }
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      photo = document.getElementById('photo');
      startbutton = document.getElementById('startbutton');
  
      navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
  
      video.addEventListener('canplay', (ev) => {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);
  
          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.
  
          if (isNaN(height)) {
            height = width / (4/3);
          }
  
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
      }, false);
  
      startbutton.addEventListener('click', (ev) => {
        takepicture();
        screenshot();
        ev.preventDefault();
      }, false);
  
      clearphoto();
    }
  
    // Fill the photo with an indication that none has been
    // captured.
  
    function clearphoto() {
      const context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      const data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    }
  
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
  
    function takepicture() {
      const context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
  
        const data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
        return data;
      } else {
        clearphoto();
      }
    }
  

// function that takes a screenshot of the video every 1 second
function screenshot() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, 320, 240);
    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
    setTimeout(screenshot, 3000);
    console.log("screenshot taken");
}


    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
  })();
  

// code that uses model to compare images
console.log("ready");
      
async function face(){
    
    const MODEL_URL = '/models'

    await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
    await faceapi.loadFaceLandmarkModel(MODEL_URL)
    await faceapi.loadFaceRecognitionModel(MODEL_URL)
    await faceapi.loadFaceExpressionModel(MODEL_URL)

    
    // get image from function takepicture() in convertor.js
    

    
    const img= data;

    let faceDescriptions = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors().withFaceExpressions()
    const canvas = $('#reflay').get(0)
    faceapi.matchDimensions(canvas, img)

    faceDescriptions = faceapi.resizeResults(faceDescriptions, img)
    faceapi.draw.drawDetections(canvas, faceDescriptions)
    faceapi.draw.drawFaceLandmarks(canvas, faceDescriptions)
    faceapi.draw.drawFaceExpressions(canvas, faceDescriptions)

    
    const labels = ['sergio-01', 'mike-01', 'emi-01']

    const labeledFaceDescriptors = await Promise.all(
        labels.map(async label => {

            const imgUrl = `images/${label}.jpg`
            const img = await faceapi.fetchImage(imgUrl)
            
            const faceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
            
            if (!faceDescription) {
            throw new Error(`no faces detected for ${label}`)
            }
            
            const faceDescriptors = [faceDescription.descriptor]
            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
        })
    );

    const threshold = 0.6
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, threshold)

    const results = faceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))

    results.forEach((bestMatch, i) => {
        const box = faceDescriptions[i].detection.box
        const text = bestMatch.toString()

        if(threshold > bestMatch.distance){ 
            const drawBox = new faceapi.draw.DrawBox(box, { label: text })
            drawBox.draw(canvas)
        }
        else {
            const drawBox = new faceapi.draw.DrawBox(box, { label: 'no match' })
            drawBox.draw(canvas)
        }
    })

}

face()