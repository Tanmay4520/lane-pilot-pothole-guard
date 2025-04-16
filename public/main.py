
# Lane Pilot Pothole Guard - Main Processing Pipeline
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
    main()
