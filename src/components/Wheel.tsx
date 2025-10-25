import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from './styles';
import { capitalize } from '@/lib/utils';
import { Stepper } from '@/App';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button as ShadcnButton } from "@/components/ui/button";

export interface Prize {
  img_src: string;
  label: string;
}

interface Props {
  prizes: Prize[];
}

const betterLuckColors = ['#2563EB', '#10B981']; // Blue and Green
const prizeColors = ['#FFFFFF', '#F3F4F6']; // White and light gray

export const Wheel: React.FC<Props> = ({ prizes }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinDirection, setSpinDirection] = useState<'clockwise' | 'counterclockwise'>('clockwise');
  const [showDialog, setShowDialog] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [popupWinner, setPopupWinner] = useState<Prize | null>(null);
  const [images, setImages] = useState<Map<string, HTMLImageElement>>(new Map());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const numSectors = prizes.length;
  const { goTo } = Stepper.useStepper();

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

          // Draw background circle behind image
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
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        } else {
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
  }, [prizes, rotation, images, numSectors]);

  const startSpin = () => {
    if (spinning) return;
    setSpinning(true);

    const numFullRotations = Math.random() * 5 + 5;
    const totalRotation = numFullRotations * 360;
    const finalRotation =
      (rotation +
        (spinDirection === 'clockwise' ? -totalRotation : totalRotation)) %
      360;

    const spinDuration = 6000;
    const easing = (t: number) => 1 - Math.pow(1 - t, 3);

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
    const prize = prizes[winningSector];
    
    setPopupWinner(prize);
    
    if (prize.label === "better luck") {
      setIsWinner(false);
      setShowDialog(true);
    } else {
      setIsWinner(true);
      setShowDialog(true);
      startConfetti();
    }
  };

  const changeSpinDirection = () => {
    setSpinDirection(
      spinDirection === 'clockwise' ? 'counterclockwise' : 'clockwise',
    );
  };

  const startConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleRestart = () => {
    setShowDialog(false);
    goTo('sorting');
  };

  const handleTryAgain = () => {
    setShowDialog(false);
    setPopupWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ borderRadius: '50%', border: '2px solid black' }}
      />
      <div className="flex justify-center gap-4">
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
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {isWinner ? '🎉 Congratulations!' : '😔 Better Luck Next Time'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {isWinner ? "You've won a prize!" : "Don't give up, try spinning again!"}
            </DialogDescription>
          </DialogHeader>
          
          {popupWinner && (
            <div className="flex flex-col items-center gap-4 py-4">
              {images.get(popupWinner.img_src) && (
                <img
                  src={popupWinner.img_src}
                  alt={popupWinner.label}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
              )}
              <p className="text-xl font-semibold">{capitalize(popupWinner.label)}</p>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {isWinner ? (
              <>
                <ShadcnButton variant="outline" onClick={() => setShowDialog(false)}>
                  Close
                </ShadcnButton>
                <ShadcnButton onClick={handleRestart}>
                  Restart Game
                </ShadcnButton>
              </>
            ) : (
              <>
                <ShadcnButton variant="outline" onClick={() => setShowDialog(false)}>
                  Close
                </ShadcnButton>
                <ShadcnButton onClick={handleTryAgain}>
                  Try Again
                </ShadcnButton>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};