export interface PlaceDetailsData {
  fullDescription: string;
  images: string[];
}

export interface Place {
  name: string;
  landingImage: string;
  landingDescription: string;
  details: PlaceDetailsData;
}