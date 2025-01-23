'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface MediaUploaderProps {
    onChange?: (imageUrl: string | null) => void;
    isDisabled?: boolean;
    defaultValue?: string;
}

export function MediaUploader({ onChange, isDisabled, defaultValue }: MediaUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>(defaultValue || '');
    const ref = useRef<HTMLInputElement>(null);

    const uploadImage = async (_file: File) => {
        setIsUploading(true);
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contentType: _file.type
                })
            });

            const { url, fields } = await response.json();

            const formData = new FormData();
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            formData.append('file', _file);

            const uploadResponse = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error('上傳失敗');
            }

            const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fields.key}`;
            setPreviewUrl(imageUrl);
            onChange?.(imageUrl);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const _file = e.target.files?.[0];
        if (!_file) return;

        setFile(_file);
        await uploadImage(_file);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="w-32">
                <AspectRatio ratio={1}>
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="圖標預覽"
                            fill
                            className="rounded-lg object-cover"
                        />
                    ) : (
                        <div className="h-full w-full rounded-lg bg-muted" />
                    )}
                </AspectRatio>
            </div>
            <Input
                ref={ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isDisabled || isUploading}
            />
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => ref.current?.click()}
                    disabled={isDisabled || isUploading}
                >
                    {isUploading ? '上傳中...' : '上傳圖標'}
                </Button>
                {previewUrl && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setFile(null);
                            setPreviewUrl('');
                            onChange?.(null);
                        }}
                    >
                        移除
                    </Button>
                )}
            </div>
        </div>
    );
}
