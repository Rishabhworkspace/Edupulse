require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');

const { allCourses } = require('../../../implementation/courses_data.js');

const freeCourseSlugs = [
  'ai-for-everyone',                    // Machine Learning & AI
  'learning-how-to-learn',              // Personal Development
  'science-of-wellbeing-yale',         // Personal Development
  'html-css-javascript-web',           // Web Development
  'responsive-web-design-freecodecamp', // Web Development
  'excel-basics-data-analysis-ibm',    // Data Science
  'data-science-methodology-ibm',      // Data Science
  'google-ux-design-foundations',      // Design
  'google-project-management',         // Project Management
  'excel-skills-business-macquarie',   // Business
  'google-cloud-fundamentals',          // Cloud & DevOps
];

const categoryMap = {
  'Machine Learning & AI': 'Data Science',
  'Computer Science': 'Data Science',
  'Programming': 'Web Development',
  'Web Development': 'Web Development',
  'Design': 'UI/UX Design',
  'Data Science': 'Data Science',
  'Finance & Investing': 'Finance & Business',
  'Business & Marketing': 'Marketing',
  'Business & Productivity': 'Business',
  'Business & Operations': 'Business',
  'Cybersecurity': 'Cybersecurity',
  'Personal Development': 'Personal Development',
  'Health & Fitness': 'Health & Fitness',
  'Science & Environment': 'Science',
  'Language & Writing': 'Language',
  'Photography & Arts': 'Arts',
  'Music & Arts': 'Music',
  'Cloud Computing': 'Cloud & DevOps',
  'Project Management': 'Project Management',
  'Ethics & Society': 'Ethics',
  'Law & Legal': 'Law',
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    if (process.argv.includes('--force')) {
      await Course.deleteMany({});
      console.log('Cleared existing courses');
    }

    let instructor = await User.findOne({ role: 'admin' });
    if (!instructor) {
      instructor = await User.create({
        name: 'EduPulse Admin',
        email: 'admin@edupulse.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Created admin user');
    }

    console.log(`Total courses to add: ${allCourses.length}`);

    const existingSlugs = new Set(
      (await Course.find({}, 'slug').lean()).map(c => c.slug)
    );

    const coursesToInsert = allCourses
      .filter(c => !existingSlugs.has(c.slug))
      .map(c => ({
        title: c.title,
        slug: c.slug,
        description: c.description,
        shortDescription: c.subtitle || c.description?.substring(0, 300),
        thumbnail: c.thumbnail || '',
        instructor: instructor._id,
        category: categoryMap[c.category] || 'General',
        subcategory: c.subcategory || c.category || '',
        tags: c.tags || [],
        level: c.level?.toLowerCase() || 'beginner',
        language: c.language || 'English',
        price: freeCourseSlugs.includes(c.slug) ? 0 : (c.price || 0),
        originalPrice: c.originalPrice || 0,
        currency: c.currency || 'INR',
        enrolledCount: c.totalStudents || 0,
        rating: c.rating || 0,
        totalReviews: c.reviewCount || 0,
        requirements: c.requirements || [],
        outcomes: c.whatYouLearn || [],
        certificate: c.certificate !== false,
        status: 'published',
        totalDuration: (c.hoursContent || 0) * 3600,
      }));

    console.log(`Courses to insert: ${coursesToInsert.length}`);

    if (coursesToInsert.length > 0) {
      await Course.insertMany(coursesToInsert);
      console.log('Courses seeded successfully!');
    } else {
      console.log('All courses already exist');
    }

    const totalCourses = await Course.countDocuments();
    console.log(`Total courses in database: ${totalCourses}`);

  } catch (error) {
    console.error('Error seeding courses:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();