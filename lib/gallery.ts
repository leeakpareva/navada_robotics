// Lifestyle images for each robot. Put files in /public/gallery and list them here;
// the gallery on the home page appears automatically once a list is not empty.
export type GalleryImage = { src: string; alt: string };

export const gallery: Record<"k1" | "t2", GalleryImage[]> = {
  k1: [],
  t2: [],
};
