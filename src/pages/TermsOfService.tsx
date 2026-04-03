import React from 'react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8 prose prose-invert">
      <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
      <p className="text-zinc-400">Last updated: March 30, 2026</p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
        <p className="text-zinc-400">
          By accessing or using YTGrowthAI, you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">2. Use License</h2>
        <p className="text-zinc-400">
          We grant you a personal, non-exclusive license to use our AI tools for your YouTube content creation. You are responsible for the content you publish using our tools.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">3. Usage Limits</h2>
        <p className="text-zinc-400">
          Free users are limited to 5 generations per day. Pro users have unlimited access, subject to our fair use policy to prevent automated abuse of our systems.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">4. Disclaimer</h2>
        <p className="text-zinc-400">
          The AI-generated content is provided "as is". While we strive for high quality, we do not guarantee the accuracy or effectiveness of the generated titles, scripts, or SEO tags.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">5. Governing Law</h2>
        <p className="text-zinc-400">
          These terms are governed by and construed in accordance with the laws of the jurisdiction in which our company is registered.
        </p>
      </section>
    </div>
  );
};
