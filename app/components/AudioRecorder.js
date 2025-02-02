'use client';
import React, { useState, useEffect, useRef } from 'react';

const scotlandWords = [
  'Highland', 
  'Bagpipes', 
  'Loch Ness', 
  'Tartan', 
  'Edinburgh', 
  'Haggis', 
  'Braveheart', 
  'Clan', 
  'Whisky', 
  'Caledonia', 
  'Deep fried Mars bar', 
  'Glen', 
  'Kilt', 
  'Scotch', 
  'Scottish terrier', 
  'Robert Burns', 
  'St. Andrew', 
  'Celtic', 
  'Glasgow', 
  'Aberdeen',
  'Bam',
  'Fergus',
  'Pint of Tennents',
  'Baldy',
  'Subcrawl',
];

const adjectives = [
  'Crusty',
  'Stingy',
  'Clumpy',
  'Jammy',
  'Bold',
  'Mighty',
  'Ancient',
  'Mystic',
  'Legendary',
  'Noble',
  'Glorious',
  'Enchanted',
  'Fierce',
  'Regal',
  'Whispering',
  'Eternal',
  'Golden',
  'Brilliant',
  'Radiant',
  'Spirited',
  'Royal',
  'Wandering',
  'Majestic',
  'Vibrant',
];

function generateInitialName() {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = scotlandWords[Math.floor(Math.random() * scotlandWords.length)];

    // Create the random name
    const randomName = `${randomAdjective} ${randomNoun}`;
    return randomName;
}

export function AudioRecorder() {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const animationFrameRef = useRef(null);
  const kernelBufferRef = useRef([]);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [name, setName] = useState(generateInitialName());

  const kernelSize = 100; // Adjust the size of the kernel for smoothing

  useEffect(() => {
    const getMicrophoneAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: {
          echoCancellation: false,
          // noiseSuppression: false,
          autoGainControl: false,
        } });
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
          // const rms = sum / inputBuffer.length;
          
          const rms = Math.abs(inputBuffer[inputBuffer.length - 1]);
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
  const device_id = name;

  const sendVolume = async () => {
    // const currentVolume = volume;
    console.log(`Sending volume: ${volume}`);
    try {

      const data = {
        "device_id": device_id,
        "x": Math.random()*4,
        "y": Math.random()*4,
        "volume": volume,
      }

      const response = await fetch(`/api/sendvolume`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify(data)
      })

    } catch (error) {
      console.error('Error sending volume:', error);
    }
  };

  return (
    <div>
      <p>Your name is: {name}</p>
      <h1>Microphone Volume Level</h1>
      <div style={{ width: `${volume}px`, height: '50px', background: 'green' }} />
      <p>Volume: {volume.toFixed(2)}</p>
    </div>
  );
};

export default AudioRecorder;
