'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Canvas from './Canvas';

export function Map() {
  const [volumes, setVolumes] = useState({});
  const [error, setError] = useState(null);
  const [currentCoordinate, setCurrentCoordinate] = useState({ x: 50, y: 50, confidence: 1 });

  const fetchVolumes = async () => {
    try {
      const response = await axios.get("/api/getvolumes");
      setVolumes(response.data);
    } catch (err) {
      setError(err);
    }
  };

  // Fetch the current coordinate from the API
  const fetchCurrentCoordinate = async () => {
    try {
      const response = await axios.get("/api/getcoordinate");
      setCurrentCoordinate(response.data); // Assuming the API returns an object with x, y, and confidence properties
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchVolumes();
      fetchCurrentCoordinate();
    }, 1000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Extract positions from volumes
  // const volumePositions = Object.values(volumes).map(volume => volume.position);

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
              <strong>Volume:</strong> {volumes[deviceId].volume} <br />
              <strong>Position:</strong> {`(${volumes[deviceId].position[0]}, ${volumes[deviceId].position[1]})`}
            </li>
          ))}
        </ul>
      )}
      <Canvas currentCoordinate={currentCoordinate} volumePositions={volumes} />
    </div>
  );
}




// 'use client';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Canvas from './Canvas';

// export function Map() {
//   const [volumes, setVolumes] = useState({});
//   const [error, setError] = useState(null);
//   const [currentCoordinate, setCurrentCoordinate] = useState({ x: 50, y: 50, confidence: 1 });

//   const fetchVolumes = async () => {
//     try {
//       const response = await axios.get("/api/getvolumes");
//       setVolumes(response.data);
//     } catch (err) {
//       setError(err);
//     }
//   };

//   // Fetch the current coordinate from the API
//   const fetchCurrentCoordinate = async () => {
//     try {
//       const response = await axios.get("/api/getcoordinate");
//       setCurrentCoordinate(response.data); // Assuming the API returns an object with x and y properties
//     } catch (err) {
//       setError(err);
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetchVolumes();
//       // fetchCurrentCoordinate();
//       setCurrentCoordinate({x: Math.random()*500, y: Math.random()*500, confidence: Math.random()})
//     }, 1000);
//     return () => {
//       clearInterval(interval);
//     }
//   }, []);

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div>
//       <h1>Device Volumes</h1>
//       {Object.keys(volumes).length === 0 ? (
//         <p>No volume data available</p>
//       ) : (
//         <ul>
//           {Object.keys(volumes).map((deviceId) => (
//             <li key={deviceId}>
//               <strong>Device ID:</strong> {deviceId} <br />
//               <strong>Volume:</strong> {volumes[deviceId].volume}
//             </li>
//           ))}
//         </ul>
//       )}
//       <Canvas currentCoordinate={currentCoordinate} />
//     </div>
//   );
// }




// // 'use client';
// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import Canvas from './Canvas';

// // export function Map() {
// //   const [volumes, setVolumes] = useState({});
// //   const [error, setError] = useState(null);
// //   const [lastUpdate, setLastUpdate] = useState(0);

// //   const fetchVolumes = async () => {
// //     const response = await axios.get("/api/getvolumes");
// //     setVolumes(response.data);
// //   };
// //     useEffect(() => {
// //         const interval = setInterval(() => {
// //             fetchVolumes();
// //         }, 1000);
// //         return () => {
// //             clearInterval(interval);
// //         }
// //     }, []);

// //   if (error) {
// //     return <div>Error: {error.message}</div>;
// //   }

// //   return (
// //     <div>
// //       <h1>Device Volumes</h1>
// //       {Object.keys(volumes).length === 0 ? (
// //         <p>No volume data available</p>
// //       ) : (
// //         <ul>
// //           {Object.keys(volumes).map((deviceId) => (
// //             <li key={deviceId}>
// //               <strong>Device ID:</strong> {deviceId} <br />
// //               <strong>Volume:</strong> {volumes[deviceId].volume}
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //       <Canvas />
// //     </div>
// //   );
// // };
