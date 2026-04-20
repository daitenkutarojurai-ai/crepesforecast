export type Mode = "crepe" | "glace";

export type Confidence = "live" | "cached" | "simulated" | "unavailable";

export interface SourceStatus {
  id: string;
  label: string;
  confidence: Confidence;
  note?: string;
  fetchedAt?: string;
}

export interface WeatherNow {
  tempC: number;
  feelsLikeC: number;
  windKmh: number;
  uvIndex: number;
  cloudCoverPct: number;
  isSunny: boolean;
  precipProbPct: number;
  sunrise: string;
  sunset: string;
  daylightMinutesLeft: number;
}

export interface HourlyPoint {
  time: string;
  tempC: number;
  feelsLikeC: number;
  windKmh: number;
  uvIndex: number;
  precipProbPct: number;
  cloudCoverPct: number;
}

export interface EngineInputs {
  weather: WeatherNow;
  hourly: HourlyPoint[];
  now: Date;
  seineFlowCubicMS?: number;
  pollenRisk?: "low" | "moderate" | "high";
  sncfDelayMin?: number;
  cherryBlossomBuzz?: number;
  competitorBusiness?: "quiet" | "typical" | "busier";
  localEvents: LocalEvent[];
}

export interface LocalEvent {
  id: string;
  title: string;
  startISO: string;
  endISO?: string;
  distanceKm: number;
  kind: "brocante" | "marathon" | "rowing" | "religious" | "theater" | "market" | "other";
  expectedBump: number;
  sourceUrl?: string;
  sourceLabel?: string;
}

export interface CardiganResult {
  value: number;
  level: "green" | "amber" | "red";
  strategy: string;
  hint: string;
}

export interface PivotResult {
  value: number;
  mode: Mode;
  heatAlert: boolean;
  description: string;
}

export interface BribeResult {
  value: number;
  active: boolean;
  window: { startISO: string; endISO: string };
  recommendation: string;
}

export interface Pulse {
  id: string;
  label: string;
  timeISO: string;
  note: string;
  kind: "ferry" | "church" | "theater" | "sncf" | "influencer" | "competitor";
  severity: "info" | "watch" | "high";
  minutesFromNow: number;
}

export interface Recommendation {
  headline: string;
  batterVolumePct: number;
  topping: string;
  staffing: "solo" | "two-hands" | "all-hands";
  rationale: string[];
  menuSpotlight: MenuSpotlight;
}

export interface MenuSpotlight {
  hero: string;
  heroCategory: "crepe" | "gaufre" | "glace" | "boisson";
  combo: string;
  avoid?: string;
}

export interface TerrasseCapacity {
  tables: number;
  seats: number;
  expectedFillPct: number;
  peakWindow: string;
  note: string;
}

export interface DrinkStock {
  tier: "base" | "renforcé" | "canicule";
  loadoutPct: number;
  priorities: DrinkPriority[];
  note: string;
}

export interface DrinkPriority {
  label: string;
  units: string;
  emoji: string;
}

export interface SeineLevelView {
  heightM: number;
  mood: "calme" | "surveillé" | "haut";
  note: string;
  timestamp: string;
}

export interface PollenView {
  level: "low" | "moderate" | "high";
  dominant: string;
  score: number;
  note: string;
}

export type TargetKind = "saturday" | "sunday" | "holiday";

export interface Briefing {
  generatedAt: string;
  targetDate: string;
  targetKind: TargetKind;
  targetLabel: string;
  targetHolidayName?: string;
  shiftStartISO: string;
  shiftEndISO: string;
  location: {
    name: string;
    lat: number;
    lon: number;
    postalCodes: string[];
  };
  mode: Mode;
  weather: WeatherNow;
  hourly: HourlyPoint[];
  cardigan: CardiganResult;
  pivot: PivotResult;
  bribe: BribeResult;
  pulses: Pulse[];
  events: LocalEvent[];
  horoscope: HoroscopeCard;
  napkinForecast: NapkinForecast;
  lycraCoefficient: LycraForecast;
  poussetteFactor: PoussetteForecast;
  nutellaIndex: NutellaIndex;
  socialSentiment: SocialSignal;
  competitorProxy: CompetitorSignal;
  recommendation: Recommendation;
  terrasse: TerrasseCapacity;
  drinks: DrinkStock;
  seineLevel?: SeineLevelView;
  pollen: PollenView;
  sources: SourceStatus[];
}

export interface WeekBriefingDay {
  targetDate: string;
  targetKind: TargetKind;
  targetLabel: string;
  targetHolidayName?: string;
  weather: WeatherNow;
  mode: Mode;
  affluenceTier: "peak" | "high" | "steady" | "quiet";
  affluenceLabel: string;
  topEvent?: { title: string; bump: number };
  terrasseFillPct: number;
  drinksTier: DrinkStock["tier"];
  menuHero: string;
  batterVolumePct: number;
}

export interface WeekBriefing {
  generatedAt: string;
  days: WeekBriefingDay[];
  sources: SourceStatus[];
}

export interface HoroscopeCard {
  headline: string;
  body: string;
  roadblock: boolean;
}

export interface NapkinForecast {
  risk: "low" | "moderate" | "high";
  recommendation: string;
}

export interface LycraForecast {
  coefficient: number;
  note: string;
}

export interface PoussetteForecast {
  density: "low" | "medium" | "high";
  window: string;
  note: string;
}

export interface NutellaIndex {
  level: "neutral" | "deal" | "shortage";
  note: string;
}

export interface SocialSignal {
  spikePct: number;
  hashtag: string;
  note: string;
}

export interface CompetitorSignal {
  status: "quiet" | "typical" | "busier";
  note: string;
}
