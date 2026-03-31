from dotenv import load_dotenv
from creative_director import generate_script
from producer import produce
import json
import uuid
from editor import combine_and_add_audio
from narrator import produce_audio

load_dotenv()

# Hardcoded values

name = "The Grove"
variety = "4, 5 and 6 Bedroom Villas"
location = "Al Yufrah, Dubai-Al Ain Road"
range_of_price_to_size = """RANGING FROM
AED 9.32 M* | INR 22.7 CR* | USD 2.55 M* |
EUR 2.25 M* | GBP 1.96 M*
Icon
From 4905.3 Sq. Ft.
From 455.72 Sq. M.
TO
AED 14.02 M* | INR 34.2 CR* | USD 3.84 M* | EUR 3.80 M* | GBP 3.12 M*
Icon
To 7191.8 Sq. Ft.
To 668.14 Sq. M."""

if __name__ == "__main__":

    property_id = str(uuid.uuid4())
    context = f"""
    Name: {name}
    Variety: {variety}
    Location: {location}
    Range of Price to Size: {range_of_price_to_size}
    """
    directory = "images"
    images = ["p1.jpg", "p2.jpg", "p3.jpg", "p4.jpg", "p5.jpg"]
    image = [directory + "/" + image for image in images]
    script_raw = generate_script(image, context) # Important BL: generate a relevant script for the video using image and text context
    print(script_raw)
    
    # Important BL: Robust JSON extraction as LLM may respond invalid format
    try:
        # First try parsing as is
        script_data = json.loads(script_raw)
    except json.JSONDecodeError:
        # If that fails, try to find the JSON object boundaries
        try:
            start_index = script_raw.find('{')
            end_index = script_raw.rfind('}')
            
            if start_index != -1 and end_index != -1 and end_index > start_index:
                cleaned_json = script_raw[start_index : end_index + 1]
                script_data = json.loads(cleaned_json)
            else:
                raise ValueError("No JSON object found in response")
        except Exception as e:
            print(f"Failed to extract JSON: {e}")
            exit(1)
            
    # script_data is already loaded in the block above
    description = list(script_data["visuals"]) # Important BL: extract list of visual-prompts to prompt for video generation model
    response = []
    for desc in description:
        response.append(produce(desc, property_id)) # Important BL: make Kie request for each visual

    video_paths = []
    for resp in response:
        if resp["status"] == "success":
            video_paths.append(resp["path"])

    audio_generated = False
    while not audio_generated:
        audio_response = produce_audio(script_data["script"], property_id)
        if audio_response["status"] == "success":
            audio_path = audio_response["path"]
            audio_generated = True

    # Important BL: Implement a mechanism to stitch the videos together and add music
    combined_video_path = combine_and_add_audio(video_paths=video_paths, narration_path=audio_path, property_id=property_id)

    print(response)



