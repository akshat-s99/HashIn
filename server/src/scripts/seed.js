import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.model.js';
import { Post } from '../models/Post.model.js';
import { Connection } from '../models/Connection.model.js';
import { Swipe } from '../models/Swipe.model.js';
import { ROLES, CONNECTION_STATUS, SWIPE_ACTION } from '../config/constants.js';

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();
    await Connection.deleteMany();
    await Swipe.deleteMany();

    console.log('Cleared existing data.');

    // Users
    const users = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@hashin.com',
        password: 'password123',
        role: ROLES.ADMIN,
        skills: ['React', 'Node.js', 'MongoDB', 'Express', 'System Design'],
        headline: 'Lead Developer @ HashIn',
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: ROLES.USER,
        skills: ['React', 'TypeScript', 'CSS', 'Framer Motion'],
        headline: 'Frontend Engineer',
      },
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        password: 'password123',
        role: ROLES.USER,
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        headline: 'Backend Developer',
      },
      {
        firstName: 'Alice',
        lastName: 'Chen',
        email: 'alice@example.com',
        password: 'password123',
        role: ROLES.USER,
        skills: ['Go', 'Kubernetes', 'gRPC', 'System Design'],
        headline: 'Platform Engineer',
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        password: 'password123',
        role: ROLES.USER,
        skills: ['React', 'Node.js', 'AWS', 'GraphQL'],
        headline: 'Full Stack Developer',
      },
      {
        firstName: 'Eva',
        lastName: 'Green',
        email: 'eva@example.com',
        password: 'password123',
        role: ROLES.USER,
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
        headline: 'ML Engineer',
      },
      {
        firstName: 'Mike',
        lastName: 'Brown',
        email: 'mike@example.com',
        password: 'password123',
        role: ROLES.USER,
        skills: ['Rust', 'WebAssembly', 'C++'],
        headline: 'Systems Programmer',
      },
      {
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah@example.com',
        password: 'password123',
        role: ROLES.USER,
        skills: ['UI/UX', 'Figma', 'React', 'CSS'],
        headline: 'Design Engineer',
      },
      {
        firstName: 'David',
        lastName: 'Miller',
        email: 'david@example.com',
        password: 'password123',
        role: ROLES.USER,
        skills: ['Java', 'Spring Boot', 'Kafka', 'Microservices'],
        headline: 'Senior Backend Engineer',
      },
      {
        firstName: 'Lisa',
        lastName: 'Taylor',
        email: 'lisa@example.com',
        password: 'password123',
        role: ROLES.USER,
        skills: ['Ruby on Rails', 'PostgreSQL', 'Redis'],
        headline: 'Full Stack Dev',
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users.`);

    // Posts
    const posts = [
      {
        authorId: createdUsers[0]._id, // Admin
        content: 'Welcome to HashIn! We are building a professional network for developers. 🚀',
      },
      {
        authorId: createdUsers[1]._id, // Jane
        content: 'Just shipped a new UI component library using React and Tailwind. The developer experience is amazing!',
      },
      {
        authorId: createdUsers[3]._id, // Alice
        content: 'Migrating from REST to gRPC for our internal microservices. The performance gains are significant.',
      },
      {
        authorId: createdUsers[4]._id, // Bob
        content: 'Anyone else loving the new features in Next.js 14? Server actions are a game changer.',
      },
      {
        authorId: createdUsers[5]._id, // Eva
        content: 'Training a new LLM model from scratch today. Hoping the loss function cooperates! 🤞',
      },
    ];

    const createdPosts = await Post.insertMany(posts);
    console.log(`Created ${createdPosts.length} posts.`);

    // Connections
    const connections = [
      { senderId: createdUsers[1]._id, receiverId: createdUsers[0]._id, status: CONNECTION_STATUS.ACCEPTED }, // Jane -> Admin
      { senderId: createdUsers[2]._id, receiverId: createdUsers[0]._id, status: CONNECTION_STATUS.ACCEPTED }, // John -> Admin
      { senderId: createdUsers[3]._id, receiverId: createdUsers[1]._id, status: CONNECTION_STATUS.ACCEPTED }, // Alice -> Jane
      { senderId: createdUsers[4]._id, receiverId: createdUsers[2]._id, status: CONNECTION_STATUS.PENDING },  // Bob -> John (Pending)
      { senderId: createdUsers[5]._id, receiverId: createdUsers[0]._id, status: CONNECTION_STATUS.PENDING },  // Eva -> Admin (Pending)
    ];

    const createdConnections = await Connection.insertMany(connections);
    console.log(`Created ${createdConnections.length} connections.`);

    // Swipes
    const swipes = [
      { swiperId: createdUsers[0]._id, swipedId: createdUsers[1]._id, action: SWIPE_ACTION.LIKE },
      { swiperId: createdUsers[0]._id, swipedId: createdUsers[2]._id, action: SWIPE_ACTION.LIKE },
      { swiperId: createdUsers[0]._id, swipedId: createdUsers[6]._id, action: SWIPE_ACTION.PASS },
      { swiperId: createdUsers[1]._id, swipedId: createdUsers[0]._id, action: SWIPE_ACTION.LIKE }, // Match!
      { swiperId: createdUsers[2]._id, swipedId: createdUsers[0]._id, action: SWIPE_ACTION.LIKE }, // Match!
    ];

    const createdSwipes = await Swipe.insertMany(swipes);
    console.log(`Created ${createdSwipes.length} swipes.`);

    console.log('Seed completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during seed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
