
export const IMAGE_MAP: Record<string, any> = {
  two_jack_lake: require('../assets/two_jack_lake.png'),
  maligne_lake: require('../assets/maligne_lake.png'),
  garibaldi_lake: require('../assets/garibaldi_lake.png'),
  takakkaw_falls: require('../assets/takakkaw_falls.png'),
  lake_magog: require('../assets/lake_magog.png'),
  elk_lakes: require('../assets/elk_lakes.png'),

  green_point: require('../assets/green_point.png'),
  point_wolfe: require('../assets/point_wolfe.png'),
  cavendish: require('../assets/cavendish.png'),
  jeremys_bay: require('../assets/jeremys_bay.png'),

  lake_opeongo: require('../assets/lake_opeongo.png'),
  wapizagonke: require('../assets/wapizagonke.png'),
  french_river: require('../assets/french_river.png'),
  quetico_nym: require('../assets/quetico_nym.png'),
};

export const getImage = (key: string) => IMAGE_MAP[key] ?? null;
