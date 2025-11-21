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
    longIntro: `## Why Animals and Wildlife Matter

Animals give us a daily reminder that we share the planet with countless other species, each of them adapted to their own climate, diet, and lifestyle. This hub explores those adaptations and behaviors in depth, so you can see how and why creatures hunt, forage, migrate, nest, sleep, and adapt to shifting conditions. We focus on what the research says about animal behavior and physiology, from tracking predator-prey cycles to decoding communication signals in birds or mammals. Knowing that wolves cooperate as packs, that owls use silent wings, or that elephants mourn their dead helps us appreciate the complex world outside our windows.

## Habitats, Ecosystems, and the Places Animals Call Home

Wildlife never exists on its own—it is always part of a habitat larger than itself. We cover what makes habitats resilient, how ecosystems rely on keystone species, and what happens when humans fragment forests or drain wetlands. The pages here examine deserts, wetlands, forests, oceans, and urban greenspaces. You’ll find clear explanations of food webs, ecological niches, migratory corridors, and how climate change shifts the availability of water and shelter. We also highlight the intersection of local knowledge and global conservation, showcasing how communities protect habitats and restore degraded land.

## Humans, Wildlife, and Living Together Safely

Human–wildlife interactions can be enriching, inspiring, and sometimes risky. This category answers questions about staying safe around unexpected visitors—like raccoons, snakes, coyotes, or bats—while minimizing harm to the animal. We focus on evidence-based guidance around wildlife deterrents, coexistence strategies, and reporting protocols for injured or distressed creatures. You’ll also discover how urban wildlife adapt, how backyard feeders affect migration, and when to call professionals. Understanding animal cues enables calmer encounters and reduces the chance of conflict, while supporting coexistence through responsible backyard habitats.

## Conservation, Endangered Species, and What You Can Do

Every species plays a role in the tapestry of life. In this hub, we explain endangered species categories, how scientists assess population health, and what conservation tools make a difference (protected areas, captive breeding, habitat corridors, policy). We summarize the evidence around invasive species, rewilding, and community-led conservation. You’ll learn how simple actions—like planting native species, supporting responsible tourism, or advocating for local habitat protections—support the long-term survival of species threatened by habitat loss, pollution, or climate change. This is about turning knowledge into action.

## Backyard Wildlife, Myths, and the Science Behind Animal Behavior

Myths about animals abound: are bats villains? Do crows hold grudges? Should you feed or fear deer? We sift through common misconceptions using biology research and behavioral studies, so you can separate fact from folklore. This includes FAQs on animal intelligence, territorial signals, or why some animals become habituated to humans. We highlight how curiosity can transform into respectful appreciation rather than fear, and we provide practical tips for backyard wildlife watching, safe feeding, or discouraging nuisance species without harm.

## Practical Routines for Pet-Free Wildlife Stewardship

The final section turns to day-to-day decisions—how to set up a wildlife-friendly backyard, design bird-safe gardens, choose humane coexistence strategies, and troubleshoot common issues like odor, nests, or tracks. We break down cleaning, deterring, and monitoring strategies, all backed by studies on repellents, chemicals, and the safest materials. We also address the connection between animal habitats and broader well-being: spending time outdoors, creating soundscapes that support migratory birds, and reducing stress through daily nature interactions. Small, consistent steps—like keeping fresh water, planting shrubs, or setting up motion-sensitive lighting—make your space safer for both people and animals.`,
    subtopics: [
      'Animal behavior and communication',
      'Habitats, ecosystems, and conservation',
      'Human-wildlife coexistence tips',
      'Backyard birds, mammals, and safety',
      'Wildlife myths vs science',
      'Conservation and endangered species updates',
      'Safety protocols for wildlife encounters',
      'Pet-free wildlife watching strategies',
      'Responsible habitat design',
      'Nature-based wellbeing and stewardship',
    ],
    faqs: [
      {
        question: 'What topics are included in Animals & Wildlife?',
        answer:
          'This category covers animal behavior, habitats, conservation, human-wildlife interactions, backyard wildlife, myths, and science-based safety around creatures big and small.',
      },
      {
        question: 'How can I interact safely with wildlife in my neighborhood?',
        answer:
          'Keep a respectful distance, avoid feeding unless approved, secure trash, and learn the specific cues of the animals around you so you can minimize conflict while enjoying their presence.',
      },
      {
        question: 'What are practical ways to support local wildlife?',
        answer:
          'Plant native species, maintain clean water sources, avoid pesticides, and provide shelter such as brush piles or birdhouses tailored to the species in your region.',
      },
      {
        question: 'How do I dispel common myths about animals?',
        answer:
          'Check reputable biology or conservation sources; look for peer-reviewed studies that explain animal behavior rather than relying on folklore, and focus on observable cues instead of fear-based stories.',
      },
      {
        question: 'Is this information a substitute for professional guidance?',
        answer:
          'No. These answers are educational and research-backed but are not a replacement for qualified wildlife rehabilitators, veterinarians, or conservation professionals when specialized care is needed.',
      },
    ],
  },
  {
    id: 'education_learning',
    slug: 'education_learning',
    label: 'Education & Learning',
    description: 'Research-based guidance on learning strategies, skill acquisition, and education trends.',
    intro: 'Education & Learning focuses on cognitive strategies, study habits, and modern pedagogy. These answers explore how to learn more efficiently, master new skills, and keep up with emerging education research. Whether you are a lifelong learner, parent, or educator, we present evidence-backed techniques to boost retention, motivation, and clarity.',
    longIntro: `## Why learning strategies matter

Education is less about memorizing facts and more about building systems that let you understand, apply, and transfer knowledge. This category highlights research-backed learning strategies, cognitive science, and practical tips so you can approach study, skill development, and teaching with confidence. We walk through how different parts of the brain encode information, why spacing and retrieval practice boost memory, and how to align goals with meaningful practice.

## Evidence-based methods for better learning

Decades of learning science point to a handful of techniques that deliver the most reliable gains: spaced repetition instead of cramming, interleaving topics rather than studying one thing at a time, and testing yourself frequently. We explain how to build retrieval practice loops, vary your practice sessions, and pair new content with prior knowledge so your mental models deepen. We also highlight how to scaffold skills—from motor tasks to academic subjects—so you move from understanding to fluency.

## Study habits that respect human limits

Attention is finite, and modern life pulls it in every direction. That’s why we emphasize chunking study into manageable sessions, using timers, and designing distraction-free environments that support focus. You’ll find suggestions for planning sessions with clear objectives, using analog and digital tools to organize material, and knowing when to switch gears to maintain momentum without burning out. We cover the role of sleep, nutrition, hydration, and movement in consolidating learning.

## Cognitive science for memory and skill acquisition

Memory works best when you connect new concepts to existing frameworks, engage multiple senses, and revisit material over time. This section translates cognitive principles—such as the generation effect, dual coding, and elaboration—into actionable steps. We explain how to craft analogies, create visual summaries, and explain ideas aloud to solidify understanding. For procedural skills, we highlight deliberate practice, feedback loops, and the importance of reflection.

## Lifelong learning and adaptive skill growth 

Learning doesn’t stop after school. Whether you want to learn a language, pick up a new hobby, or stay relevant in your career, this hub offers frameworks for building sustainable learning habits. We discuss how to balance depth and breadth, how to build learning plans that pivot with your goals, and how to stay motivated when progress feels slow. We also cover how to join communities, mentor others, and teach what you’re learning—because teaching reinforces mastery.

## Guidance for educators and parents

Parents and educators play a role in shaping a learner’s mindset. We provide research-backed advice on how to provide constructive feedback, develop growth mindsets, foster curiosity, and reduce anxiety around assessments. You’ll find strategies for scaffolding challenges, using formative assessments, and making explanations relatable. This category covers crises like learning loss, remote instruction, and supporting neurodiverse learners with differentiated practices.

## Practical routines for effective learning

Tips in this section include daily review rituals, themed study sprints, creative note-taking, and recovering from plateaus. We share how to create cognitive "warm-ups" before deep work, how to integrate reflection after practice, and how to schedule breaks that reset attention. The emphasis is always on sustainable habits—small routines that compound rather than one-off hacks.

## Learning myths versus science

Misconceptions—like the idea of “learning styles” or the myth that you either have a learning talent or you don’t—persist in education. We debunk common myths with citations, clarify how neuroplasticity supports growth, and offer practical alternatives that rebuild trust in skill development. We also cover how to spot misinformation in viral study tips and how to evaluate sources critically.

## Tools and tech for learning

This hub also reviews evidence-backed tools: spaced repetition software, collaborative study platforms, multimedia creation for teaching, and note systems that align with retrieval practice. We weigh the benefits of tech against the costs and share tips for designing digital learning experiences that minimize cognitive overload.

## Where to begin

If you’re unsure where to start, scroll through the helpful and trending questions below. Each answer points you toward small, immediate steps—like planning a study session, setting up a practice log, or framing feedback positively. By leaning on science, not quick hacks, you can build a learning approach that is thoughtful, flexible, and deeply human.`,
    subtopics: [
      'Spacing, retrieval practice, and study cycles',
      'Motivation, habit formation, and consistency',
      'Cognitive biases and memory myths',
      'Skill acquisition and deliberate practice',
      'Multisensory learning and note-taking',
      'Learning for adults and career pivoting',
      'Feedback, reflection, and formative assessment',
      'Digital tools that support learning science',
      'Supporting neurodiverse and remote learners',
      'Parenting and teaching growth mindsets',
    ],
    faqs: [
      {
        question: 'What topics are included in Education & Learning?',
        answer:
          'This category covers learning methods, study habits, cognitive science, memory, skill mastery, teaching strategies, lifelong learning, and practical academic routines.',
      },
      {
        question: 'How can I improve retention when studying?',
        answer:
          'Use spaced repetition, frequent retrieval practice, and interleaving topics; actively recalling material strengthens memory more than rereading.',
      },
      {
        question: 'What are quick ways to build better study habits?',
        answer:
          'Start with short, focused sessions, set clear objectives, reduce distractions, and celebrate small wins so motivation compounds over time.',
      },
      {
        question: 'How does cognitive science inform teaching?',
        answer:
          'It shows that feedback, scaffolding, varied practice, and metacognitive prompts deepen learning because they align instruction with how the brain encodes and retrieves knowledge.',
      },
      {
        question: 'Is this guidance a substitute for personalized teaching?',
        answer:
          'No. These answers are educational and research-backed but do not replace individualized instruction from tutors or learning specialists.',
      },
    ],
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
    longIntro:
      'Parenting is one of the most meaningful and challenging roles in life. This category offers evidence-based answers to everyday parenting questions, from supporting emotional development and building healthy routines to improving communication and managing difficult behaviors. The goal is to provide clear, practical guidance that helps parents feel more confident and connected to their kids.\n\nChildren grow through predictable stages, but every family’s situation is unique. Here we focus on what research suggests about helping kids build resilience, handle big emotions, develop independence, and create strong family relationships. You’ll see topics on discipline, motivation, sleep, screen use, family dynamics, stress management, and how to support learning at home.\n\nParenting advice online can be overwhelming or overly rigid. Our approach emphasizes simple, sustainable strategies that work in real life — tools that help parents set boundaries with empathy, stay calm in hard moments, and guide kids toward healthier habits. Small adjustments in how we communicate, structure routines, or respond to behavior often lead to major improvements over time.\n\nWhether you’re parenting toddlers, school-age kids, or teens, this hub is designed to help you navigate common challenges with clarity and compassion. If you’re not sure where to start, explore the helpful questions below. You’ll find research-backed insights that support both your child’s growth and your own well-being as a parent.',
    subtopics: [
      'Managing big emotions in kids',
      'Healthy discipline and boundaries',
      'Building routines and consistency',
      'Sleep and bedtime struggles',
      'Screen time and technology habits',
      'Motivation and confidence building',
      'Parent-child communication skills',
      'Handling stress as a parent',
      'Independence and responsibility',
      'Supporting learning at home',
    ],
    faqs: [
      {
        question: 'What topics are included in the Parenting category?',
        answer:
          'This category covers routines, discipline, emotional development, communication, sleep challenges, screen habits, confidence building, and research-based parenting strategies.',
      },
      {
        question: 'What’s the best way to handle difficult behavior?',
        answer:
          'Start by staying calm, setting clear boundaries, and focusing on teaching skills rather than punishment. Consistency and empathy together work better than extremes.',
      },
      {
        question: 'How can I help my child manage big emotions?',
        answer:
          'Labeling emotions, validating feelings, and teaching simple calming skills — like breathing, movement breaks, or quiet time — helps kids build emotional regulation.',
      },
      {
        question: 'Do routines really matter for kids?',
        answer:
          'Yes. Predictable routines reduce stress, improve behavior, support sleep, and help kids feel secure. Small consistent habits often make parenting easier.',
      },
      {
        question: 'Is this advice a substitute for medical or psychological care?',
        answer:
          'No. These answers are educational and research-based, but they are not a replacement for professional care when a child needs individualized support.',
      },
    ],
  },
  {
    id: 'relationships',
    slug: 'relationships',
    label: 'Relationships',
    description: 'Communication, connection, and relationship skills.',
    intro: 'Healthy relationships require effective communication, emotional intelligence, and practical skills for navigating conflict and building connection. This category explores research-backed strategies for improving relationships with partners, family, friends, and colleagues. Our answers draw from psychology and relationship science to provide actionable guidance for building stronger, more fulfilling connections.',
    longIntro:
      'Healthy relationships play a central role in emotional well-being, communication skills, long-term happiness, and personal growth. This category explores evidence-based insights into how people connect, resolve conflict, build trust, and support each other through different stages of life. Relationships require effort, reflection, and skill, and understanding the psychology behind them can make daily interactions more meaningful and stable.\n\nMany challenges in relationships come from misunderstandings, assumptions, and communication patterns that don’t reflect each person’s real needs. Here we focus on practical strategies backed by research: better listening habits, recognizing emotional triggers, navigating disagreements, expressing needs clearly, and strengthening bonds through small, consistent behaviors.\n\nThis category also covers modern relationship dynamics — balancing independence with partnership, navigating stress, improving emotional regulation, and creating routines that help couples stay aligned. Whether someone wants to build a stronger romantic relationship, repair communication issues, or understand how habits affect connection, this hub is designed to provide clear, grounded guidance.\n\nIf you’re not sure where to begin, explore the helpful questions below. Small improvements in communication, empathy, and awareness can significantly improve the quality of your relationships over time. This hub highlights those small, research-backed actions that make relationships healthier and more resilient.',
    subtopics: [
      'Communication skills and active listening',
      'Conflict resolution strategies',
      'Emotional regulation and patience',
      'Building trust and connection',
      'Healthy boundaries',
      'Relationship stress and coping',
      'Attachment styles and behavior patterns',
      'Supporting partners through challenges',
      'Maintaining long-term connection',
      'Daily habits that strengthen relationships',
    ],
    faqs: [
      {
        question: 'What topics are included in the Relationships category?',
        answer:
          'This category covers communication habits, emotional intelligence, conflict resolution, trust building, boundaries, and research-backed strategies for maintaining healthy relationships.',
      },
      {
        question: 'How can I improve communication with my partner?',
        answer:
          'Start with active listening, using clear statements about your needs, and avoiding assumptions. Small adjustments in tone and timing can make conversations more productive.',
      },
      {
        question: 'What are common causes of relationship conflict?',
        answer:
          'Miscommunication, unmet expectations, stress, emotional triggers, and differing viewpoints are common causes. Better empathy and clarity help reduce these conflicts.',
      },
      {
        question: 'Can small daily habits improve a relationship?',
        answer:
          'Yes. Consistent small actions — such as expressing gratitude, checking in emotionally, or sharing responsibilities — build stronger long-term connection.',
      },
      {
        question: 'Is this guidance a substitute for therapy?',
        answer:
          'No. The information here is educational and research-based, but it does not replace personalized support from a licensed counselor or therapist.',
      },
    ],
  },
  {
    id: 'home_cleaning',
    slug: 'home_cleaning',
    label: 'Home & Cleaning',
    description: 'Cleaning, organizing, and maintaining your home.',
    intro: 'Home & Cleaning covers practical strategies for keeping your living space clean, organized, and healthy. These answers explore effective cleaning methods, organization systems, and home maintenance tips backed by research. We help you create a more comfortable and hygienic living environment through evidence-based approaches to household management.',
    longIntro: `## Why Home Care Matters

Home & Cleaning is all about making your living space healthier, easier to maintain, and far less stressful. This category provides clear, research-informed answers to everyday home questions—whether you’re removing stains, tackling odors, organizing chaos, or repairing small household problems. The goal is simple: help you solve real home issues without wasted time or guesswork by translating chemistry, materials science, and practical experience into routines you can trust.

## What Works (and What Doesn’t) in Home Cleaning

There’s too much contradictory advice floating around; one article says vinegar fixes everything while another warns you never use it on anything. We focus on evidence-backed methods that respect the surfaces you live on. You’ll find the safest solvents for wood, stone, tile, and glass; how to choose detergents with fewer toxins; and why heat, pressure, or timing can make or break the result. We explain the science behind biodegradable cleaners, enzymatic stain removers, and when simple soap and water outperform expensive sprays.

Understanding product safety is also key. Mixing certain cleaners—like bleach with ammonia or vinegar—can create harmful fumes, so we spell out the compatible combinations and safer alternatives. Homemade solutions are welcome when they’re honest about limits. Each answer explains the mechanism: how alkaline lifts grease, why acids dissolve mineral deposits, and when emulsifiers keep grime from resettling. That way you know what to expect before you scrub.

## Habits & Routines That Keep Clutter from Coming Back

Cleaning isn’t a single event; it is a set of sustainable habits. The hub walks through weekly resets, daily spot-cleaning habits, and seasonal deep dives so mess never piles up. We explore how timers, lists, and “project rooms” keep tasks manageable, how to break areas into bite-sized segments, and how to track maintenance for appliances, textiles, and tough materials.

We also highlight routines that respect your energy—short evening touch-ups to prevent weekend chaos, dry dusting before mopping, and working from top to bottom so debris only flows downward. Data shows that consistency beats intensity, so we help you find a cadence that works for your life.

## Habitats, Surfaces, and Problem Solvers

The chapter on surfaces decodes the best techniques for wood, laminate, stone, tile, glass, upholstery, and fabrics. We outline what temperature or pH level each can tolerate, and we offer safe mechanical approaches—like using a soft brush or microfibre that won’t scratch. The section on appliances explains how to sanitize microwaves, degrease ovens, descale kettles, and keep vents from clogging, with clear steps so you never guess whether to use vinegar, citric acid, or a commercial descaler.

## Preventing Moisture, Mold, and Pests

Moisture invites mold, mildew, and pests into every corner. We cover ventilation strategies, humidity tracking, and how to fix small leaks before they cause big damage. When mold does appear, we break down the right cleaners, when to toss vs. restore affected materials, and how to protect vulnerable surfaces. The pest section outlines humane deterrents for insects and rodents that enter through cracks, and when it’s wiser to call a professional.

## Everyday Cleaning for Real Life

This hub doesn’t ignore the mess that comes with pets, kids, or busy schedules. You’ll get tips on removing pet hair, neutralizing odors, and managing spills quickly. We also tackle common questions like how to refresh carpets without a pricey machine, how to degrease kitchen cabinets, and how to keep bathrooms bright despite hard water. We emphasize practical actions—use a squeegee after showers, clean glass with a microfibre, keep a rotate-ready cleaning kit under the sink—so the work stays manageable.

## Myths vs. Science When Caring for Interiors

Urban legends about cleaning abound. We separate myth from method by referencing lab studies, materials research, and safety data. Why rubbing alcohol evicts grime but can dull your finish; why bleach should never meet ammonia; why “natural” vinegar may not sanitize; and how to recognize when an expensive “miracle” formula is just colored water.

## Building a Cleaner, Safer Home

If you’re not sure where to begin, start with the helpful and trending questions below. Learning a few reliable principles—like choosing the right solvent, tackling messes quickly, and building routines—makes home care faster, safer, and dramatically less frustrating over time. The hub is designed to help you solve immediate problems while strengthening a long-term maintenance mindset so your home stays welcoming and healthy year-round.`,
    subtopics: [
      'Stain and odor removal',
      'Surface-specific cleaning (wood, tile, glass, etc.)',
      'Safe cleaning products and mixtures',
      'Mold, mildew, and moisture prevention',
      'Laundry and fabric care',
      'Kitchen and bathroom deep cleaning',
      'Appliance cleaning and maintenance',
      'Organization and decluttering',
      'Pet messes and hair cleanup',
      'Quick daily cleaning routines',
    ],
    faqs: [
      {
        question: 'What topics are included in Home & Cleaning?',
        answer:
          'This category covers stain removal, surface cleaning, safe product use, mold prevention, laundry care, appliance cleaning, organization, and simple home routines.',
      },
      {
        question: 'What cleaning products are safe to mix?',
        answer:
          'Most products should not be mixed unless explicitly labeled safe. Some combinations (like bleach with ammonia or vinegar) can create dangerous fumes.',
      },
      {
        question: 'What’s the best way to remove stubborn stains?',
        answer:
          'The best method depends on the material and stain type. Acting quickly, using the right solvent, and avoiding heat until the stain is gone are key principles.',
      },
      {
        question: 'How often should I deep-clean my home?',
        answer:
          'Most homes benefit from weekly targeted deep-cleaning (bathroom, kitchen, floors) plus seasonal resets for areas like windows, vents, and appliances.',
      },
      {
        question: 'Are natural cleaners like vinegar always effective?',
        answer:
          'They can work well for some jobs, but not all. We explain when natural options are useful and when stronger cleaners are safer or more effective.',
      },
    ],
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
    longIntro:
      'Money & Finance covers practical, evidence-informed answers to everyday financial questions — from budgeting and saving to debt, credit, investing, and smart financial habits. This category is built for real people trying to make good decisions without getting overwhelmed by jargon or conflicting advice. The goal is to explain common financial topics clearly so you can take action with confidence.\n\nMost financial success comes from simple fundamentals done consistently: spending less than you earn, building an emergency buffer, avoiding high-interest debt, and using long-term investing to grow wealth. But people often get stuck on specific questions — how to pay off debt faster, what a good credit score is, how much to save, whether to invest or build cash first, and how to avoid common traps.\n\nHere we focus on clarity and practicality. You’ll find questions on debt payoff strategies, credit cards, interest rates, saving routines, beginner investing principles, financial psychology, and how to build stability over time. We aim to highlight what’s supported by reputable consensus and basic financial math, while also explaining tradeoffs so you can choose what fits your goals.\n\nIf you’re not sure where to start, explore the helpful and trending questions below. Small improvements — like automating savings, tracking expenses, or understanding how interest works — compound over time into major financial progress.',
    subtopics: [
      'Budgeting and expense tracking',
      'Saving money and emergency funds',
      'Debt payoff strategies',
      'Credit scores and credit cards',
      'Interest rates and loans',
      'Beginner investing basics',
      'Retirement planning fundamentals',
      'Financial habits and psychology',
      'Making extra income',
      'Avoiding financial scams',
    ],
    faqs: [
      {
        question: 'What topics are included in Money & Finance?',
        answer:
          'This category covers budgeting, saving, debt payoff, credit scores, interest rates, beginner investing, retirement basics, and practical financial habits.',
      },
      {
        question: 'What’s the best first step to improving my finances?',
        answer:
          'Start by tracking your spending and building a simple budget. Knowing where your money goes is the foundation for saving and debt reduction.',
      },
      {
        question: 'Should I pay off debt or save first?',
        answer:
          'It depends on the debt. High-interest debt should usually be prioritized, but having a small emergency fund first can prevent new debt.',
      },
      {
        question: 'How much should I have in an emergency fund?',
        answer:
          'A common guideline is 3–6 months of living expenses, but even a smaller buffer is valuable when you’re starting out.',
      },
      {
        question: 'Is this financial advice personalized?',
        answer:
          'No. These answers are educational and research-informed, but they don’t replace personalized advice from a qualified financial professional.',
      },
    ],
  },
  {
    id: 'productivity',
    slug: 'productivity',
    label: 'Productivity & Work',
    description: 'Workflows, focus, and productivity strategies.',
    intro: 'Productivity & Work explores research-backed methods for improving focus, managing time, and achieving more with less stress. These answers cover effective workflows, time management techniques, and strategies for maintaining focus in a distracted world. We help you work smarter by applying evidence-based productivity principles that have been tested and proven effective.',
    longIntro:
      'Productivity isn’t about doing more — it’s about doing what matters with less stress, better focus, and sustainable energy. This category offers research-backed answers to everyday questions about getting organized, staying consistent, reducing procrastination, and building habits that support meaningful work. Whether you\'re a student, a parent, an entrepreneur, or someone trying to stay on top of life in general, productivity comes down to a few core skills that can be learned and practiced.\n\nMany productivity problems aren’t caused by laziness — they come from overwhelm, unclear priorities, poor systems, and mental fatigue. Here we explore evidence-based frameworks for setting goals, managing time, improving attention, and designing routines that make good behavior easier. You’ll find topics like task batching, deep work, habit stacking, decision fatigue, daily planning, organization, and how environment influences behavior.\n\nWe also emphasize the human side of productivity. Sleep, stress, motivation, and emotional regulation all affect performance. Sustainable productivity requires balancing output with recovery so that work doesn’t become burnout. Small changes, like structuring your morning, reducing distractions, or creating a reliable “shutdown routine,” can have a huge impact over time.\n\nIf you’re not sure where to start, browse the helpful and trending questions below. The goal is to give you clear, practical tools so you can work smarter, build momentum, and feel more in control of your days.',
    subtopics: [
      'Time management and daily planning',
      'Breaking procrastination',
      'Deep work and focus habits',
      'Goal setting and follow-through',
      'Building consistent routines',
      'Reducing distractions',
      'Organization systems',
      'Motivation and discipline',
      'Burnout prevention',
      'Work-life balance',
    ],
    faqs: [
      {
        question: 'What topics are included in Productivity & Work?',
        answer:
          'This category covers research-backed strategies for time management, focus, routines, procrastination, organization, motivation, burnout prevention, and sustainable work habits.',
      },
      {
        question: 'What’s the best way to stop procrastinating?',
        answer:
          'Start by reducing the size of the task, removing friction, and setting a clear first step. Small wins build momentum faster than waiting for motivation.',
      },
      {
        question: 'How can I improve focus at work?',
        answer:
          'Minimizing distractions, batching tasks, using focused time blocks, and protecting sleep and recovery are some of the most effective evidence-based ways to improve focus.',
      },
      {
        question: 'Are routines really important for productivity?',
        answer:
          'Yes. Reliable routines reduce decision fatigue and make progress automatic. Even simple morning or evening habits can dramatically improve consistency.',
      },
      {
        question: 'How do I avoid burnout while staying productive?',
        answer:
          'Sustainable productivity requires recovery. Setting boundaries, scheduling breaks, prioritizing sleep, and focusing on fewer high-value tasks helps prevent burnout.',
      },
    ],
  },
  {
    id: 'mental_health',
    slug: 'mental_health',
    label: 'Mental Health & Mindset',
    description: 'Mindset, stress reduction, and psychological well-being.',
    intro: 'Mental Health & Mindset addresses strategies for managing stress, building resilience, and maintaining psychological well-being. These answers draw from psychology and neuroscience to provide evidence-based approaches to mental health. We help you understand how your mind works and provide practical tools for coping with challenges, managing emotions, and cultivating a healthier mindset.',
    longIntro:
      'Mental health affects every part of daily life — how we think, how we manage stress, how we communicate, and how we respond to challenges. This category focuses on evidence-based strategies for improving emotional well-being, reducing anxiety, understanding stress responses, and building healthier thought patterns. By exploring the psychology behind habits, emotions, and relationships, we aim to make mental health approachable, practical, and grounded in science.\n\nModern life creates constant demands on attention, performance, and emotional bandwidth. Many people struggle with racing thoughts, overwhelm, perfectionism, burnout, or difficulty regulating emotions. Here we break down tools from cognitive behavioral therapy (CBT), mindfulness, habit formation, and behavioral science to help you recognize triggers, shift unhelpful patterns, and develop greater resilience.\n\nMental health is also deeply connected to physical habits like sleep, exercise, and nutrition. Even small improvements in daily routines can create meaningful changes in how you feel. Understanding how the brain and body respond to stress, social pressure, or uncertainty empowers you to make choices that support long-term well-being.\n\nWhether you\'re navigating anxiety, trying to manage stress more effectively, or simply looking to build healthier mental habits, this hub provides clear, research-backed insights. Explore the helpful questions below to learn small, practical steps that can make your daily life more grounded, calm, and balanced.',
    subtopics: [
      'Managing stress and overwhelm',
      'Understanding anxiety patterns',
      'Mindfulness and grounding techniques',
      'Cognitive behavioral tools',
      'Emotional regulation strategies',
      'Breaking negative thought cycles',
      'Self-esteem and confidence',
      'Mental health and daily habits',
      'Sleep and mood connection',
      'Healthy coping mechanisms',
    ],
    faqs: [
      {
        question: 'What topics are included in the Mental Health category?',
        answer:
          'This category covers stress management, anxiety, emotional regulation, mindfulness, CBT techniques, confidence, and research-backed mental health habits.',
      },
      {
        question: 'What are practical ways to reduce daily stress?',
        answer:
          'Slowing down your breathing, setting boundaries, reducing overstimulation, organizing tasks, and creating wind-down routines all help manage daily stress.',
      },
      {
        question: 'How can I break negative thought patterns?',
        answer:
          'Recognizing cognitive distortions, challenging assumptions, reframing thoughts, and practicing mindfulness can help shift unhelpful mental patterns.',
      },
      {
        question: 'Does improving sleep help mental health?',
        answer:
          'Yes. Better sleep supports emotional regulation, lowers anxiety, improves mood, and enhances the brain’s ability to handle stress.',
      },
      {
        question: 'Is this information a substitute for therapy?',
        answer:
          'No. These answers are educational and research-based, but they are not a replacement for professional mental health treatment.',
      },
    ],
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