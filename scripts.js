// console.log(faceapi)

// const run = async()=>{
//     await Promise.all([
//         faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
//         faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
//         faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
//         faceapi.nets.ageGenderNet.loadFromUri('./models'),
//     ])
    
    // const face1 = await faceapi.fetchImage('https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Elon_Musk_Colorado_2022_%28cropped2%29.jpg/220px-Elon_Musk_Colorado_2022_%28cropped2%29.jpg')
//     // const face1 = document.getElementById('face')

//     let faceAiData = await faceapi.detectAllFaces(face1).withFaceLandmarks().withFaceDescriptors().withAgeAndGender()
//     // console.log(faceAiData);

//     const canvas = document.getElementById('canvas')
//     // canvas.style.left = face1.offsetLeft
//     // canvas.style.top = face1.offsetTop
//     // canvas.height = face1.height 
//     // canvas.width = face1.width 
//     faceapi.matchDimensions(canvas,face1)

//     faceAiData = faceapi.resizeResults(faceAiData,face1)
//     faceapi.draw.drawDetections(canvas,faceAiData)   

//     faceAiData.forEach(face => {
//         const { age, gender, genderProbability} = face
//         const genderText = `${gender} - ${Math.round(genderProbability * 100)}%`
//         const ageText = `${Math.round(age)} years`
//         const textField = new faceapi.draw.DrawTextField([genderText, ageText],face.detection.box.bottomLeft).draw(canvas)
//     });
// }

// run()







// console.log(faceapi);

// const run = async () => {
//     await Promise.all([
//         faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
//         faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
//         faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
//         faceapi.nets.ageGenderNet.loadFromUri('./models'),
//         faceapi.nets.faceExpressionNet.loadFromUri('./models'),
//     ]);

//     // Load reference image and create FaceMatcher
//     const refFace = await faceapi.fetchImage('./images/my.jpeg');
//     const refFaceAiData = await faceapi.detectAllFaces(refFace)
//         .withFaceLandmarks()
//         .withFaceDescriptors();
//     const labeledDescriptors = [
//         new faceapi.LabeledFaceDescriptors(
//             'Veshant',
//             refFaceAiData.map(fd => fd.descriptor)
//         ),
//     ];
//     const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);

//     // Setup video feed
//     const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: false,
//     });
//     const videoFeed = document.getElementById('videoFeed');
//     videoFeed.srcObject = stream;

//     // Setup canvas
//     const canvas = document.getElementById('canvas');
//     faceapi.matchDimensions(canvas, videoFeed);

//     setInterval(async () => {
//         let faceAiData = await faceapi.detectAllFaces(videoFeed)
//             .withFaceLandmarks()
//             .withFaceDescriptors()
//             .withAgeAndGender()
//             .withFaceExpressions();

//         // Clear canvas and resize results
//         const ctx = canvas.getContext('2d');
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         faceAiData = faceapi.resizeResults(faceAiData, videoFeed);

//         // Draw detections and labels
//         faceapi.draw.drawDetections(canvas, faceAiData);
//         faceapi.draw.drawFaceLandmarks(canvas, faceAiData);
//         faceapi.draw.drawFaceExpressions(canvas, faceAiData);

//         faceAiData.forEach(face => {
//             const { age, gender, genderProbability, descriptor, detection } = face;
//             const genderText = `${gender} - ${Math.round(genderProbability * 100)}%`;
//             const ageText = `${Math.round(age)} years`;

//             // Draw text
//             const textField = new faceapi.draw.DrawTextField(
//                 [genderText, ageText],
//                 detection.box.topRight
//             );
//             textField.draw(canvas);

//             // Match descriptor and draw box
//             const bestMatch = faceMatcher.findBestMatch(descriptor);
//             const boxOptions = { label: bestMatch.toString() };
//             const drawBox = new faceapi.draw.DrawBox(detection.box, boxOptions);
//             drawBox.draw(canvas);
//         });
//     }, 200);
// };

// run();




console.log(faceapi);

const run = async () => {
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    ]);

    // Load reference images and create FaceMatcher
    const referenceFaces = [
        { name: 'Veshant', imagePath: './images/my.jpeg' },
        { name: 'Aman', imagePath: './images/aman.jpeg' },
        { name: 'Yashika', imagePath: './images/yashika.jpeg' },
    ];

    const labeledDescriptors = [];

    for (const ref of referenceFaces) {
        const refImage = await faceapi.fetchImage(ref.imagePath);
        const refFaceData = await faceapi.detectAllFaces(refImage)
            .withFaceLandmarks()
            .withFaceDescriptors();
        
        if (refFaceData.length === 0) {
            console.warn(`No face detected in reference image for ${ref.name}`);
            continue;
        }

        labeledDescriptors.push(
            new faceapi.LabeledFaceDescriptors(
                ref.name,
                refFaceData.map(fd => fd.descriptor)
            )
        );
    }

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);

    // Setup video feed
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    });
    const videoFeed = document.getElementById('videoFeed');
    videoFeed.srcObject = stream;

    // Setup canvas
    const canvas = document.getElementById('canvas');
    faceapi.matchDimensions(canvas, videoFeed);

    setInterval(async () => {
        let faceAiData = await faceapi.detectAllFaces(videoFeed)
            .withFaceLandmarks()
            .withFaceDescriptors()
            .withAgeAndGender()
            .withFaceExpressions();

        // Clear canvas and resize results
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceAiData = faceapi.resizeResults(faceAiData, videoFeed);

        // Draw detections and labels
        faceapi.draw.drawDetections(canvas, faceAiData);
        faceapi.draw.drawFaceLandmarks(canvas, faceAiData);
        faceapi.draw.drawFaceExpressions(canvas, faceAiData);

        faceAiData.forEach(face => {
            const { age, gender, genderProbability, descriptor, detection } = face;
            const genderText = `${gender} - ${Math.round(genderProbability * 100)}%`;
            const ageText = `${Math.round(age)} years`;

            // Draw text
            const textField = new faceapi.draw.DrawTextField(
                [genderText, ageText],
                detection.box.topRight
            );
            textField.draw(canvas);

            // Match descriptor and draw box
            const bestMatch = faceMatcher.findBestMatch(descriptor);
            const boxOptions = { label: bestMatch.toString() };
            const drawBox = new faceapi.draw.DrawBox(detection.box, boxOptions);
            drawBox.draw(canvas);
        });
    }, 200);
};

run();




