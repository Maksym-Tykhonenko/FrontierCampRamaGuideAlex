import type { CategoryDef, LocationItem } from '../types/locations';

export const CATEGORIES: CategoryDef[] = [
  { key: 'rockies', label: 'Rockies & Alpine Lakes' },
  { key: 'coasts',  label: 'Coasts & Tidal Wonders' },
  { key: 'shield',  label: 'Shield Lakes & Canoe Country' },
];

export const LOCATIONS: LocationItem[] = [
  {
    id: 'two-jack-lake',
    category: 'rockies',
    title: 'Two Jack Lake',
    region: 'Alberta',
    access: 'Car',
    coords: '51.230° N, 115.535° W',
    imageKey: 'two_jack_lake',
    description:
      `Mirror-calm mornings, teal water, and Rundle’s dark silhouette make Two Jack a classic Banff wake-up. ` +
      `Sites sit close to shore with quick hops to Lake Minnewanka and Johnson Lake, so you can chase sunrise photos, ` +
      `paddle at lunch, and stroll for elk bugling at dusk—all without long drives. Summer brings warm afternoons and ` +
      `busy weekends; shoulder seasons trade crowds for cooler nights and misty dawns. Expect elk on campground roads ` +
      `and black bears along the forest fringe—lock food and scented items. Fire bans appear in dry spells, and cell ` +
      `coverage is spotty. Treat this as a gentle Rockies basecamp: easy access, high reward views, and a dozen ` +
      `short outings within 15–20 minutes.`,
  },
  {
    id: 'maligne-lake',
    category: 'rockies',
    title: 'Maligne Lake',
    region: 'Alberta',
    access: 'Canoe-in (backcountry) / Car to access',
    coords: '52.723° N, 117.633° W',
    imageKey: 'maligne_lake',
    description:
      `Jasper’s deep-blue corridor stretches under snow-rimmed peaks to famous Spirit Island. Day users hug the north ` +
      `bays, but the magic unlocks when you paddle to backcountry camps like Fisherman’s Bay and Coronet Creek ` +
      `(reservations required). Afternoons can turn windy; plan early crossings and keep a conservative weather margin. ` +
      `Nights are crisp even in July; bring real insulation. Wildlife ranges from elk in valley meadows to black bears ` +
      `along berry slopes; occasional caribou closures may apply—always check park advisories. Treat water, keep a clean ` +
      `camp, and cook well away from tents. On clear nights the lake becomes a silent mirror where the ridgelines ` +
      `double—unforgettable.`,
  },
  {
    id: 'garibaldi-lake',
    category: 'rockies',
    title: 'Garibaldi Lake',
    region: 'British Columbia',
    access: 'Hike-in',
    coords: '49.957° N, 123.006° W',
    imageKey: 'garibaldi_lake',
    description:
      `From Rubble Creek, the trail climbs steadily through hemlock to a volcanic bowl brimmed with glacial water so ` +
      `blue it looks unreal. A large backcountry campground sits right on the shore, with bear hangs, cooking pads, ` +
      `and a sky that boils with stars after midnight. Late July to October is prime once snow fades; earlier visits can ` +
      `mean lingering ice and buried tent pads. Side trips to Panorama Ridge and the Black Tusk turn the area into a ` +
      `two-to-three-day mini-expedition. Black bears are common but shy; keep food suspended and kitchens separate from ` +
      `sleeping areas. Expect alpine sun and fast-moving afternoon clouds; pack layers for four seasons in one day.`,
  },
  {
    id: 'takakkaw-falls',
    category: 'rockies',
    title: 'Takakkaw Falls Walk-In Campground',
    region: 'British Columbia',
    access: 'Walk-in (short carry)',
    coords: '51.497° N, 116.472° W',
    imageKey: 'takakkaw_falls',
    description:
      `Pitch your tent within earshot of one of Canada’s tallest waterfalls. Sites are a short wheelbarrow carry from ` +
      `the parking area, trading car-door convenience for misty spray, starry skies, and the constant rush of water. ` +
      `Evenings glow pink on limestone walls; mornings bring cool air and raven calls. Trails to Laughing Falls and the ` +
      `Yoho Valley peel off from here, and Emerald Lake is a quick drive for jade water and easy shoreline walks. Store ` +
      `food properly—black bears patrol the valley edge—and pack warm layers: katabatic air off the glacier keeps nights ` +
      `crisp even in midsummer.`,
  },
  {
    id: 'lake-magog',
    category: 'rockies',
    title: 'Lake Magog (Mount Assiniboine)',
    region: 'British Columbia/Alberta',
    access: 'Hike-in (backcountry)',
    coords: '50.875° N, 115.648° W',
    imageKey: 'lake_magog',
    description:
      `An amphitheater of shark-toothed peaks surrounds this high, meadowed basin. Reaching Lake Magog is a pilgrimage—` +
      `multiple trail approaches demand fitness and planning—but the payoff is alpenglow on Assiniboine’s pyramid and ` +
      `larch-studded ridges that turn gold in fall. Backcountry sites cluster near the lake with designated cooking ` +
      `areas; keep kitchens separate from tents and carry bear spray. Weather swings hard at altitude—bring legit ` +
      `insulation and a storm shell. Day hikes to Nub Peak, Windy Ridge, or Sunburst and Cerulean Lakes stitch together ` +
      `views you’ll replay for years.`,
  },
  {
    id: 'elk-lakes',
    category: 'rockies',
    title: 'Elk Lakes',
    region: 'British Columbia',
    access: 'Hike-in (backcountry)',
    coords: '50.770° N, 115.120° W',
    imageKey: 'elk_lakes',
    description:
      `A quieter corner of the Rockies where green-blue lakes sit beneath serrated limestone. The approach from Elk Pass ` +
      `rolls through airy subalpine forest to a compact backcountry campground by Lower Elk Lake. Expect wildflowers in ` +
      `July, larches in late September, and glassy dawns that reflect the peaks perfectly. Black bears and elk share the ` +
      `valley—make noise on trail, secure food, and respect closures. Afternoon thunderheads can pop fast; get your ridge ` +
      `views early and be back in the trees before the sky grumbles.`,
  },

  {
    id: 'green-point',
    category: 'coasts',
    title: 'Green Point',
    region: 'British Columbia',
    access: 'Car',
    coords: '49.025° N, 125.714° W',
    imageKey: 'green_point',
    description:
      `Pacific Rim’s signature campground perches above surf that drums day and night. Fog slips between sitka spruce, ` +
      `tidepools blink with anemones, and sunset throws gold over sea stacks. Summer is lively and books out early; fall ` +
      `brings storm-watching and empty beaches. Wolves, black bears, and ravens patrol the coastline—never leave food or ` +
      `coolers unattended, and store garbage immediately. Between swells you can walk for hours on hard-packed sand; ` +
      `check tide tables to avoid cut-offs around headlands. Mornings are made for coffee and gulls; evenings for fires ` +
      `where permitted. Bring a solid rain shell—weather here loves drama.`,
  },
  {
    id: 'point-wolfe',
    category: 'coasts',
    title: 'Point Wolfe',
    region: 'New Brunswick',
    access: 'Car',
    coords: '45.586° N, 65.034° W',
    imageKey: 'point_wolfe',
    description:
      `Red rock rivers and covered bridges lead to Fundy’s famous tides—water that can rise faster than a walking pace. ` +
      `Point Wolfe Campground tucks you under big spruce with quick access to coastal lookouts and cobble beaches. Summer ` +
      `delivers warm woods and whale-watching nearby; fall turns the valleys into a copper tunnel. Study tide tables ` +
      `before beach walks and keep an eye on fog that can swallow landmarks. Wildlife is gentler here—porcupines, deer, ` +
      `songbirds—yet black bears still require clean camps. It’s an ideal place to teach “Leave No Trace” with kids: ` +
      `dramatic change, easy trails, and lots to learn.`,
  },
  {
    id: 'cavendish',
    category: 'coasts',
    title: 'Cavendish Campground',
    region: 'Prince Edward Island',
    access: 'Car',
    coords: '46.488° N, 63.375° W',
    imageKey: 'cavendish',
    description:
      `Wide beaches, singing sand, and long, soft sunsets—Cavendish is classic Maritime summer. Boardwalks carry you over ` +
      `dunes to warm Gulf water, while coastal paths thread through wild rose and marram grass. Campsites are ` +
      `family-friendly, breezy, and a short cycle from lighthouses and small bakeries. Gulls, foxes, and seabirds are the ` +
      `regulars; black bears aren’t a concern here, but raccoons and foxes will happily sample a lazy camp. Fog filters ` +
      `mornings into gentle light; afternoons invite swims and sandcastle physics.`,
  },
  {
    id: 'jeremys-bay',
    category: 'coasts',
    title: 'Jeremy’s Bay (Kejimkujik)',
    region: 'Nova Scotia',
    access: 'Car',
    coords: '44.440° N, 65.218° W',
    imageKey: 'jeremys_bay',
    description:
      `Keji blends quiet lakes, Mi’kmaq petroglyphs, and dark-sky camping in one forested package. Jeremy’s Bay sits near ` +
      `canoe put-ins where mirror water reveals loons and turtle heads along the reeds. Daytrip a portage or two for a ` +
      `simple overnight on backcountry platforms, then return for showers and easy trails. Black bears are present but shy; ` +
      `keep food sealed and cook away from tents. Early June brings frogs in stereo; September paints the hardwoods and ` +
      `thins the crowds. Nights can be inky—bring a tripod for Milky Way arcs.`,
  },

  {
    id: 'opeongo',
    category: 'shield',
    title: 'Lake Opeongo Access',
    region: 'Ontario',
    access: 'Canoe-in / Car to access',
    coords: '45.672° N, 78.360° W',
    imageKey: 'lake_opeongo',
    description:
      `Algonquin’s largest lake is a world of islands, points, and glassy mornings. Outfitters at the access point rent ` +
      `boats and run shuttles, letting you slip into wind-sheltered arms like the North Arm before tackling big ` +
      `crossings. Reserve backcountry sites in advance during peak months. Loons call through the night, moose browse the ` +
      `shallows at dawn, and wolves sometimes howl on still evenings. Afternoon winds build fast—plan travel early and aim ` +
      `for protected shorelines. Hang food or use canisters; black bears learn quickly where poor habits live. With short ` +
      `portages you can link Opeongo to quieter lakes and feel days fall away.`,
  },
  {
    id: 'wapizagonke',
    category: 'shield',
    title: 'Wapizagonke Lake',
    region: 'Québec',
    access: 'Canoe-in',
    coords: '46.736° N, 72.875° W',
    imageKey: 'wapizagonke',
    description:
      `La Mauricie’s long, sinuous lake is beginner-friendly canoe country: sheltered inlets, short portages, and ` +
      `backcountry sites that catch evening sun. Maple-clad hills glow in late September; summer means warm swims and ` +
      `loons on glass water. Rentals are convenient near the park road, making spontaneous overnights possible with a ` +
      `weather window. Black bears are present but shy—clean kitchens and odor-proof bags keep encounters distant. ` +
      `Morning mist often lifts to reveal reflections that double the shoreline; paddle quietly and you’ll hear ` +
      `woodpeckers and distant falls. It’s the kind of lake that turns first-timers into lifers.`,
  },
  {
    id: 'french-river',
    category: 'shield',
    title: 'French River — Hartley Bay Access',
    region: 'Ontario',
    access: 'Canoe-in / Car to access',
    coords: '45.869° N, 80.690° W',
    imageKey: 'french_river',
    description:
      `Granite channels, pine-clad islands, and mild current make the French a joy for first expeditions. Put in at ` +
      `Hartley Bay and choose your own chain of bays and narrows, camping on polished rock with western sunset views. ` +
      `Afternoon winds can funnel; plan crossings early and stick to lee shores when it pipes up. Loons, beavers, and the ` +
      `odd moose share the banks; black bears are around but usually uninterested if camps are clean. Bring proper maps—` +
      `side channels tempt detours you’ll be glad you took.`,
  },
  {
    id: 'quetico-nym',
    category: 'shield',
    title: 'Quetico — Nym Lake Access',
    region: 'Ontario',
    access: 'Canoe-in / Car to access',
    coords: '48.732° N, 91.783° W',
    imageKey: 'quetico_nym',
    description:
      `Slip from Nym Lake into a labyrinth of tea-stained waters, short portages, and granite knobs warmed by the sun. ` +
      `Compared with its U.S. neighbor, Quetico feels wilder and quieter: fewer signs, more decisions. Camps are often ` +
      `simple clearings with a breeze and a loon; pack a solid filter and repair kit. Weather can deliver both glass and ` +
      `gale in a day—read the clouds and travel early. Wolves sometimes chorus at night; it’s unforgettable and safe from ` +
      `the comfort of a tidy camp.`,
  },
];
