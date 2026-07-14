// Video testimonials shown in the "Traveller stories" homepage section. The section
// stays hidden until at least one entry is added here, so it's live-ready but empty.
// To add one: drop the YouTube video ID (the part after `watch?v=`) below.

export interface VideoTestimonial {
  id: string;
  name: string;
  /** Short trip label, e.g. "Maldives Honeymoon" or "Kerala Family Trip". */
  trip: string;
  /** YouTube video ID — e.g. from https://youtube.com/watch?v=ABC123 → "ABC123". */
  youtubeId: string;
}

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  // { id: "1", name: "Rahul & Priya", trip: "Maldives Honeymoon", youtubeId: "XXXXXXXXXXX" },
  // { id: "2", name: "The Nair Family", trip: "Kerala Family Trip", youtubeId: "XXXXXXXXXXX" },
];
