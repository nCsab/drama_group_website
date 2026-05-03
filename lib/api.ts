import { IMAGES, CAMP_VIDEOS } from "./data";
import type { ImageItem } from "./data";

export type CampVideo = (typeof CAMP_VIDEOS)[number];

export const QUERY_KEYS = {
  images: ["images"] as const,
  campVideos: ["campVideos"] as const,
} as const;

export async function fetchImages(): Promise<ImageItem[]> {
  // TODO: Replace with actual REST API call
  // Example: return fetch('/api/images').then(res => res.json());
  return IMAGES;
}

export async function fetchCampVideos(): Promise<CampVideo[]> {
  // TODO: Replace with actual REST API call
  // Example: return fetch('/api/camp-videos').then(res => res.json());
  return CAMP_VIDEOS;
}
