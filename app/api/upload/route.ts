import { NextResponse } from 'next/server';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION!,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
    }
});

export async function POST(request: Request) {
    try {
        const { contentType } = await request.json();

        // 生成唯一的文件名
        const fileExtension = contentType.split('/')[1];
        const key = `nfc-checkin/location-icons/${uuidv4()}.${fileExtension}`;

        const { url, fields } = await createPresignedPost(s3Client, {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
            Key: key,
            Conditions: [
                ['content-length-range', 0, 5242880], // 最大 5MB
                ['starts-with', '$Content-Type', 'image/']
            ],
            Fields: {
                'Content-Type': contentType
            }
        });

        return NextResponse.json({ url, fields });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: '上傳失敗，請稍後再試' }, { status: 500 });
    }
}
