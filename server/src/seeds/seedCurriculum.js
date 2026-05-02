require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Course = require('../models/Course');
const { Section, Lesson } = require('../models/Lesson');

const curriculumTemplates = {
  'Data Science': (course) => [
    {
      title: 'Module 1: Foundations & Setup',
      lessons: [
        { title: 'Course Introduction & Roadmap', type: 'article', description: 'Overview of what we will cover.', estimatedMinutes: 10,
          content: `# Welcome to ${course.title}\n\nIn this course, we will explore the exciting world of Data Science. From data manipulation to advanced machine learning models, you'll gain the skills needed to thrive as a Data Scientist.\n\n## What You'll Learn\n${course.outcomes?.map(o => `- ${o}`).join('\n') || '- Data Analysis\n- Machine Learning\n- Python Programming'}\n\n## Prerequisites\n${course.requirements?.map(r => `- ${r}`).join('\n') || 'None — this course starts from scratch.'}` },
        { title: 'Environment Setup Guide', type: 'article', description: 'Setting up Python and Jupyter.', estimatedMinutes: 20,
          content: `## Setting Up Your Workspace\n\nFollow these steps to prepare your development environment...\n\n### Tools Required\n- Python 3.10+\n- Jupyter Notebook\n- VS Code (recommended)\n\n### Installation Steps\n1. Install Python from python.org...\n2. Install pip packages: \`pip install numpy pandas matplotlib scikit-learn\`\n3. Verify installation: \`python --version\`` },
        { title: 'Quick Knowledge Check', type: 'quiz', description: 'Test your setup knowledge.', estimatedMinutes: 5,
          questions: [
            { question: 'What is the primary library for data manipulation in Python?', options: ['Pandas', 'Requests', 'BeautifulSoup', 'Flask'], correctIndex: 0, explanation: 'Pandas is the standard library for data frames and analysis.' },
            { question: 'Which tool is commonly used for interactive data science notebooks?', options: ['Word', 'Jupyter', 'Postman', 'Docker'], correctIndex: 1, explanation: 'Jupyter Notebooks are essential for interactive coding and visualisation.' }
          ] },
      ],
    },
    {
      title: 'Module 2: Core Concepts',
      lessons: [
        { title: 'Understanding the Fundamentals', type: 'article', description: 'Key theory and concepts.', estimatedMinutes: 15, content: '# Data Science Fundamentals\n\nData science is about using data to solve problems. It combines statistics, computer science, and domain expertise.\n\n## Key Concepts\n- **Big Data**: Handling large volumes of information.\n- **Algorithms**: Rules for processing data.\n- **Insights**: Meaningful patterns derived from data.' },
        { title: 'Hands-On Practice Exercise', type: 'assignment', description: 'Apply what you have learned.', estimatedMinutes: 45, content: '## Assignment: Data Cleaning\n\nDownload the dataset below and use Pandas to remove null values and standardise the columns.\n\n### Tasks\n1. Load the CSV.\n2. Handle missing values.\n3. Export the cleaned CSV.', resources: [{ name: 'Practice Dataset', url: 'https://example.com/data.csv', resourceType: 'csv' }] },
        { title: 'Concept Review Quiz', type: 'quiz', description: 'Review module 2 concepts.', estimatedMinutes: 10, questions: [
           { question: 'What does EDA stand for?', options: ['Every Day Analysis', 'Exploratory Data Analysis', 'Electronic Data Access', 'Estimated Data Amount'], correctIndex: 1, explanation: 'EDA is the process of exploring data to find patterns.' }
        ] },
      ],
    },
    {
      title: 'Module 3: Advanced Techniques',
      lessons: [
        { title: 'Advanced Modeling', type: 'article', description: 'Moving beyond basics.', estimatedMinutes: 25, content: '# Advanced Modeling Techniques\n\nWe will look at ensemble methods, deep learning, and cross-validation to improve model accuracy.' },
        { title: 'Module assessment', type: 'quiz', description: 'Final check for module 3.', estimatedMinutes: 15, questions: [
           { question: 'Which of these is an ensemble method?', options: ['Linear Regression', 'Random Forest', 'Binary Search', 'HTML'], correctIndex: 1, explanation: 'Random Forest is a popular ensemble learning method.' }
        ] }
      ]
    },
    {
      title: 'Final Project',
      lessons: [
        { title: 'Capstone Project Instructions', type: 'assignment', description: 'Your final challenge.', estimatedMinutes: 120, content: '# Capstone Project: Predictive Analysis\n\nUse everything you have learned to build a predictive model for the provided housing dataset.\n\n## Requirements\n- Clean data\n- Perform EDA\n- Build & Evaluate Model\n- Submit report', resources: [{ name: 'Housing Dataset', url: 'https://example.com/housing.csv', type: 'csv' }] }
      ]
    }
  ],
  'Web Development': (course) => [
    {
      title: 'Module 1: Modern Web Tools',
      lessons: [
        { title: 'Course Welcome', type: 'article', description: 'Introduction to web dev.', estimatedMinutes: 5, content: `# Welcome to ${course.title}\n\nWeb development is the heart of the digital world. Let's get started!` },
        { title: 'Tooling & VS Code', type: 'article', description: 'Setup your editor.', estimatedMinutes: 15, content: '## Setting up VS Code\n\nInstall extensions like ESLint, Prettier, and Live Server.' },
        { title: 'First Web Page', type: 'assignment', description: 'Your first HTML file.', estimatedMinutes: 30, content: '## Assignment\n\nCreate an index.html file with a h1, p, and an image.' }
      ]
    },
    {
      title: 'Module 2: Frontend Mastery',
      lessons: [
        { title: 'CSS Layouts', type: 'article', description: 'Flexbox and Grid.', estimatedMinutes: 20, content: '# Modern CSS\n\nLearn how to create responsive layouts using CSS Flexbox and Grid System.' },
        { title: 'Quiz: CSS Selectors', type: 'quiz', description: 'Test your CSS skills.', estimatedMinutes: 10, questions: [
          { question: 'Which property is used to change text color?', options: ['color', 'font-style', 'background', 'text-align'], correctIndex: 0, explanation: 'The color property sets the foreground color of text.' }
        ] }
      ]
    },
    {
      title: 'Module 3: Dynamic Sites',
      lessons: [
        { title: 'JavaScript Basics', type: 'article', description: 'Variables and Functions.', estimatedMinutes: 25, content: '# JavaScript Essentials\n\nVariables (let, const), functions, and DOM manipulation.' },
        { title: 'Interactive Challenge', type: 'assignment', description: 'Build a counter.', estimatedMinutes: 40, content: '## Project: Simple Counter\n\nCreate a web page with a number and two buttons to increment and decrement it.' }
      ]
    },
    {
      title: 'Final Project',
      lessons: [
        { title: 'Build a Personal Portfolio', type: 'assignment', description: 'Showcase your work.', estimatedMinutes: 180, content: '# Portfolio Project\n\nBuild and deploy a 3-page portfolio website using HTML, CSS, and JS.' }
      ]
    }
  ],
  'UI/UX Design': (course) => [
    {
      title: 'Module 1: Design Thinking',
      lessons: [
        { title: 'UX Principles', type: 'article', description: 'Core user experience laws.', estimatedMinutes: 15, content: '# Principles of UX\n\nFocus on usability, accessibility, and desirability.' },
        { title: 'Design Process', type: 'article', description: 'Double diamond approach.', estimatedMinutes: 10, content: '## The Double Diamond\n\nDiscover, Define, Develop, Deliver.' }
      ]
    },
    {
      title: 'Module 2: Visual Design',
      lessons: [
        { title: 'Color Theory', type: 'article', description: 'Using palette effectively.', estimatedMinutes: 20, content: '# Visual Design & Color\n\nUnderstanding contrast, hierarchy, and emotion in design.' },
        { title: 'Typography Quiz', type: 'quiz', description: 'Font knowledge check.', estimatedMinutes: 10, questions: [
          { question: 'What is "Serif"?', options: ['Small lines at ends of strokes', 'A sans-font', 'A color', 'A layout grid'], correctIndex: 0, explanation: 'Serifs are small lines attached to the end of a stroke in a letter.' }
        ] }
      ]
    },
    {
      title: 'Module 3: Prototyping',
      lessons: [
        { title: 'Figma Basics', type: 'article', description: 'Setting up Figma.', estimatedMinutes: 30, content: '# Figma for Beginners\n\nFrames, auto-layout, and components.' },
        { title: 'Interactive Prototype', type: 'assignment', description: 'Build a mobile flow.', estimatedMinutes: 60, content: '## Assignment\n\nCreate a 5-screen login flow in Figma.' }
      ]
    }
  ],
  'Business': (course) => [
     {
      title: 'Module 1: Strategy',
      lessons: [
        { title: 'SWOT Analysis', type: 'article', description: 'Strategic planning tool.', estimatedMinutes: 15, content: '# SWOT Framework\n\nStrengths, Weaknesses, Opportunities, Threats.' },
        { title: 'Market Research', type: 'article', description: 'Understanding your audience.', estimatedMinutes: 20, content: '## Research Methods\n\nSurveys, interviews, and competitor analysis.' }
      ]
    },
    {
      title: 'Module 2: Operations',
      lessons: [
        { title: 'Supply Chain Basics', type: 'article', description: 'Logistics and flow.', estimatedMinutes: 25, content: '# Operational Excellence\n\nStreamlining processes to deliver value efficiently.' }
      ]
    }
  ],
  'default': (course) => [
    {
      title: 'Module 1: Introduction',
      lessons: [
        { title: 'Getting Started', type: 'article', description: 'Introduction to the course.', estimatedMinutes: 10, content: `# Welcome to ${course.title}\n\nWe are glad you are here. Let's begin our journey.` },
        { title: 'Basics Quiz', type: 'quiz', description: 'Check initial concepts.', estimatedMinutes: 10, questions: [
          { question: 'What is the first step?', options: ['Starting', 'Stopping', 'Ignoring', 'Deleting'], correctIndex: 0, explanation: 'Taking the first step is essential for progress.' }
        ] }
      ]
    },
    {
      title: 'Module 2: Deep Dive',
      lessons: [
        { title: 'In-Depth Look', type: 'article', description: 'Detailed exploration.', estimatedMinutes: 30, content: '# Core Subject Matter\n\nExploring the primary topics in detail with examples.' },
        { title: 'Practical Exercise', type: 'assignment', description: 'Apply concepts.', estimatedMinutes: 45, content: '## Assignment\n\nComplete the exercise based on the module content.' }
      ]
    }
  ]
};

async function seedCurriculum() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses to update.`);

    for (const course of courses) {
      // Skip courses that already have a curriculum (unless --force is used)
      if (course.curriculum.length > 0 && !process.argv.includes('--force')) {
        console.log(`Skipping ${course.title} (already has curriculum)`);
        continue;
      }

      // Clear existing curriculum for this course if force
      if (process.argv.includes('--force')) {
        await Section.deleteMany({ course: course._id });
        await Lesson.deleteMany({ course: course._id });
        course.curriculum = [];
      }

      const template = curriculumTemplates[course.category] || curriculumTemplates.default;
      const modules = template(course);
      
      let totalLessonCount = 0;
      let totalCourseDuration = 0;
      const newCurriculumIds = [];

      for (let i = 0; i < modules.length; i++) {
        const mod = modules[i];
        const section = await Section.create({
          title: mod.title,
          course: course._id,
          order: i,
        });

        const lessonDocs = [];
        for (let j = 0; j < mod.lessons.length; j++) {
          const les = mod.lessons[j];
          const lesson = await Lesson.create({
            ...les,
            section: section._id,
            course: course._id,
            order: j,
          });
          lessonDocs.push(lesson._id);
          totalLessonCount++;
          totalCourseDuration += (les.estimatedMinutes || 10) * 60;
        }

        section.lessons = lessonDocs;
        await section.save();
        newCurriculumIds.push(section._id);
      }

      course.curriculum = newCurriculumIds;
      course.totalLessons = totalLessonCount;
      course.totalDuration = totalCourseDuration;
      await course.save();

      console.log(`- Seeded curriculum for: ${course.title} (${totalLessonCount} lessons)`);
    }

    console.log('Curriculum seeding completed!');

  } catch (error) {
    console.error('Error seeding curriculum:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedCurriculum();