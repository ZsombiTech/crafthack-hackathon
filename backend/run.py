import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        app = "api.index:app", 
        host = "0.0.0.0", 
        port = 8000, 
        log_level = "debug", 
        reload = True,
    )
