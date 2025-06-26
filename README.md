# SELLY: More insights. More sales.

> A multi-agent copilot that delivers complete sales briefings in seconds by fusing internal CRM data with real-time market intelligence.

## The Problem

Enterprise sellers today face a critical challenge: **information silos**. They have access to rich internal CRM data and abundant external market signals, but no unified solution to create actionable insights that drive strategic sales decisions. This disconnect leads to missed opportunities, generic pitches, and suboptimal product recommendations.

## Our Solution

**SELLY** bridges the gap between internal data and external trends through an intelligent multi-agent system that:

- 🔍 **Analyzes CRM data** to understand existing customer relationships and low-ACR opportunities
- 🌐 **Crawls market intelligence** for recent news, financial data, and industry trends  
- 🧠 **Correlates insights** to identify the strongest Microsoft product synergies
- 📋 **Generates ready-to-send briefings** with strategic storylines backed by fresh evidence

## What SELLY Delivers (in <10 seconds)

✅ **Account Snapshot** - Status quo, key figures, and current Microsoft footprint  
✅ **Low-ACR Opportunities** - Pipeline deals worth reviving with highest potential  
✅ **Product Synergies** - Microsoft portfolio recommendations with upsell logic  
✅ **Ready-to-Send Storyline** - Persuasive narrative linking products to market signals  

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐
│   Web Crawler   │    │    CRM Agent     │
│     Agent       │    │                  │
│                 │    │                  │
│ • Latest News   │    │ • Opportunities  │
│ • Market Trends │    │ • ACR Scores     │
│ • Financials    │    │ • Deal History   │
└─────────┬───────┘    └────────┬─────────┘
          │                     │
          └──────┬──────────────┘
                 │
         ┌───────▼───────┐
         │   Research    │
         │    Agent      │
         │               │
         │ • Correlates  │
         │ • Scores      │
         │ • Prioritizes │
         └───────┬───────┘
                 │
         ┌───────▼───────┐
         │   Briefing    │
         │    Agent      │
         │               │
         │ • Structures  │
         │ • Formats     │
         │ • Finalizes   │
         └───────────────┘
```

## Technology Stack

### Backend (`/Backend`)
- **FastAPI** - REST API with Azure AI Agents integration
- **Azure AI Studio** - Multi-agent orchestration and AI capabilities
- **Python** - Core backend logic and agent coordination

### Frontend (`/Frontend`)  
- **Next.js 14** - React-based web application
- **TypeScript** - Type-safe frontend development
- **Tailwind CSS** - Modern, responsive UI design

## Quick Start

### Prerequisites
- Node.js 18+ and Python 3.8+
- Azure subscription with AI Studio access
- Azure CLI for authentication

### 1. Setup Backend
```bash
cd Backend
python -m venv labenv
labenv\Scripts\activate          # Windows
pip install -r requirements.txt
# Configure .env with Azure credentials
uvicorn main:app --reload --port 8000
```

### 2. Setup Frontend
```bash
cd Frontend
npm install
npm run dev
```

### 3. Access Application
- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs

## Project Structure

```
Hackathon25/
├── Backend/                 # FastAPI + Azure AI Agents
│   ├── main.py             # Agent orchestration logic
│   ├── Resources/          # CRM database files
│   └── README.md          # Backend setup instructions
├── Frontend/               # Next.js application
│   ├── app/page.tsx       # Main SELLY interface
│   ├── public/data/       # CSV data files
│   └── README.md         # Frontend setup instructions
└── README.md             # This file
```

## Key Features

### 🎯 Intelligent Agent Orchestration
- **Parallel Processing**: CRM and Web Crawler agents work simultaneously
- **Sequential Analysis**: Research and Briefing agents build on combined insights
- **Error Handling**: Graceful fallbacks when external services are unavailable

### 📊 Rich Data Integration
- **CRM Analysis**: Processes opportunity data, ACR scores, and deal history
- **Market Intelligence**: Real-time news, financial reports, and industry trends
- **Smart Correlation**: Links external signals to internal opportunities

### 🎨 Professional User Experience
- **Visual Agent Progress**: Watch AI agents work in real-time
- **Interactive CRM Explorer**: Click to view detailed account information
- **Export Options**: Copy text or download professional PDF reports
- **Dark/Light Themes**: Customizable interface for different preferences

## Business Value

### For Microsoft Sales Teams
- **Faster Prep Time**: Reduce account research from hours to seconds
- **Strategic Positioning**: Data-driven product recommendations
- **Higher Win Rates**: Leverage existing relationships and market timing
- **Consistent Messaging**: Structured, evidence-based storylines

### For Enterprise Customers  
- **Relevant Solutions**: Recommendations based on actual business context
- **Strategic Alignment**: Products that complement existing investments
- **Timely Proposals**: Offers aligned with current market opportunities

## Demo Scenarios

1. **Contoso Ltd.** - Manufacturing company with IoT focus
   - Identifies Azure OpenAI opportunity aligned with AI R&D expansion
   - Connects to existing Azure IoT Suite investment
   - Provides storyline linking Munich hub announcement to AI transformation

2. **Enterprise Accounts** - Various industries and company sizes
   - Analyzes low-ACR pipeline opportunities
   - Recommends complementary Microsoft products
   - Generates customized briefings based on company profile

## Getting Started

For detailed setup instructions, see:
- [Backend Setup Guide](./Backend/README.md)
- [Frontend Setup Guide](./Frontend/README.md)

## Contributing

This project was built by a cross-functional team during Microsoft Hackathon 2025. For questions or contributions, please refer to the individual component READMEs for technical details.

## Vision

SELLY transforms how enterprise sellers prepare for customer engagements by automatically surfacing the most strategically aligned product opportunities. Every recommendation is grounded in strategy, previous engagements, and concrete business upside.

**More insights. More sales.**