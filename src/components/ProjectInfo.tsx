
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Code, FileText, Github, Youtube } from 'lucide-react';

const ProjectInfo = () => {
  return (
    <div className="container mx-auto mt-12 mb-8">
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Lane Pilot Pothole Guard</CardTitle>
              <CardDescription>
                Advanced driver assistance system for lane detection and pothole avoidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This project demonstrates an AI-powered driver assistance system that combines:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Real-time lane detection and steering guidance</li>
                <li>Object detection for road hazards</li>
                <li>Pothole detection with emergency brake recommendation</li>
                <li>Visual annotations showing system decisions</li>
              </ul>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="font-semibold mb-2">How to use:</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Upload a driving video using the file uploader</li>
                  <li>Watch as the system analyzes the road conditions frame by frame</li>
                  <li>Observe lane detection and steering recommendations</li>
                  <li>Notice alerts when potholes are detected</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
              <CardDescription>
                Implementation details and technologies used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Core Technologies:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium">YOLOv8:</span> Used for lane and object detection</li>
                  <li><span className="font-medium">OpenCV:</span> Simulated SLAM for pothole detection using grayscale thresholding and contours</li>
                  <li><span className="font-medium">Python:</span> Backend processing pipeline</li>
                  <li><span className="font-medium">React:</span> Frontend interface</li>
                </ul>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="font-semibold mb-2">Project Structure:</h4>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  <p>main.py <span className="text-gray-500">// Main processing pipeline</span></p>
                  <p>pothole_detector.py <span className="text-gray-500">// Pothole detection module</span></p>
                  <p>requirements.txt <span className="text-gray-500">// Python dependencies</span></p>
                  <p>README.md <span className="text-gray-500">// Project documentation</span></p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="font-semibold mb-2">Algorithm Flow:</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Video is processed frame by frame</li>
                  <li>YOLOv8 detects lanes and objects, determining initial steering</li>
                  <li>OpenCV-based pothole detection runs in parallel</li>
                  <li>If pothole is detected within threshold, steering is overridden</li>
                  <li>Annotated frames are compiled into output video</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
              <CardDescription>
                Sample datasets, code references, and helpful tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-500" />
                  Sample Video Datasets:
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><a href="#" className="text-blue-600 hover:underline">Berkeley DeepDrive Dataset (BDD100K)</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Cityscapes Dataset</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">KITTI Road Dataset</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Indian Driving Dataset (IDD)</a></li>
                </ul>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub Repositories:
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><a href="#" className="text-blue-600 hover:underline">Ultralytics YOLOv8</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Awesome Lane Detection</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Road Damage Detection</a></li>
                </ul>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Tutorials:
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><a href="#" className="text-blue-600 hover:underline">Getting Started with YOLOv8</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Lane Detection with OpenCV</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Pothole Detection using Computer Vision</a></li>
                </ul>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Papers:
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><a href="#" className="text-blue-600 hover:underline">YOLOv8: State-of-the-Art Object Detection</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">SLAM Techniques for Road Surface Analysis</a></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectInfo;
