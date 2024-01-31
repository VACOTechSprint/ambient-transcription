import { useState } from 'react';
import axios from 'axios';

const AudioUploader = ({audioBlob}) => {
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

    const uploadAudio = async () => {
        if (!audioBlob) {
            setUploadStatus('No audio blob provided');
            return;
        }

        const fileName = 'your-audio-file-name.webm'; // Set your desired file name here
        const signedUrl = await fetchSignedUrl(fileName);

        if (!signedUrl) {
            return; // Exit if we didn't get a signed URL
        }

        try {
            console.log('Uploading audioBlob:', audioBlob);
            const response = await axios.put(signedUrl, audioBlob, {
                headers: {
                    'Content-Type': 'audio/webm', // Set the correct content type for your audio blob
                },
            });
            setUploadStatus('Upload successful');
            console.log('Upload response:', response);
        } catch (error) {
            console.error('Error uploading audio:', error.message);
            setUploadStatus('Failed to upload audio');
        }
    };

    return (
        <div>
            <button onClick={uploadAudio}>Upload Audio</button>
            <p>Upload Status: {uploadStatus}</p>
        </div>
    );
};


export default AudioUploader;
