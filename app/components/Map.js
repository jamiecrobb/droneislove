'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function Map() {
  const [volumes, setVolumes] = useState({});
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(0);

  const fetchVolumes = async () => {
    const response = await axios.get("/api/getvolumes");
    setVolumes(response.data);
  };
    useEffect(() => {
        const interval = setInterval(() => {
            fetchVolumes();
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Device Volumes</h1>
      {Object.keys(volumes).length === 0 ? (
        <p>No volume data available</p>
      ) : (
        <ul>
          {Object.keys(volumes).map((deviceId) => (
            <li key={deviceId}>
              <strong>Device ID:</strong> {deviceId} <br />
              <strong>Volume:</strong> {volumes[deviceId].volume}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
