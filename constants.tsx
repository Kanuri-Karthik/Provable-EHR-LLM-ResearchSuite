

import React from 'react';
import { ShieldAlert, ClipboardList, Shield, Layers, Languages, Image, Globe, Video, FileAudio, Voicemail, Volume2, AudioLines } from 'lucide-react';
import type { Project } from './types';
import ZeroHallucination from './components/modules/ZeroHallucination';
import ProvenanceSummarization from './components/modules/ProvenanceSummarization';
import PrivacyEquitable from './components/modules/PrivacyEquitable';
import MultimodalFusion from './components/modules/MultimodalFusion';
import MultilingualRobustness from './components/modules/MultilingualRobustness';
import ImageGeneration from './components/modules/ImageGeneration';
import WebGroundedQA from './components/modules/WebGroundedQA';
import VideoAnalysis from './components/modules/VideoAnalysis';
import AudioTranscription from './components/modules/AudioTranscription';
import VoiceConversation from './components/modules/VoiceConversation';
import TextToSpeech from './components/modules/TextToSpeech';
import AudioTranslator from './components/modules/AudioTranslator';

export const PROJECTS: Project[] = [
  {
    id: 'zero-hallucination',
    title: 'Zero-Hallucination & Workflow Compliance',
    tagline: 'Ensuring generated reports adhere to clinical rules.',
    Icon: ShieldAlert,
    description: 'Ensure that LLM-generated reports are free of hallucinations and comply with established clinical workflow rules. This module uses a rule-based checker to validate outputs against predefined templates and constraints.',
    component: ZeroHallucination,
  },
  {
    id: 'provenance-summarization',
    title: 'Provenance-based Summarization',
    tagline: 'Generate traceable clinical summaries from EHR data.',
    Icon: ClipboardList,
    description: 'Generate concise, accurate clinical summaries from complex Electronic Health Record (EHR) data. Each statement in the summary is linked back to its source in the original record, ensuring traceability and verifiability.',
    component: ProvenanceSummarization,
  },
  {
    id: 'privacy-equitable',
    title: 'Privacy & Equitable AI',
    tagline: 'De-identify PII and monitor for algorithmic bias.',
    Icon: Shield,
    description: 'Protect patient privacy by automatically de-identifying Personally Identifiable Information (PII) from clinical text. This module also includes a dashboard for monitoring fairness metrics to promote equitable AI.',
    component: PrivacyEquitable,
  },
  {
    id: 'multimodal-fusion',
    title: 'Multimodal Data Fusion',
    tagline: 'Synthesize insights from text, images, and vitals.',
    Icon: Layers,
    description: 'Fuse information from diverse data sources, including clinical notes (text), medical images (e.g., X-rays), and patient vitals (tabular data), to generate comprehensive longitudinal summaries and insights.',
    component: MultimodalFusion,
  },
  {
    id: 'multilingual-robustness',
    title: 'Multilingual Robustness',
    tagline: 'Assess clinical note consistency across languages.',
    Icon: Languages,
    description: 'Evaluate the faithfulness and consistency of clinical notes across different languages. This module translates notes and provides a consistency score, ensuring that meaning is preserved and quality is maintained.',
    component: MultilingualRobustness,
  },
  {
    id: 'image-generation',
    title: 'Medical Image Generation',
    tagline: 'Create synthetic medical images from text prompts.',
    Icon: Image,
    description: 'Generate high-quality, synthetic medical images from descriptive text prompts. This tool can be used for educational purposes, data augmentation, or visualizing complex medical scenarios.',
    component: ImageGeneration,
  },
  {
    id: 'web-grounded-qa',
    title: 'Web-Grounded Q&A',
    tagline: 'Get up-to-date answers backed by web search.',
    Icon: Globe,
    description: 'Ask questions about recent events or topics and receive answers that are grounded in the latest information from Google Search, complete with source links for verification.',
    component: WebGroundedQA,
  },
  {
    id: 'video-analysis',
    title: 'Video Analysis',
    tagline: 'Understand content and context from video files.',
    Icon: Video,
    description: 'Upload a video and ask questions about it. This module analyzes video frames to provide descriptive summaries and answer queries about the visual content.',
    component: VideoAnalysis,
  },
  {
    id: 'audio-transcription',
    title: 'Audio Transcription',
    tagline: 'Transcribe spoken words from audio recordings.',
    Icon: FileAudio,
    description: 'Record audio directly in your browser and get a high-fidelity text transcription. Useful for dictating notes or analyzing spoken conversations.',
    component: AudioTranscription,
  },
  {
    id: 'voice-conversation',
    title: 'Live Voice Conversation',
    tagline: 'Engage in a real-time voice chat with an AI.',
    Icon: Voicemail,
    description: 'Experience a low-latency, real-time voice conversation with an AI assistant. This module features live transcription and spoken responses.',
    component: VoiceConversation,
  },
  {
    id: 'text-to-speech',
    title: 'Text-to-Speech (TTS)',
    tagline: 'Convert written text into natural-sounding speech.',
    Icon: Volume2,
    description: 'Synthesize high-quality, human-like speech from any text input. Generate audio clips for various applications, from reading out notes to creating educational content.',
    component: TextToSpeech,
  },
  {
    id: 'audio-translator',
    title: 'Audio Translator',
    tagline: 'Speak and hear the translated response.',
    Icon: AudioLines,
    description: 'Record audio in one language, and this module will transcribe it, translate it to a selected language, and synthesize speech for the translation.',
    component: AudioTranslator,
  },
];

export const DUMMY_DOCTOR_NOTE = `
PATIENT: Jane Smith
DATE: 2023-10-27
SUBJECTIVE: Patient is a 52-year-old female complaining of a persistent cough for 3 weeks, accompanied by mild fever.
OBJECTIVE: Vital signs are stable. Chest X-ray ordered.
ASSESSMENT: Suspected community-acquired pneumonia.
PLAN:
1. Start Amoxicillin 500mg TID for 7 days.
2. Follow up on Chest X-ray results.
3. Patient to monitor symptoms and return if they worsen.
`;

// FIX: Add missing dummy data constants
export const DUMMY_EHR_DATA = JSON.stringify({
    "patient_id": "P001",
    "encounter_id": "E123",
    "notes": [
        { "date": "2023-10-20", "text": "Patient reports persistent headache for 3 days." },
        { "date": "2023-10-22", "text": "Prescribed basic analgesics. Follow-up in one week." }
    ],
    "labs": [
        { "name": "Blood Pressure", "value": "120/80 mmHg", "date": "2023-10-20" }
    ]
}, null, 2);

export const DUMMY_PII_TEXT = "Patient John Doe, DOB 01/01/1980, phone 555-123-4567, lives at 123 Main St, Anytown. Email: john.doe@email.com. Visited Dr. Smith regarding chest pain.";

export const DUMMY_VITALS_CSV = `date,heart_rate,blood_pressure,temperature_c
2023-10-01,72,120/80,37.0
2023-10-08,75,122/81,37.1
2023-10-15,78,125/83,37.3
2023-10-22,76,124/82,37.2`;

export const DUMMY_MULTILINGUAL_NOTE = {
    english: "Patient complains of chest pain and shortness of breath. History of hypertension.",
    hindi: "मरीज को सीने में दर्द और सांस लेने में तकलीफ की शिकायत है। उच्च रक्तचाप का इतिहास।",
    telugu: "రోగి ఛాతీ నొప్పి మరియు శ్వాస ఆడకపోవడం గురించి ఫిర్యాదు చేశారు. రక్తపోటు చరిత్ర.",
};