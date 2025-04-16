
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUploader from '@/components/FileUploader';
import VideoPlayer from '@/components/VideoPlayer';
import ProjectInfo from '@/components/ProjectInfo';
import CodeSnippets from '@/components/CodeSnippets';

const Index = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleFileSelected = (file: File) => {
    setVideoFile(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Lane Pilot Pothole Guard</h1>
            <p className="text-xl text-muted-foreground">
              Advanced driver assistance system with lane detection and pothole avoidance
            </p>
          </div>
          
          {!videoFile && <FileUploader onFileSelected={handleFileSelected} />}
          
          {videoFile && <VideoPlayer videoFile={videoFile} />}
          
          <ProjectInfo />
          
          <CodeSnippets />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
