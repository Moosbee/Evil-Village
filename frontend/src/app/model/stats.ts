export interface Stats {
  all: nameSpaces;
  your: nameSpaces;
  notYour: nameSpaces;
}

export interface nameSpaces {
  all: {
    count: number;
    avgStrength: number;
    minStrength: number;
    maxStrength: number;
  };
  army: {
    count: number;
    moving: number;
    avgStrength: number;
    minStrength: number;
    maxStrength: number;
  };
  schiff: {
    count: number;
    moving: number;
    avgStrength: number;
    minStrength: number;
    maxStrength: number;
  };
  stadt: {
    count: number;
    producing: number;
    capitals: number;

    avgStrength: number;
    minStrength: number;
    maxStrength: number;
    avgPopulation: number;
    minPopulation: number;
    maxPopulation: number;
    avgSpeed: number;
    minSpeed: number;
    maxSpeed: number;
  };
}
