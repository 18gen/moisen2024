// recording test component
import React, { useState, useRef } from 'react';
import axios from 'axios';

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) {
      setUploadStatus('No audio to upload');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadStatus('Upload successful: ' + response.data.filename);
    } catch (error) {
      console.error('Error uploading audio:', error);
      setUploadStatus('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording} disabled={isUploading}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioBlob && (
        <button onClick={uploadAudio} disabled={isRecording || isUploading}>
          Upload Recording
        </button>
      )}
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default AudioRecorder;
