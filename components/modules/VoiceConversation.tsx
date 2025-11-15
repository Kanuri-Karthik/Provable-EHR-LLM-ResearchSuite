

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, LiveSession } from '@google/genai';
import { decode, encode, decodeAudioData } from '../../utils/audio';
import Button from '../ui/Button';
import { Mic, MicOff, Bot, User } from 'lucide-react';
import { GEMINI_API_KEY } from '../../config';

const INITIAL_MESSAGE = { speaker: 'ai' as const, text: 'Hello! How can I assist you today? Press Start to begin.' };

const VoiceConversation: React.FC = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState('Idle');
    const [error, setError] = useState('');
    const [transcript, setTranscript] = useState<{ speaker: 'user' | 'ai'; text: string }[]>([INITIAL_MESSAGE]);

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const outputSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    const transcriptEndRef = useRef<HTMLDivElement>(null);


    const stopConversation = useCallback(() => {
        setIsConnecting(false);
        setIsActive(false);
        setStatus('Conversation ended.');

        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close()).catch(console.error);
            sessionPromiseRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }

        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            inputAudioContextRef.current.close().catch(console.error);
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
             outputSourcesRef.current.forEach(source => source.stop());
             outputSourcesRef.current.clear();
             outputAudioContextRef.current.close().catch(console.error);
        }
    }, []);

    const startConversation = async () => {
        setIsConnecting(true);
        setError('');
        setTranscript([INITIAL_MESSAGE]);
        setStatus('Requesting microphone access...');

        try {
            const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
            
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('Connection open. Start speaking...');
                        setIsConnecting(false);
                        setIsActive(true);
                        
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        processorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            if (sessionPromiseRef.current) {
                                sessionPromiseRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const { inputTranscription, outputTranscription } = message.serverContent ?? {};

                        if (inputTranscription) {
                            setTranscript(prev => {
                                const last = prev[prev.length - 1];
                                if (last?.speaker === 'user') {
                                    const newTranscript = [...prev];
                                    newTranscript[newTranscript.length - 1] = { ...last, text: last.text + inputTranscription.text };
                                    return newTranscript;
                                } else {
                                    return [...prev, { speaker: 'user', text: inputTranscription.text }];
                                }
                            });
                        }

                        if (outputTranscription) {
                             setTranscript(prev => {
                                const last = prev[prev.length - 1];
                                if (last?.speaker === 'ai') {
                                    const newTranscript = [...prev];
                                    newTranscript[newTranscript.length - 1] = { ...last, text: last.text + outputTranscription.text };
                                    return newTranscript;
                                } else {
                                    return [...prev, { speaker: 'ai', text: outputTranscription.text }];
                                }
                            });
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                             const outputCtx = outputAudioContextRef.current;
                             nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                             const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                             const source = outputCtx.createBufferSource();
                             source.buffer = audioBuffer;
                             source.connect(outputCtx.destination);
                             source.addEventListener('ended', () => {
                                outputSourcesRef.current.delete(source);
                             });
                             source.start(nextStartTimeRef.current);
                             nextStartTimeRef.current += audioBuffer.duration;
                             outputSourcesRef.current.add(source);
                        }

                         if(message.serverContent?.interrupted) {
                            outputSourcesRef.current.forEach(source => source.stop());
                            outputSourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                         }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live API Error:', e);
                        setError(`An error occurred: ${e.message}`);
                        stopConversation();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Live API connection closed.');
                        stopConversation();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                    },
                    systemInstruction: 'You are a friendly and helpful AI assistant.',
                },
            });
        } catch (err: any) {
            setError(`Failed to start conversation: ${err.message}`);
            setStatus('Error');
            setIsConnecting(false);
        }
    };
    
    useEffect(() => {
        return () => {
            stopConversation();
        };
    }, [stopConversation]);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    return (
        <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
                <Button onClick={isActive ? stopConversation : startConversation} isLoading={isConnecting} className="w-48 h-16 text-lg">
                    {isActive ? <MicOff className="mr-2"/> : <Mic className="mr-2"/>}
                    {isConnecting ? 'Connecting...' : isActive ? 'Stop' : 'Start'}
                </Button>
            </div>
            <div className="p-4 bg-bkg border border-content/20 rounded-md min-h-[8rem] text-center">
                <p className="font-semibold text-xl">{status}</p>
                {error && <p className="text-red-400 mt-2">{error}</p>}
            </div>
             <div className="mt-6 p-4 bg-bkg border border-content/20 rounded-md min-h-[16rem] text-left">
                <h3 className="text-lg font-semibold mb-4">Conversation Transcript</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                   {transcript.map((item, index) => (
                       <div key={index} className={`flex items-start gap-3 ${item.speaker === 'user' ? 'justify-end' : ''}`}>
                           {item.speaker === 'ai' && <div className="p-2 bg-sky-500/20 rounded-full flex-shrink-0"><Bot size={20} className="text-sky-300"/></div>}
                           <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${item.speaker === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-content/10 rounded-bl-none'}`}>
                                <p className="text-sm break-words">{item.text || '...'}</p>
                           </div>
                           {item.speaker === 'user' && <div className="p-2 bg-gray-500/20 rounded-full flex-shrink-0"><User size={20} className="text-gray-300"/></div>}
                       </div>
                   ))}
                   <div ref={transcriptEndRef} />
                </div>
             </div>
        </div>
    );
};

export default VoiceConversation;
