
import React, { useState, useRef } from 'react';
import { analyzeVideo, fileToBase64 } from '../../services/geminiService';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import { Upload } from 'lucide-react';

const FRAME_COUNT = 10; // Number of frames to extract

const VideoAnalysis: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('Describe what is happening in this video. What are the key objects and actions?');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
            setResult('');
            setError('');
        }
    };

    const extractFrames = (): Promise<{ data: string, mimeType: string }[]> => {
        return new Promise((resolve, reject) => {
            if (!videoRef.current || !canvasRef.current || !videoFile) {
                return reject(new Error("Video or canvas element not ready."));
            }
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error("Could not get canvas context."));

            const frames: { data: string, mimeType: string }[] = [];
            let processedFrames = 0;

            video.onloadeddata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const duration = video.duration;
                const interval = duration / FRAME_COUNT;

                const captureFrame = (time: number) => {
                    video.currentTime = time;
                };

                video.onseeked = () => {
                    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                    const dataUrl = canvas.toDataURL('image/jpeg');
                    frames.push({
                        data: dataUrl.split(',')[1],
                        mimeType: 'image/jpeg'
                    });
                    processedFrames++;
                    if (processedFrames < FRAME_COUNT) {
                        captureFrame(processedFrames * interval);
                    } else {
                        video.onloadeddata = null;
                        video.onseeked = null;
                        resolve(frames);
                    }
                };
                
                captureFrame(0);
            };

            video.onerror = (e) => reject(new Error("Error loading video."));
            video.src = URL.createObjectURL(videoFile);
        });
    };

    const handleAnalyze = async () => {
        if (!videoFile) {
            setError("Please upload a video file first.");
            return;
        }
        setIsLoading(true);
        setError('');
        setResult('');
        try {
            setStatus('Extracting frames from video...');
            const frames = await extractFrames();
            
            setStatus('Analyzing frames with Gemini Pro...');
            const analysisResult = await analyzeVideo(frames, prompt);
            setResult(analysisResult);
        } catch (e: any) {
            setError(e.message || "An error occurred during analysis.");
        } finally {
            setIsLoading(false);
            setStatus('');
        }
    };

    return (
        <div>
            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-2">1. Upload Video</h3>
                     <label className="w-full h-64 flex flex-col items-center justify-center bg-bkg border-2 border-dashed border-content/20 rounded-md cursor-pointer hover:border-primary-focus">
                        {videoPreview ? 
                            <video ref={videoRef} src={videoPreview} className="max-h-full max-w-full object-contain" controls /> : 
                            <div className="flex flex-col items-center gap-2 text-content/60"><Upload /><p>Click to upload video</p></div>}
                        <input type="file" className="hidden" onChange={handleFileChange} accept="video/*" />
                    </label>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">2. Enter Your Query</h3>
                    <textarea
                        className="w-full h-64 p-2 bg-bkg border border-content/20 rounded-md text-sm"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., What is the main subject of this video?"
                    />
                </div>
            </div>
            <div className="mt-6">
                <Button onClick={handleAnalyze} isLoading={isLoading}>
                    Analyze Video
                </Button>
            </div>
            <div className="mt-8">
                 <h3 className="text-lg font-semibold mb-2">Analysis Result</h3>
                 <div className="w-full p-4 bg-bkg border border-content/20 rounded-md min-h-[15rem]">
                    {isLoading ? <div className="text-center"><Loader /><p className="mt-2">{status}</p></div> : 
                     error ? <div className="text-red-400">{error}</div> :
                     <p className="whitespace-pre-wrap leading-relaxed">{result || "Analysis from Gemini Pro will appear here."}</p>
                    }
                 </div>
            </div>
        </div>
    );
};

export default VideoAnalysis;
