export function faceSystem(){
              
    console.log("faceSystem working ! :)");

    // function that will determine events driven by the faceSystem
    function faceStatus(status, face){
        if(status == true){ 
            console.log("Status is " + status + " and face is " + face)
        }
        else{
            console.log("Status is " + status  + " and face is " + face)
            // Funcion que proviene de popup.js que nos pone un popup al no detectar una cara
            openPopUp();
        }
    
    }

    async function face(){
        
        const MODEL_URL = '/models'

        await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
        await faceapi.loadFaceLandmarkModel(MODEL_URL)
        await faceapi.loadFaceRecognitionModel(MODEL_URL)
        await faceapi.loadFaceExpressionModel(MODEL_URL)

        const img= document.getElementById('photo')
        let faceDescriptions = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors().withFaceExpressions()
        const canvas = $('#reflay').get(0)
        faceapi.matchDimensions(canvas, img)

        faceDescriptions = faceapi.resizeResults(faceDescriptions, img)
        faceapi.draw.drawDetections(canvas, faceDescriptions)
        faceapi.draw.drawFaceLandmarks(canvas, faceDescriptions)
        faceapi.draw.drawFaceExpressions(canvas, faceDescriptions)

        
        const labels = ['sergio-01', 'mike-01', 'emi-01', 'viche-01'] // here add the names of the people that wants to be recognize

        const labeledFaceDescriptors = await Promise.all(

            labels.map(async label => {

                const imgUrl = `/images/${label}.jpg`
                const img = await faceapi.fetchImage(imgUrl)
                
                const faceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                
                if (!faceDescription) {
                // console.log('no faces detected for ${label}')
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
            const text = bestMatch.toString() + " was detected"

            if(threshold > bestMatch.distance){ 
                console.log("face detected ! :)" + bestMatch.toString());
                const drawBox = new faceapi.draw.DrawBox(box, { label: text })
                drawBox.draw(canvas)
                faceStatus(true, bestMatch.toString())
            }
            else {
                console.log("no face detected ! :(");
                const drawBox = new faceapi.draw.DrawBox(box, { label: 'no match' })
                faceStatus(false, "no face detected")

                drawBox.draw(canvas)
            }
        })

        if (results.length === 0) {
            console.log("No face recognize");
            faceStatus(false, "nobody detected");
        }
    }
    
    face()

}



