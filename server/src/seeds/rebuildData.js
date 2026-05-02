const fs = require('fs');
const path = require('path');

const rebuild = () => {
  const dumpPath = path.join(__dirname, '../../courses_dump.json');
  if (!fs.existsSync(dumpPath)) {
    console.error('Dump file not found');
    return;
  }

  const courses = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));

  const expandedCourses = courses.map(course => {
    // Clean up fields we don't want in the static seed files (like DB IDs)
    const { _id, instructor, curriculum, createdAt, updatedAt, __v, ...cleanCourse } = course;
    
    const tagline = cleanCourse.description || "";
    const longDescription = `
## About this Course
${tagline}

This comprehensive program is designed to take you from a foundational understanding to advanced mastery. In today's rapidly evolving landscape, staying ahead requires not just knowledge, but practical, hands-on experience. That is exactly what this course delivers.

## Why Choose This Program?
Whether you are looking to pivot your career or deepen your existing expertise, we provide the tools, community, and mentorship you need to succeed. Our curriculum is developed by industry veterans and academic leaders to ensure you are learning the most relevant skills.

### Key Highlights:
- **Project-Based Learning**: Apply what you learn through real-world scenarios and datasets.
- **Expert Instruction**: Gain insights from instructors who have "been there and done that."
- **Comprehensive Curriculum**: We cover everything from the basics to the most complex topics.
- **Community Support**: Join a global network of learners and professionals.

## What to Expect
Each module is carefully crafted to build upon the last, ensuring a smooth and logical progression. You will encounter a mix of reading materials, interactive quizzes, and challenging assignments designed to solidify your understanding. By the end of this course, you will have a portfolio of work and the confidence to apply your new skills in any professional setting.
    `.trim();

    return {
      ...cleanCourse,
      longDescription,
      thumbnail: cleanCourse.thumbnail ? cleanCourse.thumbnail.replace('w=600', 'w=1200').replace('q=80', 'q=90') : cleanCourse.thumbnail
    };
  });

  const part1 = expandedCourses.slice(0, 25);
  const part2 = expandedCourses.slice(25);

  fs.writeFileSync(
    path.join(__dirname, '../../../implementation/courses_part1.js'),
    `// EduPulse Course Catalog - Part 1 (Courses 1-25)\nconst courses1 = ${JSON.stringify(part1, null, 2)};\n\nmodule.exports = courses1;`
  );

  fs.writeFileSync(
    path.join(__dirname, '../../../implementation/courses_part2.js'),
    `// EduPulse Course Catalog - Part 2 (Courses 26-50)\nconst courses2 = ${JSON.stringify(part2, null, 2)};\n\nmodule.exports = courses2;`
  );

  console.log('Rebuilt part1 and part2 with long descriptions and high-res images.');
};

rebuild();
