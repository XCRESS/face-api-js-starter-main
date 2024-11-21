console.log(faceapi);

const loadModels = async () => {
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    ]);
};

const setupVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    const videoFeed = document.getElementById('videoFeed');
    videoFeed.srcObject = stream;
    return videoFeed;
};

const createFaceMatcher = async () => {
    const referenceFaces = [
        { label: 'Veshant', imagePath: './images/my.jpeg' },
        { label: 'Aman', imagePath: './images/aman.jpeg' },
        { label: 'yashika', imagePath: './images/yashika.jpeg' },
    ];

    const labeledDescriptors = await Promise.all(
        referenceFaces.map(async ({ label, imagePath }) => {
            const img = await faceapi.fetchImage(imagePath);
            const faceData = await faceapi.detectAllFaces(img)
                .withFaceLandmarks()
                .withFaceDescriptors();
            const descriptors = faceData.map(fd => fd.descriptor);
            return new faceapi.LabeledFaceDescriptors(label, descriptors);
        })
    );

    return new faceapi.FaceMatcher(labeledDescriptors);
};

const drawOnCanvas = (canvas, videoFeed, faceData, faceMatcher) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faceapi.resizeResults(faceData, videoFeed).forEach(face => {
        faceapi.draw.drawDetections(canvas, [face]);
        faceapi.draw.drawFaceLandmarks(canvas, [face]);
        faceapi.draw.drawFaceExpressions(canvas, [face]);

        const { age, gender, genderProbability, descriptor, detection } = face;
        const text = [`${gender} (${Math.round(genderProbability * 100)}%)`, `${Math.round(age)} years`];
        new faceapi.draw.DrawTextField(text, detection.box.topRight).draw(canvas);

        const match = faceMatcher.findBestMatch(descriptor);
        new faceapi.draw.DrawBox(detection.box, { label: match.toString() }).draw(canvas);
    });
};

const run = async () => {
    await loadModels();
    const videoFeed = await setupVideo();
    const faceMatcher = await createFaceMatcher();

    const canvas = document.getElementById('canvas');
    faceapi.matchDimensions(canvas, videoFeed);

    setInterval(async () => {
        const faceData = await faceapi.detectAllFaces(videoFeed)
            .withFaceLandmarks()
            .withFaceDescriptors()
            .withAgeAndGender()
            .withFaceExpressions();
        drawOnCanvas(canvas, videoFeed, faceData, faceMatcher);
    }, 200);
};

run();
