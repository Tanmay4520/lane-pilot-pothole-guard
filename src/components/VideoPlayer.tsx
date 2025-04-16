
import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AlertOctagon,
  ArrowUp,
  PauseCircle,
  PlayCircle,
  Gauge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// These would be returned by our Python backend in a real implementation
type SteeringDirection = 'left' | 'right' | 'straight' | 'brake';
type DetectionData = {
  frame: number;
  steering: SteeringDirection;
  potholeDetected: boolean;
  potholeDistance?: number; // Added distance information
  speed: number; // Added speed information
  objects: { type: string; confidence: number }[];
}

interface VideoPlayerProps {
  videoFile: File | null;
}

const VideoPlayer = ({ videoFile }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // In a real implementation, these would come from processing each frame
  // This is just for demonstration
  const [steeringDirection, setSteeringDirection] = useState<SteeringDirection>('straight');
  const [potholeDetected, setPotholeDetected] = useState(false);
  const [potholeDistance, setPotholeDistance] = useState<number | null>(null); // New state for pothole distance
  const [currentSpeed, setCurrentSpeed] = useState(0); // New state for current speed
  const [speedWarning, setSpeedWarning] = useState(false); // New state for speed warning
  const [detectedObjects, setDetectedObjects] = useState<{ type: string; confidence: number }[]>([]);

  const speedLimit = 60; // Speed limit in km/h

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Simulate detection results based on video time
      // In a real app, this would be based on frame-by-frame analysis
      simulateDetections(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // This simulates what would be returned by the YOLOv8 + SLAM backend
  const simulateDetections = (time: number) => {
    // Create a deterministic but changing pattern based on video time
    const cyclePosition = (time % 10) / 10; // 0 to 1 every 10 seconds
    
    // Simulate speed (40-80 km/h range)
    const simulatedSpeed = 40 + Math.sin(time * 0.5) * 20 + Math.sin(time * 0.2) * 20;
    setCurrentSpeed(Math.round(simulatedSpeed));
    
    // Set speed warning if over speed limit
    setSpeedWarning(simulatedSpeed > speedLimit);
    
    // Steering direction changes
    if (cyclePosition < 0.3) {
      setSteeringDirection('straight');
    } else if (cyclePosition < 0.5) {
      setSteeringDirection('left');
    } else if (cyclePosition < 0.7) {
      setSteeringDirection('right');
    } else if (cyclePosition < 0.8) {
      // Simulate pothole detection triggering a brake
      setPotholeDetected(true);
      setSteeringDirection('brake');
      
      // Simulate pothole distance (closer as time progresses in this segment)
      const distance = 10 - ((cyclePosition - 0.7) * 33.3);
      setPotholeDistance(Math.max(0.5, parseFloat(distance.toFixed(1))));
    } else {
      setPotholeDetected(false);
      setPotholeDistance(null);
      setSteeringDirection('straight');
    }
    
    // Simulate detected objects
    const baseObjects = [
      { type: 'car', confidence: 0.92 },
      { type: 'lane', confidence: 0.88 }
    ];
    
    // Add pothole with varying confidence
    if (cyclePosition > 0.65 && cyclePosition < 0.85) {
      const potholeConfidence = 0.7 + (cyclePosition - 0.65) * 1.5;
      baseObjects.push({ type: 'pothole', confidence: Math.min(0.99, potholeConfidence) });
    }
    
    setDetectedObjects(baseObjects);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getSteeringIcon = () => {
    switch (steeringDirection) {
      case 'left': return <ArrowLeft className="h-5 w-5" />;
      case 'right': return <ArrowRight className="h-5 w-5" />;
      case 'straight': return <ArrowUp className="h-5 w-5" />;
      case 'brake': return <AlertOctagon className="h-5 w-5" />;
      default: return <ArrowUp className="h-5 w-5" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="video-container rounded-lg overflow-hidden bg-black relative">
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-auto"
              controls={false}
            />
            
            {/* Annotation overlay */}
            <div className="annotation-overlay">
              {/* Speed indicator */}
              <div className={`speed-indicator ${speedWarning ? 'speed-warning' : ''}`}>
                <Gauge className="h-5 w-5" />
                <span>{currentSpeed} km/h</span>
                {speedWarning && <span className="warning-text">SLOW DOWN!</span>}
              </div>
              
              {/* Steering indicator */}
              <div className={`steering-indicator steering-${steeringDirection}`}>
                {getSteeringIcon()}
                <span>{steeringDirection.toUpperCase()}</span>
              </div>
              
              {/* Pothole alert with distance */}
              {potholeDetected && (
                <div className="pothole-alert">
                  <AlertOctagon className="h-5 w-5" />
                  <span>POTHOLE DETECTED</span>
                  {potholeDistance !== null && (
                    <span className="distance-text">{potholeDistance}m</span>
                  )}
                </div>
              )}
              
              {/* Detection info */}
              <div className="detection-info">
                <p className="font-bold mb-1">Detections:</p>
                <ul className="text-xs space-y-1">
                  {detectedObjects.map((obj, idx) => (
                    <li key={idx}>
                      {obj.type}: {(obj.confidence * 100).toFixed(1)}%
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-900 text-gray-400">
            <p>No video selected</p>
          </div>
        )}
      </div>
      
      {/* Video controls */}
      {videoUrl && (
        <div className="mt-4 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">{formatTime(currentTime)}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={togglePlayPause} 
              className="rounded-full"
            >
              {isPlaying ? 
                <PauseCircle className="h-6 w-6" /> : 
                <PlayCircle className="h-6 w-6" />
              }
            </Button>
            <span className="text-sm">{formatTime(duration)}</span>
          </div>
          
          <input 
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.currentTime = Number(e.target.value);
              }
            }}
            className="w-full"
          />
        </div>
      )}
      
      {/* Analysis Results */}
      {videoUrl && (
        <div className="mt-6 bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-bold mb-2">Lane Pilot Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-3 rounded">
              <h4 className="font-medium text-sm mb-2">Current Steering</h4>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  steeringDirection === 'brake' ? 'bg-destructive' : 
                  steeringDirection === 'straight' ? 'bg-success' : 'bg-info'
                }`}></span>
                <span className="font-medium">{steeringDirection.toUpperCase()}</span>
              </div>
            </div>
            
            <div className="bg-muted/50 p-3 rounded">
              <h4 className="font-medium text-sm mb-2">Safety Status</h4>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  potholeDetected ? 'bg-destructive' : 'bg-success'
                }`}></span>
                <span className="font-medium">
                  {potholeDetected ? 'WARNING: HAZARD DETECTED' : 'SAFE'}
                </span>
              </div>
            </div>
            
            {/* New speed display */}
            <div className="bg-muted/50 p-3 rounded">
              <h4 className="font-medium text-sm mb-2">Current Speed</h4>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  speedWarning ? 'bg-warning' : 'bg-success'
                }`}></span>
                <span className="font-medium">
                  {currentSpeed} km/h {speedWarning && <span className="text-warning font-bold">(OVER LIMIT)</span>}
                </span>
              </div>
            </div>
            
            {/* New pothole distance display */}
            <div className="bg-muted/50 p-3 rounded">
              <h4 className="font-medium text-sm mb-2">Pothole Information</h4>
              {potholeDetected ? (
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full mr-2 bg-destructive"></span>
                  <span className="font-medium">
                    Distance: {potholeDistance}m
                    {potholeDistance && potholeDistance < 2 && (
                      <span className="text-destructive font-bold ml-2">(IMMINENT)</span>
                    )}
                  </span>
                </div>
              ) : (
                <span className="font-medium text-success">No potholes detected</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
