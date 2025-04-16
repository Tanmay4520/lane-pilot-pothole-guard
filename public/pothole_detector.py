
# Pothole Detector Module
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
        
        return annotated
