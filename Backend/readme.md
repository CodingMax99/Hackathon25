# SELLY Backend - FastAPI with Azure AI Agents

This is the backend service for SELLY, an AI-powered account briefing tool that uses Azure AI Agents to generate comprehensive account insights for sales professionals.

## Features

- **Multi-Agent System**: Orchestrates CRM, Web Crawling, and Briefing agents
- **Azure AI Integration**: Uses Azure AI Agents for intelligent data processing
- **Document Processing**: Uploads and processes CRM documents using vector search
- **RESTful API**: FastAPI-based REST API with CORS support
- **Real-time Processing**: Streams agent execution progress

## Prerequisites

- Python 3.8 or higher
- Azure subscription with AI Services enabled
- Azure CLI (for authentication)
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Hackathon25/Backend
```

### 2. Create Virtual Environment

Create a Python virtual environment to isolate dependencies:

```bash
# Create virtual environment
python -m venv labenv

# Activate virtual environment
# On Windows:
labenv\Scripts\activate
# On macOS/Linux:
source labenv/bin/activate
```

### 3. Install Dependencies

Install the required Python packages:

```bash
pip install fastapi uvicorn python-dotenv azure-ai-agents azure-identity
```

Or if you have a requirements.txt file:

```bash
pip install -r requirements.txt
```

### 4. Azure Setup

#### 4.1 Azure Authentication

Authenticate with Azure CLI:

```bash
az login
```

#### 4.2 Create Azure AI Project

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new **Azure AI Studio** project
3. Note down your project details:
   - Resource name
   - Endpoint URL
   - Model deployment name

### 5. Environment Configuration

Create a `.env` file in the Backend directory and configure the following variables:

```env
# Azure AI Project Configuration
PROJECT_ENDPOINT="https://your-resource-name.openai.azure.com/"
MODEL_DEPLOYMENT_NAME="gpt-4o"
```

#### Environment Variables Explanation:

- **PROJECT_ENDPOINT**: Your Azure OpenAI resource endpoint
  - Format: `https://your-resource-name.openai.azure.com/`
  - Find this in Azure Portal → Your AI Resource → Keys and Endpoint
  
- **MODEL_DEPLOYMENT_NAME**: The name of your deployed model
  - Common values: `gpt-4o`, `gpt-4`, `gpt-35-turbo`
  - Find this in Azure AI Studio → Deployments
  
- **AGENT_ID**: Your specific agent ID (can be placeholder initially)
  - This will be created when you first run the application

### 6. Prepare CRM Document

Place your CRM database file in the `Resources` folder:

```
Backend/
├── Resources/
│   └── Database.pdf    # Your CRM data document
├── main.py
├── .env
└── README.md
```

The application expects a PDF file named `Database.pdf` containing your CRM data. This file will be uploaded to Azure and used for vector search by the CRM agent.

### 7. Start the Application

Run the FastAPI development server:

```
uvicorn main:app --reload --port 8000
```

The API will be available at:
- **API Base URL**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Generate Report
- **POST** `/generate_report`
- **Body**: `{ "company_name": "Company Name" }`
- **Response**: `{ "response": "Generated account brief in markdown format" }`

### Health Check
- **GET** `/health`
- **Response**: Application status and configuration info

## Project Structure

```
Backend/
├── main.py                 # Main FastAPI application
├── .env                    # Environment variables (create this)
├── .gitignore             # Git ignore file
├── README.md              # This file
├── Requirements/          # (optional) Requirements files
├── Resources/             # CRM documents
│   └── Database.pdf       # CRM database document
└── labenv/               # Virtual environment (created by setup)
```

## Agent Architecture

The system uses a multi-agent architecture:

1. **SellyCRM Agent**: Analyzes CRM data from uploaded documents
2. **SellyWebCrawler Agent**: Gathers web intelligence about companies
3. **SellyBriefing Agent**: Creates strategic recommendations
4. **SellyOrchestrator Agent**: Coordinates all agents and generates final output

## Troubleshooting

### Common Issues

#### 1. Azure Authentication Errors
```
ServiceRequestError: Bearer token authentication is not permitted for non-TLS protected URLs
```

**Solution**: 
- Ensure `PROJECT_ENDPOINT` uses HTTPS format
- Run `az login` to authenticate with Azure
- Verify your Azure subscription is active

#### 2. Agent Initialization Fails
```
Error during agent initialization
```

**Solution**:
- Check if `Resources/Database.pdf` exists
- Verify your model deployment name is correct
- Ensure you have proper Azure permissions

#### 3. CORS Errors from Frontend
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**:
- Frontend should run on `http://localhost:3000`
- Backend CORS is configured for this origin
- Check if both servers are running

#### 4. Import Errors
```
ModuleNotFoundError: No module named 'azure.ai.agents'
```

**Solution**:
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install azure-ai-agents`

### Environment Variables Validation

The application will log warnings if environment variables are not properly configured:

```bash
# Check if your configuration is correct
curl http://localhost:8000/health
```

### Debugging Mode

For detailed logging, modify the log level in `main.py`:

```python
logging.basicConfig(level=logging.DEBUG)
```

## Development

### Adding New Dependencies

```bash
# Install new package
pip install package-name

# Update requirements (optional)
pip freeze > requirements.txt
```

### Testing the API

Use the built-in FastAPI documentation at http://localhost:8000/docs to test endpoints interactively.

Or use curl:

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test report generation
curl -X POST http://localhost:8000/generate_report \
  -H "Content-Type: application/json" \
  -d '{"company_name": "Contoso Ltd."}'
```

## Security

- Never commit `.env` files to version control
- Use Azure Key Vault for production secrets
- Implement proper authentication for production use
- Regular security updates for dependencies


