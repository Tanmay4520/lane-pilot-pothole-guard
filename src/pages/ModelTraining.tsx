
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowRight, Play, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';

const ModelTraining = () => {
  const [trainingVideos, setTrainingVideos] = useState<File[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newVideos = Array.from(e.target.files);
      setTrainingVideos(prev => [...prev, ...newVideos]);
      toast.success(`${newVideos.length} video(s) added to training set`);
    }
  };
  
  const removeVideo = (index: number) => {
    setTrainingVideos(prev => prev.filter((_, i) => i !== index));
  };
  
  const startTraining = () => {
    if (trainingVideos.length === 0) {
      toast.error('Please upload at least one video for training');
      return;
    }
    
    setIsTraining(true);
    setProgress(0);
    setTrainingLogs([]);
    
    // Simulate training process
    const totalSteps = 100;
    let currentStep = 0;
    
    const trainingInterval = setInterval(() => {
      currentStep += 1;
      setProgress(Math.min((currentStep / totalSteps) * 100, 100));
      
      // Add training logs
      if (currentStep % 10 === 0 || currentStep === 1) {
        const logMessages = [
          `[${currentStep}/${totalSteps}] Processing video frames...`,
          `[${currentStep}/${totalSteps}] Extracting lane features...`,
          `[${currentStep}/${totalSteps}] Training YOLOv8 model...`,
          `[${currentStep}/${totalSteps}] Optimizing pothole detection...`,
          `[${currentStep}/${totalSteps}] Fine-tuning model parameters...`,
          `[${currentStep}/${totalSteps}] Validating on test frames...`,
        ];
        
        const randomIndex = Math.floor(Math.random() * logMessages.length);
        setTrainingLogs(prev => [...prev, logMessages[randomIndex]]);
      }
      
      if (currentStep >= totalSteps) {
        clearInterval(trainingInterval);
        setIsTraining(false);
        setTrainingComplete(true);
        setTrainingLogs(prev => [...prev, "Training complete! Model saved as lane_pilot_model_v1.pt"]);
        toast.success("Model training complete!");
      }
    }, 200);
  };
  
  const resetTraining = () => {
    setTrainingVideos([]);
    setTrainingComplete(false);
    setProgress(0);
    setTrainingLogs([]);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Train Lane Pilot Model</h1>
          <p className="text-xl text-muted-foreground">
            Upload driving videos to train the YOLOv8 lane detection and pothole recognition model
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video upload and training section */}
          <section className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Training Data
              </h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="video-upload"
                    className="hidden"
                    accept="video/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={isTraining}
                  />
                  <label 
                    htmlFor="video-upload" 
                    className={`flex flex-col items-center cursor-pointer ${isTraining ? 'opacity-50' : ''}`}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="font-medium">Click to upload driving videos</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      MP4, MOV, or AVI formats accepted
                    </p>
                  </label>
                </div>
                
                {trainingVideos.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Training Videos ({trainingVideos.length})</h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                      {trainingVideos.map((video, index) => (
                        <li key={index} className="flex items-center justify-between border rounded-md p-2">
                          <div className="flex items-center">
                            <Play className="h-4 w-4 mr-2" />
                            <span className="text-sm truncate max-w-[200px]">{video.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVideo(index)}
                            disabled={isTraining}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={startTraining} 
                    disabled={trainingVideos.length === 0 || isTraining}
                    className="w-full"
                  >
                    {isTraining ? 'Training in Progress...' : 'Start Training'}
                  </Button>
                  
                  {trainingComplete && (
                    <Button 
                      variant="outline" 
                      onClick={resetTraining}
                      className="w-full"
                    >
                      Reset & Train New Model
                    </Button>
                  )}
                </div>
              </div>
            </Card>
            
            {/* Training configuration - This would be expanded in a real implementation */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Training Configuration</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Model Type</h3>
                    <p className="text-sm text-muted-foreground">YOLOv8-small</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Epochs</h3>
                    <p className="text-sm text-muted-foreground">50</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Batch Size</h3>
                    <p className="text-sm text-muted-foreground">16</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Learning Rate</h3>
                    <p className="text-sm text-muted-foreground">0.001</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Using default hyperparameters optimized for lane and pothole detection
                </p>
              </div>
            </Card>
          </section>
          
          {/* Training progress and logs */}
          <section className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <ArrowRight className="mr-2 h-5 w-5" />
                Training Progress
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      {trainingComplete ? 'Complete!' : isTraining ? 'Training...' : 'Not Started'}
                    </span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                {(isTraining || trainingComplete) && (
                  <div className="mt-6">
                    <div className="flex items-center mb-2">
                      {trainingComplete ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      )}
                      <h3 className="font-medium">
                        {trainingComplete ? 'Training Complete' : 'Training Logs'}
                      </h3>
                    </div>
                    
                    <div className="bg-black text-green-400 font-mono text-xs rounded-md p-4 h-80 overflow-y-auto">
                      {trainingLogs.map((log, index) => (
                        <div key={index} className="mb-1">
                          &gt; {log}
                        </div>
                      ))}
                      {isTraining && (
                        <div className="inline-block animate-pulse">_</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
            {trainingComplete && (
              <Card className="p-6 border-green-500">
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Model Training Successful</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your custom Lane Pilot model has been trained and is ready to use.
                    </p>
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="font-medium text-sm">Model Details</h4>
                      <ul className="text-sm space-y-1 mt-2">
                        <li>Name: lane_pilot_model_v1.pt</li>
                        <li>Size: 14.2 MB</li>
                        <li>Classes: Lanes, Vehicles, Pedestrians, Potholes</li>
                        <li>Accuracy: 89.7% (simulated)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ModelTraining;
