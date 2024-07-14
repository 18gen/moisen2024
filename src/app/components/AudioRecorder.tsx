import React, { useRef, useImperativeHandle, forwardRef } from 'react';

interface AudioRecorderProps {
  onStop: (audioBlob: Blob) => void;
}

const AudioRecorder = forwardRef(({ onStop }: AudioRecorderProps, ref) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecording
  }));

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
        onStop(audioBlob);
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return null;
});

AudioRecorder.displayName = 'AudioRecorder';

export default AudioRecorder;
