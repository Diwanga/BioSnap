import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { identifySpecies } from "./recognitionChat.mjs";

const s3Client = new S3Client({ region: process.env.REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

export const handler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  try {
    // Extract userId from Cognito authorizer
    const userId = event.requestContext?.authorizer?.claims?.sub;
    
    if (!userId) {
      return createResponse(401, { 
        error: 'Unauthorized', 
        message: 'User ID not found in token' 
      });
    }
    
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const imageKey = body.imageKey;
    
    if (!imageKey) {
      return createResponse(400, { 
        error: 'Bad Request', 
        message: 'imageKey is required' 
      });
    }
    
    console.log('Processing recognition for imageKey:', imageKey);
    
    // Step 1: Generate pre-signed GET URL for OpenAI to access the image
    const imageUrl = await getPresignedImageUrl(imageKey);
    console.log('Generated image URL for OpenAI');
    
    // Step 2: Call OpenAI to identify species
    const recognition = await identifySpecies(imageUrl);
    console.log('OpenAI recognition result:', recognition);
    
    // Step 3: Save to DynamoDB
    const timestamp = Date.now();
    const item = {
      userId: userId,
      timestamp: timestamp,
      recognitionId: `rec-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
      imageKey: imageKey,
      type: recognition.type,
      scientificName: recognition.scientificName,
      commonName: recognition.commonName,
      description: recognition.description,
      confidence: recognition.confidence,
      createdAt: new Date().toISOString()
    };
    
    await saveToDynamoDB(item);
    console.log('Recognition saved to DynamoDB');
    
    // Step 4: Return result
    return createResponse(200, {
      success: true,
      recognition: {
        type: recognition.type,
        scientificName: recognition.scientificName,
        commonName: recognition.commonName,
        description: recognition.description,
        confidence: recognition.confidence,
        imageKey: imageKey
      }
    });
    
  } catch (error) {
    console.error('Error in recognition handler:', error);
    return createResponse(500, { 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};

// Generate pre-signed GET URL for image (so OpenAI can access it)
async function getPresignedImageUrl(key) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });
  
  // Generate pre-signed URL valid for 1 hour
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}

// Save recognition result to DynamoDB
async function saveToDynamoDB(item) {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: item
  });
  
  await docClient.send(command);
}

// Helper function for API responses
function createResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'OPTIONS,POST',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}