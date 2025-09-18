export interface FormData {
  age?: string;
  sex?: string;
  heightUnit?: 'feet' | 'inches' | 'centimeters';
  heightFeet?: string;
  heightInches?: string;
  heightTotalInches?: string;
  heightCentimeters?: string;
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
  medicalConditions?: string[];
  familyHistory?: string[];
  lonelinessFactors?: string[];
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