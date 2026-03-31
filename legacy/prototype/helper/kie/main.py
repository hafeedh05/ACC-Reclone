import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()

HOST = "localhost"
PORT = 8000

def make_kie_request(prompt, model):
    """
    Important BL:
    - Makes Kie request for audio/video generation on endpoint: https://api.kie.ai/api/v1/jobs/createTask
    - Does not deal with downloading the audio, it only returns the task id
    """
    url = "https://api.kie.ai/api/v1/jobs/createTask"
    headers = {
        "Authorization": f"Bearer {os.getenv('KIE_API_KEY')}",
        "Content-Type": "application/json",
    }
    if model == "elevenlabs/text-to-dialogue-v3":
        payload = {
        "model": "elevenlabs/text-to-dialogue-v3",
        "callBackUrl": "https://unfleeting-noncortically-len.ngrok-free.app/api/callback",
        "input": {
            "dialogue": [
                {
                    "text": prompt,
                    "voice": "Adam"
                }],
            "stability": 0.5
        }}
    elif model == "sora-2-text-to-video":
        payload = {
        "model": "sora-2-text-to-video",
        "callBackUrl": "https://unfleeting-noncortically-len.ngrok-free.app/api/callback",
        "progressCallBackUrl": "https://unfleeting-noncortically-len.ngrok-free.app/api/progressCallBackUrl",
        "input": {
            "prompt": prompt,
            "aspect_ratio": "landscape",
            "n_frames": "10",
            "remove_watermark": True,
            "upload_method": "s3"
            }
        }


    response = requests.post(url, headers=headers, json=payload)
    return response.json()