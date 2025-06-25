"use client"

import { useState, useEffect } from "react"

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
      return `# Account Brief for ${accountName}

## Account Snapshot – Status Quo & Financials

**Contoso Ltd.** is a global manufacturing leader specializing in IoT sensors with €2.8B revenue (2024). Recent expansion into AI R&D with new Munich hub signals strategic pivot toward intelligent manufacturing. Strong financial position with 15% YoY growth in industrial automation segment.

### Key Financial Metrics
- **Revenue:** €2.8B (2024)
- **Growth Rate:** 15% YoY
- **Focus Area:** Industrial automation and IoT

---

## Previous Deals & Installed Base

${includeClosedWon 
  ? `Previous Microsoft wins include **Azure IoT Suite** (€2.6M, Feb 2024) and **Power BI Premium** (€0.9M, Nov 2023). Installed base demonstrates commitment to Microsoft cloud ecosystem with focus on data analytics and IoT infrastructure.

### Recent Wins
- **Azure IoT Suite**: €2.6M (February 2024)
- **Power BI Premium**: €0.9M (November 2023)

### Technology Stack
- Microsoft Azure Cloud Platform
- Power BI Analytics
- IoT Infrastructure`
  : `No closed/won analysis included in this brief.`}

---

## Low-ACR Pipeline Deals

Two qualified deals with low ACR scores:

### Current Deals
- **Azure OpenAI** (DEAL-317, ACR: 0.12, Owner: Tobi)
- **Microsoft Fabric** (DEAL-322, ACR: 0.18, Owner: Max)

Both deals align with Contoso's AI transformation initiative announced in recent news.

---

## Upsell Synergies with High Potential

### Highest synergy potential:

1. **Azure OpenAI + Azure IoT Suite** 
   - **Fit Score:** 0.8
   - **Use Case:** Enable predictive maintenance with AI-powered insights

2. **Microsoft Fabric + Power BI Premium**
   - **Fit Score:** 0.75  
   - **Use Case:** Unified analytics platform for manufacturing data

> **Combined upsell potential:** €4.2M based on similar manufacturing accounts.

---

## 🎯 Ready-to-Send Storyline

Position Contoso's AI R&D expansion as the perfect catalyst for **Azure OpenAI** integration with their existing **Azure IoT Suite**. 

The Munich hub announcement proves executive commitment to AI transformation, making this the ideal time to propose **Microsoft Fabric** as the unified data foundation that extends their successful **Power BI Premium** deployment.

### Key Talking Points
- Leverage existing Azure investment
- AI-driven manufacturing insights
- Unified data platform strategy
- Proven ROI from current Microsoft solutions

---

*Generated by SELLY • More insights. More sales.*`
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

*Generated by SELLY • More insights. More sales.*`
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
        description: "Analyzing CRM data and product portfolio",
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
        name: "Research Agent",
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
        name: "Briefing Agent",
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

    const blob = new Blob([briefData.markdownReport], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `AccountBrief-${briefData.accountName.replace(/[^a-zA-Z0-9]/g, "-")}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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

  // Simple markdown to HTML converter
  const markdownToHtml = (markdown: string) => {
    let html = markdown
      // Headers
      .replace(/^# (.*$)/gim, `<h1 class="text-3xl font-bold mb-4 pb-2 border-b ${darkMode ? 'text-gray-100 border-gray-600' : 'text-gray-900 border-gray-300'}">$1</h1>`)
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 mt-6" style="color: #0078D4;">$1</h2>')
      .replace(/^### (.*$)/gim, `<h3 class="text-xl font-medium mb-2 mt-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}">$1</h3>`)
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold" style="color: #0078D4;">$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, `<em class="italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}">$1</em>`)
      // Horizontal rules
      .replace(/^---$/gim, `<hr class="my-6 ${darkMode ? 'border-gray-600' : 'border-gray-300'}" />`)
      // Blockquotes
      .replace(/^> (.*$)/gim, `<blockquote class="border-l-4 pl-4 py-2 my-4 italic ${darkMode ? 'bg-blue-900 text-gray-300' : 'bg-blue-50 text-gray-700'}" style="border-left-color: #0078D4;">$1</blockquote>`)
    
    // Handle lists
    const lines = html.split('\n')
    const processedLines = []
    let inList = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.match(/^- /)) {
        if (!inList) {
          processedLines.push(`<ul class="list-disc list-inside mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}">`)
          inList = true
        }
        processedLines.push(`<li class="mb-1">${line.replace(/^- /, '')}</li>`)
      } else if (line.match(/^\d+\. /)) {
        if (!inList) {
          processedLines.push(`<ol class="list-decimal list-inside mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}">`)
          inList = true
        }
        processedLines.push(`<li class="mb-1">${line.replace(/^\d+\. /, '')}</li>`)
      } else {
        if (inList) {
          processedLines.push('</ul>')
          inList = false
        }
        processedLines.push(line)
      }
    }
    
    if (inList) {
      processedLines.push('</ul>')
    }
    
    return processedLines
      .join('<br/>')
      // Clean up extra br tags after headers and block elements
      .replace(/(<\/h[1-6]>)<br\/>/g, '$1')
      .replace(/(<\/blockquote>)<br\/>/g, '$1')
      .replace(/(<hr[^>]*>)<br\/>/g, '$1')
      .replace(/(<\/ul>)<br\/>/g, '$1')
      .replace(/(<\/ol>)<br\/>/g, '$1')
      .replace(/(<ul[^>]*>)<br\/>/g, '$1')
      .replace(/(<ol[^>]*>)<br\/>/g, '$1')
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
              className="w-12 h-12 mr-3"
            />
            <h1 className={`text-4xl font-light ${darkMode ? 'text-white' : 'text-gray-800'}`}>SELLY</h1>
          </div>
          <h2 className={`text-xl font-light mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>More insights. More sales.</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Give enterprise sellers every critical insight about a target account in under ten seconds</p>
        </div>

        {/* Input Form */}
        <div className={`rounded-lg shadow-lg border p-8 mb-8 transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`} style={{ borderRadius: '8px' }}>
          <div className="mb-6">
            <h3 className={`text-2xl font-light mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Generate Account Brief</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Get snapshot, low-ACR pipeline, upsell synergies, and ready-to-send storyline</p>
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
                      className={`border-2 rounded-lg p-6 transition-all duration-500 ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } ${
                        agent.status === 'loading' ? 'border-blue-500 shadow-lg' :
                        agent.status === 'completed' ? 'border-green-500 shadow-md' :
                        darkMode ? 'border-gray-600' : 'border-gray-200'
                      }`}
                    >
                      {/* Agent Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{agent.icon}</div>
                          <div>
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
                      className={`border-2 border-green-500 rounded-lg p-6 shadow-md opacity-90 transition-colors duration-300 ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{agent.icon}</div>
                          <div>
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
                  New Brief
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
                  className="w-10 h-10 mr-4"
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
                  Download Brief
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
                <div 
                  className={`leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(briefData.markdownReport) }}
                />
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
          <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Powered by SELLY AI</p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>More insights. More sales.</p>
        </div>
      </div>
    </div>
  )
}
