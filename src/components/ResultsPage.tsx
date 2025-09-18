import React from 'react';
import Logo from './Logo';
import { FormData } from '../types/form';

interface ResultsPageProps {
  formData: FormData;
  onBack: () => void;
}

// Mock data structure - in production this would come from your API
const getMockResultsData = (formData: FormData) => ({
  "profile": { 
    "name": null, 
    "sex": formData.sex || "Unknown", 
    "age": parseInt(formData.age || "0"), 
    "location": "TX" 
  },
  "metrics": {
    "height_cm": parseInt(formData.heightCentimeters || "172"),
    "weight_kg": Math.round(parseFloat(formData.weightKg || "71")),
    "bmi": 24.0,
    "activity_minutes_week": 150
  },
  "body_age": {
    "delta_years_min": 7,
    "delta_years_max": 10,
    "direction": "older",
    "confidence": "medium",
    "confidence_notes": ["Sleep schedule chaotic", "Unexplained weight loss"]
  },
  "drivers": [
    { "label": "Circadian disruption (night shifts / no set schedule)", "impact_years": +3.2 },
    { "label": "Family history: early heart attack/stroke", "impact_years": +2.4 },
    { "label": "Diet quality mixed (processed + healthy)", "impact_years": +1.6 }
  ],
  "positives": [
    "7–8h sleep duration (quantity OK)",
    "150–299 min weekly walking",
    "No alcohol",
    "No snoring, good stairs/lifting capacity",
    "No current medical conditions reported"
  ],
  "risk_flags": [
    { "type": "medical", "label": "Unintentional weight loss", "severity": "high" },
    { "type": "lifestyle", "label": "Shift-work circadian misalignment", "severity": "medium" },
    { "type": "family", "label": "Premature cardiovascular disease in family", "severity": "medium" }
  ],
  "quick_wins": [
    { "title": "Circadian reset", "detail": "Fix sleep window (e.g., 23:30–07:00) 7 nights; anchor wake time; no weekend drift.", "expected_delta_years": -1.6 },
    { "title": "Zone-2 floor", "detail": "35–45 min brisk walk or cycle, 5x/week (keep HR conversational).", "expected_delta_years": -1.1 },
    { "title": "Protein & fiber rebase", "detail": "1.6 g/kg/day protein; ≥30 g fiber/day; replace late-night junk with casein/Greek yogurt + fruit.", "expected_delta_years": -0.9 }
  ],
  "recommendations": [
    { "product": "Advanced Testing", "why": "Unintentional weight loss + family CVD → screen thyroid, iron, CBC, CRP, lipids/ApoB, A1c, CMP." },
    { "product": "Cardiovascular Disease Prevention and Reversal", "why": "Family risk; establish baseline (ApoB, Lp(a)), BP patterning, lifestyle plan." },
    { "product": "Virtual Consultations", "why": "Fast triage; telemedicine fits schedule to address shift-work and labs." }
  ],
  "peptide_position": {
    "indicated": false,
    "rationale": "Age 19 with unresolved weight loss → rule out medical causes first. Peptides are not first-line in adolescents/young adults without diagnostics."
  },
  "cta": {
    "primary": "Book a Reversal Consult",
    "subtext": "15 minutes. $0. Telemedicine. Get a 30-day reversal plan.",
    "scarcity": "Limited free slots for TX this month."
  },
  "faq": [
    { "q": "Does peptide therapy fit everyone?", "a": "No. It's selective and clinician-guided. At 19, focus on diagnostics and circadian repair first." },
    { "q": "Why am I 'older' if I'm active and don't drink?", "a": "Circadian chaos + family CVD history pull hard in the wrong direction. Quantity of sleep ≠ quality/synchrony." },
    { "q": "Is this a diagnosis?", "a": "No. It's a risk model. High-priority next step is labs + clinician review." }
  ]
});

export default function ResultsPage({ formData, onBack }: ResultsPageProps) {
  const results = getMockResultsData(formData);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medical': return '🏥';
      case 'lifestyle': return '🏃‍♂️';
      case 'family': return '👨‍👩‍👧‍👦';
      default: return '⚠️';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Logo />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        {/* Body Age Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl font-bold text-accent mb-2">
              {results.profile.age + results.body_age.delta_years_min}–{results.profile.age + results.body_age.delta_years_max}
            </div>
            <div className="text-lg text-gray-600">
              Your body age is <span className="font-semibold text-accent">{results.body_age.delta_years_min}–{results.body_age.delta_years_max} years {results.body_age.direction}</span> than your calendar age of {results.profile.age}
            </div>
            <div className="mt-4 inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              {results.body_age.confidence} confidence
            </div>
          </div>
          
          {/* Confidence Notes */}
          <div className="bg-gray-50 rounded-xl p-4 mt-6">
            <div className="text-sm font-semibold text-gray-700 mb-2">Key factors identified:</div>
            <div className="space-y-1">
              {results.body_age.confidence_notes.map((note, index) => (
                <div key={index} className="text-sm text-gray-600">• {note}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile & Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{results.profile.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sex:</span>
                <span className="font-medium">{results.profile.sex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{results.profile.location}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Height:</span>
                <span className="font-medium">{results.metrics.height_cm} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">{results.metrics.weight_kg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">BMI:</span>
                <span className="font-medium">{results.metrics.bmi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Activity:</span>
                <span className="font-medium">{results.metrics.activity_minutes_week} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Age Drivers */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What's aging you faster</h3>
          <div className="space-y-4">
            {results.drivers.map((driver, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex-1">
                  <div className="text-gray-900">{driver.label}</div>
                </div>
                <div className="text-red-600 font-semibold">
                  +{driver.impact_years} years
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Positives */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What you're doing right</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.positives.map((positive, index) => (
              <div key={index} className="flex items-center p-3 bg-green-50 rounded-xl border border-green-100">
                <span className="text-green-500 mr-3">✓</span>
                <div className="text-gray-900 text-sm">{positive}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Flags */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk flags to address</h3>
          <div className="space-y-3">
            {results.risk_flags.map((flag, index) => (
              <div key={index} className={`flex items-center p-4 rounded-xl border ${getSeverityColor(flag.severity)}`}>
                <span className="text-xl mr-3">{getTypeIcon(flag.type)}</span>
                <div className="flex-1">
                  <div className="font-medium">{flag.label}</div>
                  <div className="text-xs opacity-75 mt-1">{flag.type} • {flag.severity} priority</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Wins */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick wins (start here)</h3>
          <div className="space-y-4">
            {results.quick_wins.map((win, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-lg font-semibold text-blue-900">{win.title}</div>
                  <div className="text-blue-600 font-semibold text-sm">
                    {win.expected_delta_years} years
                  </div>
                </div>
                <div className="text-gray-700 text-sm leading-relaxed">
                  {win.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended next steps</h3>
          <div className="space-y-4">
            {results.recommendations.map((rec, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-xl">
                <div className="font-semibold text-gray-900 mb-2">{rec.product}</div>
                <div className="text-gray-700 text-sm">{rec.why}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Peptide Position */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peptide therapy assessment</h3>
          <div className={`p-4 rounded-xl border ${results.peptide_position.indicated ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="font-semibold mb-2">
              {results.peptide_position.indicated ? '✓ Indicated' : '⚠️ Not currently indicated'}
            </div>
            <div className="text-gray-700 text-sm">{results.peptide_position.rationale}</div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-accent text-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">{results.cta.primary}</h3>
          <p className="text-lg mb-4 opacity-90">{results.cta.subtext}</p>
          <p className="text-sm opacity-75 mb-6">{results.cta.scarcity}</p>
          <button className="bg-white text-accent px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors">
            Book Now
          </button>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently asked questions</h3>
          <div className="space-y-4">
            {results.faq.map((item, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="font-semibold text-gray-900 mb-2">{item.q}</div>
                <div className="text-gray-700 text-sm">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Back to Form
          </button>
        </div>
      </div>

      {/* Fixed Floating Booking Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-accent hover:bg-accent/90 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-accent/25 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-3 font-semibold text-lg group animate-pulse hover:animate-none">
          <div className="flex items-center space-x-2">
            <span>📅</span>
            <span>Book Free Consult</span>
          </div>
          <div className="w-2 h-2 bg-white rounded-full animate-ping group-hover:animate-none"></div>
        </button>
      </div>
    </div>
  );
}