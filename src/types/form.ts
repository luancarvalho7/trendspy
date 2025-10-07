// Niche type definition
export interface Niche {
  text: string;
  type: 'aiRecommend' | 'manualAdded';
}

export interface FormData {
  age?: string;
  sex?: string; // Keep for backward compatibility
  niches?: Niche[];
  profileMonitoring?: string;
  heightUnit?: 'feet' | 'inches' | 'centimeters';
  heightFeet?: string;
  heightInches?: string;
  heightTotalInches?: string;
  heightCentimeters?: string;
  hasWebsite?: string;
  weight?: string;
  weightChange?: string;
  pregnancyStatus?: string;
  hormoneTherapy?: string;
  ht1Medications?: string[];
  htMedications?: {
    [medicationName: string]: {
      method?: string;
      duration?: string;
      doseChange?: string;
    };
  };
  walkingActivity?: string;
  sleepHours?: string;
  sleepSchedule?: string;
  snoringStatus?: string;
  stairsCapacity?: string;
  liftingCapability?: string;
  stressLevel?: string;
  alcoholConsumption?: string;
  eatingHabits?: string;
  mainObjective?: string;
  familyHistory?: string[];
  profilesToMonitor?: Array<{
    text: string;
    niche?: string;
    type: 'aiRecommend' | 'manualAdded';
  }> | string[]; // Allow both formats for backward compatibility
  aiSuggestedProfiles?: Array<{
    text: string;
    niche?: string;
    type: 'aiRecommend' | 'manualAdded';
  }>; // AI suggested profiles from webhook
  lonelinessFactors?: string[];
  brandMissions?: string[];
  coreValues?: string[];
  competitiveDifferentials?: string[];
  userProfileMetrics?: {
    profilePicture?: string;
    bio?: string;
    following?: string;
    followers?: string;
    media?: string;
    name?: string;
    username?: string;
    userId?: string;
    success?: boolean;
    verified?: boolean;
  };
  [key: string]: any; // Allow for additional fields as we add more questions
}

export interface FormStep {
  id: string;
  component: React.ComponentType<FormStepProps>;
  nextStepLogic: (formData: FormData) => string | null; // null means form is complete
  prevStepId?: string | ((formData: FormData, history: string[]) => string | null);
  title?: string; // Optional title for debugging/admin purposes
}

export interface FormStepProps {
  onContinue: (data: any) => void;
  formData?: FormData;
  currentMedication?: string; // For dynamic sub-flow questions
}