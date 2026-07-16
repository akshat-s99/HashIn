import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.model.js';
import { Post } from '../models/Post.model.js';
import { Connection } from '../models/Connection.model.js';
import { Swipe } from '../models/Swipe.model.js';
import { ROLES, CONNECTION_STATUS } from '../config/constants.js';
import dotenv from 'dotenv';
dotenv.config();

const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
const roles = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Product Manager', 'UX Designer', 'CTO', 'Software Engineer', 'Machine Learning Engineer'];
const tech = ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'MongoDB', 'PostgreSQL', 'GraphQL', 'Next.js', 'Vue.js', 'Go', 'Rust'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const fn = getRandomItem(firstNames);
    const ln = getRandomItem(lastNames);
    users.push({
      firstName: fn,
      lastName: ln,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}.${Math.floor(Math.random()*10000)}@hashin-mock.com`,
      password: 'password123',
      role: ROLES.USER,
      headline: getRandomItem(roles),
      skills: [getRandomItem(tech), getRandomItem(tech), getRandomItem(tech)],
      about: `Passionate ${getRandomItem(roles).toLowerCase()} with a love for building scalable applications using ${getRandomItem(tech)} and ${getRandomItem(tech)}.`,
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
    });
  }
  return users;
}

const addData = async () => {
  try {
    await connectDB();
    console.log('Connected to DB. Adding mock data...');

    const newUsers = generateRandomUsers(30);
    const createdUsers = await User.create(newUsers);
    console.log(`Created ${createdUsers.length} mock users.`);

    const postTemplates = [
      "Just deployed my first microservice using {tech}! The architecture is so much cleaner now. Anyone else made the switch recently?",
      "Spent the whole weekend debugging a tricky issue in {tech}. Turns out it was just a typo in the config file. Typical! 🤦‍♂️",
      "What's everyone's thoughts on the latest update to {tech}? I think the new features are going to be a game changer for {role}s.",
      "Looking for recommendations! What's the best resource to learn advanced {tech} concepts?",
      "Just published a new blog post on optimizing performance in {tech}. Check it out on my profile!",
      "Feeling incredibly productive today. Got my {tech} environment perfectly tuned.",
      "The more I use {tech}, the more I appreciate its design patterns.",
      "Any {role}s out there who have successfully integrated {tech} into their legacy stack?",
      "Hot take: {tech} is vastly overrated. Change my mind.",
      "Excited to start a new project tomorrow focusing heavily on {tech}!"
    ];

    const posts = [];
    for (let i = 0; i < 50; i++) {
      const user = getRandomItem(createdUsers);
      const template = getRandomItem(postTemplates);
      const content = template.replace(/{tech}/g, getRandomItem(tech)).replace(/{role}/g, user.headline);
      posts.push({
        authorId: user._id,
        content: content,
        likesCount: Math.floor(Math.random() * 50)
      });
    }

    const createdPosts = await Post.insertMany(posts);
    console.log(`Created ${createdPosts.length} mock posts.`);

    console.log('Mock data population complete!');
    process.exit();
  } catch (error) {
    console.error(`Error adding data: ${error.message}`);
    process.exit(1);
  }
};

addData();
