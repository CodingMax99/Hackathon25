# SELLY Frontend - Next.js Application

This is the frontend application for SELLY, an AI-powered account briefing tool that provides enterprise sellers with critical insights about target accounts in under ten seconds.

## Features

- **Interactive Account Selection**: Dropdown with account names loaded from CSV data
- **Real-time Agent Visualization**: Watch AI agents process data with animated progress indicators
- **Dynamic Brief Generation**: Receive comprehensive account briefs in markdown format
- **CRM Data Inspection**: Click-to-view detailed CRM information for selected accounts
- **Export Capabilities**: Copy to clipboard and download as PDF
- **Dark/Light Mode**: Toggle between themes for better user experience
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technology Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF
- **HTTP Client**: Axios
- **Markdown Rendering**: react-markdown
- **Screenshot Capture**: html2canvas

## Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Hackathon25/Frontend
```

### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

## Development

### Start Development Server

Run the development server:

```bash
npm run dev
```

The application will be available at:
- **Frontend URL**: http://localhost:3000
- **Development Mode**: Hot reload enabled

### Build for Production

Create an optimized production build:

```bash
npm run build
```

This creates a `.next` folder with the production build.

### Start Production Server

After building, start the production server:

```bash
npm start
```


### Linting

Run ESLint to check code quality:

```bash
npm run lint
```


## Project Structure

```
Frontend/
├── app/                           # Next.js 13+ App Router
│   ├── page.tsx                   # Main application page
│   ├── layout.tsx                 # Root layout component
│   ├── globals.css               # Global CSS styles
│   └── briefing/                 # Additional pages (if any)
├── public/                        # Static assets
│   ├── data/                     # Data files
│   │   └── mock_crm_hackathon.csv
│   └── img/                      # Images
│       └── logoimg.png
├── components/                    # React components (if separated)
├── types/                        # TypeScript type definitions
├── utils/                        # Utility functions
├── package.json                  # Project dependencies
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                    # This file
```

## Key Components

### Main Application (`app/page.tsx`)
- **Account Selection**: Dropdown populated from CSV data
- **Agent Execution**: Visual representation of AI agents working
- **Brief Display**: Formatted markdown output with export options
- **CRM Modal**: Detailed account information overlay

### Features Overview

1. **Account Loading**: Automatically loads account names from CSV
2. **Agent Animation**: Shows 3 agents (CRM, Research, Briefing) with progress
3. **API Integration**: Calls FastAPI backend for account brief generation
4. **Export Options**: Copy text and PDF download functionality
5. **Theme Toggle**: Dark/light mode switching
6. **Error Handling**: Graceful fallback when backend is unavailable

## API Integration

The frontend communicates with the FastAPI backend running at localhost:8000
