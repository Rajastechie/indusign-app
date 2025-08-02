from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="InduSign API",
    description="eSignature Application Backend API",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "InduSign API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "indusign-backend", "version": "1.0.0"}


@app.get("/api/health")
async def api_health():
    return {"status": "healthy", "api": "indusign-backend", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
