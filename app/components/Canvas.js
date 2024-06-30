import { useEffect, useRef } from 'react';

export default function Canvas({ currentCoordinate, volumePositions }) {
  const canvasRef = useRef(null);

    const scaleMultiple = 150; 

  // Function to draw a node at a specific position
  const drawNode = (ctx, x, y) => {
    ctx.beginPath();
    ctx.arc(x*scaleMultiple, y*scaleMultiple, 10, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  };

  // Function to draw a grid
  const drawGrid = (ctx, width, height, gridSize) => {
    ctx.beginPath();
    ctx.strokeStyle = 'lightgray';
    ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }

    ctx.stroke();
    ctx.closePath();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawPoint = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the grid
      drawGrid(ctx, canvas.width, canvas.height, 50);

      // Draw the static nodes from volume positions
      Object.values(volumePositions).forEach( vol => {
        console.log(vol);
        drawNode(ctx, vol.position[0], vol.position[1]);
      });

      // Draw the moving point based on the current coordinate
      const { x, y, confidence } = currentCoordinate;
      const radius = Math.max(10 * (1 - confidence), 2); // Smaller radius for higher confidence, with a minimum size
      ctx.beginPath();
      ctx.arc(x*scaleMultiple, y*scaleMultiple, radius, 0, Math.PI * 2, false);
      ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'; // Blue with 50% transparency
      ctx.fill();
      ctx.closePath();

      requestAnimationFrame(drawPoint);
    };

    drawPoint();
  }, [currentCoordinate, volumePositions]);

  return (
    <div>
      <canvas ref={canvasRef} width="500" height="500" style={{ border: '1px solid black' }}></canvas>
    </div>
  );
}





// import { useEffect, useRef } from 'react';

// export default function Canvas({ currentCoordinate }) {
//   const canvasRef = useRef(null);

//   // Function to draw a node at a specific position
//   const drawNode = (ctx, x, y) => {
//     ctx.beginPath();
//     ctx.arc(x, y, 10, 0, Math.PI * 2, false);
//     ctx.fillStyle = 'red';
//     ctx.fill();
//     ctx.closePath();
//   };

//   // Function to draw a grid
//   const drawGrid = (ctx, width, height, gridSize) => {
//     ctx.beginPath();
//     ctx.strokeStyle = 'lightgray';
//     ctx.lineWidth = 0.5;

//     // Vertical lines
//     for (let x = 0; x <= width; x += gridSize) {
//       ctx.moveTo(x, 0);
//       ctx.lineTo(x, height);
//     }

//     // Horizontal lines
//     for (let y = 0; y <= height; y += gridSize) {
//       ctx.moveTo(0, y);
//       ctx.lineTo(width, y);
//     }

//     ctx.stroke();
//     ctx.closePath();
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');

//     const drawPoint = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Draw the grid
//       drawGrid(ctx, canvas.width, canvas.height, 50);

//       // Draw the static nodes
//       drawNode(ctx, 100, 100);
//       drawNode(ctx, 400, 100);
//       drawNode(ctx, 100, 400);
//       drawNode(ctx, 400, 400);

//       // Draw the moving point based on the current coordinate
//       const { x, y, confidence } = currentCoordinate;
//       const radius = Math.max(30 * (1 - confidence), 2); // Smaller radius for higher confidence, with a minimum size
//       ctx.beginPath();
//       ctx.arc(x, y, radius, 0, Math.PI * 2, false);
//       ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'; // Blue with 50% transparency
//       ctx.fill();
//       ctx.closePath();

//       requestAnimationFrame(drawPoint);
//     };

//     drawPoint();
//   }, [currentCoordinate]);

//   return (
//     <div>
//       <canvas ref={canvasRef} width="500" height="500" style={{ border: '1px solid black' }}></canvas>
//     </div>
//   );
// }



// // import { useEffect, useRef } from 'react';

// // export default function Canvas({ currentCoordinate }) {
// //   const canvasRef = useRef(null);

// //   // Function to draw a node at a specific position
// //   const drawNode = (ctx, x, y) => {
// //     ctx.beginPath();
// //     ctx.arc(x, y, 10, 0, Math.PI * 2, false);
// //     ctx.fillStyle = 'red';
// //     ctx.fill();
// //     ctx.closePath();
// //   };

// //   useEffect(() => {
// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext('2d');

// //     const drawPoint = () => {
// //       ctx.clearRect(0, 0, canvas.width, canvas.height);

// //       // Draw the static nodes
// //       drawNode(ctx, 100, 100);
// //       drawNode(ctx, 400, 100);
// //       drawNode(ctx, 100, 400);
// //       drawNode(ctx, 400, 400);

// //       // Draw the moving point based on the current coordinate
// //       const { x, y, confidence } = currentCoordinate;
// //       const radius = Math.max(50 * (1 - confidence), 10); // Smaller radius for higher confidence, with a minimum size
// //       ctx.beginPath();
// //       ctx.arc(x, y, radius, 0, Math.PI * 2, false);
// //       ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'; // Blue with 50% transparency
// //       ctx.fill();
// //       ctx.closePath();

// //       requestAnimationFrame(drawPoint);
// //     };

// //     drawPoint();
// //   }, [currentCoordinate]);

// //   return (
// //     <div>
// //       <canvas ref={canvasRef} width="500" height="500" style={{ border: '1px solid black' }}></canvas>
// //     </div>
// //   );
// // }