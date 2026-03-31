import requests
import os
from dotenv import load_dotenv
import socket
import json
import logging
from helper.kie.main import make_kie_request
from helper.downloader import download_file_requests    


# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()

HOST = "localhost"
PORT = 8000

def progress_and_download_video(job_id, property_id):
    """
    Important BL:
    - Polls the Kie server for the progress of the video generation
    - Downloads the video from the Kie server when callback is received
    """
    callback_received = False
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen(5)

    print(f"Listening for Kie callbacks on http://{HOST}:{PORT}")

    while not callback_received:
        client_socket, addr = server_socket.accept()
        print(f"Connection from {addr}")

        request_data = client_socket.recv(8192).decode()
        print("RAW REQUEST:\n", request_data)

        # ---- Parse HTTP ----
        headers, body = request_data.split("\r\n\r\n", 1)
        path = headers.split(" ")[1].rstrip('/')

        try:
            body_json = json.loads(body)
        except Exception:
            body_json = {}
            logger.error("Invalid JSON body")

        # ---- CALLBACK LOGIC ----
        if path == "/api/callback":
            print("Callback Body:", body_json)
            data = body_json.get("data", {})
            fetched_job_id = data.get("taskId")

            if not fetched_job_id:
                logger.error("Missing taskId")
                response_body = '{"error":"missing taskId"}'
                callback_received = True
            else:
                logger.debug(f"Callback received for job {job_id}")

                if body_json.get("code") == 200:
                    if fetched_job_id == job_id:
                        result_json_str = data.get("resultJson")
                        if result_json_str:
                            try:
                                result_data = json.loads(result_json_str)
                                urls = result_data.get("resultUrls", [])
                                if urls:
                                    url = urls[0]
                                    try:
                                        response = download_file_requests(job_id, url, property_id)
                                        logger.info(f"File downloaded for {job_id}")
                                        callback_received = True
                                    except Exception as e:
                                        logger.error(f"Download failed for {job_id}: {e}")
                                else:
                                    response = {"status": "error", "message": f"No resultUrls found in resultJson for {job_id}"}
                                    callback_received = True
                                    logger.error(f"No resultUrls found in resultJson for {job_id}")
                            except json.JSONDecodeError:
                                logger.error(f"Invalid resultJson (failed to parse) for {job_id}")
                        else:
                            response = {"status": "error", "message": f"No resultUrls found in resultJson for {job_id}"}
                            callback_received = True
                            logger.error(f"Missing resultJson in callback data for {job_id}")
                    else:
                        logger.warning(f"Ignored callback for different job: {fetched_job_id} (expected {job_id})")
                else:
                    msg = body_json.get("msg") or data.get("failMsg", "Unknown error")
                    response = {"status": "error", "message": f"Job failed {fetched_job_id}: {msg}"}
                    callback_received = True
                    logger.error(f"Job failed {fetched_job_id}: {msg}")

                response_body = '{"status":"ok"}'

        # ---- PROGRESS CALLBACK ----
        elif path == "/api/progressCallBackUrl":
            print("Progress Body:", body_json)
            data = body_json.get("data", {})
            job_id = data.get("task_id") or data.get("taskId")
            progress = data.get("progress_percent")

            if job_id and progress is not None:
                logger.debug(f"Job {job_id} progress: {progress}%")
            else:
                logger.warning("Incomplete progress data")

            response_body = '{"status":"progress received"}'

        # ---- UNKNOWN PATH ----
        else:
            response_body = '{"error":"Not Found"}'

        # ---- HTTP RESPONSE ----
        http_response = (
            "HTTP/1.1 200 OK\r\n"
            "Content-Type: application/json\r\n"
            f"Content-Length: {len(response_body)}\r\n"
            "Connection: close\r\n\r\n"
            f"{response_body}"
        )

        client_socket.sendall(http_response.encode())
        client_socket.close()

    server_socket.close()
    return response

def produce(prompt, property_id):
    """
    Important BL:
    - Makes Kie request for video generation on endpoint: https://api.kie.ai/api/v1/jobs/createTask
    - Deals with downloading the video from the Kie server
    """

    response = make_kie_request(prompt, "sora-2-text-to-video")
    print(response)
    task_id = response.get("data", {}).get("taskId") or response.get("data", {}).get("task_id")
    if not task_id:
        logger.error(f"Could not extract taskId from response: {response}")
        return {"status": "error", "message": "No taskId found"}
    
    response = progress_and_download_video(task_id, property_id)
    if response["status"] == "error":
        response = produce(prompt, property_id)
    return response


    
