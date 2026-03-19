import requests
import os
from dotenv import load_dotenv

load_dotenv()

def download_file_requests(job_id, url, property_id):
    """
    Downloads a file from a URL using the requests library.
    For large files, streaming is recommended to save memory.
    """
    print(f"Downloading file for {job_id} from {url}")
    try:
        # Determine the directory where this script is located
        base_dir = os.path.dirname(os.path.abspath(__file__))
        save_dir = os.path.join(base_dir, 'generated_videos', property_id)
        
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
            
        save_path = os.path.join(save_dir, f"{job_id}.mp4")
        
        # Use 'stream=True' for large files to read in chunks and avoid memory issues
        response = requests.get(url, stream=True)
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
        
        with open(save_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192): # Iterate over chunks
                file.write(chunk)
        return {"status": "success", "message": f"File downloaded successfully to {save_path}", "path": save_path}
    except requests.exceptions.RequestException as e:
        raise e