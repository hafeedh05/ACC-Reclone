from moviepy import VideoFileClip, concatenate_videoclips, AudioFileClip, CompositeAudioClip
import os

def combine_and_add_audio(property_id, video_paths, narration_path=None, music_path=None):
    clips = []
    for path in video_paths:
        clip = VideoFileClip(path)
        clips.append(clip)

    if not clips:
        print("No video clips to combine. Exiting...")
        return None

    final_clip = concatenate_videoclips(clips)

    if narration_path:
        overlay_audio_clip = AudioFileClip(narration_path)
        final_audio = CompositeAudioClip([overlay_audio_clip])
        muted_video = final_clip.without_audio()
        final_clip = muted_video.set_audio(final_audio)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    save_dir = os.path.join(base_dir, 'generated_videos', property_id)
    
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
        
    output_path = os.path.join(save_dir, f"{property_id}.mp4")

    print(f"Stitching videos and saving to {output_path}...")
    final_clip.write_videofile(output_path, codec="libx264", audio_codec="aac")
    print("Done!")

    for clip in clips:
        clip.close()
    
    return output_path



    