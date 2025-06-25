"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface BriefData {
  accountName: string
  includeClosedWon: boolean
  briefContent: {
    accountSnapshot: string
    previousDeals: string
    openOpportunities: string
    productSynergies: string
    storyline: string
  }
}

export default function BriefPage() {
  const [briefData, setBriefData] = useState<BriefData | null>(null)
  const [copied, setCopied] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const accountName = sessionStorage.getItem("dealbrief-account")
    const includeClosedWon = sessionStorage.getItem("dealbrief-include-closed-won") === "true"

    if (!accountName) {
      router.push("/")
      return
    }

    // Generate mock brief content based on account name
    const briefContent = generateMockBrief(accountName, includeClosedWon)
    setBriefData({
      accountName,
      includeClosedWon,
      briefContent,
    })
  }, [router])

  const generateMockBrief = (accountName: string, includeClosedWon: boolean) => {
    const isContoso = accountName.toLowerCase().includes("contoso")

    if (isContoso) {
      return {
        accountSnapshot: `**Contoso Ltd.** is a global manufacturing leader specializing in IoT sensors with €2.8B revenue (2024). Recent expansion into AI R&D with new Munich hub signals strategic pivot toward intelligent manufacturing. Strong financial position with 15% YoY growth in industrial automation segment.`,

        previousDeals: includeClosedWon
          ? `Previous Microsoft wins include **Azure IoT Suite** (€2.6M, Feb 2024) and **Power BI Premium** (€0.9M, Nov 2023). Installed base demonstrates commitment to Microsoft cloud ecosystem with focus on data analytics and IoT infrastructure.`
          : `No closed/won analysis included in this brief.`,

        openOpportunities: `Two qualified opportunities with low ACR scores:\n• **Azure OpenAI** (OPP-317, ACR: 0.12, Owner: Tobi)\n• **Microsoft Fabric** (OPP-322, ACR: 0.18, Owner: Max)\n\nBoth opportunities align with Contoso's AI transformation initiative announced in recent news.`,

        productSynergies: `**Highest synergy potential:**\n1. **Azure OpenAI** + existing **Azure IoT Suite** (Fit Score: 0.8) - Enable predictive maintenance with AI-powered insights\n2. **Microsoft Fabric** + **Power BI Premium** (Fit Score: 0.75) - Unified analytics platform for manufacturing data\n\nCombined upsell potential: €4.2M based on similar manufacturing accounts.`,

        storyline: `Position Contoso's AI R&D expansion as the perfect catalyst for **Azure OpenAI** integration with their existing **Azure IoT Suite**. The Munich hub announcement proves executive commitment to AI transformation, making this the ideal time to propose **Microsoft Fabric** as the unified data foundation that extends their successful **Power BI Premium** deployment.`,
      }
    } else {
      return {
        accountSnapshot: `**${accountName}** is a mid-market enterprise with strong growth trajectory. Recent market activities suggest expansion into new technology areas with focus on digital transformation initiatives.`,

        previousDeals: includeClosedWon
          ? `Limited previous Microsoft engagement. Opportunity to establish strategic partnership with initial cloud adoption wins.`
          : `No closed/won analysis included in this brief.`,

        openOpportunities: `Potential opportunities identified based on industry trends and company profile. Recommend discovery calls to uncover specific business challenges and technology gaps.`,

        productSynergies: `**Recommended approach:**\n1. Start with foundational cloud services\n2. Build toward integrated Microsoft ecosystem\n3. Focus on business value and ROI demonstration\n\nEstimated opportunity size: €1-3M based on company profile.`,

        storyline: `Position Microsoft as the strategic technology partner for ${accountName}'s digital transformation journey. Focus on proven ROI and seamless integration capabilities to build long-term enterprise relationship.`,
      }
    }
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handleCopy = async () => {
    if (!briefData) return

    const briefText = `DealBrief for ${briefData.accountName}

ACCOUNT SNAPSHOT
${briefData.briefContent.accountSnapshot}

PREVIOUS DEALS & INSTALLED BASE
${briefData.briefContent.previousDeals}

OPEN OPPORTUNITIES WITH LOW ACR
${briefData.briefContent.openOpportunities}

PRODUCT SYNERGIES WITH HIGH UPSELL POTENTIAL
${briefData.briefContent.productSynergies}

STORYLINE FOR SELLER
${briefData.briefContent.storyline}`

    try {
      await navigator.clipboard.writeText(briefText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }

  const handleDownload = () => {
    if (!briefData) return

    const briefText = `DealBrief for ${briefData.accountName}

ACCOUNT SNAPSHOT
${briefData.briefContent.accountSnapshot}

PREVIOUS DEALS & INSTALLED BASE
${briefData.briefContent.previousDeals}

OPEN OPPORTUNITIES WITH LOW ACR
${briefData.briefContent.openOpportunities}

PRODUCT SYNERGIES WITH HIGH UPSELL POTENTIAL
${briefData.briefContent.productSynergies}

STORYLINE FOR SELLER
${briefData.briefContent.storyline}

Generated on: ${new Date().toLocaleDateString()}`

    const blob = new Blob([briefText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `DealBrief-${briefData.accountName.replace(/[^a-zA-Z0-9]/g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatContent = (content: string) => {
    return content.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0078d4;">$1</strong>').replace(/\n/g, "<br/>")
  }

  if (!briefData) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
        style={{ fontFamily: "Segoe UI, system-ui, sans-serif" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading brief...</p>
        </div>
      </div>
    )
  }

  const sections = [
    {
      id: "account-snapshot",
      title: "Account Snapshot – Status Quo & Financials",
      content: briefData.briefContent.accountSnapshot,
    },
    { id: "previous-deals", title: "Previous Deals & Installed Base", content: briefData.briefContent.previousDeals },
    {
      id: "open-opportunities",
      title: "Open Opportunities with Low ACR",
      content: briefData.briefContent.openOpportunities,
    },
    {
      id: "product-synergies",
      title: "Product Synergies with High Upsell Potential",
      content: briefData.briefContent.productSynergies,
    },
    { id: "storyline", title: "Storyline for Seller", content: briefData.briefContent.storyline },
  ]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      style={{ fontFamily: "Segoe UI, system-ui, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
                  Copy to Clipboard
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download .txt
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center mr-4">
              <span className="text-white font-bold">DB</span>
            </div>
            <div>
              <h1 className="text-3xl font-light text-gray-800">DealBrief for {briefData.accountName}</h1>
              <p className="text-gray-600">Strategic insights and synergy analysis generated by AI</p>
            </div>
          </div>

          {/* Accordion */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h2 className="text-lg font-medium text-gray-800">{section.title}</h2>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openSections.includes(section.id) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSections.includes(section.id) && (
                  <div className="px-6 pb-6">
                    <div
                      className={`p-4 rounded-md ${section.id === "storyline" ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50 border border-gray-200"}`}
                    >
                      <div
                        className="text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatContent(section.content) }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Generated by DealBrief AI • Strategic Alignment Copilot • Microsoft</p>
        </div>
      </div>
    </div>
  )
}
