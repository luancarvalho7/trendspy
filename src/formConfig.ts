import { FormStep, FormData } from './types/form';
import AccountNameForm from './components/AccountNameForm';
import SocialNetworkTypeForm from './components/SocialNetworkTypeForm';
import InstagramHandleForm from './components/InstagramHandleForm';
import WebsiteLinkForm from './components/WebsiteLinkForm';
import NicheForm from './components/NicheForm';
import HormoneTherapyForm from './components/HormoneTherapyForm';
import HT1Form from './components/HT1Form';
import HT2Form from './components/HT2Form';
import HT3Form from './components/HT3Form';
import HT4Form from './components/HT4Form';
import PregnancyForm from './components/PregnancyForm';
import WalkingForm from './components/WalkingForm';
import LiftingForm from './components/LiftingForm';
import SleepForm from './components/SleepForm';
import SleepScheduleForm from './components/SleepScheduleForm';
import StairsForm from './components/StairsForm';
import SnoringForm from './components/SnoringForm';
import AlcoholForm from './components/AlcoholForm';
import EatingForm from './components/EatingForm';
import WeightChangeForm from './components/WeightChangeForm';
import MainObjectiveForm from './components/MedicalConditionsForm';
import FamilyHistoryForm from './components/FamilyHistoryForm';
import StressForm from './components/StressForm';
import LonelinessForm from './components/LonelinessForm';

export const formConfig: FormStep[] = [
  {
    id: 'account_name',
    component: AccountNameForm,
    title: 'Account Name Question',
    nextStepLogic: (formData: FormData) => {
      // Simple linear progression to sex question
      return 'social_network_type';
    }
  },
  {
    id: 'social_network_type',
    component: SocialNetworkTypeForm,
    title: 'Social Network Type Question',
    nextStepLogic: (formData: FormData) => {
      return 'instagram_handle';
    },
    prevStepId: 'account_name'
  },
  {
    id: 'instagram_handle',
    component: InstagramHandleForm,
    title: 'Instagram Handle Question',
    nextStepLogic: (formData: FormData) => {
      return 'has_website';
    },
    prevStepId: 'social_network_type'
  },
  {
    id: 'has_website',
    component: WeightChangeForm,
    title: 'Website Availability Question',
    nextStepLogic: (formData: FormData) => {
      // If user has a website, ask for the link
      if (formData.hasWebsite === 'Sim') {
        return 'website_link';
      } else {
        // If no website, continue to sex question
        return 'sex';
      }
    },
    prevStepId: 'instagram_handle'
  },
  {
    id: 'website_link',
    component: WebsiteLinkForm,
    title: 'Website Link Question',
    nextStepLogic: (formData: FormData) => {
      return 'sex';
    },
    prevStepId: 'has_website'
  },
  {
    id: 'niches',
    component: NicheForm,
    title: 'Niche Selection Question',
    nextStepLogic: (formData: FormData) => {
      // Always go to medical conditions next
      return 'medical_conditions';
    },
    prevStepId: (formData: FormData) => {
      // Dynamic previous step - could come from has_website (No) or website_link (Yes)
      if (formData.hasWebsite === 'Sim') {
        return 'website_link';
      } else {
        return 'has_website';
      }
    }
  },
  {
    id: 'main_objective',
    component: MainObjectiveForm,
    title: 'Main Objective Question',
    nextStepLogic: (formData: FormData) => {
      // After medical conditions, go to hormone therapy
      return 'family_history';
    },
    prevStepId: 'niches'
  },
  {
    id: 'family_history',
    component: FamilyHistoryForm,
    title: 'Family History Question',
    nextStepLogic: (formData: FormData) => {
      // After family history, go to hormone therapy
      return 'hormone_therapy';
    },
    prevStepId: 'main_objective'
  },
  {
    id: 'hormone_therapy',
    component: HormoneTherapyForm,
    title: 'Hormone Therapy Question',
    nextStepLogic: (formData: FormData) => {
      // Conditional routing based on hormone therapy answer
      if (formData.hormoneTherapy === 'Yes') {
        return 'ht1'; // Go to hormone therapy questions
      } else {
        // If No to hormone therapy, check if female for pregnancy question
        if (formData.niches?.includes('Female') || formData.sex === 'Female') {
          return 'pregnancy';
        } else {
          return 'walking'; // Go to walking question for males
        }
      }
    },
    prevStepId: 'family_history'
  },
  {
    id: 'ht1',
    component: HT1Form,
    title: 'Hormone Therapy - Medications',
    nextStepLogic: (formData: FormData) => {
      // Signal to start dynamic sub-flow for selected medications
      if (formData.ht1Medications && formData.ht1Medications.length > 0) {
        return 'start_ht_subflow';
      }
      return null; // No medications selected, end form
    },
    prevStepId: 'hormone_therapy'
  },
  {
    id: 'ht2',
    component: HT2Form,
    title: 'Hormone Therapy - Method',
    nextStepLogic: (formData: FormData) => {
      return 'ht3';
    },
    prevStepId: 'ht1'
  },
  {
    id: 'ht3',
    component: HT3Form,
    title: 'Hormone Therapy - Duration',
    nextStepLogic: (formData: FormData) => {
      return 'ht4';
    },
    prevStepId: 'ht2'
  },
  {
    id: 'ht4',
    component: HT4Form,
    title: 'Hormone Therapy - Dose Change',
    nextStepLogic: (formData: FormData) => {
      // End of hormone therapy section
      // After completing all HT questions, check if female for pregnancy
      if (formData.niches?.includes('Female') || formData.sex === 'Female') {
        return 'pregnancy';
      } else {
        return 'walking'; // Go to walking question for males
      }
    },
    prevStepId: 'ht3'
  },
  {
    id: 'pregnancy',
    component: PregnancyForm,
    title: 'Pregnancy Status Question',
    nextStepLogic: (formData: FormData) => {
      // After pregnancy question, go to walking activity
      return 'walking';
    },
    prevStepId: (formData: FormData) => {
      // Dynamic previous step - could come from hormone_therapy (No) or from completed HT flow
      if (formData.hormoneTherapy === 'No') {
        return 'hormone_therapy';
      } else {
        // Coming from completed HT flow, but we need to figure out the last step
        // This is complex due to dynamic subflow, so we'll handle this in navigation
        return 'hormone_therapy'; // Fallback
      }
    }
  },
  {
    id: 'walking',
    component: WalkingForm,
    title: 'Walking Activity Question',
    nextStepLogic: (formData: FormData) => {
      // After walking question, go to stairs question
      return 'stairs';
    },
    prevStepId: (formData: FormData) => {
      // Dynamic previous step based on gender and hormone therapy
      if (formData.niches?.includes('Female') || formData.sex === 'Female') {
        return 'pregnancy';
      } else {
        // Male - could come from hormone_therapy (No) or from completed HT flow
        if (formData.hormoneTherapy === 'No') {
          return 'hormone_therapy';
        } else {
          return 'hormone_therapy'; // Fallback - navigation will handle HT completion
        }
      }
    }
  },
  {
    id: 'stairs',
    component: StairsForm,
    title: 'Stairs Climbing Capacity Question',
    nextStepLogic: (formData: FormData) => {
      // After stairs question, go to lifting question
      return 'lifting';
    },
    prevStepId: 'walking'
  },
  {
    id: 'lifting',
    component: LiftingForm,
    title: 'Carry-On Lifting Capacity Question',
    nextStepLogic: (formData: FormData) => {
      // After lifting question, go to sleep question
      return 'sleep';
    },
    prevStepId: 'stairs'
  },
  {
    id: 'sleep',
    component: SleepForm,
    title: 'Sleep Hours Question',
    nextStepLogic: (formData: FormData) => {
      // After sleep hours, go to snoring question
      return 'snoring';
    },
    prevStepId: 'lifting'
  },
  {
    id: 'snoring',
    component: SnoringForm,
    title: 'Snoring/Sleep Apnea Question',
    nextStepLogic: (formData: FormData) => {
      // After snoring question, go to sleep schedule question
      return 'sleep_schedule';
    },
    prevStepId: 'sleep'
  },
  {
    id: 'sleep_schedule',
    component: SleepScheduleForm,
    title: 'Sleep Schedule Consistency Question',
    nextStepLogic: (formData: FormData) => {
      // After sleep schedule, go to eating habits
      return 'stress';
    },
    prevStepId: 'snoring'
  },
  {
    id: 'stress',
    component: StressForm,
    title: 'Stress Level Question',
    nextStepLogic: (formData: FormData) => {
      // After stress level, go to loneliness assessment
      return 'loneliness';
    },
    prevStepId: 'sleep_schedule'
  },
  {
    id: 'loneliness',
    component: LonelinessForm,
    title: 'Loneliness/Social Connection Question',
    nextStepLogic: (formData: FormData) => {
      // After loneliness assessment, go to eating habits
      return 'eating';
    },
    prevStepId: 'stress'
  },
  {
    id: 'eating',
    component: EatingForm,
    title: 'Eating Habits Question',
    nextStepLogic: (formData: FormData) => {
      // After eating habits, go to alcohol consumption
      return 'alcohol';
    },
    prevStepId: 'loneliness'
  },
  {
    id: 'alcohol',
    component: AlcoholForm,
    title: 'Alcohol Consumption Question',
    nextStepLogic: (formData: FormData) => {
      // End of form after alcohol question
      return null;
    },
    prevStepId: 'eating'
  }
  
  // Example of how to add more questions:
  // {
  //   id: 'question_3',
  //   component: Question3Form,
  //   title: 'Third Question',
  //   nextStepLogic: (formData: FormData) => {
  //     // Conditional routing example
  //     if (formData.sex === 'Female') {
  //       return 'female_specific_question';
  //     }
  //     return 'general_question_4';
  //   },
  //   prevStepId: 'sex'
  // },
  // {
  //   id: 'female_specific_question',
  //   component: FemaleSpecificForm,
  //   title: 'Female-Specific Question',
  //   nextStepLogic: (formData: FormData) => 'general_question_5',
  //   prevStepId: 'question_3'
  // }
];

// Helper function to find step by ID
export const findStepById = (id: string): FormStep | undefined => {
  return formConfig.find(step => step.id === id);
};

// Helper function to find step index by ID
export const findStepIndexById = (id: string): number => {
  return formConfig.findIndex(step => step.id === id);
};

// Get the first step
export const getFirstStep = (): FormStep => {
  return formConfig[0];
};