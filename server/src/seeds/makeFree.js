require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const freeCourseSlugs = [
  'agile-with-atlassian-jira',
  'ai-for-everyone',
  'android-development-meta',
  'astronomy-duke',
  'aws-cloud-practitioner',
  'chinese-for-beginners-peking',
  'climate-change-science-policy',
  'contract-law-yale',
  'covid19-epidemiology',
  'cs50-intro-computer-science',
  'cs50-web-python-javascript',
  'data-science-methodology-ibm',
  'digital-photography-michigan',
  'docker-kubernetes-coursera',
  'english-composition-duke',
  'entrepreneurship-laying-foundation',
  'ethics-technology-policy-duke',
  'excel-basics-data-analysis',
  'excel-skills-business-macquarie',
  'figma-ui-design',
  'financial-markets-yale',
  'generative-ai-for-everyone',
  'google-advanced-data-analytics',
  'google-cloud-fundamentals',
  'google-project-management',
  'google-ux-design-foundations',
  'graphic-design-calarts',
  'harvard-data-science-r',
];

async function makeFree() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const Course = require('../models/Course');

    const result = await Course.updateMany(
      { slug: { $in: freeCourseSlugs } },
      { $set: { price: 0 } }
    );

    console.log(`Updated ${result.modifiedCount} courses to free`);

    const freeCourses = await Course.find({ slug: { $in: freeCourseSlugs } }).select('title slug price category');
    console.log('\nFree courses:');
    freeCourses.forEach(c => console.log(`  - ${c.title} (${c.category}): ₹${c.price}`));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

makeFree();