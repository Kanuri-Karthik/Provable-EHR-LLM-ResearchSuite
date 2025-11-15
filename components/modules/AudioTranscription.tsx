
import React, { useState, useRef } from 'react';
import { transcribeAudio, fileToBase64 } from '../../services/geminiService';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import { Mic, StopCircle } from 'lucide-react';

const AudioTranscription: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleStartRecording = async () => {
        setError('');
        setTranscription('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                setIsLoading(true);
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                try {
                    const audioBase64 = await fileToBase64(audioBlob);
                    const result = await transcribeAudio(audioBase64, audioBlob.type);
                    setTranscription(result);
                } catch(e: any) {
                    setError(e.message || "Failed to transcribe audio.");
                } finally {
                    setIsLoading(false);
                }
                stream.getTracks().forEach(track => track.stop()); // Stop microphone access
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            setError('Microphone access was denied. Please allow access to use this feature.');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-lg font-semibold mb-4">Record Audio for Transcription</h3>
            
            <div className="mb-6">
                <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`inline-flex items-center justify-center px-6 py-3 font-semibold rounded-full transition-colors text-white ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-sky-600 hover:bg-sky-700'}`}
                    aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                >
                    {isRecording ? <StopCircle className="mr-2" /> : <Mic className="mr-2" />}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </div>
             {isRecording &&
                <div className="flex items-center justify-center gap-2 text-content/80">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Recording...</span>
                </div>
             }


            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2 text-left">Transcription</h3>
                <div className="w-full p-4 bg-bkg border border-content/20 rounded-md min-h-[15rem] text-left">
                    {isLoading && <Loader />}
                    {error && <div className="text-red-400">{error}</div>}
                    {!isLoading && !error && (
                         <p className="whitespace-pre-wrap leading-relaxed">
                            {transcription || "Transcription will appear here..."}
                         </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AudioTranscription;
