require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { Section, Lesson } = require('../models/Lesson');

async function fixStats() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const userId = '69f4d0c8fa9149762758a63d';
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found');
      return;
    }

    // Update user stats
    user.xpPoints = 1250;
    user.streak = 5;
    await user.save();
    console.log('Updated user stats');

    // Clear existing enrollments for this user to ensure fresh stats
    await Enrollment.deleteMany({ user: userId });
    console.log('Cleared existing enrollments');

    // Find some courses to enroll the user in
    const courses = await Course.find({ status: 'published' }).limit(3);
    if (courses.length === 0) {
      console.error('No courses found to enroll');
      return;
    }

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      
      // Ensure course has curriculum
      if (course.curriculum.length === 0) {
        console.log('Creating curriculum for course: ' + course.title);
        const section = await Section.create({ title: 'Introduction', course: course._id, order: 0 });
        const lesson = await Lesson.create({ title: 'Welcome', section: section._id, course: course._id, order: 0, videoDuration: 300 });
        section.lessons.push(lesson._id);
        await section.save();
        course.curriculum.push(section._id);
        course.totalLessons = 1;
        course.totalDuration = 300;
        await course.save();
      }

      const enrollment = await Enrollment.create({
        user: userId,
        course: course._id,
        progressPercent: i === 0 ? 100 : (i === 1 ? 45 : 12),
        isCompleted: i === 0,
        completedAt: i === 0 ? new Date() : null,
        lastAccessedAt: new Date()
      });
      
      if (i === 0) {
        const lessonId = (await Section.findById(course.curriculum[0])).lessons[0];
        enrollment.completedLessons.push(lessonId);
        await enrollment.save();
      }

      console.log('Enrolled user in ' + course.title + ' with progress ' + enrollment.progressPercent + '%');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixStats();
