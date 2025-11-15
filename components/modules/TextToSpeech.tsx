
import React, { useState, useRef } from 'react';
import { generateSpeech } from '../../services/geminiService';
import { decode, decodeAudioData } from '../../utils/audio';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import { Play, Square } from 'lucide-react';

const TextToSpeech: React.FC = () => {
    const [text, setText] = useState('Hello! This is a demonstration of Gemini\'s text-to-speech capabilities.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    const handleGenerateSpeech = async () => {
        setIsLoading(true);
        setError('');
        setAudioBuffer(null);
        if (isPlaying) {
            audioSourceRef.current?.stop();
            setIsPlaying(false);
        }

        try {
            const base64Audio = await generateSpeech(text);
            if (!base64Audio) throw new Error("API did not return audio data.");

            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioBytes = decode(base64Audio);
            const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            setAudioBuffer(buffer);

        } catch (e: any) {
            setError(e.message || "An error occurred while generating speech.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePlayAudio = () => {
        if (!audioBuffer || !audioContextRef.current) return;
        
        if (isPlaying) {
             if (audioSourceRef.current) {
                audioSourceRef.current.stop();
             }
             setIsPlaying(false);
             return;
        }

        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => {
            setIsPlaying(false);
            audioSourceRef.current = null;
        };
        source.start(0);
        audioSourceRef.current = source;
        setIsPlaying(true);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="space-y-4">
                <div>
                    <label htmlFor="tts-text" className="block text-lg font-semibold mb-2">Text to Synthesize</label>
                    <textarea
                        id="tts-text"
                        className="w-full p-2 bg-bkg border border-content/20 rounded-md text-sm"
                        rows={5}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text you want to convert to speech..."
                    />
                </div>
                <Button onClick={handleGenerateSpeech} isLoading={isLoading}>
                    Generate Speech
                </Button>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Audio Output</h3>
                <div className="w-full p-4 bg-bkg border border-content/20 rounded-md min-h-[8rem] flex items-center justify-center">
                    {isLoading && <Loader />}
                    {error && <div className="text-red-400">{error}</div>}
                    {audioBuffer && (
                        <Button onClick={handlePlayAudio} className="w-48">
                            {isPlaying ? <Square className="mr-2" /> : <Play className="mr-2" />}
                            {isPlaying ? 'Stop' : 'Play Audio'}
                        </Button>
                    )}
                     {!isLoading && !error && !audioBuffer && <p className="text-content/60">Generated audio will appear here.</p>}
                </div>
            </div>
        </div>
    );
};

export default TextToSpeech;
