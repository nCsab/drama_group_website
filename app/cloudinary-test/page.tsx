"use client";

import { CldImage, CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

export default function CloudinaryTestPage() {
  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center gap-10">
      <h1 className="text-3xl font-bold">Cloudinary Integration Test</h1>
      
      <div className="w-full max-w-2xl bg-gray-900 p-5 rounded-xl border border-gray-700">
        <h2 className="text-xl mb-4 text-green-400">1. Image Test</h2>
        <p className="mb-4 text-gray-400">Replace "sample" with your uploaded image Public ID.</p>
        <div className="relative w-full h-[300px] bg-gray-800 rounded-lg overflow-hidden">
          {/* REPLACE "sample" WITH YOUR IMAGE PUBLIC ID (e.g., "images/logos/logo_label_title") */}
          <CldImage
            src="sample" 
            width="800"
            height="600"
            alt="Test Image"
            sizes="100vw"
            className="object-contain"
          />
        </div>
      </div>

      <div className="w-full max-w-2xl bg-gray-900 p-5 rounded-xl border border-gray-700">
        <h2 className="text-xl mb-4 text-blue-400">2. Video Test</h2>
        <p className="mb-4 text-gray-400">Replace "samples/sea-turtle" with your uploaded video Public ID.</p>
        <div className="w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
           {/* REPLACE "samples/sea-turtle" WITH YOUR VIDEO PUBLIC ID (e.g., "video/logo_animation") */}
          <CldVideoPlayer
            width="1920"
            height="1080"
            src="samples/sea-turtle"
          />
        </div>
      </div>
    </div>
  );
}
