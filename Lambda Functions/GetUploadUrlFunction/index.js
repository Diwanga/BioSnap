import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: process.env.REGION });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const handler = async (event) => {
    console.log('Event received:', JSON.stringify(event, null, 2));
    
    try {
        // Extract userId from Cognito authorizer claims
        const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
        
        if (!userId) {
            return {
                statusCode: 401,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Unauthorized',
                    message: 'User ID not found in token' 
                })
            };
        }
        
        // Get file extension from request body (optional)
        let fileExtension = 'jpg'; // default
        if (event.body) {
            try {
                const body = JSON.parse(event.body);
                if (body.fileExtension) {
                    fileExtension = body.fileExtension.replace('.', ''); // remove dot if present
                }
            } catch (e) {
                console.log('No body or invalid JSON, using default extension');
            }
        }
        
        // Generate unique S3 key
        const timestamp = Date.now();
        const imageKey = `users/${userId}/image-${timestamp}.${fileExtension}`;
        
        console.log('Generating pre-signed URL for:', imageKey);
        
        // Create the S3 PutObject command
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: imageKey,
            ContentType: `image/${fileExtension}` // Set appropriate content type
        });
        
        // Generate pre-signed URL (expires in 15 minutes)
        const uploadUrl = await getSignedUrl(s3Client, command, { 
            expiresIn: 900 // 15 minutes in seconds
        });
        
        console.log('Pre-signed URL generated successfully');
        
        // Return success response
        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                uploadUrl: uploadUrl,
                imageKey: imageKey,
                expiresIn: 900,
                message: 'Pre-signed URL generated successfully'
            })
        };
        
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({ 
                error: 'Internal Server Error',
                message: error.message 
            })
        };
    }
};

// Helper function for CORS headers
function getCorsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Content-Type': 'application/json'
    };
}
