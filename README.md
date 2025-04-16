
# Lane Pilot Pothole Guard

An advanced driver assistance system application that combines YOLOv8 lane detection with OpenCV-based pothole detection to enhance driving safety.

## Project Description

Lane Pilot Pothole Guard is a demonstration application that showcases:
- Dynamic lane detection using YOLOv8
- Steering direction determination based on lane alignment
- Real-time pothole detection using computer vision techniques
- Safety alerts when hazards are detected
- Annotated video output showing system decisions

## Features

1. **YOLOv8 Lane Detection**
   - Identifies lane markings and road objects
   - Calculates optimal steering trajectory
   - Provides real-time steering recommendations

2. **Pothole Detection**
   - Uses simulated SLAM techniques with OpenCV
   - Detects potholes using grayscale thresholding and contour analysis
   - Estimates distance to detected potholes

3. **Integrated Decision System**
   - Overrides steering decisions when potholes are detected
   - Issues "BRAKE" alerts for imminent hazards
   - Visual annotations of all detected objects

## Demo

This repository contains a React web application that demonstrates the lane pilot and pothole guard functionality. In a full implementation, the Python backend would process videos through YOLOv8 and OpenCV to generate the annotated output.

### Python Implementation

The core algorithms demonstrated in this project would be implemented with the following Python code structure:

- `main.py`: The integrated pipeline combining YOLOv8 and pothole detection
- `pothole_detector.py`: Dedicated module for pothole detection using OpenCV
- `requirements.txt`: Python dependencies for the project

### Requirements

The Python implementation would require:
```
opencv-python>=4.5.0
numpy>=1.20.0
torch>=1.9.0
ultralytics>=8.0.0
```

## Sample Data Sources

You can find sample driving videos for testing from these sources:
- [Berkeley DeepDrive Dataset (BDD100K)](https://bdd-data.berkeley.edu/)
- [Cityscapes Dataset](https://www.cityscapes-dataset.com/)
- [KITTI Road Dataset](http://www.cvlibs.net/datasets/kitti/eval_road.php)
- [Indian Driving Dataset (IDD)](https://idd.insaan.iiit.ac.in/)

## Getting Started with the Demo

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Upload a driving video to see the lane pilot and pothole detection in action

## Potential Applications

- Advanced Driver Assistance Systems (ADAS)
- Autonomous vehicle development
- Road quality monitoring and management
- Driver training and education

## Future Enhancements

- Integration with real-time computer vision processing
- Improved pothole detection using depth estimation
- Integration with GPS data for route planning
- Support for adverse weather conditions
