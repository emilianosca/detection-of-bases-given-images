const labels = ['sergio-01', 'viche-01', 'mike-01', 'emi-01']
console.log('Loading models...' + labels) 



const video = document.getElementById('video') 

function startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
  }
  
  video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    //   faceapi.draw.drawDetections(canvas, resizedDetections)
    //   faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    //   faceapi.draw.drawFaceExpressions(canvas, resizedDetections)    
    loadLabeledImages()
    }, 10000)
    
  
  })
  


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),  
]).then(startVideo)


async function loadLabeledImages() { 

    console.log('Loading images...')
    console.log('Loading images...')
    console.log('Loading images...')
    
    const canvas = faceapi.createCanvasFromMedia(video)
      
    const MODEL_URL = '/models'
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
    await faceapi.loadFaceLandmarkModel(MODEL_URL)
    await faceapi.loadFaceRecognitionModel(MODEL_URL)
    await faceapi.loadFaceExpressionModel(MODEL_URL)

    let faceDescriptions = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors().withFaceExpressions()
    faceDescriptions = faceapi.resizeResults(faceDescriptions, video)

    const labeledFaceDescriptors = await Promise.all( 
        labels.map(async label => {
            const imgUrl = `images/${label}.jpg`
            console.log("This is the image url: " + imgUrl)
            const img = await faceapi.fetchImage(imgUrl)
            console.log("This is the image: " + img)
            const faceDescription = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor()
            if (!faceDescription) {
                console.log("No faces detected for " + label)
                throw new Error(`no faces detected for ${label}`)
            }
            else {
                console.log("Faces detected for " + label)
            }
            const faceDescriptors = [faceDescription.descriptor]
            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
            })
        );
        const threshold = 0.6
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, threshold)

        const results = faceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))
        results.forEach((bestMatch, i) => {
          console.log(bestMatch.toString() + " " + faceDescriptions[i].expressions)
          // const box = faceDescriptions[i].detection.box
          // const text = bestMatch.toString()
          // const drawBox = new faceapi.draw.DrawBox(box, { label: text })            
          document.body.append(canvas) //
          const displaySize = { width: video.width, height: video.height }
          faceapi.matchDimensions(canvas, displaySize)

          let managmentProcess = setInterval(async () => {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
          const resizedDetections = faceapi.resizeResults(detections, displaySize)
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
          let imageDistanceFace = bestMatch._distance 

          if (imageDistanceFace < 0.6) { 
            console.log("The person is unknown with a confidence of: " + bestMatch._distance)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            clearInterval(managmentProcess)
            // drawBox.draw(canvas)
          }
          else { 
            if (bestMatch._distance >= 0.6 && bestMatch._label == "sergio-01" ) {
              console.log("The person is Sergio with a confidence of: " + bestMatch._distance)
              faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
              faceapi.draw.drawDetections(canvas, resizedDetections)
              clearInterval(managmentProcess)
              // drawBox.draw(canvas)
          }
          else if (bestMatch._label == "viche-01" && bestMatch._distance > 0.6) {
              console.log("The person is Viche with a confidence of: " + bestMatch._distance)
              faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
              faceapi.draw.drawDetections(canvas, resizedDetections)
              clearInterval(managmentProcess)
              // drawBox.draw(canvas)
          } 
          else if (bestMatch._label == "mike-01" && bestMatch._distance > 0.6) {

              console.log("The person is Mike with a confidence of: " + bestMatch._distance)
              faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
              faceapi.draw.drawDetections(canvas, resizedDetections)
              clearInterval(managmentProcess)
              // drawBox.draw(canvas)
          }
          }         
              faceapi.draw.drawDetections(canvas, resizedDetections)
              faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
              faceapi.draw.drawFaceExpressions(canvas, resizedDetections)    
          
            }, 1000)  
        })

       
       
            
         
       
          


} 


