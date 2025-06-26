"use client"

import { useState, useEffect } from "react"
import jsPDF from 'jspdf'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BriefData {
  accountName: string
  includeClosedWon: boolean
  markdownReport: string
}

export default function HomePage() {
  const [accountName, setAccountName] = useState("")
  const [includeClosedWon, setIncludeClosedWon] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [briefData, setBriefData] = useState<BriefData | null>(null)
  const [copied, setCopied] = useState(false)
  const [accountNames, setAccountNames] = useState<string[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  
  // CRM Modal states
  const [showCrmModal, setShowCrmModal] = useState(false)
  const [crmData, setCrmData] = useState<any>(null)
  
  // Agent execution tracking
  const [currentAgentIndex, setCurrentAgentIndex] = useState<number>(-1)
  const [agentBoxes, setAgentBoxes] = useState<Array<{
    name: string
    description: string
    status: 'pending' | 'loading' | 'completed'
    currentTask: string
    icon: string
    tasks: string[]
  }>>([])
  const [agentTaskIndex, setAgentTaskIndex] = useState<number>(0)

  // Load account names from CSV file
  useEffect(() => {
    const loadAccountNames = async () => {
      try {
        const response = await fetch('/data/mock_crm_hackathon.csv')
        const csvText = await response.text()
        
        // Parse CSV manually (simple parsing for semicolon-separated values)
        const lines = csvText.split('\n').filter(line => line.trim())
        const headers = lines[0].split(';')
        
        // Find the Account_Name column index
        const accountNameIndex = headers.findIndex(header => 
          header.trim().toLowerCase() === 'account_name'
        )
        
        if (accountNameIndex !== -1) {
          const accounts = lines
            .slice(1) // Skip header row
            .map(line => {
              const columns = line.split(';')
              return columns[accountNameIndex]?.trim()
            })
            .filter(name => name && name.length > 0)
            .filter((name, index, arr) => arr.indexOf(name) === index) // Remove duplicates
            .sort()
          
          setAccountNames(accounts)
        } else {
          throw new Error('Account_Name column not found')
        }
      } catch (error) {
        console.error('Error loading account names from CSV:', error)
        // Fallback to some default accounts
        setAccountNames(['Contoso Ltd.', 'Fabrikam AG', 'Adventure Works', 'Northwind Traders', 'Wide World Importers'])
      } finally {
        setIsLoadingAccounts(false)
      }
    }

    loadAccountNames()
  }, [])

  const generateDummyMarkdownReport = (accountName: string, includeClosedWon: boolean) => {
    const isContoso = accountName.toLowerCase().includes("contoso")

    if (isContoso) {
      return `# Contoso – Account Report (June 2025)

## 1. Management Summary
Contoso is a leading German supplier to the automotive industry, generating an annual revenue of USD 4.6 billion and employing 7,500 people. The company is currently facing industry-wide layoffs, increasing production pressure, and intense competition from China.

## 2. Company Profile
| Metric | Value |
| --- | --- |
| **Account Name** | Contoso |
| **Short Description** | German supplier to the automotive industry |
| **Annual Revenue (USD million)** | 4,600 |
| **Employees** | 7,500 |

## 3. CRM Insights – What the Numbers Mean
Internal data positions Contoso as a **strategic account** yet reveals an imbalance in workload adoption: the company has already invested heavily in Azure-based IoT and analytics—closing more than €5 million in wins over the past 18 months—while **Azure AI workloads are still underperforming**. 
Two AI-focused deals (Azure OpenAI and Microsoft Fabric) sit early in the pipeline with very low ACR and a combined value of roughly €2 million, signalling quick-win potential once an AI use-case narrative resonates with the client. 
Given the robust Azure cloud and Power BI footprint, plus a recent interaction on 23 June 2025, Contoso is primed for an AI upsell that extends—not replaces—their existing stack.

## 4. Current Challenges (Web-Agent News Summary)

1. **Industry-wide layoffs** – Cost pressures are forcing reductions in personnel while retaining productivity.
2. **Rising supply chain challenges** – Supply shortages are leading to delays.
3. **Competition from China** – Aggressive pricing and shorter development cycles are putting Contoso under pressure.

## 5. Growth and Synergy Potential
| Challenge | Impact of AI Foundry (Agentic Systems) |
| --- | --- | 
| Workforce reduction | Agent-based automation of repetitive engineering & back-office processes | 
| Production pressure | AI-supported simulation & optimization of manufacturing parameters in real time | 
| Competitive pressure | Faster time to market through generative design agents |
| Supply chain delays | Intelligent production planning based on an agentic system |

## 6. Recommended Solution Architecture

Azure OpenAI Service provides scalable model capacities.
- **AI Foundry** orchestrates specialized agents (quality, planning, design).
- **Power BI & Fabric** visualize KPI progress for leadership.

## 7. Storyline – How to Approach the Client

1. **C-Level Visioning Workshop (CW 28)**
   Goal: Joint vision "Productivity 2030".
2. **Value Discovery & Use Case Scoring (CW 29–30)**
   Prioritize quick wins (e.g. quality agent, supply chain copilot).
3. **Pilot "Smart Factory Agents" (Q3 / CY 2025)**
   6-week PoC at Plant 3, KPI: OEE +5%.
4. **Roll-out & Change Enablement (Q4 / CY 2025)**
   Scale across all plants, define workforce up/reskilling paths.
5. **Joint Success Plan (FY 2026)**
   Continuous KPI monitoring and upsell roadmap (Data Fabric, Security).

## 8. Next Steps
| Date | Activity | Responsible |
| --- | --- | --- |
| 03 July 2025 | Preparation Visioning Workshop | Account Team |
| 10 July 2025 | Visioning Workshop in Stuttgart | Contoso CxO & Account Team |
| 15 July 2025 | Sign-off Use Case Backlog & PoC Scope | Contoso COO |
| 05 Aug 2025 | Kick-off Pilot "Smart Factory Agents" | Joint PMO |

---

*Generated by Selly • More insights. More sales.*`
    } else {
      return `# Account Brief for ${accountName}

## Account Snapshot – Status Quo & Financials

**${accountName}** is a mid-market enterprise with strong growth trajectory. Recent market activities suggest expansion into new technology areas with focus on digital transformation initiatives.

---

## Previous Deals & Installed Base

${includeClosedWon 
  ? `Limited previous Microsoft engagement. Deal to establish strategic partnership with initial cloud adoption wins.

### Deal Areas
- Cloud infrastructure adoption
- Productivity solutions
- Data analytics platform`
  : `No closed/won analysis included in this brief.`}

---

## Low-ACR Pipeline Deals

Potential deals identified based on industry trends and company profile. Recommend discovery calls to uncover specific business challenges and technology gaps.

### Recommended Discovery Areas
- Current technology stack assessment
- Digital transformation roadmap
- Budget and timeline evaluation

---

## Upsell Synergies with High Potential

### Recommended approach:

1. **Start with foundational cloud services**
2. **Build toward integrated Microsoft ecosystem**
3. **Focus on business value and ROI demonstration**

> **Estimated deal size:** €1-3M based on company profile.

---

## 🎯 Ready-to-Send Storyline

Position Microsoft as the strategic technology partner for ${accountName}'s digital transformation journey. Focus on proven ROI and seamless integration capabilities to build long-term enterprise relationship.

### Key Strategy
- Establish foundational partnership
- Demonstrate quick wins
- Build toward comprehensive solution

---

*Generated by Selly • More Insights. More Sales.*`
    }
  }

  const handleGenerate = async () => {
    if (!accountName.trim()) return

    setIsGenerating(true)
    setProgress(0)
    setBriefData(null)
    setCurrentAgentIndex(-1)
    setAgentTaskIndex(0)

    // Define the 3 agent boxes
    const agents = [
      {
        name: "CRM Agent",
        description: "Analyzing CRM data and portfolio",
        status: 'pending' as const,
        currentTask: "",
        icon: "🔍",
        tasks: [
          "Connecting to CRM database...",
          "Analyzing account history...",
          "Extracting opportunity insights...",
          "Mapping product portfolio...",
          "Identifying cross-sell patterns...",
          "CRM analysis complete"
        ]
      },
      {
        name: "Web Agent",
        description: "Crawling web for market intelligence",
        status: 'pending' as const,
        currentTask: "",
        icon: "🌐",
        tasks: [
          "Searching recent news articles...",
          "Analyzing industry trends...",
          "Monitoring competitor activities...",
          "Gathering market insights...",
          "Correlating external signals...",
          "Research complete"
        ]
      },
      {
        name: "Analyst Agent",
        description: "Generating strategic account brief",
        status: 'pending' as const,
        currentTask: "",
        icon: "📋",
        tasks: [
          "Synthesizing CRM insights...",
          "Integrating market intelligence...",
          "Crafting strategic narrative...",
          "Generating recommendations...",
          "Finalizing account brief...",
          "Brief generation complete"
        ]
      }
    ]

    // Initialize agent boxes
    setAgentBoxes(agents)

    // Process each agent sequentially
    for (let i = 0; i < agents.length; i++) {
      setCurrentAgentIndex(i)
      
      // Mark current agent as loading
      setAgentBoxes(prev => prev.map((agent, index) => 
        index === i ? { ...agent, status: 'loading' } : agent
      ))

      // Process each task for the current agent
      for (let j = 0; j < agents[i].tasks.length; j++) {
        setAgentTaskIndex(j)
        
        // Update current task
        setAgentBoxes(prev => prev.map((agent, index) => 
          index === i ? { ...agent, currentTask: agents[i].tasks[j] } : agent
        ))

        // Wait for task duration (varying times for realism)
        const taskDuration = j === agents[i].tasks.length - 1 ? 800 : 600 + Math.random() * 400
        await new Promise(resolve => setTimeout(resolve, taskDuration))
        
        // Update overall progress
        const totalTasks = agents.reduce((sum, agent) => sum + agent.tasks.length, 0)
        const completedTasks = i * agents[0].tasks.length + j + 1
        setProgress((completedTasks / totalTasks) * 100)
      }

      // Mark agent as completed
      setAgentBoxes(prev => prev.map((agent, index) => 
        index === i ? { ...agent, status: 'completed', currentTask: agents[i].tasks[agents[i].tasks.length - 1] } : agent
      ))
    }

    // Generate dummy markdown report
    const markdownReport = generateDummyMarkdownReport(accountName, includeClosedWon)
    setBriefData({
      accountName,
      includeClosedWon,
      markdownReport,
    })

    setCurrentAgentIndex(-1)
    setIsGenerating(false)
    setProgress(0)
  }

  const handleCopy = async () => {
    if (!briefData) return

    try {
      await navigator.clipboard.writeText(briefData.markdownReport)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }

  const handleDownload = () => {
    if (!briefData) return

    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    let currentY = margin

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number, isBold: boolean = false, color: string = '#000000') => {
      pdf.setFontSize(fontSize)
      pdf.setFont("helvetica", isBold ? "bold" : "normal")
      
      // Convert hex color to RGB
      if (color === '#0078D4') {
        pdf.setTextColor(0, 120, 212)
      } else {
        pdf.setTextColor(0, 0, 0)
      }
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin)
      
      // Check if we need a new page
      if (currentY + (lines.length * fontSize * 0.4) > pageHeight - margin) {
        pdf.addPage()
        currentY = margin
      }
      
      pdf.text(lines, margin, currentY)
      currentY += lines.length * fontSize * 0.4 + 5
    }

    // Helper function to add a line break
    const addLineBreak = (space: number = 10) => {
      currentY += space
    }

    // Header with logo area
    pdf.setFillColor(240, 240, 240)
    pdf.rect(0, 0, pageWidth, 40, 'F')
    
    pdf.setFontSize(24)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(0, 120, 212)
    pdf.text("Selly", margin, 25)
    
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(100, 100, 100)
    pdf.text("More Insights. More Sales.", margin + 50, 25)
    
    currentY = 50

    // Parse and format the markdown content
    const content = briefData.markdownReport
    const lines = content.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (!line) {
        addLineBreak(5)
        continue
      }
      
      // Handle headers
      if (line.startsWith('# ')) {
        addLineBreak(10)
        addText(line.substring(2), 20, true, '#0078D4')
        addLineBreak(5)
      } else if (line.startsWith('## ')) {
        addLineBreak(8)
        addText(line.substring(3), 16, true, '#0078D4')
        addLineBreak(5)
      } else if (line.startsWith('### ')) {
        addLineBreak(6)
        addText(line.substring(4), 14, true)
        addLineBreak(3)
      } else if (line.startsWith('---')) {
        // Horizontal rule
        addLineBreak(5)
        pdf.setDrawColor(200, 200, 200)
        pdf.line(margin, currentY, pageWidth - margin, currentY)
        addLineBreak(5)
      } else if (line.startsWith('> ')) {
        // Blockquote
        addLineBreak(3)
        pdf.setFillColor(240, 248, 255)
        const quoteText = line.substring(2)
        const quoteLines = pdf.splitTextToSize(quoteText, pageWidth - 2 * margin - 20)
        const quoteHeight = quoteLines.length * 12 * 0.4 + 10
        
        pdf.rect(margin, currentY - 5, pageWidth - 2 * margin, quoteHeight, 'F')
        pdf.setDrawColor(0, 120, 212)
        pdf.line(margin + 5, currentY - 5, margin + 5, currentY + quoteHeight - 5)
        
        pdf.setFontSize(12)
        pdf.setFont("helvetica", "italic")
        pdf.setTextColor(70, 70, 70)
        pdf.text(quoteLines, margin + 15, currentY)
        currentY += quoteHeight
      } else if (line.startsWith('- ')) {
        // Bullet point
        const bulletText = line.substring(2)
        pdf.setFontSize(11)
        pdf.setFont("helvetica", "normal")
        pdf.setTextColor(0, 0, 0)
        
        // Add bullet
        pdf.text('•', margin + 5, currentY)
        
        // Add text with proper indentation
        const bulletLines = pdf.splitTextToSize(bulletText, pageWidth - 2 * margin - 15)
        pdf.text(bulletLines, margin + 15, currentY)
        currentY += bulletLines.length * 11 * 0.4 + 3
      } else if (line.includes('**') && line.includes('**')) {
        // Handle bold text in regular paragraphs
        let processedLine = line
        let fontSize = 11
        
        // Simple bold text processing (this is a basic implementation)
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '$1')
        addText(processedLine, fontSize, false)
      } else if (line.trim().length > 0) {
        // Regular paragraph
        addText(line, 11, false)
      }
    }

    // Footer
    pdf.setFontSize(8)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(150, 150, 150)
    pdf.text("Generated by Selly • More Insights. More Sales.", margin, pageHeight - 15)
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - margin - 60, pageHeight - 15)

    // Save the PDF
    pdf.save(`AccountBrief-${briefData.accountName.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`)
  }

  const handleReset = () => {
    setAccountName("")
    setIncludeClosedWon(true)
    setBriefData(null)
    setCopied(false)
    setCurrentAgentIndex(-1)
    setAgentBoxes([])
    setAgentTaskIndex(0)
  }

  // Load CRM data from CSV for the selected account
  const handleInspectCrm = async () => {
    if (!accountName) return

    try {
      const response = await fetch('/data/mock_crm_hackathon.csv')
      const csvText = await response.text()
      
      // Parse CSV manually (simple parsing for semicolon-separated values)
      const lines = csvText.split('\n').filter(line => line.trim())
      const headers = lines[0].split(';')
      
      // Filter opportunities for the selected account
      const accountOpportunities = lines
        .slice(1) // Skip header row
        .map(line => {
          const columns = line.split(';')
          const opportunity: any = {}
          headers.forEach((header, index) => {
            opportunity[header.trim()] = columns[index]?.trim() || ''
          })
          return opportunity
        })
        .filter(opp => opp.Account_Name === accountName)

      if (accountOpportunities.length > 0) {
        // Extract account information from first opportunity (all should have same account data)
        const firstOpp = accountOpportunities[0]
        
        // Separate active and closed opportunities
        const activeOpportunities = accountOpportunities.filter(opp => opp.Is_Open === 'TRUE')
        const closedOpportunities = accountOpportunities.filter(opp => opp.Is_Open === 'FALSE')
        
        const crmData = {
          accountInfo: {
            name: firstOpp.Account_Name,
            industry: firstOpp.Industry,
            revenue: `$${firstOpp.Annual_Revenue_MUSD}M USD`,
            employees: firstOpp.Employees,
            accountManager: firstOpp.Account_Manager,
            region: firstOpp.Region
          },
          contacts: firstOpp.Main_Contacts.split(';').map((contact: string) => contact.trim()),
          activeOpportunities,
          closedOpportunities
        }
        
        setCrmData(crmData)
        setShowCrmModal(true)
      }
    } catch (error) {
      console.error('Error loading CRM data:', error)
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
      style={{ fontFamily: "'Segoe UI Semibold', 'Segoe UI', system-ui, sans-serif", fontWeight: 600 }}
    >
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Dark Mode Toggle */}
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                : 'bg-white hover:bg-gray-50 text-gray-600 shadow-lg'
            }`}
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <img    
              src="/img/logoimg.png" 
              alt="SELLY Logo" 
              className="w-20 h-20 mr-3"
            />
            <h1 className={`text-4xl font-light ${darkMode ? 'text-white' : 'text-gray-800'}`}>Selly</h1>
          </div>
          <h2 className={`text-xl font-light mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>More Insights. More Sales.</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Give enterprise sellers critical insight about leads in seconds</p>
        </div>

        {/* Input Form */}
        <div className={`rounded-lg shadow-lg border p-8 mb-8 transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`} style={{ borderRadius: '8px' }}>
          <div className="mb-6">
            <h3 className={`text-2xl font-light mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Generate Account Briefing</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Selly instantly transforms market news and CRM insights into actionable sales opportunities and compelling storylines.</p>
          </div>

          <div className="space-y-6">
            {/* Account Name Dropdown */}
            <div>
              <label htmlFor="account-name" className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Account Name *
              </label>  
              {isLoadingAccounts ? (
                <div className={`w-full px-4 py-3 border rounded flex items-center transition-colors duration-300 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-gray-300' 
                    : 'border-gray-300 bg-gray-100 text-gray-500'
                }`} 
                     style={{ borderRadius: '8px' }}>
                  <div className={`animate-spin rounded-full h-4 w-4 border-b-2 mr-2 ${
                    darkMode ? 'border-gray-400' : 'border-gray-400'
                  }`}></div>
                  <span>Loading accounts...</span>
                </div>
              ) : (
                <select
                  id="account-name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  disabled={isGenerating}
                  className={`w-full px-4 py-3 border focus:ring-2 focus:border-blue-500 disabled:cursor-not-allowed transition-colors duration-300 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white disabled:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-900 disabled:bg-gray-100'
                  }`}
                  style={{ borderRadius: '8px' }}
                >
                  <option value="">Select an account...</option>
                  {accountNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Checkbox */}
            <div className="flex items-center">
              <input
                id="include-closed-won"
                type="checkbox"
                checked={includeClosedWon}
                onChange={(e) => setIncludeClosedWon(e.target.checked)}
                disabled={isGenerating}
                className="h-4 w-4 focus:ring-2 border-gray-300 rounded disabled:cursor-not-allowed"
                style={{ accentColor: '#0078D4' }}
              />
              <label htmlFor="include-closed-won" className={`ml-3 text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Include closed/won analysis
              </label>
            </div>

            {/* Agent Execution Display */}
            {isGenerating && (
              <div className="space-y-6">
                {/* Overall Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Generating account brief...
                    </span>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{Math.round(progress)}%</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Three Agent Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {agentBoxes.map((agent, index) => (
                    <div 
                      key={index} 
                      className={`border-2 rounded-lg p-6 transition-all duration-500 relative ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } ${
                        agent.status === 'loading' ? 'border-blue-500 shadow-lg' :
                        agent.status === 'completed' ? 'border-green-500 shadow-md' :
                        darkMode ? 'border-gray-600' : 'border-gray-200'
                      } ${
                        agent.name === "CRM Agent" && accountName 
                          ? `cursor-pointer hover:shadow-lg ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} group` 
                          : ''
                      }`}
                      onClick={agent.name === "CRM Agent" && accountName ? handleInspectCrm : undefined}
                      title={agent.name === "CRM Agent" && accountName ? "Click to inspect CRM data" : undefined}
                    >
                      {/* Hover tooltip for CRM Agent */}
                      {agent.name === "CRM Agent" && accountName && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          Click to inspect CRM data
                        </div>
                      )}
                      
                      {/* Agent Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-2xl">{agent.icon}</div>
                          <div className="flex-1">
                            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{agent.name}</h4>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{agent.description}</p>
                          </div>
                        </div>
                        
                        {/* Status Indicator */}
                        <div className="flex-shrink-0">
                          {agent.status === 'pending' && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}>
                              <div className={`w-3 h-3 rounded-full ${
                                darkMode ? 'bg-gray-500' : 'bg-gray-400'
                              }`}></div>
                            </div>
                          )}
                          {agent.status === 'loading' && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              darkMode ? 'bg-blue-900' : 'bg-blue-100'
                            }`}>
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                          {agent.status === 'completed' && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              darkMode ? 'bg-green-900' : 'bg-green-100'
                            }`}>
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Current Task */}
                      <div className="min-h-[60px] flex items-center">
                        {agent.currentTask && (
                          <div className={`text-sm transition-all duration-300 ${
                            agent.status === 'loading' ? 'text-blue-600 font-medium' :
                            agent.status === 'completed' ? 'text-green-600 font-medium' :
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {agent.currentTask}
                          </div>
                        )}
                        {!agent.currentTask && agent.status === 'pending' && (
                          <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Waiting to start...</div>
                        )}
                      </div>

                      {/* Progress Dots for Current Agent */}
                      {agent.status !== 'pending' && (
                        <div className="flex gap-1 mt-4">
                          {agent.tasks.map((_, taskIndex) => (
                            <div
                              key={taskIndex}
                              className={`h-1 flex-1 rounded transition-all duration-300 ${
                                agent.status === 'completed' ? 'bg-green-500' :
                                (currentAgentIndex === index && taskIndex <= agentTaskIndex) ? 'bg-blue-500' :
                                darkMode ? 'bg-gray-600' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show completed agent boxes even after generation */}
            {!isGenerating && agentBoxes.length > 0 && (
              <div className="space-y-4">
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>✅ Agent Analysis Complete</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {agentBoxes.map((agent, index) => (
                    <div 
                      key={index} 
                      className={`border-2 border-green-500 rounded-lg p-6 shadow-md opacity-90 transition-colors duration-300 relative ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } ${
                        agent.name === "CRM Agent" && accountName 
                          ? `cursor-pointer hover:shadow-xl ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} group` 
                          : ''
                      }`}
                      onClick={agent.name === "CRM Agent" && accountName ? handleInspectCrm : undefined}
                      title={agent.name === "CRM Agent" && accountName ? "Click to inspect CRM data" : undefined}
                    >
                      {/* Hover tooltip for CRM Agent */}
                      {agent.name === "CRM Agent" && accountName && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          Click to inspect CRM data
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-2xl">{agent.icon}</div>
                          <div className="flex-1">
                            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{agent.name}</h4>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{agent.description}</p>
                          </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-green-900' : 'bg-green-100'
                        }`}>
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        {agent.currentTask}
                      </div>
                      <div className="flex gap-1 mt-4">
                        {agent.tasks.map((_, taskIndex) => (
                          <div
                            key={taskIndex}
                            className="h-1 flex-1 rounded bg-green-500"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={!accountName.trim() || isGenerating}
                className="flex-1 hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 transition-colors duration-200 flex items-center justify-center"
                style={{ backgroundColor: '#0078D4', borderRadius: '8px' }}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                    Generating Brief...
                  </>
                ) : (
                  <>
                    Generate Brief
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
              
              {briefData && (
                <button
                  onClick={handleReset}
                  className={`px-6 py-4 border rounded-md hover:opacity-90 transition-colors ${
                    darkMode 
                      ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                  style={{ borderRadius: '8px' }}
                >
                    Reset  
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Brief Results */}
        {briefData && (
          <div className={`rounded-lg shadow-lg border p-8 transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`} style={{ borderRadius: '8px' }}>
            {/* Brief Header with Actions */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <img 
                  src="/img/logoimg.png" 
                  alt="SELLY Logo" 
                  className="w-12 h-12 mr-4"
                />
                <div>
                  <h2 className={`text-3xl font-light ${darkMode ? 'text-white' : 'text-gray-800'}`}>Account Brief Generated</h2>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Critical insights for your target account</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className={`flex items-center px-4 py-2 border rounded-md hover:opacity-90 transition-colors ${
                    darkMode 
                      ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy Brief
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className={`flex items-center px-4 py-2 border rounded-md hover:opacity-90 transition-colors ${
                    darkMode 
                      ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                  style={{ borderRadius: '8px' }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>

            {/* Account Brief Display */}
            <div className={`border rounded-lg p-6 transition-colors duration-300 ${
              darkMode 
                ? 'border-gray-600 bg-gray-700' 
                : 'border-gray-200 bg-gray-50'
            }`} style={{ borderRadius: '8px' }}>
              <div className="prose prose-gray max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  className={`leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                  components={{
                    h1: ({node, ...props}) => <h1 className={`text-3xl font-bold mb-4 pb-2 border-b ${darkMode ? 'text-gray-100 border-gray-600' : 'text-gray-900 border-gray-300'}`} {...props} />,
                    h2: ({node, ...props}) => <h2 className={`text-2xl font-semibold mb-3 mt-6 ${darkMode ? '' : 'text-blue-600'}`} style={darkMode ? {color: '#b3daf0'} : {}} {...props} />,
                    h3: ({node, ...props}) => <h3 className={`text-xl font-medium mb-2 mt-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`} {...props} />,
                    strong: ({node, ...props}) => <strong className={`font-semibold ${darkMode ? '' : 'text-blue-600'}`} style={darkMode ? {color: '#b3daf0'} : {}} {...props} />,
                    table: ({node, ...props}) => <table className={`w-full border-collapse border ${darkMode ? 'border-gray-600' : 'border-gray-300'} mb-4 mt-2`} {...props} />,
                    th: ({node, ...props}) => <th className={`border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-gray-50 text-gray-900'} px-3 py-2 text-left font-semibold`} {...props} />,
                    td: ({node, ...props}) => <td className={`border ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'} px-3 py-2`} {...props} />,
                    ul: ({node, ...props}) => <ul className={`list-disc list-inside mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} {...props} />,
                    ol: ({node, ...props}) => <ol className={`list-decimal list-inside mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    hr: ({node, ...props}) => <hr className={`my-6 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`} {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className={`border-l-4 pl-4 py-2 my-4 italic border-blue-600 ${darkMode ? 'bg-blue-900 text-gray-300' : 'bg-blue-50 text-gray-700'}`} {...props} />,
                    em: ({node, ...props}) => <em className={`italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} {...props} />
                  }}
                >
                  {briefData.markdownReport}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* CRM Data Modal */}
        {showCrmModal && crmData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-6 border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  CRM Data for {crmData.accountInfo.name}
                </h3>
                <button
                  onClick={() => setShowCrmModal(false)}
                  className={`p-2 rounded-md transition-colors ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  
                  {/* Account Information */}
                  <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Account Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Industry:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {crmData.accountInfo.industry}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revenue:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {crmData.accountInfo.revenue}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Employees:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {crmData.accountInfo.employees}
                        </span>
                      </div>
                    
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Account Manager:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {crmData.accountInfo.accountManager}
                        </span>
                      </div>
                     
                    </div>
                  </div>

                  {/* Key Contacts */}
                  <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Key Contacts</h4>
                    <div className="space-y-2">
                      {crmData.contacts.map((contact: string, index: number) => (
                        <div key={index} className={`p-2 rounded border ${
                          darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                        }`}>
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {contact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


                {/* Active Opportunities */}
                {crmData.activeOpportunities.length > 0 && (
                  <div className={`rounded-lg p-4 mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Active Pipeline ({crmData.activeOpportunities.length} opportunities)
                    </h4>
                    <div className="space-y-3">
                      {crmData.activeOpportunities.map((opp: any, index: number) => (
                        <div key={index} className={`p-3 rounded border ${
                          darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                        }`}>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {opp.Product}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {opp.Opportunity_ID} | {opp.Product_Category}
                              </div>
                            </div>
                            <div>
                              <div className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                ${parseInt(opp.ACV_USD).toLocaleString()}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                ACR: {opp.ACR}
                              </div>
                            </div>
                            <div>
                              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {opp.Stage}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Probability: {(parseFloat(opp.Probability) * 100).toFixed(0)}%
                              </div>
                            </div>
                            <div>
                              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {opp.Owner}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Synergy: {(parseFloat(opp.Synergy_Fit_Score) * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Closed Won Opportunities */}
                {crmData.closedOpportunities.length > 0 && (
                  <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Previous Wins ({crmData.closedOpportunities.length} opportunities)
                    </h4>
                    <div className="space-y-3">
                      {crmData.closedOpportunities.map((opp: any, index: number) => (
                        <div key={index} className={`p-3 rounded border ${
                          darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                        }`}>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {opp.Product}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {opp.Opportunity_ID} | {opp.Product_Category}
                              </div>
                            </div>
                            <div>
                              <div className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                ${parseInt(opp.ACV_USD).toLocaleString()}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                ACR: {opp.ACR}
                              </div>
                            </div>
                            <div>
                              <div className={`text-sm text-green-600`}>
                                {opp.Stage}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Closed: {opp.Close_Date}
                              </div>
                            </div>
                            <div>
                              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {opp.Owner}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Synergy: {(parseFloat(opp.Synergy_Fit_Score) * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`mt-8 text-center backdrop-blur-sm rounded-lg border p-4 transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700' 
            : 'bg-white/60 border-gray-200'
        }`} style={{ borderRadius: '8px' }}>
          <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Powered by Selly AI</p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>More Insights. More Sales.</p>
        </div>
      </div>
    </div>
  )
}
