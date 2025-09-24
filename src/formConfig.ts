import { FormStep, FormData } from './types/form';
import AccountNameForm from './components/AccountNameForm';
import SocialNetworkTypeForm from './components/SocialNetworkTypeForm';
import InstagramHandleForm from './components/InstagramHandleForm';
import InstagramConfirmationForm from './components/InstagramConfirmationForm';
import WebsiteLinkForm from './components/WebsiteLinkForm';
import NicheForm from './components/NicheForm';
import ProfileMonitoringForm from './components/ProfileMonitoringForm';
import TargetsForm from './components/TargetsForm';
import WeightChangeForm from './components/WeightChangeForm';
import MainObjectiveForm from './components/MedicalConditionsForm';

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
      return 'instagram_confirmation';
    },
    prevStepId: 'social_network_type'
  },
  {
    id: 'instagram_confirmation',
    component: InstagramConfirmationForm,
    title: 'Instagram Profile Confirmation',
    nextStepLogic: (formData: FormData) => {
      return 'has_website';
    },
    prevStepId: 'instagram_handle'
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
        // If no website, continue to niches question
        return 'niches';
      }
    },
    prevStepId: 'instagram_confirmation'
  },
  {
    id: 'website_link',
    component: WebsiteLinkForm,
    title: 'Website Link Question',
    nextStepLogic: (formData: FormData) => {
      return 'niches';
    },
    prevStepId: 'has_website'
  },
  {
    id: 'niches',
    component: NicheForm,
    title: 'Niche Selection Question',
    nextStepLogic: (formData: FormData) => {
      // Always go to main objective next
      return 'main_objective';
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
      // After main objective, go to profile monitoring
      return 'profile_monitoring';
    },
    prevStepId: 'niches'
  },
  {
    id: 'profile_monitoring',
    component: ProfileMonitoringForm,
    title: 'Profile Monitoring Question',
    nextStepLogic: (formData: FormData) => {
      // After profile monitoring, check if they know which profiles to monitor
      if (formData.profileMonitoring === 'Sim') {
        return 'targets';
      } else {
        // If they don't know which profiles to monitor, skip targets and go to hormone therapy
        return 'hormone_therapy';
      }
    },
    prevStepId: 'main_objective'
  },
  {
    id: 'targets',
    component: TargetsForm,
    title: 'Targets to Monitor Question',
    nextStepLogic: (formData: FormData) => {
      // End of form after targets
      return null;
    },
    prevStepId: 'profile_monitoring'
  }
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