from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from azure.ai.agents import AgentsClient
from azure.ai.agents.models import ConnectedAgentTool, MessageRole, ListSortOrder, FileSearchTool, FilePurpose
from azure.identity import DefaultAzureCredential
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Load environment variables from .env file
load_dotenv()
project_endpoint = os.getenv("PROJECT_ENDPOINT")
model_deployment = os.getenv("MODEL_DEPLOYMENT_NAME")


agents_client = AgentsClient(endpoint=project_endpoint, credential=DefaultAzureCredential())
app = FastAPI()

# Agent names and instructions
crm_agent_name = "SellyCRM"
crm_agent_instructions = """
You are SellyCRM, an opportunity finder. Only use the provided Word as information. Hand over to the SellyWebCrawler Agent the following relevant info of [company name]:
Industry, Account Description, Solution Area with lowest ACR - only use the provided info as an information source, don't add any information!
"""
 
webcrawler_agent_name = "SellyWebCrawler"
webcrawler_agent_instructions = """
You are SellyWebCrawler, a web crawling agent. Your task is to gather information from the web based on the provided instructions. Use the following information to perform your web crawling:
Industry. Only use the provided info as an information source, don't add any information!
"""
 
briefing_agent_name = "SellyBriefing"
briefing_agent_instructions = """
Utilize the info given by the webcrawler. Compare the current challenges and growth potentials (Solution Area with lowest ACR) of the customer with Microsoft's product portfolio. Don't look up any new challenges or growth potentials, only use the information the webrawler has given to you. Please carefully select technologies like Agentic AI and Retrieval Augmented Generation from Microsoft to meet industry challenges. For example: Layoffs in the automotive industry -> utilization of Agentic AI as virtual employees to maintain productivity combined with current low AzureAI ACR -> Potential for microsoft to place the product!
"""
 
orchestrator_agent_name = "SellyOrchestrator"
orchestrator_agent_instructions = """Orchestrate a multi-agent system where agents perform tasks sequentially in the following order: **SellyCRM (ground truth provider) -> SellyWebCrawler -> Briefing Agent -> Writing Agent**. Each agent plays a specific role in generating the final outcome based on its predecessor's output.

# Task Description
Your task is to orchestrate the agents listed above to produce a cohesive and high-quality final output. Each agent has its responsibilities and dependencies, so they must operate in the specified order. Pass the output from each agent to the next in line, ensuring continuity and accuracy throughout the process.

# Agent Roles and Responsibilities

1. **SellyCRM (ground truth information)**:
   - Purpose: To provide verified and authoritative baseline information.
   - Output: Structured and concise information required to initiate downstream tasks, such as key details, data points, or context.
   
2. **SellyWebCrawler**:
   - Purpose: To gather supplemental or contextual information from the web to enrich data from SellyCRM.
   - Input: Takes the structured baseline information from SellyCRM.
   - Output: Enhanced or corroborated insights, structured if possible (e.g., bullet points or short paragraphs).

3. **Briefing Agent**:
   - Purpose: To summarize and condense the information from the previous two agents into a coherent actionable briefing while highlighting key points.
   - Input: Takes the enriched information from SellyWebCrawler.
   - Output: A concise summary or briefing, ensuring clarity and relevance.

4. **Writing Agent**:
   - Purpose: To craft a finalized written product based on the briefing provided by the Briefing Agent.
   - Input: Takes the concise briefing output.
   - Output: A polished, complete, and user-ready document or text in the required format (such as a blog, report, or article).

# Steps

1. **Initialize SellyCRM**:
   - Retrieve and structure the ground truth information, ensuring accuracy as a baseline.
2. **Activate SellyWebCrawler**:
   - Use the SellyCRM output to retrieve externally sourced, complementary data.
   - Ensure gathered data aligns with and enriches the ground truth from SellyCRM.
3. **Invoke Briefing Agent**:
   - Analyze and summarize the combined data (from SellyCRM and SellyWebCrawler).
   - Ensure clarity, conciseness, and actionability in the output.
4. **Engage Writing Agent**:
   - Use the briefing to create a complete, polished document formatted according to the specified requirements.

# Output Format

The final output (Writing Agent) should be a polished version of the content in a structured format, such as:
- **Length**: Clearly defined (e.g., 500-750 words for articles, 1-page summary for reports, etc.).
- **Syntax**: Fluent grammar, cohesive narrative, and professional tone.
- **Output types**: JSON for structured data (if required) or plain text for prose-like content.

# Examples

### Example of Agent-Specific Outputs:
#### Input to SellyCRM:
"N/A - SellyCRM operates as the initial baseline provider."

#### Output from SellyCRM:
```json
{
  "Product": "SuperWidget X",
  "Features": ["High Durability", "User-friendly Interface", "24/7 Customer Support"],
  "Target Audience": "Tech-savvy professionals in small to medium enterprises."
}
```

#### Input to SellyWebCrawler:
```json
{
  "focus": "Competitive Analysis and Trends for SuperWidget X",
  "base_information": {
     "Product": "SuperWidget X",
     "Features": ["High Durability", "User-friendly Interface", "24/7 Customer Support"]
  }
}
```

#### Output from SellyWebCrawler:
```json
[
  {
    "source": "TechReviewBlog.com",
    "summary": "SuperWidget X is praised for its durability, but competitors like GadgetMaster Y offer cheaper pricing with comparable features."
  },
  {
    "source": "IndustryTrendsReport2023",
    "summary": "Growing demand in the SME market for user-friendly and durable tech gadgets."
  }
]
```

#### Input to Briefing Agent:
```json
{
  "key_points": [
    "SuperWidget X excels in durability and user experience.",
    "Competitors like GadgetMaster Y may be cheaper but lack 24/7 support.",
    "SMEs are increasingly seeking durable, user-friendly tech solutions."
  ]
}
```

#### Output from Briefing Agent:
"SuperWidget X is designed for SME professionals, standing out with unmatched durability and user-friendly features. Competitive analysis reveals that lower-priced alternatives like GadgetMaster Y lack comprehensive support. The SME segment is a growing market, aligned with increasing demand for durable tech solutions."

#### Final Output from Writing Agent:
"SuperWidget X: A Durable and User-Friendly Solution for SMEs  
Tech-savvy professionals in SMEs consistently seek durable and intuitive technology solutions, and SuperWidget X delivers exactly that. With unmatched durability, a user-friendly interface, and 24/7 customer support, this product caters perfectly to small- and medium-sized enterprises. Competitive analysis shows that while alternatives like GadgetMaster Y offer lower prices, they often compromise on essential features like customer support. As trends in the SME market indicate a rising demand for reliable solutions, SuperWidget X positions itself as the premium choice for businesses seeking longevity and functionality in their tech investments."

# Notes
- Ensure each agent's output is formatted appropriately for the next agent in the sequence.
- Handle missing or incomplete information gracefully by flagging it for user input or clarification.
- Emphasize consistency and logical flow across the agent outputs. Transparency in reasoning or missing data should propagate cleanly in the chain while signaling the need downstream.
"""
 



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Or just ["POST"] if you want to be strict
    allow_headers=["*"],
)



@app.on_event("startup")
async def startup_event():

    # Define the path to the file to be uploaded
    crm_file = "Resources/Database.pdf"

    # Upload the file to foundry and create a vector store
    file = agents_client.files.upload_and_poll(file_path=crm_file, purpose=FilePurpose.AGENTS)
    vector_store = agents_client.vector_stores.create_and_poll(file_ids=[file.id], name="crm_vector_store")

    # Create file search tool with resources followed by creating agent
    file_search = FileSearchTool(vector_store_ids=[vector_store.id])

    # Create the policy agent using the file search tool
    crm_agent = agents_client.create_agent(
        model=model_deployment,
        name=crm_agent_name,
        instructions=crm_agent_instructions,
        tools=file_search.definitions,
        tool_resources=file_search.resources,
    )


    webcrawler_agent = agents_client.create_agent(
        model=model_deployment,
        name=webcrawler_agent_name,
        instructions=webcrawler_agent_instructions,
    )

    briefing_agent = agents_client.create_agent(
        model=model_deployment, 
        name=briefing_agent_name,
        instructions=briefing_agent_instructions,
    )

    # Create the connected agent tools for all 3 agents
    # Note: The connected agent tools are used to connect the agents to the orchestrator agent
    crm_agent_tool = ConnectedAgentTool(
        id=crm_agent.id,
        name=crm_agent_name,
        description="Prüft die Daten zu den Unternehmen im CRM System."
    )

    webcrawler_agent_tool = ConnectedAgentTool(
        id=webcrawler_agent.id,
        name=webcrawler_agent_name,
        description="Durchsucht das Web nach relevanten Informationen."
    )

    briefing_agent_tool = ConnectedAgentTool(
        id=briefing_agent.id,
        name=briefing_agent_name,
        description="Erstellt ein Briefing basierend auf den Informationen des Webcrawlers."
    )

    global orchestrator_agent

    # Create the Orchestrator Agent
    # This agent will coordinate the other agents based on user input
    orchestrator_agent = agents_client.create_agent(
        model=model_deployment,
        name=orchestrator_agent_name,
        instructions=orchestrator_agent_instructions,
        tools=[
            crm_agent_tool.definitions[0],
            webcrawler_agent_tool.definitions[0],
            briefing_agent_tool.definitions[0]
        ]
    )


# Request model
class AskRequest(BaseModel):
    company_name: str

@app.post("/generate_report")
async def ask_agent(payload: AskRequest):
    try:
        # Check if orchestrator agent is initialized
        if not orchestrator_agent:
            raise HTTPException(status_code=500, detail="Orchestrator agent not initialized.")  
        thread = agents_client.threads.create()

        # Send user message
        agents_client.messages.create(
            thread_id=thread.id,
            role="user",
            content=payload.company_name
        )

        # Run the assistant
        run = agents_client.runs.create_and_process(
            thread_id=thread.id,
            agent_id=orchestrator_agent.id
        )

        if run.status == "failed":
            return {"error": run.last_error}

        # Read messages
        messages = agents_client.messages.list(thread_id=thread.id, order=ListSortOrder.ASCENDING)

        for message in messages:
            if message.role == "assistant" and message.text_messages:
                return {"response": message.text_messages[-1].text.value}

        return {"response": "No assistant response."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
