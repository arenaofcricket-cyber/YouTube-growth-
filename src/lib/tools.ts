export type ToolType = 'title' | 'tags' | 'description' | 'thumbnail' | 'script' | 'hashtag';

export interface Tool {
  id: ToolType;
  name: string;
  description: string;
  icon: string;
  prompt: string;
  systemInstruction: string;
}

export const TOOLS: Tool[] = [
  {
    id: 'title',
    name: 'Title Generator',
    description: 'Generate 10 captivating and high-CTR YouTube titles with strong CTAs.',
    icon: 'Type',
    prompt: 'Generate 10 captivating and high-CTR YouTube titles with strong CTAs for a video about {topic}. Target Audience: {audience}. Tone: {tone}.',
    systemInstruction: 'You are a world-class YouTube SEO and Growth expert. Your goal is to create titles that maximize CTR (Click-Through Rate) by using psychological triggers, power words, and compelling hooks. Every single title MUST incorporate a strong, actionable call to action or a high-stakes curiosity gap. Use direct, punchy language that commands attention. Focus on the benefit to the viewer or the cost of not watching. Ensure each title creates an irresistible urge to click while maintaining relevance to the topic and specified audience. Format the output as a clear numbered list. For each title, provide a brief "Why it works" explanation focusing on the emotional trigger and the specific CTA strategy employed.'
  },
  {
    id: 'tags',
    name: 'Tags Generator',
    description: 'Get SEO-friendly tags to improve your search ranking.',
    icon: 'Hash',
    prompt: 'Generate a list of SEO-friendly YouTube tags for a video about: ',
    systemInstruction: 'You are an SEO specialist. Provide a comma-separated list of highly relevant tags for YouTube search. Also, group them into "Primary Keywords", "Secondary Keywords", and "Long-tail Keywords" for better organization.'
  },
  {
    id: 'description',
    name: 'Description Generator',
    description: 'Create full, SEO-optimized YouTube descriptions.',
    icon: 'FileText',
    prompt: 'Generate a full YouTube description for: {topic}. Tone: {tone}.',
    systemInstruction: 'You are a content strategist. Write a detailed, SEO-friendly description. Use clear headings like 📝 ABOUT THIS VIDEO, 📌 TIMESTAMPS, 🔗 SOCIAL LINKS, and 🏷️ HASHTAGS. Use emojis to make it visually appealing and readable. Ensure the tone matches the specified style (e.g., Informative, Engaging, Promotional).'
  },
  {
    id: 'thumbnail',
    name: 'Thumbnail Idea Generator',
    description: 'Creative thumbnail concepts to increase your CTR.',
    icon: 'Image',
    prompt: 'Generate 5 creative and high-CTR thumbnail ideas for a video about: ',
    systemInstruction: 'You are a graphic designer and YouTube growth expert. For each idea, provide: 1) Background Description, 2) Main Subject/Person, 3) Text Overlay (Bold & Short), and 4) Color Palette. Use a clear structured format.'
  },
  {
    id: 'script',
    name: 'Viral Script Generator (Shorts)',
    description: 'Engaging 30-60 second scripts for viral Shorts.',
    icon: 'Zap',
    prompt: 'Generate a viral 30-60 second script for a YouTube Short about: {topic}. Tone: {tone}.',
    systemInstruction: 'You are a viral content creator. Write a script with clear sections: [00-05s] THE HOOK, [05-45s] THE VALUE, [45-60s] CALL TO ACTION. Include visual cues in brackets like [Visual: Show screen recording]. Ensure the script matches the specified tone (e.g., Funny, Informative, Inspiring, Dramatic).'
  },
  {
    id: 'hashtag',
    name: 'Hashtag Generator',
    description: 'Find trending hashtags to reach a wider audience.',
    icon: 'TrendingUp',
    prompt: 'Generate 15 trending and relevant hashtags for a YouTube video about: ',
    systemInstruction: 'You are a social media manager. Provide a list of hashtags grouped by "High Volume", "Medium Volume", and "Niche Specific". Explain how many hashtags are recommended for the description.'
  }
];
