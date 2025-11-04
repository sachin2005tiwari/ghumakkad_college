export interface LocationCard {
    id: number;
    name: string;
    landing_image: string;
    about_description: string;
}

export interface LocationDetails {
    id: number;
    name: string;
    landing_image: string;
    about_description: string;
    attractions_list: Attraction[];
    latitude: number;
    longitude: number; 
}

export interface Attraction {
    desc: string;
    name: string;
    screenshots: string[];
}