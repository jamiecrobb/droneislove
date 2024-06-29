'use client';
import React, { useState, useEffect, useRef } from 'react';

export function AudioRecorder() {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const animationFrameRef = useRef(null);
  const kernelBufferRef = useRef([]);
  const [lastUpdate, setLastUpdate] = useState(0);

  const kernelSize = 100; // Adjust the size of the kernel for smoothing

  useEffect(() => {
    const getMicrophoneAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);

        // Create a ScriptProcessorNode for processing the audio data
        scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(256, 1, 1);
        scriptProcessorRef.current.onaudioprocess = (event) => {
          const inputBuffer = event.inputBuffer.getChannelData(0);
          let sum = 0;
          for (let i = 0; i < inputBuffer.length; i++) {
            sum += Math.abs(inputBuffer[i]); //* inputBuffer[i];
            // console.log(inputBuffer[i]);
          }
          const rms = sum / inputBuffer.length;
          const average = rms * 100;

          // Add the new volume to the kernel buffer
          kernelBufferRef.current.push(average);

          // Keep only the last `kernelSize` values in the buffer
          if (kernelBufferRef.current.length > kernelSize) {
            kernelBufferRef.current.shift();
          }

          // Calculate the smoothed volume
          const smoothedVolume =
            kernelBufferRef.current.reduce((acc, val) => acc + val, 0) /
            kernelBufferRef.current.length;

          setVolume(smoothedVolume);
        };

        source.connect(scriptProcessorRef.current);
        scriptProcessorRef.current.connect(audioContextRef.current.destination);

      } catch (err) {
        console.error('Error accessing microphone', err);
      }
    };

    getMicrophoneAccess();



  }, []);

  useEffect(() => {

    const date = Date.now();
    if ((date - lastUpdate) > 500) {

      sendVolume();
      setLastUpdate(date);

    }
  }, [volume]);

  const API_ENDPOINT = "https://172.20.10.2:5000";
  const device_id = "jamie";

  const sendVolume = async () => {
    // const currentVolume = volume;
    console.log(`Sending volume: ${volume}`);
    try {

      const data = {
        "device_id": "jamie",
        "volume": volume.toFixed(2),
      }

      const response = await fetch(`/api/sendvolume`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify(data)
      })

      // await axios.post(`${API_ENDPOINT}/sendvolume/`, data, {
      //   headers: {
      //     "content-type": "json",
      //   }
      // })

      // const response = await fetch(`${API_ENDPOINT}/sendvolume/${device_id}/${(volume*100).toFixed(0)}`);
      // if (!response.ok) {
      //   throw new Error(`Failed to send volume. Status: ${response.status.toString()}`);
      // }
    } catch (error) {
      console.error('Error sending volume:', error);
    }
  };

  return (
    <div>
      <h1>Microphone Volume Level</h1>
      <div style={{ width: `${volume}px`, height: '50px', background: 'green' }} />
      <p>Volume: {volume.toFixed(2)}</p>
    </div>
  );
};

export default AudioRecorder;
