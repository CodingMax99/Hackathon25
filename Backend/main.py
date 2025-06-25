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
orchestrator_agent_id = os.getenv("AGENT_ID")

agents_client = AgentsClient(endpoint=project_endpoint, credential=DefaultAzureCredential())
app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Or just ["POST"] if you want to be strict
    allow_headers=["*"],
)


# Request model
class AskRequest(BaseModel):
    company_name: str

@app.post("/generate_report")
async def ask_agent(payload: AskRequest):
    try:
        agent = agents_client.get_agent(agent_id=orchestrator_agent_id)
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
            agent_id=agent.id
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
