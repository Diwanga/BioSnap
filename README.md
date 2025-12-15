<!-- <img width="955" height="888" alt="image" src="https://github.com/user-attachments/assets/f2c6d340-0d27-47a2-9e8c-d2a36b2790f4" /> -->
## 🌿 BioSnap

> AI-Powered Plant & Animal Recognition using AWS Serverless Architecture

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://dcyfolii23kqd.cloudfront.net)
[![AWS](https://img.shields.io/badge/AWS-Serverless-orange)](https://aws.amazon.com/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

Snap a photo of any plant or animal and instantly discover its species, scientific name, and detailed information—all powered by AI and built entirely on AWS serverless services.

![BioSnap Demo](./screenshots/demo.gif)
*Upload an image → Get instant AI recognition → View your history*

---

## ✨ Features

- 🤖 **AI-Powered Recognition** - OpenAI Vision API identifies species instantly
- 📸 **Easy Upload** - Drag & drop or select images up to 10MB
- 📜 **Recognition History** - Track all your discoveries with beautiful cards
- 🔐 **Secure Authentication** - AWS Cognito user management
- 📱 **Fully Responsive** - Works seamlessly on mobile and desktop
- ⚡ **Lightning Fast** - Serverless architecture scales automatically
- 💰 **Cost Efficient** - Less than $5/month to run

---

## 🏗️ Architecture

<img width="2905" height="1668" alt="image" src="https://github.com/user-attachments/assets/8c613f85-d8bd-4049-80b9-9f509e6cd47f" />


### AWS Services Used

| Service | Purpose |
|---------|---------|
| **Amazon Cognito** | User authentication & JWT tokens |
| **API Gateway** | RESTful API endpoints |
| **AWS Lambda** | Serverless compute (3 functions) |
| **DynamoDB** | NoSQL database for recognition history |
| **S3** | Image storage & React app hosting |
| **CloudFront** | CDN for global distribution |
| **IAM** | Secure role-based permissions |

**Tech Stack:** React 18, Node.js 20.x, OpenAI API, AWS SDK v3

---

## 🚀 Live Demo

**Try it now:** [https://dcyfolii23kqd.cloudfront.net](https://dcyfolii23kqd.cloudfront.net)

### Test Account
```
Email: demo@biosnap.app
Password: Demo123!
```
*(Or sign up with your own email)*

---

## 📸 Screenshots

<table>
  <tr>
    <td><img width="944" height="685" alt="image" src="https://github.com/user-attachments/assets/1d0ab62e-a8d9-400d-9a94-fcdf03a50598" />
<br/><b>Home Page</b></td>
    <td><img width="955" height="704" alt="image" src="https://github.com/user-attachments/assets/941a50a3-5be9-4cca-8493-1cda112de5a5" />
<br/><b>Upload & Recognition</b></td>
  </tr>
  <tr>
    <td><img width="955" height="888" alt="image" src="https://github.com/user-attachments/assets/04191ac5-a8d4-415b-8022-841037ac7716" />
<b>Recognition Result</b></td>
    <td><img width="689" height="363" alt="image" src="https://github.com/user-attachments/assets/99bd6bd6-cdc2-40f1-82fb-5a8b5ebb8089" />
<br/><b>History Grid</b></td>
  </tr>
</table>

---

## 🛠️ Technical Highlights

### Serverless Backend
- **3 Lambda Functions** with minimal cold starts (256-512 MB)
- **Pre-signed S3 URLs** for direct browser uploads (no size limits)
- **DynamoDB On-Demand** for automatic scaling
- **JWT Authorization** via Cognito authorizers

### Smart Image Handling
```
1. Frontend → GetUploadUrlFunction → Pre-signed PUT URL
2. Browser → S3 (direct upload, bypasses Lambda)
3. Frontend → RecognitionFunction → OpenAI Vision API
4. Save to DynamoDB → Return results
```

### Cost Optimization
- Skipped AWS Secrets Manager ($0.40/month saved)
- HTTP API vs REST API (71% cheaper)
- On-Demand DynamoDB (pay-per-request)
- CloudFront caching reduces API calls

**Monthly Cost:** < $5 (within AWS Free Tier)

---

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- AWS Account
- OpenAI API Key

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/biosnap.git
cd biosnap

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_COGNITO_DOMAIN=your-cognito-domain
VITE_CLIENT_ID=your-cognito-client-id
VITE_API_URL=https://your-cloudfront-domain.cloudfront.net/bio-snap-v1
EOF

# Run locally
npm run dev

# Build for production
npm run build
```

### Backend Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete AWS setup instructions.

**Quick Deploy Checklist:**
- [ ] Create Cognito User Pool
- [ ] Create DynamoDB table
- [ ] Create S3 buckets (images + frontend)
- [ ] Deploy 3 Lambda functions
- [ ] Configure API Gateway
- [ ] Set up CloudFront distribution

---

## 📁 Project Structure

```
biosnap/
├── src/
│   ├── components/
│   │   ├── Upload.jsx          # Image upload & recognition
│   │   ├── History.jsx         # Recognition history grid
│   │   └── Navigation.jsx      # App navigation bar
│   ├── services/
│   │   └── api.js              # API calls to Lambda
│   ├── utils/
│   │   └── auth.js             # Authentication helpers
│   ├── App.jsx                 # Main app component
│   ├── Home.jsx                # Landing page
│   └── config.js               # API configuration
├── lambda/
│   ├── GetUploadUrlFunction/   # Generate S3 pre-signed URLs
│   ├── RecognitionFunction/    # OpenAI Vision API integration
│   └── HistoryFunction/        # Query DynamoDB history
└── screenshots/                # Demo images
```

---

## 🎯 Key Features Explained

### 1️⃣ Secure File Upload
- Pre-signed S3 URLs (15-min expiration)
- Direct browser-to-S3 transfer
- No file size limits
- Automatic virus scanning (optional)

### 2️⃣ AI Recognition
- OpenAI GPT-4 Vision API
- Custom prompts for species identification
- Returns: type, common name, scientific name, description, confidence
- 2-5 second response time

### 3️⃣ History Management
- DynamoDB partition key: `userId` (from Cognito)
- Sort key: `timestamp` (newest first)
- Pre-signed GET URLs for images (1-hour expiration)
- Pagination-ready (limit 10 per page)

### 4️⃣ Authentication Flow
```
User → Cognito Hosted UI → OAuth2 Code Flow → JWT Tokens
       ↓
API Gateway validates JWT → Extracts userId → Passes to Lambda
```

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| Image Upload | 2-5 seconds |
| AI Recognition | 2-5 seconds |
| History Load | 100-200ms |
| CloudFront Cache Hit | 20-50ms |
| Lambda Cold Start | 200-500ms |
| Lambda Warm Start | 5-50ms |

**Scalability:** Handles 1 to 1,000,000 users automatically

---

## 🔒 Security

- ✅ All S3 buckets are private
- ✅ Pre-signed URLs with expiration
- ✅ Least-privilege IAM roles
- ✅ HTTPS-only (enforced by CloudFront)
- ✅ JWT token validation on every request
- ✅ CORS configured properly
- ✅ No API keys exposed to frontend

---

## 📈 Future Enhancements

- [ ] Pagination for history (load more)
- [ ] Search & filter by species type
- [ ] Export history as CSV/PDF
- [ ] PWA with offline support
- [ ] Camera integration for mobile
- [ ] Multi-language support
- [ ] Social sharing features
- [ ] User favorites/collections
- [ ] Advanced analytics dashboard

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Diwanga Amasith**
- Email: diwangaamasith@gmail.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)


---

## 🙏 Acknowledgments

- OpenAI for Vision API
- AWS for serverless infrastructure
- React team for amazing framework
- All contributors and users

---

## 📚 Learn More

- [Medium Article: Building BioSnap](https://medium.com/@diwangaamasith/building-biosnap-a-serverless-ai-powered-species-recognition-app-on-aws-222c9313d9c7)
- [AWS Serverless Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [React Documentation](https://react.dev/)

---

## ⭐ Show Your Support

If you found this project helpful, please give it a star! ⭐

---

**Built with ❤️ using AWS Serverless**
