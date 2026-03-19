from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from PIL import Image
import base64
import io

def images_to_base64(image_paths):
    """
    Important BL:
    - Converts a list of image paths to a list of base64 encoded strings.
    - As LLM processable format
    """
    encoded_images = []
    for path in image_paths:
        image = Image.open(path)
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        encoded_images.append(
            base64.b64encode(buffered.getvalue()).decode("utf-8")
        )
    return encoded_images


def generate_script(
    image_path: list[str],
    property_context: str,
):
    """
    Important BL:
    Generates a real estate ad script using an image + text context.
    """

    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0.7,
        max_tokens=600,
    )

    images_base64 = images_to_base64(image_path)
    content=[
        {
            "type": "text",
            "text": (
                "You are a professional real estate advertisement producer. "
                "Create a compelling, smooth, voiceover-style ad script. "
                "Along with description of array of visuals that could/should appear in the video, sort of like a storyboard but with text."
                # "Description of the visuals can be similar to the reference images."
                "Highlight lifestyle, value, and emotional appeal. "
                "Keep it polished, confident, and market-ready."
                "Note: You need to respond with json object with two keys: script and visuals."
                "script should be a string and visuals should be an array of strings of length 5-6."

                f"Property details:\n{property_context}"

            ),
        },
    ]
    
    for img in images_base64:
        content.append(
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{img}"
                },
            }
        )


    response = llm.invoke([HumanMessage(content=content)])
    return response.content
