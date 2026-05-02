const fs = require('fs');
const path = require('path');

const expandFile = (fileName) => {
  const filePath = path.join(__dirname, '../../../implementation', fileName);
  let content = fs.readFileSync(filePath, 'utf8');

  // Extract the array content
  const match = content.match(/const\s+\w+\s+=\s+\[([\s\S]+)\];/);
  if (!match) {
    // If it's already JSON-like from a previous run
    const jsonMatch = content.match(/const\s+\w+\s+=\s+([\s\S]+);/);
    if (!jsonMatch) return;
    content = jsonMatch[1];
  } else {
    content = '[' + match[1] + ']';
  }

  // Handle common JS patterns in the file
  const courses = eval(content);

  const expandedCourses = courses.map(course => {
    const tagline = course.description || "";
    const title = course.title || "This Course";
    
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
      ...course,
      longDescription,
      thumbnail: course.thumbnail ? course.thumbnail.replace('w=600', 'w=1200').replace('q=80', 'q=90') : course.thumbnail
    };
  });

  const arrayName = fileName.includes('part1') ? 'courses1' : 'courses2';
  const newContent = `// EduPulse Course Catalog - ${fileName.includes('part1') ? 'Part 1 (Courses 1-25)' : 'Part 2 (Courses 26-50)'}\nconst ${arrayName} = ${JSON.stringify(expandedCourses, null, 2)};\n\nmodule.exports = ${arrayName};`;
  
  fs.writeFileSync(filePath, newContent);
  console.log(`Expanded ${fileName}`);
};

expandFile('courses_part1.js');
expandFile('courses_part2.js');
