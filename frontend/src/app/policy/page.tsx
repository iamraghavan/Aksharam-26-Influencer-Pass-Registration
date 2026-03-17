import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-carbon-gray-10)] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 border border-[var(--color-carbon-gray-20)] shadow-carbon-sm">
        
        <div className="mb-10 border-b border-[var(--color-carbon-gray-20)] pb-6">
          <h1 className="text-3xl font-light text-[var(--color-carbon-gray-100)] mb-2">Aksharam'26</h1>
          <p className="text-sm font-semibold tracking-wider text-[var(--color-carbon-gray-60)] uppercase">Influencer Terms & Policy</p>
        </div>

        <div className="space-y-8 text-[var(--color-carbon-gray-90)] leading-relaxed">
          
          <section>
            <h2 className="text-xl font-semibold mb-4 text-[var(--color-carbon-gray-100)]">1. Content Deliverables</h2>
            <p className="mb-3">
              By registering as an active Influencer or Campus Ambassador for Aksharam'26, you agree to fulfill the following essential content deliverables during the course of the event:
            </p>
            <ul className="list-disc pl-6 space-y-2 border-l-2 border-[var(--color-carbon-blue-60)] ml-2">
              <li><strong>Minimum Posts/Reels:</strong> You must publish at least <strong>three (3)</strong> high-quality posts or reels to your primary registered social media feed.</li>
              <li><strong>Minimum Stories:</strong> You must publish a minimum of <strong>two (2)</strong> stories documenting your real-time experience at the event.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-[var(--color-carbon-gray-100)]">2. Content Tagging & Attribution</h2>
            <p className="mb-3">
              All event-related content (posts, reels, stories, live streams) must accurately tag and mention the official Aksharam'26 social media accounts. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2 border-l-2 border-[var(--color-carbon-blue-60)] ml-2">
              <li>The official Aksharam'26 page must be tagged as a collaborator or explicitly mentioned in the primary caption of posts and reels.</li>
              <li>Visible mentions (via text or interactive stickers) must be present in all stories.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-[var(--color-carbon-gray-100)]">3. Representation & Conduct</h2>
            <p>
              As an influencer attending on a subsidized or comped pass, you are representing both your own brand and the Aksharam'26 festival. We expect all content creators to maintain a professional, respectful demeanor toward event staff, artists, and attendees. 
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-[var(--color-carbon-gray-100)]">4. Revocation of Pass</h2>
            <p>
              Failure to meet the agreed-upon content deliverables or adhere to the code of conduct may result in the revocation of future influencer privileges or immediate cancellation of your current pass without entry. 
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-carbon-gray-20)] flex justify-start">
          <Link href="/">
            <Button variant="outline" className="flex items-center">
              Back to Registration
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
