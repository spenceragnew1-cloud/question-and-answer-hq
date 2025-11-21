export type CategoryId =
  | 'general_health'
  | 'nutrition'
  | 'sleep'
  | 'fitness_exercise'
  | 'parenting'
  | 'relationships'
  | 'home_cleaning'
  | 'cooking_food'
  | 'money_finance'
  | 'productivity'
  | 'mental_health'
  | 'animals_wildlife'
  | 'education_learning'
  | 'geography'
  | 'history'
  | 'hobbies_diy'
  | 'miscellaneous'
  | 'outdoor_nature'
  | 'science';

export interface CategoryDef {
  id: CategoryId;
  slug: string;
  label: string;
  description: string;
  intro: string;
  longIntro?: string;
  faqs?: {
    question: string;
    answer: string;
  }[];
  subtopics?: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'general_health',
    slug: 'general_health',
    label: 'Health & Wellness',
    description: 'Evidence-based answers for health, wellness, and healthy living.',
    intro: 'Health & Wellness covers evidence-based advice on healthy living, disease prevention, and everyday habits that support long-term health. These answers help people build sustainable routines and make informed decisions about their well-being. We provide practical guidance backed by current research to help you navigate health choices confidently.',
    longIntro:
      'Health & Wellness covers evidence-based advice on healthy living, disease prevention, energy, recovery, and everyday lifestyle choices. This category helps readers understand how sleep, movement, stress, nutrition, and habits interact to support long-term well-being. The goal is to translate scientific research into clear, practical guidance that feels doable in real life.',
    faqs: [
      {
        question: 'What kinds of topics are included in Health & Wellness?',
        answer:
          'The Health & Wellness category includes questions about daily habits, prevention strategies, immune function, energy, recovery, and lifestyle choices that impact long-term well-being.',
      },
      {
        question: 'Is the Health & Wellness information medical advice?',
        answer:
          'No. The information in Health & Wellness is educational and based on current research, but it is not a substitute for personal medical advice from a qualified professional.',
      },
      {
        question: 'How can I use this category to improve my health?',
        answer:
          'You can browse questions that match your current goals—such as improving sleep, managing stress, or building healthier routines—and apply the practical suggestions that fit your situation.',
      },
    ],
    subtopics: [
      'Sleep quality and routines',
      'Stress and recovery',
      'Immune health basics',
      'Daily movement and posture',
      'Energy and fatigue',
      'Healthy habit building',
    ],
  },
  {
    id: 'animals_wildlife',
    slug: 'animals_wildlife',
    label: 'Animals & Wildlife',
    description: 'Wildlife, conservation, and animal science explained with evidence.',
    intro: 'Animals & Wildlife covers questions about conservation biology, animal behavior, and how humans coexist with wild species. We break down the research behind habitats, biodiversity, and responsible wildlife care so you can understand threats and rewards within a broader ecosystem perspective. Expect practical explanations of how animal science intersects with ecology, climate, and everyday choices.',
  },
  {
    id: 'education_learning',
    slug: 'education_learning',
    label: 'Education & Learning',
    description: 'Research-based guidance on learning strategies, skill acquisition, and education trends.',
    intro: 'Education & Learning focuses on cognitive strategies, study habits, and modern pedagogy. These answers explore how to learn more efficiently, master new skills, and keep up with emerging education research. Whether you are a lifelong learner, parent, or educator, we present evidence-backed techniques to boost retention, motivation, and clarity.',
  },
  {
    id: 'nutrition',
    slug: 'nutrition',
    label: 'Nutrition & Diet',
    description: 'Food, diet, and nutrition questions backed by research.',
    intro: 'Nutrition & Diet provides research-backed guidance on healthy eating, nutrient balance, weight management, and dietary habits. These answers distill current scientific evidence into simple, practical recommendations. Whether you\'re looking to improve your diet, manage weight, or understand how food affects your health, we break down the science into actionable advice.',
    longIntro:
      'Nutrition & Diet is all about using food in a practical, sustainable way to support energy, health, and performance. This category covers everyday questions like how much protein you really need, whether certain diets help or hurt, how meal timing affects appetite and weight, and what the research says about popular nutrition trends. Our goal is to translate nutrition science into clear takeaways you can use without needing a PhD in biochemistry.\n\nA lot of nutrition advice online is oversimplified or driven by extremes — ‘carbs are bad,’ ‘fat is bad,’ ‘eat this miracle food.’ In reality, healthy eating usually comes down to consistent habits: getting enough protein and fiber, eating mostly minimally processed foods, and building meals that fit your lifestyle. We highlight what high-quality research shows, and we also point out where evidence is mixed so you can make informed choices.\n\nYou’ll find answers here on weight management, recovery and muscle building, gut and metabolic health, hydration, supplements, and how nutrition interacts with sleep and stress. Whether your goal is to feel better day-to-day, improve athletic performance, or just eat with more confidence, this hub is built to make nutrition simpler, more realistic, and more evidence-based.\n\nIf you’re not sure where to start, browse the most helpful and trending questions below. Over time, small improvements — like pairing carbs with protein, eating more plants, or setting a simple meal routine — compound into big changes. This category is here to help you find those small improvements that matter most.',
    subtopics: [
      'Protein, muscle, and recovery',
      'Healthy weight loss & appetite control',
      'Carbohydrates, fats, and energy balance',
      'Meal timing and breakfast habits',
      'Gut health and digestive basics',
      'Hydration and electrolytes',
      'Supplements: what helps vs hype',
      'Plant-based and special diets',
    ],
    faqs: [
      {
        question: 'What kinds of questions are included in Nutrition & Diet?',
        answer:
          'This category covers practical, research-backed answers about eating habits, weight management, macronutrients, meal timing, supplements, hydration, and popular diet approaches.',
      },
      {
        question: 'Do I need to follow a specific diet to be healthy?',
        answer:
          'Not necessarily. Most people do best with simple, consistent habits: enough protein and fiber, mostly minimally processed foods, and a routine that matches their lifestyle.',
      },
      {
        question: 'How do you decide what nutrition evidence to trust?',
        answer:
          'We prioritize peer-reviewed research and consensus guidance from trusted scientific institutions. When studies disagree, we explain the strengths and limits of the evidence.',
      },
      {
        question: 'Is this nutritional advice personalized medical guidance?',
        answer:
          'No. Our answers are educational and research-based, but they can’t replace individualized guidance from a registered dietitian or medical professional.',
      },
    ],
  },
  {
    id: 'sleep',
    slug: 'sleep',
    label: 'Sleep',
    description: 'Sleep quality, rest, and recovery science.',
    intro: 'Sleep quality is fundamental to physical health, mental clarity, and overall well-being. This category explores evidence-based strategies for improving sleep hygiene, understanding sleep cycles, and addressing common sleep challenges. Our answers help you optimize your rest and recovery for better performance in all areas of life.',
    longIntro: `Sleep is one of the most powerful tools we have for improving both daily well-being and long-term health. In this category, we explore the science of restful sleep, evidence-based habits, and practical strategies for improving the quality and consistency of your nightly rest. Good sleep affects nearly every system of the body — from metabolism, immune function, and hormonal balance to muscle recovery, learning, and emotional regulation.

Many people struggle with inconsistent sleep patterns, light exposure at the wrong times, excessive stress, or difficulty winding down. We examine what the research says about circadian rhythms, sleep cycles, deep sleep, REM sleep, and how behaviors throughout the day influence nightly rest. This includes topics like caffeine timing, nighttime routines, screen exposure, breathing techniques, environmental changes, and how lifestyle factors such as exercise, nutrition, and stress interact with sleep quality.

For those who train or live an active lifestyle, sleep plays an especially important role in recovery and performance. Studies consistently show that even small improvements in sleep can speed muscle repair, improve mood and focus, and reduce injury risk. Whether you're an athlete, a parent trying to get better rest, or simply someone who wants more energy during the day, understanding how sleep works gives you the tools to create healthier routines.

If you're unsure where to begin, explore the helpful questions below. You’ll find practical suggestions grounded in research — small, sustainable steps that can help you fall asleep faster, wake up feeling more refreshed, and build healthier habits over time.`,
    subtopics: [
      'Circadian rhythm and sleep cycles',
      'Deep sleep vs REM sleep',
      'Bedtime routines and wind-down habits',
      'Caffeine timing and stimulant effects',
      'Light exposure and screen impact',
      'Sleep for recovery and performance',
      'Stress, anxiety, and racing thoughts',
      'Napping and daytime sleepiness',
      'Environmental changes for better sleep',
      'How exercise affects sleep',
    ],
    faqs: [
      {
        question: 'What kinds of questions are included in the Sleep category?',
        answer:
          'This category covers research-backed answers about falling asleep faster, improving sleep quality, recovering from training, managing circadian rhythms, and building better nightly routines.',
      },
      {
        question: 'How much sleep does the average adult need?',
        answer:
          'Most adults need 7–9 hours of sleep per night, though factors like training volume, stress, and health conditions can influence individual needs.',
      },
      {
        question: 'Does screen time really affect sleep?',
        answer:
          'Yes. Bright or blue-rich light in the evening can delay melatonin release and push your sleep cycle later, making it harder to fall asleep.',
      },
      {
        question: 'Can improving sleep help athletic recovery?',
        answer:
          'Absolutely. Quality sleep supports muscle repair, hormone regulation, immune function, and mental focus — all essential for training and performance.',
      },
      {
        question: 'Is this information a substitute for medical advice?',
        answer:
          'No. The Sleep category offers educational, evidence-based guidance, but it does not replace personalized medical advice or treatment.',
      },
    ],
  },
  {
    id: 'fitness_exercise',
    slug: 'fitness_exercise',
    label: 'Fitness & Exercise',
    description: 'Workouts, training, and staying active.',
    intro: 'Fitness & Exercise offers science-backed insights into effective workouts, training methods, and staying active at any fitness level. These answers help you build effective exercise routines, prevent injuries, and understand how different types of training affect your body. Whether you\'re just starting out or looking to optimize your current routine, we provide practical, research-supported guidance.',
    longIntro:
      'Fitness & Exercise covers everything from building strength and endurance to improving mobility, recovery, and overall physical well-being. This category focuses on practical, research-backed advice that helps people move better, feel stronger, and stay consistent with their training. Whether someone is new to fitness or has years of experience, the goal is to simplify the science into clear strategies that actually work in real life.\n\nTraining programs often fail not because the exercises are wrong, but because people struggle with recovery, intensity management, and long-term sustainability. Here we explore topics like proper warm-ups, progressive overload, energy systems, injury prevention, and how to structure strength or cardio sessions based on personal goals. The emphasis is always on practical application — improving technique, choosing the right exercises, and building habits that support long-term progress.\n\nWe also highlight the connection between exercise and overall health. Physical activity improves mood, metabolic function, cardiovascular health, sleep quality, and even cognitive performance. Consistent training reduces the risk of chronic disease and helps people maintain mobility and independence as they age.\n\nFor runners, lifters, athletes, or anyone pursuing an active lifestyle, this category provides guidance on form, frequency, load management, and recovery techniques. By understanding how the body adapts to physical stress, readers can train smarter, reduce injury risk, and make meaningful progress over time.',
    subtopics: [
      'Strength training fundamentals',
      'Cardio and energy systems',
      'Progressive overload',
      'Warm-ups and mobility',
      'Injury prevention and stability',
      'Endurance training basics',
      'HIIT and interval training',
      'Recovery strategies',
      'Exercise technique and form',
      'Training for longevity',
    ],
    faqs: [
      {
        question: 'What topics are covered in the Fitness & Exercise category?',
        answer:
          'This category includes research-backed guidance on strength training, cardio, mobility, warm-ups, recovery strategies, injury prevention, and improving exercise technique.',
      },
      {
        question: 'How often should I work out each week?',
        answer:
          'Most adults benefit from 2–4 strength sessions and 2–3 cardio sessions per week, depending on goals, training age, and recovery capacity.',
      },
      {
        question: 'Do I need a gym to make progress?',
        answer:
          'No. You can build strength, endurance, and mobility using bodyweight exercises, household items, or minimal equipment. A gym simply provides more options.',
      },
      {
        question: 'How do I know if I\'m doing an exercise correctly?',
        answer:
          'Proper technique should feel controlled, stable, and repeatable. If you feel pain, excessive strain, or loss of balance, adjust load, slow down, or choose a regression.',
      },
      {
        question: 'Can exercise improve overall health?',
        answer:
          'Yes. Regular physical activity supports cardiovascular health, metabolic function, mental well-being, sleep, and long-term mobility and independence.',
      },
    ],
  },
  {
    id: 'parenting',
    slug: 'parenting',
    label: 'Parenting',
    description: 'Family, raising kids, and parenting science.',
    intro: 'Parenting brings countless questions about child development, behavior, health, and family dynamics. This category provides evidence-based answers grounded in child development research and parenting science. We help parents make informed decisions about their children\'s wellbeing, from infancy through the teenage years, backed by current research and expert insights.',
  },
  {
    id: 'relationships',
    slug: 'relationships',
    label: 'Relationships',
    description: 'Communication, connection, and relationship skills.',
    intro: 'Healthy relationships require effective communication, emotional intelligence, and practical skills for navigating conflict and building connection. This category explores research-backed strategies for improving relationships with partners, family, friends, and colleagues. Our answers draw from psychology and relationship science to provide actionable guidance for building stronger, more fulfilling connections.',
  },
  {
    id: 'home_cleaning',
    slug: 'home_cleaning',
    label: 'Home & Cleaning',
    description: 'Cleaning, organizing, and maintaining your home.',
    intro: 'Home & Cleaning covers practical strategies for keeping your living space clean, organized, and healthy. These answers explore effective cleaning methods, organization systems, and home maintenance tips backed by research. We help you create a more comfortable and hygienic living environment through evidence-based approaches to household management.',
  },
  {
    id: 'cooking_food',
    slug: 'cooking_food',
    label: 'Cooking & Food',
    description: 'Cooking basics, kitchen tips, and food science.',
    intro: 'Cooking & Food combines practical kitchen skills with food science to help you become a better cook and make smarter food choices. These answers explore cooking techniques, ingredient science, food safety, and kitchen efficiency. Whether you\'re learning the basics or looking to refine your culinary skills, we provide evidence-based guidance to enhance your cooking and eating experience.',
  },
  {
    id: 'money_finance',
    slug: 'money_finance',
    label: 'Money & Finance',
    description: 'Saving, budgeting, and personal finance advice.',
    intro: 'Money & Finance provides evidence-based guidance on personal finance, budgeting, saving strategies, and making informed financial decisions. These answers help you build financial literacy and develop practical money management skills. We break down complex financial concepts into clear, actionable advice to help you achieve your financial goals and build long-term security.',
  },
  {
    id: 'productivity',
    slug: 'productivity',
    label: 'Productivity & Work',
    description: 'Workflows, focus, and productivity strategies.',
    intro: 'Productivity & Work explores research-backed methods for improving focus, managing time, and achieving more with less stress. These answers cover effective workflows, time management techniques, and strategies for maintaining focus in a distracted world. We help you work smarter by applying evidence-based productivity principles that have been tested and proven effective.',
  },
  {
    id: 'mental_health',
    slug: 'mental_health',
    label: 'Mental Health & Mindset',
    description: 'Mindset, stress reduction, and psychological well-being.',
    intro: 'Mental Health & Mindset addresses strategies for managing stress, building resilience, and maintaining psychological well-being. These answers draw from psychology and neuroscience to provide evidence-based approaches to mental health. We help you understand how your mind works and provide practical tools for coping with challenges, managing emotions, and cultivating a healthier mindset.',
  },
  {
    id: 'geography',
    slug: 'geography',
    label: 'Geography',
    description: 'Regional science, landscapes, and place-based insights.',
    intro: 'Geography explores place-based knowledge ranging from physical landscapes to cultural geography. This category answers how geography shapes climate, infrastructure, travel, and human behavior, integrating data from maps, GIS, and spatial research to explain place-focused phenomena.',
  },
  {
    id: 'history',
    slug: 'history',
    label: 'History',
    description: 'Historical contexts, timelines, and evidence-based interpretations.',
    intro: 'History provides context for our present by examining events, movements, and figures through evidence-based interpretations. We highlight sources, timelines, and the historiography behind major developments so readers can appreciate the causes, consequences, and lessons from the past.',
  },
  {
    id: 'hobbies_diy',
    slug: 'hobbies_diy',
    label: 'Hobbies & DIY',
    description: 'Projects, DIY instructions, and hobby-focused how-to knowledge.',
    intro: 'Hobbies & DIY shares practical know-how for crafting, building, and enjoying hands-on projects. These answers focus on safe techniques, materials science, and workflow improvements so hobbyists can plan and complete rewarding creations with confidence.',
  },
  {
    id: 'miscellaneous',
    slug: 'miscellaneous',
    label: 'Miscellaneous',
    description: 'Oddball, cross-topic questions that do not fit within another category.',
    intro: 'Miscellaneous collects interesting questions that span unique or emerging topics. When a question does not cleanly fall under a specialized category, we include it here with the same commitment to citing evidence and keeping the answer approachable.',
  },
  {
    id: 'outdoor_nature',
    slug: 'outdoor_nature',
    label: 'Outdoor & Nature',
    description: 'Outdoor adventure, environmental stewardship, and nature literacy.',
    intro: 'Outdoor & Nature highlights responsible outdoor living, conservation awareness, and science-informed stewardship tips. From trail planning to ecological literacy, we share practical advice that connects you with natural environments while honoring sustainability.',
  },
  {
    id: 'science',
    slug: 'science',
    label: 'Science & Discovery',
    description: 'Explaining scientific findings across disciplines with clarity.',
    intro: 'Science & Discovery distills research from biology, physics, technology, and more into digestible explanations. We contextualize breakthroughs, clarify the scientific method, and highlight how discoveries impact everyday life, including travel, technology, and the natural world.',
  },
];

export function getCategoryById(id?: string): CategoryDef | undefined {
  if (!id) return undefined;
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryBySlug(slug?: string): CategoryDef | undefined {
  if (!slug) return undefined;
  return CATEGORIES.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

// Legacy helper functions for backward compatibility
export function formatCategoryName(categoryId: string): string {
  const category = getCategoryById(categoryId) || getCategoryBySlug(categoryId);
  return category?.label || categoryId
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function isValidCategory(categoryId: string): boolean {
  return !!getCategoryById(categoryId) || !!getCategoryBySlug(categoryId);
}

export function getCategoryDescription(categoryId: string): string {
  const category = getCategoryById(categoryId) || getCategoryBySlug(categoryId);
  return category?.description || `Explore questions and answers in the ${formatCategoryName(categoryId)} category.`;
}