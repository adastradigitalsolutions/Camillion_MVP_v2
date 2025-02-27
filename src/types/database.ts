export interface MuscleGroup {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  video_url: string;
  image_url: string;
  muscle_group_id: string;
  created_at: string;
}