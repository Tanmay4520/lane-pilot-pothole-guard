
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CodeSnippets = () => {
  return (
    <div className="container mx-auto mt-12 mb-8">
      <h2 className="text-2xl font-bold mb-6">Project Code Samples</h2>
      <Card>
        <CardHeader>
          <CardTitle>Project Implementation Snippets</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="main-py">
              <AccordionTrigger>main.py</AccordionTrigger>
              <AccordionContent>
                <pre className="bg-black text-green-400 p-4 rounded-md overflow-auto text-sm font-mono">
{`# Lane Pilot Pothole Guard - Main Processing Pipeline
import cv2
import numpy as np
import argparse
from ultralytics import YOLO
from pothole_detector import PotholeDetector

class LanePilot:
    def __init__(self):
        # Initialize YOLOv8 model
        self.yolo_model = YOLO('yolov8n.pt')
        
        # Initialize pothole detector
        self.pothole_detector = PotholeDetector()
        
        # Distance threshold for pothole brake decision (pixels)
        self.pothole_distance_threshold = 150
    
    def process_video(self, input_path, output_path):
        # Open the input video file
        cap = cv2.VideoCapture(input_path)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        # Create output video writer
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        frame_count = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            print(f"Processing frame {frame_count}")
            
            # Run YOLOv8 detection
            yolo_results = self.yolo_model(frame)
            
            # Process detections to determine steering direction
            steering_direction = self.determine_steering(yolo_results, frame)
            
            # Run pothole detection
            pothole_result = self.pothole_detector.detect_potholes(frame)
            pothole_detected = pothole_result['detected']
            pothole_distance = pothole_result['distance'] if pothole_detected else float('inf')
            
            # Override steering if pothole is within threshold
            if pothole_detected and pothole_distance < self.pothole_distance_threshold:
                steering_direction = 'brake'
            
            # Annotate the frame
            annotated_frame = self.annotate_frame(frame, steering_direction, 
                                                  pothole_detected, yolo_results)
            
            # Write the output frame
            out.write(annotated_frame)
        
        # Release resources
        cap.release()
        out.release()
        cv2.destroyAllWindows()
        
        print(f"Processing complete. Output saved to {output_path}")
    
    def determine_steering(self, yolo_results, frame):
        # Extract lane detections and road objects
        # Logic to determine steering based on lane positions and objects
        # This is a simplified example - real implementation would be more complex
        
        # For demo purposes, determine steering based on lane positions
        height, width = frame.shape[:2]
        center_x = width // 2
        
        # Get lane detections
        lanes = []
        for result in yolo_results:
            for box in result.boxes:
                cls = int(box.cls[0])
                if cls == 2:  # Assuming class 2 is lanes
                    lanes.append(box.xyxy[0].tolist())
        
        if not lanes:
            return 'straight'  # Default if no lanes detected
        
        # Calculate average lane position
        lane_x_positions = []
        for lane in lanes:
            x1, y1, x2, y2 = lane
            lane_x_positions.append((x1 + x2) / 2)
        
        avg_lane_x = sum(lane_x_positions) / len(lane_x_positions)
        
        # Determine steering based on lane position
        threshold = width * 0.05  # 5% of frame width
        
        if avg_lane_x < center_x - threshold:
            return 'left'
        elif avg_lane_x > center_x + threshold:
            return 'right'
        else:
            return 'straight'
    
    def annotate_frame(self, frame, steering_direction, pothole_detected, yolo_results):
        # Create a copy of the frame for annotation
        annotated = frame.copy()
        height, width = frame.shape[:2]
        
        # Draw YOLOv8 detections
        for result in yolo_results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = [int(i) for i in box.xyxy[0].tolist()]
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                
                # Different colors for different object types
                if cls == 0:  # Person
                    color = (0, 255, 0)  # Green
                    label = f"Person {conf:.2f}"
                elif cls == 2:  # Car
                    color = (255, 0, 0)  # Blue
                    label = f"Car {conf:.2f}"
                elif cls == 3:  # Lane
                    color = (0, 255, 255)  # Yellow
                    label = f"Lane {conf:.2f}"
                else:
                    color = (255, 255, 0)  # Cyan
                    label = f"Object {conf:.2f}"
                
                # Draw bounding box
                cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)
                
                # Draw label
                cv2.putText(annotated, label, (x1, y1-10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        # Draw pothole detections if any
        if pothole_detected:
            # Draw pothole overlay from pothole_detector
            annotated = self.pothole_detector.draw_potholes(annotated)
            
            # Add warning text
            warning_text = "POTHOLE DETECTED!"
            cv2.putText(annotated, warning_text, (width//2-100, height-50), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        # Draw steering indicator
        indicator_y = height - 100
        indicator_width = 150
        indicator_height = 50
        indicator_x = width // 2 - indicator_width // 2
        
        if steering_direction == 'left':
            color = (255, 191, 0)  # Orange
            text = "LEFT"
            arrow_start = (indicator_x + indicator_width - 30, indicator_y + indicator_height // 2)
            arrow_end = (indicator_x + 30, indicator_y + indicator_height // 2)
        elif steering_direction == 'right':
            color = (255, 191, 0)  # Orange
            text = "RIGHT"
            arrow_start = (indicator_x + 30, indicator_y + indicator_height // 2)
            arrow_end = (indicator_x + indicator_width - 30, indicator_y + indicator_height // 2)
        elif steering_direction == 'brake':
            color = (0, 0, 255)  # Red
            text = "BRAKE!"
        else:  # straight
            color = (0, 255, 0)  # Green
            text = "STRAIGHT"
            arrow_start = (width // 2, indicator_y + indicator_height - 10)
            arrow_end = (width // 2, indicator_y + 10)
        
        # Draw steering indicator background
        cv2.rectangle(annotated, (indicator_x, indicator_y), 
                     (indicator_x + indicator_width, indicator_y + indicator_height), 
                     color, -1)
        
        # Draw steering text
        cv2.putText(annotated, text, 
                   (indicator_x + 10, indicator_y + indicator_height - 15), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Draw steering arrow
        if steering_direction != 'brake':
            cv2.arrowedLine(annotated, arrow_start, arrow_end, 
                           (255, 255, 255), 2, tipLength=0.3)
        
        # Add frame information
        info_text = "Lane Pilot Pothole Guard"
        cv2.putText(annotated, info_text, (10, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        return annotated

def main():
    parser = argparse.ArgumentParser(description='Lane Pilot Pothole Guard')
    parser.add_argument('--input', type=str, required=True, help='Input video path')
    parser.add_argument('--output', type=str, default='output.mp4', help='Output video path')
    args = parser.parse_args()
    
    lane_pilot = LanePilot()
    lane_pilot.process_video(args.input, args.output)

if __name__ == '__main__':
    main()`}
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="pothole-detector">
              <AccordionTrigger>pothole_detector.py</AccordionTrigger>
              <AccordionContent>
                <pre className="bg-black text-green-400 p-4 rounded-md overflow-auto text-sm font-mono">
{`# Pothole Detector Module
import cv2
import numpy as np

class PotholeDetector:
    def __init__(self):
        # Parameters for pothole detection
        self.gray_threshold = 50  # Threshold for grayscale segmentation
        self.min_area = 500  # Minimum area for pothole detection
        self.max_area = 15000  # Maximum area for pothole detection
        
        # Parameters for distance estimation
        self.focal_length = 1000  # Approximate focal length
        self.pothole_width_actual = 0.5  # Average pothole width in meters
        self.sensor_width = 1000  # Approximate sensor width in pixels
        
        # Store detected potholes for visualization
        self.detected_potholes = []
    
    def detect_potholes(self, frame):
        """
        Detect potholes in the frame using a simple grayscale thresholding approach.
        In a real system, this would be more sophisticated.
        """
        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (9, 9), 0)
        
        # Apply adaptive thresholding
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 19, 2
        )
        
        # Apply morphological operations to clean up the image
        kernel = np.ones((5, 5), np.uint8)
        opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
        closing = cv2.morphologyEx(opening, cv2.MORPH_CLOSE, kernel)
        
        # Find contours in the thresholded image
        contours, _ = cv2.findContours(
            closing, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )
        
        # Reset detected potholes
        self.detected_potholes = []
        
        # Filter contours based on area and shape
        min_distance = float('inf')
        for contour in contours:
            area = cv2.contourArea(contour)
            
            # Filter by area
            if self.min_area < area < self.max_area:
                # Get bounding rectangle
                x, y, w, h = cv2.boundingRect(contour)
                
                # Calculate aspect ratio
                aspect_ratio = float(w) / h
                
                # Filter by aspect ratio - potholes are roughly circular
                if 0.5 < aspect_ratio < 2.0:
                    # Calculate circularity
                    perimeter = cv2.arcLength(contour, True)
                    circularity = 4 * np.pi * area / (perimeter * perimeter)
                    
                    # If sufficiently circular, consider it a pothole
                    if circularity > 0.3:
                        # Calculate distance (simplified approach)
                        distance = self.estimate_distance(w)
                        
                        # Store pothole info
                        self.detected_potholes.append({
                            'contour': contour,
                            'x': x,
                            'y': y,
                            'w': w,
                            'h': h,
                            'distance': distance
                        })
                        
                        # Update minimum distance
                        if distance < min_distance:
                            min_distance = distance
        
        # Return detection result
        result = {
            'detected': len(self.detected_potholes) > 0,
            'count': len(self.detected_potholes),
            'distance': min_distance if self.detected_potholes else None
        }
        
        return result
    
    def estimate_distance(self, pothole_width_pixels):
        """
        Estimate the distance to the pothole using a simplified approach.
        In a real system, this would use proper depth estimation techniques.
        """
        # Simple pinhole camera model: distance = (actual_width * focal_length) / pixel_width
        distance = (self.pothole_width_actual * self.focal_length) / pothole_width_pixels
        
        return distance
    
    def draw_potholes(self, frame):
        """
        Draw detected potholes on the frame
        """
        annotated = frame.copy()
        
        for pothole in self.detected_potholes:
            # Draw contour
            cv2.drawContours(annotated, [pothole['contour']], 0, (0, 0, 255), 2)
            
            # Draw bounding box
            x, y, w, h = pothole['x'], pothole['y'], pothole['w'], pothole['h']
            cv2.rectangle(annotated, (x, y), (x+w, y+h), (0, 165, 255), 2)
            
            # Draw distance
            distance_text = f"{pothole['distance']:.1f}m"
            cv2.putText(annotated, distance_text, (x, y-10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 165, 255), 2)
        
        return annotated`}
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="requirements">
              <AccordionTrigger>requirements.txt</AccordionTrigger>
              <AccordionContent>
                <pre className="bg-black text-green-400 p-4 rounded-md overflow-auto text-sm font-mono">
{`# Python dependencies for Lane Pilot Pothole Guard

# Computer Vision
opencv-python>=4.5.0
numpy>=1.20.0

# Deep Learning
torch>=1.9.0
torchvision>=0.10.0

# YOLOv8 
ultralytics>=8.0.0

# Video processing
ffmpeg-python>=0.2.0

# Utility
tqdm>=4.62.0
matplotlib>=3.4.0
pillow>=8.2.0
scipy>=1.7.0
`}
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="readme">
              <AccordionTrigger>README.md</AccordionTrigger>
              <AccordionContent>
                <pre className="bg-black text-green-400 p-4 rounded-md overflow-auto text-sm font-mono">
{`# Lane Pilot Pothole Guard

An advanced driver assistance system that combines lane detection, object recognition, and pothole detection to enhance driving safety.

## Overview

Lane Pilot Pothole Guard is a computer vision application that:
- Detects lanes and calculates optimal steering trajectory
- Identifies objects on the road using YOLOv8
- Detects potholes using computer vision techniques
- Provides real-time steering recommendations
- Issues warnings and brake recommendations when hazards are detected

## Features

1. **Lane Detection**
   - Identifies lane markings using YOLOv8
   - Calculates optimal steering angle
   - Suggests left/right/straight steering directions

2. **Object Detection**
   - Identifies vehicles, pedestrians, and other road objects
   - Maintains safe distance from detected objects
   - Adjusts steering recommendations based on object positions

3. **Pothole Detection**
   - Uses grayscale thresholding and contour analysis to identify potholes
   - Estimates distance to detected potholes
   - Issues "BRAKE" alerts when potholes are within unsafe distance

4. **Visual Annotations**
   - Displays steering recommendations
   - Highlights detected lanes, objects, and potholes
   - Shows safety warnings when hazards are detected

## Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/lane-pilot-pothole-guard.git
   cd lane-pilot-pothole-guard
   \`\`\`

2. Create a virtual environment (recommended):
   \`\`\`
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   \`\`\`

3. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`

## Usage

1. Process a video file:
   \`\`\`
   python main.py --input your_driving_video.mp4 --output processed_video.mp4
   \`\`\`

2. Command line options:
   - \`--input\`: Path to input video file (required)
   - \`--output\`: Path to save processed video (default: output.mp4)

## Sample Data Sources

You can find sample driving videos for testing from these sources:
- [Berkeley DeepDrive Dataset (BDD100K)](https://bdd-data.berkeley.edu/)
- [Cityscapes Dataset](https://www.cityscapes-dataset.com/)
- [KITTI Road Dataset](http://www.cvlibs.net/datasets/kitti/eval_road.php)
- [Indian Driving Dataset (IDD)](https://idd.insaan.iiit.ac.in/)

## Project Structure

- \`main.py\`: Main processing pipeline integrating all components
- \`pothole_detector.py\`: Standalone module for pothole detection
- \`requirements.txt\`: Python dependencies
- \`README.md\`: Documentation (you are here)

## Limitations and Future Work

Current limitations:
- Simplified pothole detection without depth information
- Basic steering logic without complex traffic rules
- No handling of weather conditions or night driving

Future improvements:
- Implement real SLAM for accurate 3D mapping
- Add machine learning for pothole severity classification
- Integrate with real-time GPS for route planning
- Support for adverse weather conditions
- Implement emergency vehicle detection

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- YOLOv8 by Ultralytics
- OpenCV community for computer vision tools
- Sample data providers`}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeSnippets;
