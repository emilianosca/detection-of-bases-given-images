export function faceSystem(){
              
    console.log("faceSystem working ! :)");
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

        
        const labels = ['sergio-01', 'mike-01', 'emi-01', 'viche-01']

        const labeledFaceDescriptors = await Promise.all(

            labels.map(async label => {

                const imgUrl = `/images/${label}.jpg`
                const img = await faceapi.fetchImage(imgUrl)
                
                const faceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                
                if (!faceDescription) {
                console.log('no faces detected for ${label}')
                throw new Error(`no faces detected for ${label}`)
                }
                else {
                    console.log('face detected for' + label)
                }
                
                const faceDescriptors = [faceDescription.descriptor]
                return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
            })
        );


        console.log("start recognition");
        const threshold = 0.6
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, threshold)

        const results = faceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))
        console.log("results were " + results);

        results.forEach((bestMatch, i) => {
            console.log("ENTERED HERe " + bestMatch.toString())
            const box = faceDescriptions[i].detection.box
            const text = bestMatch.toString()

            if(threshold > bestMatch.distance){ 
                console.log("face detected ! :)" + bestMatch.toString());
                const drawBox = new faceapi.draw.DrawBox(box, { label: text })
                drawBox.draw(canvas)
            }
            else {
                console.log("no face detected ! :(");
                const drawBox = new faceapi.draw.DrawBox(box, { label: 'no match' })
                drawBox.draw(canvas)
            }
        })
        console.log("end recognition");

    }
    
    face()
}



