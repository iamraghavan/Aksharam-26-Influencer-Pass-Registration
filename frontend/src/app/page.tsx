"use client";

import React, { useState, useRef, useEffect } from "react";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { RegistrationStepper, StepProps } from "@/components/ui/registration-stepper";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function AksharamRegistration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    instagram: "",
    followers: "",
    otherPlatforms: "",
    engagement: [] as string[],
    passCount: "",
    category: "",
    agreement1: false,
    agreement2: false,
    agreement3: false,
  });
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync WhatsApp with Phone if checked
  useEffect(() => {
    if (sameAsPhone) {
      setFormData(prev => ({ ...prev, whatsapp: prev.phone }));
    }
  }, [formData.phone, sameAsPhone]);

  const cityInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityFocus = () => {
    if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps && cityInputRef.current) {
      if (!cityInputRef.current.dataset.hasAutocomplete) {
        const autocomplete = new (window as any).google.maps.places.Autocomplete(cityInputRef.current, {
          types: ['(cities)'],
        });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place && place.name) {
            setFormData(prev => ({ ...prev, city: place.name || '' }));
          }
        });
        cityInputRef.current.dataset.hasAutocomplete = 'true';
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name === "engagement") {
      setFormData((prev) => {
        if (checked) return { ...prev, engagement: [...prev.engagement, value] };
        return { ...prev, engagement: prev.engagement.filter((item) => item !== value) };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--color-carbon-gray-10)] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-10 border border-[var(--color-carbon-gray-20)] shadow-carbon-sm text-center">
          <div className="w-16 h-16 bg-[var(--color-carbon-success-50)] text-white flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[var(--color-carbon-gray-100)] mb-3">Registration Complete</h2>
          <p className="text-[var(--color-carbon-gray-70)] mb-8">
            Your influencer pass request for Aksharam'26 has been received. We will send the details to your email.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  // Carbon Design shared input classes
  const inputCarbonClass = "w-full p-3 bg-[var(--color-carbon-gray-10)] border-b-2 border-b-[var(--color-carbon-gray-40)] focus:outline-none focus:border-b-[var(--color-carbon-blue-60)] focus:bg-[var(--color-carbon-gray-20)] transition-colors text-sm text-[var(--color-carbon-gray-100)]";
  const labelCarbonClass = "text-xs font-semibold tracking-wide text-[var(--color-carbon-gray-70)] uppercase mb-1 block";

  const steps: StepProps[] = [
    {
      step: 1,
      title: "Basic Details",
      description: "Your personal information",
      content: (
        <div className="space-y-6">
          <div>
            <label className={labelCarbonClass}>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={inputCarbonClass} placeholder="Enter full name" />
          </div>
          <div>
            <label className={labelCarbonClass}>Phone Number</label>
            <PhoneInput
              defaultCountry="in"
              value={formData.phone}
              onChange={(phone) => handlePhoneChange("phone", phone)}
              inputClassName={inputCarbonClass}
              style={{ '--react-international-phone-border-color': 'transparent', '--react-international-phone-background-color': 'transparent', '--react-international-phone-text-color': 'var(--color-carbon-gray-100)' } as React.CSSProperties}
              className="flex items-stretch w-full"
              countrySelectorStyleProps={{
                buttonClassName: "!bg-[var(--color-carbon-gray-10)] !border-none !border-b-2 !border-b-[var(--color-carbon-gray-40)] !rounded-none !h-[42.79px] !px-3",
              }}
              inputProps={{
                name: "phone",
                className: `!flex-1 !border-none !border-b-2 !border-l-2 !border-b-[var(--color-carbon-gray-40)] !border-l-white focus:!border-b-[var(--color-carbon-blue-60)] !bg-[var(--color-carbon-gray-10)] focus:!bg-[var(--color-carbon-gray-20)] !rounded-none !p-3 !text-sm !text-[var(--color-carbon-gray-100)] !shadow-none !outline-none`
              }}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold tracking-wide text-[var(--color-carbon-gray-70)] uppercase block">WhatsApp Number</label>
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4 border-2 border-[var(--color-carbon-gray-100)] group-hover:border-[var(--color-carbon-blue-60)] flex-shrink-0">
                  <input type="checkbox" checked={sameAsPhone} onChange={(e) => setSameAsPhone(e.target.checked)} className="absolute opacity-0 w-full h-full cursor-pointer" />
                  {sameAsPhone && <div className="w-2 h-2 bg-[var(--color-carbon-blue-60)]" />}
                </div>
                <span className="text-xs text-[var(--color-carbon-gray-90)]">Same as Phone</span>
              </label>
            </div>
            
            {!sameAsPhone && (
              <PhoneInput
                defaultCountry="in"
                value={formData.whatsapp}
                onChange={(phone) => handlePhoneChange("whatsapp", phone)}
                style={{ '--react-international-phone-border-color': 'transparent', '--react-international-phone-background-color': 'transparent', '--react-international-phone-text-color': 'var(--color-carbon-gray-100)' } as React.CSSProperties}
                className="flex items-stretch w-full"
                countrySelectorStyleProps={{
                  buttonClassName: "!bg-[var(--color-carbon-gray-10)] !border-none !border-b-2 !border-b-[var(--color-carbon-gray-40)] !rounded-none !h-[42.79px] !px-3",
                }}
                inputProps={{
                  name: "whatsapp",
                  className: `!flex-1 !border-none !border-b-2 !border-l-2 !border-b-[var(--color-carbon-gray-40)] !border-l-white focus:!border-b-[var(--color-carbon-blue-60)] !bg-[var(--color-carbon-gray-10)] focus:!bg-[var(--color-carbon-gray-20)] !rounded-none !p-3 !text-sm !text-[var(--color-carbon-gray-100)] !shadow-none !outline-none`
                }}
              />
            )}
            {sameAsPhone && (
               <input type="tel" disabled value={formData.whatsapp} className={`${inputCarbonClass} opacity-70 cursor-not-allowed`} />
            )}
          </div>
          <div>
            <label className={labelCarbonClass}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputCarbonClass} placeholder="Enter email address" />
          </div>
          <div>
            <label className={labelCarbonClass}>City</label>
            <input type="text" name="city" ref={cityInputRef} onFocus={handleCityFocus} value={formData.city} onChange={handleInputChange} className={inputCarbonClass} placeholder="Enter city (Powered by Google Maps)" />
          </div>
          <Button className="w-full mt-6 flex justify-between items-center pr-2" onClick={nextStep} disabled={!formData.fullName || !formData.phone || !formData.whatsapp || !formData.email || !formData.city}>
            Continue <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      ),
    },
    {
      step: 2,
      title: "Social Media Presence",
      description: "Link your profiles",
      content: (
        <div className="space-y-6">
          <div>
            <label className={labelCarbonClass}>Instagram Handle</label>
            <input type="text" name="instagram" value={formData.instagram} onChange={handleInputChange} className={inputCarbonClass} placeholder="@username" />
          </div>
          <div>
            <label className={labelCarbonClass}>Followers Count</label>
            <select name="followers" value={formData.followers} onChange={handleInputChange} className={inputCarbonClass}>
              <option value="" disabled>Select range</option>
              <option value="1K-5K">1K - 5K</option>
              <option value="5K-10K">5K - 10K</option>
              <option value="10K-50K">10K - 50K+</option>
              <option value="50K+">50K+</option>
            </select>
          </div>
          <div>
            <label className={labelCarbonClass}>Other Platforms</label>
            <input type="text" name="otherPlatforms" value={formData.otherPlatforms} onChange={handleInputChange} className={inputCarbonClass} placeholder="YouTube, Snapchat, etc." />
          </div>
          <div>
            <label className={labelCarbonClass}>Engagement Type</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {['Reels', 'Stories', 'Posts', 'Live'].map(type => (
                <label key={type} className="flex items-start space-x-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 border-2 border-[var(--color-carbon-gray-100)] group-hover:border-[var(--color-carbon-blue-60)] transition-colors mt-0.5">
                    <input type="checkbox" name="engagement" value={type} checked={formData.engagement.includes(type)} onChange={handleCheckboxChange} className="absolute opacity-0 w-full h-full cursor-pointer" />
                    {formData.engagement.includes(type) && (
                      <div className="w-3 h-3 bg-[var(--color-carbon-blue-60)]" />
                    )}
                  </div>
                  <span className="text-sm text-[var(--color-carbon-gray-100)]">{type}</span>
                </label>
              ))}
            </div>
          </div>
          <Button className="w-full mt-6 flex justify-between items-center pr-2" onClick={nextStep} disabled={!formData.instagram || !formData.followers}>
            Continue <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      ),
    },
    {
      step: 3,
      title: "Pass Details",
      description: "Requirements and agreements",
      content: (
        <div className="space-y-6">
          <div>
            <label className={labelCarbonClass}>Passes Required</label>
            <select name="passCount" value={formData.passCount} onChange={handleInputChange} className={inputCarbonClass}>
              <option value="" disabled>Select quantity</option>
              <option value="1">1 Person</option>
              <option value="2">2 Persons</option>
              <option value="Team">Team</option>
            </select>
          </div>
          <div>
            <label className={labelCarbonClass}>Category</label>
            <div className="grid gap-3 mt-2">
              {['Influencer', 'Creator', 'Campus Ambassador'].map(cat => (
                <label key={cat} className="flex items-center space-x-3 p-4 border border-[var(--color-carbon-gray-30)] hover:border-[var(--color-carbon-blue-60)] cursor-pointer transition-colors">
                  <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-[var(--color-carbon-gray-100)]">
                    <input type="radio" name="category" value={cat} checked={formData.category === cat} onChange={handleInputChange} className="absolute opacity-0 w-full h-full cursor-pointer" />
                    {formData.category === cat && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-carbon-blue-60)]" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-[var(--color-carbon-gray-100)]">{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <Button className="w-full mt-6 flex justify-between items-center pr-2" onClick={nextStep} disabled={!formData.passCount || !formData.category}>
            Continue <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      ),
    },
    {
      step: 4,
      title: "Agreement",
      description: "Final confirm",
      content: (
        <div className="space-y-6">
          <div className="bg-[var(--color-carbon-gray-10)] p-6 border-l-4 border-[var(--color-carbon-blue-60)] space-y-4">
            <label className="flex items-start space-x-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 border-2 border-[var(--color-carbon-gray-100)] group-hover:border-[var(--color-carbon-blue-60)] flex-shrink-0 mt-0.5">
                <input type="checkbox" name="agreement1" checked={formData.agreement1} onChange={handleCheckboxChange} className="absolute opacity-0 w-full h-full cursor-pointer" />
                 {formData.agreement1 && <div className="w-3 h-3 bg-[var(--color-carbon-blue-60)]" />}
              </div>
              <span className="text-sm text-[var(--color-carbon-gray-90)]">I agree to publish at least 3 posts/reels and a minimum of 2 stories during the event.</span>
            </label>
            <label className="flex items-start space-x-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 border-2 border-[var(--color-carbon-gray-100)] group-hover:border-[var(--color-carbon-blue-60)] flex-shrink-0 mt-0.5">
                <input type="checkbox" name="agreement2" checked={formData.agreement2} onChange={handleCheckboxChange} className="absolute opacity-0 w-full h-full cursor-pointer" />
                 {formData.agreement2 && <div className="w-3 h-3 bg-[var(--color-carbon-blue-60)]" />}
              </div>
              <span className="text-sm text-[var(--color-carbon-gray-90)]">I agree to accurately tag the official Aksharam'26 page in all event-related content.</span>
            </label>
            <label className="flex items-start space-x-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 border-2 border-[var(--color-carbon-gray-100)] group-hover:border-[var(--color-carbon-blue-60)] flex-shrink-0 mt-0.5">
                <input type="checkbox" name="agreement3" checked={formData.agreement3} onChange={handleCheckboxChange} className="absolute opacity-0 w-full h-full cursor-pointer" />
                 {formData.agreement3 && <div className="w-3 h-3 bg-[var(--color-carbon-blue-60)]" />}
              </div>
              <span className="text-sm text-[var(--color-carbon-gray-90)]">
                I have read and agree to the <a href="/policy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-carbon-blue-60)] hover:underline font-semibold">Influencer Terms & Policy</a>.
              </span>
            </label>
          </div>
          <Button className="w-full flex justify-between items-center pr-2" onClick={submitForm} disabled={!formData.agreement1 || !formData.agreement2 || !formData.agreement3 || isSubmitting}>
            {isSubmitting ? "Processing..." : "Submit Application"}
             {!isSubmitting && <ChevronRight className="w-5 h-5" />}
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-carbon-gray-10)] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto mb-8">
        <h1 className="text-4xl font-light text-[var(--color-carbon-gray-100)] mb-1">Aksharam'26</h1>
        <p className="text-sm font-semibold tracking-wider text-[var(--color-carbon-gray-60)] uppercase">Influencer Pass Registration</p>
      </div>
      
      <RegistrationStepper
        currentStep={currentStep}
        steps={steps}
        headerTitle="Application Status"
        headerStatus="Draft"
      />
    </div>
  );
}
