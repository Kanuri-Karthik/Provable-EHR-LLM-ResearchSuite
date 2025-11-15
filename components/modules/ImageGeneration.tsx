
import React, { useState } from 'react';
import { generateImage } from '../../services/geminiService';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const ImageGeneration: React.FC = () => {
    const [prompt, setPrompt] = useState('A majestic lion wearing a crown, cinematic lighting');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setImageUrl(null);
        try {
            const url = await generateImage(prompt, aspectRatio);
            setImageUrl(url);
        } catch (e: any) {
            setError(e.message || "An error occurred while generating the image.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="max-w-2xl mx-auto">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="prompt" className="block text-lg font-semibold mb-2">Image Prompt</label>
                        <textarea
                            id="prompt"
                            className="w-full p-2 bg-bkg border border-content/20 rounded-md text-sm"
                            rows={3}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A photo of an astronaut riding a horse on Mars"
                        />
                    </div>
                    <div>
                         <label htmlFor="aspect-ratio" className="block text-lg font-semibold mb-2">Aspect Ratio</label>
                         <div className="flex flex-wrap gap-2">
                            {aspectRatios.map(ar => (
                                <button
                                    key={ar}
                                    onClick={() => setAspectRatio(ar)}
                                    className={`px-4 py-2 text-sm rounded-md border transition-colors ${aspectRatio === ar ? 'bg-sky-600 border-sky-600' : 'bg-bkg border-content/20 hover:border-content/50'}`}
                                >
                                    {ar}
                                </button>
                            ))}
                         </div>
                    </div>
                    <Button onClick={handleGenerate} isLoading={isLoading}>
                        Generate Image
                    </Button>
                </div>
            </div>
            <div className="mt-8 flex justify-center">
                <div className="w-full max-w-2xl p-4 bg-bkg border border-content/20 rounded-md min-h-[30rem] flex items-center justify-center">
                    {isLoading && <Loader />}
                    {error && <div className="text-red-400 text-center">{error}</div>}
                    {imageUrl && <img src={imageUrl} alt={prompt} className="max-w-full max-h-[28rem] rounded-md object-contain" />}
                    {!isLoading && !error && !imageUrl && <p className="text-content/60">Your generated image will appear here.</p>}
                </div>
            </div>
        </div>
    );
};

export default ImageGeneration;
