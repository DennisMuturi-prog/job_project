import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

import confetti from 'canvas-confetti';

import { Button } from './styles';
import { capitalize } from '@/lib/utils';

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  color: #006400;
  padding: 1rem 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 1000;
  animation: popin 1s ease-out;

  @keyframes popin {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

export interface Prize {
  img_src: string;
  label: string;
}

interface Props {
  prizes: Prize[];
}

const betterLuckColors = ['#2563EB', '#10B981']; // Blue and Green
const prizeColors = ['#FFFFFF', '#F3F4F6'];

const colors = [
  '#CC4629', // Darker vibrant orange
  '#CC9A29', // Darker bright yellow
  '#B2CC29', // Darker light green-yellow
  '#5ECC29', // Darker bright green
  '#29CC46', // Darker bright teal-green
  '#29CC99', // Darker turquoise
  '#2985CC', // Darker sky blue
  '#293FCC', // Darker bright blue
  '#4629CC', // Darker purple
  '#9929CC', // Darker violet
  '#CC2981', // Darker hot pink
  '#CC2929', // Darker red
  '#CC5929', // Darker coral
  '#CC9529', // Darker gold
  '#B2CC29', // Darker lime green
  '#66CC29', // Darker olive green
  '#29CC5F', // Darker mint green
  '#29CC91', // Darker pale turquoise
  '#298ECC', // Darker deep sky blue
  '#4A29CC', // Darker royal blue
  '#8429CC', // Darker medium purple
  '#CC298F', // Darker fuchsia
  '#CC294F', // Darker hot pink
];

export const Wheel: React.FC<Props> = ({ prizes }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinDirection, setSpinDirection] = useState<
    'clockwise' | 'counterclockwise'
  >('clockwise');
  const [showPopup, setShowPopup] = useState(false);
  const [showLosingPopup, setShowLosingPopup] = useState(false);
  const [popupWinner, setPopupWinner] = useState<Prize | null>(null);
  const [images, setImages] = useState<Map<string, HTMLImageElement>>(new Map());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const numSectors = prizes.length;

  useEffect(() => {
    const loadImages = async () => {
      const imageMap = new Map<string, HTMLImageElement>();

      const loadPromises = prizes.map((prize) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = prize.img_src;
          img.onload = () => {
            imageMap.set(prize.img_src, img);
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${prize.img_src}`);
            resolve();
          };
        });
      });

      await Promise.all(loadPromises);
      setImages(imageMap);
    };

    loadImages();
  }, [prizes]);

  useEffect(() => {
    const drawWheel = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const radius = canvas.width / 2;
      const sliceAngle = (2 * Math.PI) / numSectors;

      // Clear previous drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(radius, radius);
      ctx.rotate(-rotation * (Math.PI / 180));

      // Draw sectors
      for (let i = 0; i < numSectors; i++) {
        const startAngle = i * sliceAngle;
        const endAngle = (i + 1) * sliceAngle;
        const prize = prizes[i];
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        
        // Determine color based on prize type
        if (prize.label === 'better luck') {
          // Alternate between blue and green for better luck sectors
          const betterLuckIndex = Math.floor(i / 2) % 2;
          ctx.fillStyle = betterLuckColors[betterLuckIndex];
        } else {
          // White or light gray for real prizes
          ctx.fillStyle = prizeColors[i % 2];
        }
        
        ctx.fill();

        // Draw borders between sectors
        ctx.strokeStyle = prize.label === 'better luck' ? 'white' : '#D1D5DB';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw the image and name in the sector
        ctx.save();
        ctx.rotate((startAngle + endAngle) / 2);

        const img = images.get(prize.img_src);

        // Draw image closer to center
        if (img) {
          const imgSize = 60;
          const imgX = radius * 0.35 - imgSize / 2;
          const imgY = -imgSize / 2;

          // Draw background circle behind image (darker for better visibility)
          ctx.beginPath();
          ctx.arc(radius * 0.35, 0, imgSize / 2 + 3, 0, 2 * Math.PI);
          ctx.fillStyle = prize.label === 'better luck' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)';
          ctx.fill();

          // Create circular clipping path for image
          ctx.save();
          ctx.beginPath();
          ctx.arc(radius * 0.35, 0, imgSize / 2, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
          ctx.restore();

          // Draw border around image
          ctx.beginPath();
          ctx.arc(radius * 0.35, 0, imgSize / 2, 0, 2 * Math.PI);
          ctx.strokeStyle = prize.label === 'better luck' ? '#FFF' : '#000';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Draw the name with better visibility
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const text = capitalize(prize.label) || '';
        ctx.font = 'bold 16px Arial';
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = 20;
        
        // Background rectangle for text
        if (prize.label === 'better luck') {
          // Dark background for text on colored sectors
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        } else {
          // Dark background for text on white sectors
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        }
        
        ctx.fillRect(
          radius * 0.65 - textWidth / 2 - 5,
          -textHeight / 2 - 2,
          textWidth + 10,
          textHeight + 4
        );
        
        // Draw text
        ctx.fillStyle = 'white';
        ctx.strokeStyle = prize.label === 'better luck' ? 'rgba(0, 0, 0, 0.5)' : 'black';
        ctx.lineWidth = 2;
        ctx.strokeText(text, radius * 0.65, 0);
        ctx.fillText(text, radius * 0.65, 0);

        ctx.restore();
      }

      ctx.rotate(rotation * (Math.PI / 180));
      ctx.translate(-radius, -radius);

      // Draw the static indicator
      const indicatorLength = 30;
      const indicatorWidth = 20;
      ctx.save();
      ctx.translate(canvas.width, canvas.height / 2);
      ctx.beginPath();
      ctx.moveTo(-indicatorLength, -indicatorWidth / 2);
      ctx.lineTo(0, 0);
      ctx.lineTo(-indicatorLength, indicatorWidth / 2);
      ctx.closePath();
      ctx.fillStyle = '#FF0000';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    };

    if (canvasRef.current && images.size > 0) {
      drawWheel();
    }
  }, [prizes, rotation, images,numSectors]);

  const darkenColor = (color: string, amount: number): string => {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };



  const startSpin = () => {
    if (spinning) return;
    setSpinning(true);

    // Set the number of full rotations and calculate final rotation
    const numFullRotations = Math.random() * 5 + 5; // Between 5 and 10 full rotations
    const totalRotation = numFullRotations * 360;
    const finalRotation =
      (rotation +
        (spinDirection === 'clockwise' ? -totalRotation : totalRotation)) %
      360;

    const spinDuration = 6000;
    const easing = (t: number) => {
      // Ease-out cubic
      return 1 - Math.pow(1 - t, 3);
    };

    let startTime: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const t = Math.min(elapsed / spinDuration, 1);
      const easeT = easing(t);
      const currentRotation =
        rotation +
        (spinDirection === 'clockwise' ? -totalRotation : totalRotation) *
        easeT;

      setRotation(currentRotation);

      if (elapsed < spinDuration) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        determineWinner(finalRotation);
      }
    };

    requestAnimationFrame(animate);
  };

  const determineWinner = (finalRotation: number) => {
    const sliceAngle = 360 / numSectors;
    const normalizedRotation = ((finalRotation % 360) + 360) % 360;
    const winningSector = Math.floor(normalizedRotation / sliceAngle);
    const prize=prizes[winningSector];
    if (prize.label=="better luck"){
      setPopupWinner(prizes[winningSector]);
      setShowLosingPopup(true);
    }else{
      setPopupWinner(prizes[winningSector]);
      setShowPopup(true);

    }

  };

  const changeSpinDirection = () => {
    setSpinDirection(
      spinDirection === 'clockwise' ? 'counterclockwise' : 'clockwise',
    );
  };

  useEffect(() => {
    if (showPopup) {
      startConfetti();
      const timer = setTimeout(() => setShowPopup(false), 5000); // Hide popup after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const startConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ borderRadius: '50%', border: '2px solid black' }}
      />
      <ButtonsContainer>
        <Button
          onClick={changeSpinDirection}
          disabled={prizes.length === 0 || spinning}
        >
          {capitalize(spinDirection)}
        </Button>
        <Button
          onClick={startSpin}
          disabled={prizes.length === 0 || spinning}
        >
          Spin
        </Button>
      </ButtonsContainer>
      {showPopup && popupWinner && (
        <Popup>
          <h2>Congratulations!</h2>
          {images.get(popupWinner.img_src) && (
            <img
              src={popupWinner.img_src}
              alt={popupWinner.label}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                margin: '1rem auto'
              }}
            />
          )}
          <h3>{capitalize(popupWinner.label)}</h3>
        </Popup>
      )}
      {showLosingPopup && popupWinner && (
        <Popup>
          <h2>Better Luck Next Time</h2>
          {images.get(popupWinner.img_src) && (
            <img
              src={popupWinner.img_src}
              alt={popupWinner.label}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                margin: '1rem auto'
              }}
            />
          )}
        </Popup>
      )}
    </div>
  );
};