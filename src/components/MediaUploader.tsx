'use client';

import { useState, useRef, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface MediaFile {
    url: string;
    type: 'image' | 'video';
    order: number;
    file?: File;
    uploading?: boolean;
}

interface MediaUploaderProps {
    value: MediaFile[];
    onChange: (media: MediaFile[]) => void;
    maxImages?: number;
    maxVideos?: number;
    maxSizeMB?: number;
}

export default function MediaUploader({
    value,
    onChange,
    maxImages = 5,
    maxVideos = 1,
    maxSizeMB = 20,
}: MediaUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const imageCount = value.filter((m) => m.type === 'image').length;
    const videoCount = value.filter((m) => m.type === 'video').length;

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = async (files: File[]) => {
        setUploadError('');

        for (const file of files) {
            // Validate file type
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');

            if (!isImage && !isVideo) {
                setUploadError('Only image and video files are allowed');
                continue;
            }

            // Check limits
            if (isImage && imageCount >= maxImages) {
                setUploadError(`Maximum ${maxImages} images allowed`);
                continue;
            }

            if (isVideo && videoCount >= maxVideos) {
                setUploadError(`Maximum ${maxVideos} video allowed`);
                continue;
            }

            // Validate file size
            const sizeMB = file.size / (1024 * 1024);
            if (sizeMB > maxSizeMB) {
                setUploadError(`File size must be less than ${maxSizeMB}MB`);
                continue;
            }

            // Upload file
            await uploadFile(file, isImage ? 'image' : 'video');
        }
    };

    const uploadFile = async (file: File, type: 'image' | 'video') => {
        // Add to state with uploading flag
        const tempMedia: MediaFile = {
            url: URL.createObjectURL(file),
            type,
            order: value.length,
            uploading: true,
        };

        onChange([...value, tempMedia]);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || 'Upload failed');
            }

            // Update with actual URL
            onChange(
                value.map((m) =>
                    m.url === tempMedia.url
                        ? { ...m, url: data.data.url, uploading: false }
                        : m
                ).concat({ url: data.data.url, type: data.data.type, order: value.length })
            );
        } catch (error: any) {
            setUploadError(error.message || 'Upload failed');
            // Remove failed upload
            onChange(value.filter((m) => m.url !== tempMedia.url));
        }
    };

    const removeMedia = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
                        ? 'border-pink-500 bg-pink-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                    }
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                />

                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                    Drop files here or click to browse
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                    Upload up to {maxImages} images and {maxVideos} video (max {maxSizeMB}MB each)
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <ImageIcon className="w-4 h-4" />
                        {imageCount}/{maxImages} images
                    </span>
                    <span className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        {videoCount}/{maxVideos} video
                    </span>
                </div>
            </div>

            {uploadError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                    {uploadError}
                </div>
            )}

            {/* Preview Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {value.map((media, index) => (
                        <div
                            key={index}
                            className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 group"
                        >
                            {media.uploading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                                    <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                                </div>
                            ) : media.type === 'image' ? (
                                <Image
                                    src={media.url}
                                    alt={`Upload ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <video src={media.url} className="w-full h-full object-cover" />
                            )}

                            {!media.uploading && (
                                <button
                                    onClick={() => removeMedia(index)}
                                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            )}

                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-900/80 rounded text-xs text-white flex items-center gap-1">
                                {media.type === 'image' ? (
                                    <ImageIcon className="w-3 h-3" />
                                ) : (
                                    <Video className="w-3 h-3" />
                                )}
                                {media.type}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
