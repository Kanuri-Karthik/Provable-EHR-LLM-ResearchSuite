
import React, { useState, useRef } from 'react';
import { transcribeAndTranslate, generateSpeech, fileToBase64 } from '../../services/geminiService';
import { decode, decodeAudioData } from '../../utils/audio';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import { Mic, StopCircle, Square, Volume2 } from 'lucide-react';

const availableLanguages = [
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ja', name: 'Japanese' },
    { code: 'es', name: 'Spanish' },
    { code: 'te', name: 'Telugu' },
];

interface TranslationResult {
    originalTranscription: string;
    translatedText: string;
    translatedAudioBuffer: AudioBuffer | null;
}

const AudioTranslator: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<TranslationResult | null>(null);
    const [targetLanguage, setTargetLanguage] = useState('es');
    const [isPlaying, setIsPlaying] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    const handleStartRecording = async () => {
        setError('');
        setResult(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                setIsLoading(true);
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                if (audioBlob.size === 0) {
                    setError("No audio was recorded.");
                    setIsLoading(false);
                    return;
                }

                try {
                    const audioBase64 = await fileToBase64(audioBlob);
                    const langName = availableLanguages.find(l => l.code === targetLanguage)?.name || 'the selected language';
                    
                    // Step 1 & 2: Transcribe and Translate
                    const { originalTranscription, translatedText } = await transcribeAndTranslate(audioBase64, audioBlob.type, langName);

                    // Step 3: Generate Speech from translated text
                    const translatedAudioBase64 = await generateSpeech(translatedText);

                    // Step 4: Decode audio for playback
                     if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    }
                    const audioBytes = decode(translatedAudioBase64);
                    const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
                    
                    setResult({
                        originalTranscription,
                        translatedText,
                        translatedAudioBuffer: buffer,
                    });

                } catch (e: any) {
                    setError(e.message || "Failed to translate audio.");
                } finally {
                    setIsLoading(false);
                }
                stream.getTracks().forEach(track => track.stop());
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
    
    const handlePlayAudio = () => {
        if (!result?.translatedAudioBuffer || !audioContextRef.current) return;
        
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
        source.buffer = result.translatedAudioBuffer;
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
        <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 items-center mb-6">
                <div>
                    <label htmlFor="language-select" className="block text-lg font-semibold mb-2">Translate To:</label>
                    <select
                        id="language-select"
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="w-full p-3 bg-bkg border border-content/20 rounded-md"
                        disabled={isRecording || isLoading}
                    >
                        {availableLanguages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                    </select>
                </div>
                <div className="text-center">
                     <button
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        disabled={isLoading}
                        className={`inline-flex items-center justify-center px-8 py-4 font-semibold rounded-full transition-all text-white text-lg ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-sky-600 hover:bg-sky-700'} disabled:opacity-50`}
                    >
                        {isRecording ? <StopCircle className="mr-2" /> : <Mic className="mr-2" />}
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </button>
                </div>
            </div>
            
             {isRecording &&
                <div className="flex items-center justify-center gap-2 text-content/80 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Recording audio...</span>
                </div>
             }
            
            {isLoading && <div className="text-center my-8"><Loader /><p className="mt-2">Translating audio, please wait...</p></div>}
            {error && <div className="text-red-400 p-4 bg-red-500/10 rounded-md my-4">{error}</div>}

            {result && (
                 <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Original Transcription</h3>
                        <div className="w-full p-4 bg-bkg border border-content/20 rounded-md min-h-[10rem]">
                            <p className="whitespace-pre-wrap leading-relaxed">{result.originalTranscription}</p>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2">Translated Text & Audio</h3>
                        <div className="w-full p-4 bg-bkg border border-content/20 rounded-md min-h-[10rem] flex flex-col justify-between">
                            <p className="whitespace-pre-wrap leading-relaxed">{result.translatedText}</p>
                            <div className="mt-4 text-right">
                                <Button onClick={handlePlayAudio} disabled={!result.translatedAudioBuffer}>
                                    {isPlaying ? <Square className="mr-2" /> : <Volume2 className="mr-2" />}
                                    {isPlaying ? 'Stop' : 'Play Translation'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioTranslator;
