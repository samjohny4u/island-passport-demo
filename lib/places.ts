import raw from "@/data/places.json";

export type Place = {
  id: string;
  name: string;
  town: string;
  blurb: string;
  lng: number;
  lat: number;
  ink: string;
  photo: string;
  credit: string;
  license: string;
  source: string;
};

export const PLACES = raw as Place[];
export const stampSrc = (id: string) => `/stamps/${id}.svg`;
