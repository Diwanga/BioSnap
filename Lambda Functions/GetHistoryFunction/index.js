import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const dynamoClient = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const s3Client = new S3Client({ region: process.env.REGION });

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const handler = async (event) => {
    console.log('Event received:', JSON.stringify(event, null, 2));
    
    try {
        // Extract userId from Cognito authorizer
        // const userId = event.requestContext?.authorizer?.claims?.sub;
        const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
        
        if (!userId) {
            return createResponse(401, { 
                error: 'Unauthorized', 
                message: 'User ID not found in token' 
            });
        }
        
        console.log('Fetching history for userId:', userId);
        
        // Query DynamoDB for user's recognition history
        const items = await queryHistory(userId);
        
        console.log(`Found ${items.length} recognition records`);
        
        // Generate pre-signed URLs for each image
        const historyWithUrls = await Promise.all(
            items.map(async (item) => {
                const imageUrl = await generatePresignedUrl(item.imageKey);
                
                return {
                    recognitionId: item.recognitionId,
                    timestamp: item.timestamp,
                    createdAt: item.createdAt,
                    type: item.type,
                    scientificName: item.scientificName,
                    commonName: item.commonName,
                    description: item.description,
                    confidence: item.confidence,
                    imageUrl: imageUrl,
                    imageKey: item.imageKey
                };
            })
        );
        
        console.log('Successfully generated pre-signed URLs for all images');
        
        // Return history
        return createResponse(200, {
            success: true,
            count: historyWithUrls.length,
            history: historyWithUrls
        });
        
    } catch (error) {
        console.error('Error fetching history:', error);
        return createResponse(500, { 
            error: 'Internal Server Error', 
            message: error.message 
        });
    }
};

// Query DynamoDB for user's history
async function queryHistory(userId) {
    const command = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        },
        ScanIndexForward: false, // Sort descending (newest first)
        Limit: 10 // Return last 10 items
    });
    
    const response = await docClient.send(command);
    return response.Items || [];
}

// Generate pre-signed GET URL for image
async function generatePresignedUrl(imageKey) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: imageKey
    });
    
    // Generate pre-signed URL valid for 1 hour
    const url = await getSignedUrl(s3Client, command, { 
        expiresIn: 3600 
    });
    
    return url;
}

// Helper function for API responses
function createResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'OPTIONS,GET',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
}
