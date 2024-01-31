import { useState } from 'react';
import axios from 'axios';

const AudioUploader = () => {
    const [uploadStatus, setUploadStatus] = useState('');

    const fetchSignedUrl = async (fileName) => {
        try {
            // Replace this URL with the endpoint that generates your signed URL
            const response = await axios.get(`https://us-east4-vacotechsprint.cloudfunctions.net/signed-url-function?fileName=${fileName}`);
            console.log(response.data.url);
            return response.data.url; // Assuming the response contains the signed URL in the 'url' field
        } catch (error) {
            console.error('Error fetching signed URL:', error);
            setUploadStatus('Failed to fetch signed URL');
        }
    };

    const uploadAudio = async (audioBlob) => {
        const fileName = 'your-audio-file-name.webm'; // Set your desired file name here
        const signedUrl = await fetchSignedUrl(fileName);

        if (!signedUrl) {
            return; // Exit if we didn't get a signed URL
        }

        try {
            const response = await axios.put(signedUrl, audioBlob, {
                headers: {
                    'Content-Type': 'audio/webm', // Set the correct content type for your audio blob
                },
            });
            setUploadStatus('Upload successful');
            console.log('Upload response:', response);
        } catch (error) {
            console.error('Error uploading audio:', error);
            setUploadStatus('Failed to upload audio');
        }
    };

    // This function is just an example trigger for the upload process
    const handleUploadClick = () => {
        const exampleAudioBlob = new Blob(['Your audio data here'], { type: 'audio/webm' }); // Replace with your actual audio blob
        uploadAudio(exampleAudioBlob);
    };

    return (
        <div>
            <button onClick={handleUploadClick}>Upload Audio</button>
            <p>Upload Status: {uploadStatus}</p>
        </div>
    );
};

export default AudioUploader;
