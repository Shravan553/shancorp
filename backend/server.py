from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import asyncio
import uuid
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

# Load environment variables
load_dotenv()

app = FastAPI(title="QuantumSpace Research Platform API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.quantumspace_db

# LLM Integration
EMERGENT_LLM_KEY = os.getenv("EMERGENT_LLM_KEY", "sk-emergent-95905C4Fe9c595e544")

# Pydantic models
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class ResearchItem(BaseModel):
    title: str
    category: str
    description: str
    findings: str

class ResearchResponse(BaseModel):
    id: str
    title: str
    category: str
    description: str
    findings: str
    created_at: str

# Initialize LLM Chat
def get_llm_chat():
    """Initialize LLM chat with space and quantum research expertise"""
    system_message = """You are an advanced AI assistant specialized in space research, quantum theory, and AI programming. You have expertise in:

1. Space Research & Technology:
   - Satellite technology and space missions
   - Astronomical data analysis
   - Space exploration programs
   - Rocket technology and propulsion systems
   - Space station operations

2. Quantum Theory & Computing:
   - Quantum mechanics principles
   - Quantum computing algorithms
   - Quantum entanglement and superposition
   - Quantum cryptography
   - Quantum machine learning

3. AI Programming & Database Systems:
   - Machine learning models for research
   - Data analysis and visualization
   - Database management for research data
   - Predictive analytics for space missions

Provide clear, educational, and engaging explanations suitable for researchers, investors, and the general public. Use analogies when helpful and always maintain scientific accuracy."""

    return LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id="quantumspace-chat",
        system_message=system_message
    ).with_model("openai", "gpt-4o-mini")

# API Routes
@app.get("/")
async def root():
    return {"message": "QuantumSpace Research Platform API", "status": "operational"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(chat_message: ChatMessage):
    """Chat with AI assistant about space research and quantum theory"""
    try:
        # Initialize LLM chat
        chat = get_llm_chat()
        
        # Create user message
        user_message = UserMessage(text=chat_message.message)
        
        # Get AI response
        response = await chat.send_message(user_message)
        
        return ChatResponse(response=response)
    
    except Exception as e:
        print(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing chat message: {str(e)}"
        )

@app.get("/api/research", response_model=List[ResearchResponse])
async def get_research_data():
    """Get all research data from database"""
    try:
        research_items = []
        async for item in db.research.find():
            research_items.append(ResearchResponse(
                id=item["id"],
                title=item["title"],
                category=item["category"],
                description=item["description"],
                findings=item["findings"],
                created_at=item["created_at"]
            ))
        return research_items
    
    except Exception as e:
        print(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching research data: {str(e)}"
        )

@app.post("/api/research", response_model=ResearchResponse)
async def add_research_data(research: ResearchItem):
    """Add new research data to database"""
    try:
        # Create unique ID and timestamp
        research_id = str(uuid.uuid4())
        created_at = datetime.now().isoformat()
        
        # Prepare document for database
        research_doc = {
            "id": research_id,
            "title": research.title,
            "category": research.category,
            "description": research.description,
            "findings": research.findings,
            "created_at": created_at
        }
        
        # Insert into database
        result = await db.research.insert_one(research_doc)
        
        if result.inserted_id:
            return ResearchResponse(
                id=research_id,
                title=research.title,
                category=research.category,
                description=research.description,
                findings=research.findings,
                created_at=created_at
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to insert research data")
    
    except Exception as e:
        print(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error adding research data: {str(e)}"
        )

@app.delete("/api/research/{research_id}")
async def delete_research_data(research_id: str):
    """Delete research data by ID"""
    try:
        result = await db.research.delete_one({"id": research_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Research item not found")
        
        return {"message": "Research item deleted successfully", "id": research_id}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting research data: {str(e)}"
        )

@app.get("/api/research/categories")
async def get_research_categories():
    """Get available research categories"""
    return {
        "categories": [
            {"id": "space", "name": "Space Research", "description": "Space exploration and satellite technology"},
            {"id": "quantum", "name": "Quantum Theory", "description": "Quantum computing and quantum mechanics"},
            {"id": "ai", "name": "AI Programming", "description": "Artificial intelligence and machine learning"},
            {"id": "database", "name": "Database Technology", "description": "Data management and analytics"}
        ]
    }

@app.get("/api/research/stats")
async def get_research_stats():
    """Get research statistics"""
    try:
        # Count total research items
        total_count = await db.research.count_documents({})
        
        # Count by category
        space_count = await db.research.count_documents({"category": "space"})
        quantum_count = await db.research.count_documents({"category": "quantum"})
        ai_count = await db.research.count_documents({"category": "ai"})
        database_count = await db.research.count_documents({"category": "database"})
        
        return {
            "total_research": total_count,
            "categories": {
                "space": space_count,
                "quantum": quantum_count,
                "ai": ai_count,
                "database": database_count
            },
            "last_updated": datetime.now().isoformat()
        }
    
    except Exception as e:
        print(f"Database error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching research statistics: {str(e)}"
        )

# Initialize database with sample data on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database with sample research data"""
    try:
        # Check if data already exists
        existing_count = await db.research.count_documents({})
        
        if existing_count == 0:
            # Add sample research data
            sample_data = [
                {
                    "id": str(uuid.uuid4()),
                    "title": "Mars Rover Autonomous Navigation System",
                    "category": "space",
                    "description": "Development of advanced AI-driven navigation systems for Mars exploration rovers, enabling autonomous decision-making in challenging terrain.",
                    "findings": "Successfully implemented machine learning algorithms that improved navigation accuracy by 85% and reduced mission planning time by 60%.",
                    "created_at": datetime.now().isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Quantum Entanglement Communication Protocol",
                    "category": "quantum",
                    "description": "Research into quantum entanglement-based communication systems for secure space-to-Earth data transmission.",
                    "findings": "Achieved quantum entanglement stability over 1000km distance with 99.9% fidelity, opening possibilities for unhackable space communications.",
                    "created_at": datetime.now().isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "AI-Powered Astronomical Data Analysis",
                    "category": "ai",
                    "description": "Machine learning models for automated detection and classification of celestial objects from telescope data.",
                    "findings": "Developed neural networks that can identify exoplanets with 95% accuracy, processing 1000x faster than traditional methods.",
                    "created_at": datetime.now().isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Distributed Space Mission Database Architecture",
                    "category": "database",
                    "description": "Scalable database systems for managing vast amounts of space mission data across multiple research institutions.",
                    "findings": "Implemented blockchain-based data integrity system handling 10TB+ daily space mission data with real-time global synchronization.",
                    "created_at": datetime.now().isoformat()
                }
            ]
            
            # Insert sample data
            await db.research.insert_many(sample_data)
            print("Database initialized with sample research data")
        
        print("QuantumSpace Research Platform API started successfully")
    
    except Exception as e:
        print(f"Startup error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)