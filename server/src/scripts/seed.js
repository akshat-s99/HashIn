import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.model.js';
import { Post } from '../models/Post.model.js';
import { Connection } from '../models/Connection.model.js';
import { Swipe } from '../models/Swipe.model.js';
import { Message } from '../models/Message.model.js';
import { Conversation } from '../models/Conversation.model.js';
import { ROLES, CONNECTION_STATUS, SWIPE_ACTION } from '../config/constants.js';

// Realistic pool of developer skills and locations
const SKILLS_POOL = [
  'React', 'Node.js', 'TypeScript', 'Go', 'Rust', 'Python', 'C++', 'Docker', 
  'Kubernetes', 'AWS', 'PostgreSQL', 'GraphQL', 'Next.js', 'TailwindCSS', 
  'TensorFlow', 'PyTorch', 'System Design', 'Redis', 'gRPC', 'WebAssembly'
];

const LOCATIONS = [
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'London, UK', 
  'Berlin, DE', 'Bangalore, IN', 'Tokyo, JP', 'Toronto, CA', 'Amsterdam, NL'
];

const DEVELOPER_ROLES = [
  { title: 'Frontend Engineer', skills: ['React', 'TypeScript', 'TailwindCSS', 'Next.js', 'GraphQL'] },
  { title: 'Backend Developer', skills: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'Docker'] },
  { title: 'Systems Architect', skills: ['Rust', 'C++', 'System Design', 'gRPC', 'WebAssembly'] },
  { title: 'DevOps Engineer', skills: ['Docker', 'Kubernetes', 'AWS', 'Go', 'System Design'] },
  { title: 'ML/AI Researcher', skills: ['Python', 'TensorFlow', 'PyTorch', 'Rust', 'Docker'] },
  { title: 'Full Stack Engineer', skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'] }
];

const FIRST_NAMES = [
  'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia',
  'James', 'Amelia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Alexander', 'Harper',
  'Mason', 'Camila', 'Michael', 'Gianna', 'Ethan', 'Abigail', 'Daniel', 'Luna', 'Jacob', 'Ella',
  'Logan', 'Elizabeth', 'Jackson', 'Sofia', 'Levi', 'Avery', 'Sebastian', 'Mila', 'Mateo', 'Aria'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
];

const POST_TEMPLATES = [
  "Just migrated our production database from dynamic sharding to horizontal partition clusters. The query latency dropped by 34%! Always invest in proper database design early. 🗄️",
  "Is it just me, or is the compile-time safety in Rust worth the 2x developer overhead? Writing systems code has never felt this solid. 🦀",
  "Ripped out all standard client-side state managers in our app and moved to React Context + url search params. Kept it simple and removed 40kb from our JS bundle.",
  "Here is my quick tip on DevOps: If your Docker container builds are slow, use multi-stage builds and make sure your runner caches the node_modules layers! 🚀",
  "Spent the morning debugging a race condition in our Go microservice cluster. Lesson learned: always use channels and select statements instead of mutexes when possible.",
  "Just launched a new UI package today! Beautiful components, fully keyboard accessible (a11y), and zero dependencies. Check it out on npm.",
  "AI is exciting, but let's remember that clean code, solid testing, and high reliability are still the backbone of any product. Don't build houses of cards.",
  "What is your go-to stack for high-performance side-projects in 2026? Next.js + Tailwind, or Vite + Go + Vanilla CSS?",
  "Refactoring 3,000 lines of legacy JavaScript code into strict TypeScript. It hurts, but the compiler already caught 14 potential production bugs.",
  "System design interview question of the day: How would you design a real-time collaborative code editor like Google Docs but with offline support?",
  "Unpopular opinion: You don't need Kubernetes until you have at least 15 microservices and 5 engineering teams. Keep it simple on App Engine or Render first."
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();
    await Connection.deleteMany();
    await Swipe.deleteMany();
    await Message.deleteMany();
    await Conversation.deleteMany();

    console.log('Cleared all collections.');

    // 1. Create Core Users (Admin & Standard demo users)
    const coreUsers = [
      {
        firstName: 'Admin',
        lastName: 'Developer',
        email: 'admin@hashin.com',
        password: 'password123',
        role: ROLES.ADMIN,
        skills: ['React', 'Node.js', 'System Design', 'PostgreSQL', 'Docker'],
        headline: 'Lead Architect @ HashIn',
        location: 'San Francisco, CA',
        about: 'Building the next generation social hub for developers. Passionate about software craftsmanship, microservices, and modular UI design.',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Admin`
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: ROLES.USER,
        skills: ['React', 'TypeScript', 'TailwindCSS', 'Next.js'],
        headline: 'Senior Frontend Engineer @ Vercel',
        location: 'New York, NY',
        about: 'Creating interactive user interfaces and exploring design systems. Love visual craftsmanship.',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Jane`
      },
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        password: 'password123',
        role: ROLES.USER,
        skills: ['Python', 'Docker', 'Kubernetes', 'AWS'],
        headline: 'Cloud Architect @ AWS',
        location: 'Seattle, WA',
        about: 'Designing auto-scaling infrastructure and hybrid cloud pipelines. Docker is life.',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=John`
      }
    ];

    const createdCoreUsers = await User.create(coreUsers);
    const adminUser = createdCoreUsers[0];
    console.log('Created core users.');

    // 2. Generate 50+ diverse, high-fidelity developer profiles
    const generatedUsers = [];
    for (let i = 0; i < 55; i++) {
      const devRole = DEVELOPER_ROLES[i % DEVELOPER_ROLES.length];
      const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
      const lastName = LAST_NAMES[i % LAST_NAMES.length];
      const email = `dev${i + 1}@hashin.com`;
      const location = LOCATIONS[i % LOCATIONS.length];
      
      // Shuffle skills slightly to create unique sets
      const baseSkills = [...devRole.skills];
      const randomExtraSkill = SKILLS_POOL.find(s => !baseSkills.includes(s));
      if (randomExtraSkill) baseSkills.push(randomExtraSkill);

      const about = `I am a passionate ${devRole.title} based in ${location.split(',')[0]}. Specializing in ${baseSkills.slice(0, 3).join(', ')}. Currently working on building open-source developer tooling and scalable software architecture. Feel free to connect!`;

      generatedUsers.push({
        firstName,
        lastName,
        email,
        password: 'password123',
        role: ROLES.USER,
        skills: baseSkills,
        headline: `${devRole.title} @ ${i % 3 === 0 ? 'Stripe' : i % 3 === 1 ? 'Linear' : 'GitHub'}`,
        location,
        about,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}${lastName}`,
        experience: [
          {
            title: devRole.title,
            company: i % 2 === 0 ? 'Netflix' : 'Meta',
            location,
            current: true,
            description: `Developing and implementing modern software designs for microservices and cloud deployments.`
          }
        ],
        education: [
          {
            school: 'Stanford University',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            current: false,
            description: 'Focused on Algorithms, Distributed Systems, and Database Systems.'
          }
        ]
      });
    }

    const createdDevUsers = await User.create(generatedUsers);
    const allUsers = [...createdCoreUsers, ...createdDevUsers];
    console.log(`Successfully seeded ${allUsers.length} total developers.`);

    // 3. Generate 30+ highly-polished tech posts
    const seededPosts = [];
    for (let i = 0; i < 35; i++) {
      const author = allUsers[i % allUsers.length];
      const content = POST_TEMPLATES[i % POST_TEMPLATES.length];
      
      // Generate realistic like list (random subset of users)
      const likesCount = Math.floor(Math.random() * 15) + 3;
      const likes = [];
      for (let j = 0; j < likesCount; j++) {
        const liker = allUsers[Math.floor(Math.random() * allUsers.length)];
        if (!likes.includes(liker._id)) {
          likes.push(liker._id);
        }
      }

      // Add a technical comment occasionally
      const comments = [];
      if (i % 2 === 0) {
        comments.push({
          content: `Fully agree! This is exactly why we shifted to Next.js server actions. Removes boilerplate code.`,
          authorId: allUsers[Math.floor(Math.random() * allUsers.length)]._id,
          createdAt: new Date(Date.now() - (i * 3600000))
        });
      }

      seededPosts.push({
        authorId: author._id,
        content,
        likes,
        likesCount: likes.length,
        comments,
        createdAt: new Date(Date.now() - (i * 4 * 3600000)) // space out posts in time
      });
    }

    const createdPosts = await Post.insertMany(seededPosts);
    console.log(`Seeded ${createdPosts.length} developer posts.`);

    // 4. Pre-seed Swipe patterns (Enabling instant mutual matches for presentation)
    // We will have the first 15 developers "like" the Admin user in advance.
    // When the Admin user logs in and swiped them right during the demo, they will match immediately!
    const swipes = [];
    const connections = [];

    // First 10 developers pre-liked Admin
    for (let i = 3; i < 18; i++) {
      const dev = allUsers[i];
      swipes.push({
        swiperId: dev._id,
        swipedId: adminUser._id,
        action: SWIPE_ACTION.LIKE
      });
    }

    // Pre-create 5 accepted connections for Admin so their Network list has data immediately
    for (let i = 18; i < 23; i++) {
      const dev = allUsers[i];
      connections.push({
        senderId: dev._id,
        receiverId: adminUser._id,
        status: CONNECTION_STATUS.ACCEPTED
      });
      // Also record matching swipes so discovery doesn't recommend them again
      swipes.push(
        { swiperId: dev._id, swipedId: adminUser._id, action: SWIPE_ACTION.LIKE },
        { swiperId: adminUser._id, swipedId: dev._id, action: SWIPE_ACTION.LIKE }
      );
    }

    // Pre-create 3 pending connection requests for Admin to accept during the demo
    for (let i = 23; i < 26; i++) {
      const dev = allUsers[i];
      connections.push({
        senderId: dev._id,
        receiverId: adminUser._id,
        status: CONNECTION_STATUS.PENDING
      });
    }

    await Swipe.insertMany(swipes);
    await Connection.insertMany(connections);
    console.log('Successfully configured mutual match swipe records.');

    console.log('Database Seeding Completed Successfully! 🚀');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
