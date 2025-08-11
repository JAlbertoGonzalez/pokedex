export type Generation = {
  id: number;
  name: string;
  region_id: number;
  region: {
    name: string;
  };
};

export type GetGenerationsOutput = {
  generation: Generation[];
};
