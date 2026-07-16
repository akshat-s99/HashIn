import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './src/app.js';
import { User } from './src/models/User.model.js';
import { Post } from './src/models/Post.model.js';
import { Connection } from './src/models/Connection.model.js';
import * as authService from './src/services/auth.service.js';
import * as postService from './src/services/post.service.js';
import * as userService from './src/services/user.service.js';
import * as adminController from './src/controllers/admin.controller.js';

dotenv.config();

// Simple mock res
const mockRes = {
  status: function(code) { this.statusCode = code; return this; },
  json: function(data) { this.data = data; return this; },
  clearCookie: function() { return this; }
};
const mockNext = (err) => { if (err) throw err; };

async function runTests() {
  console.log('Connecting to DB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.');
  
  try {
    // Clean up test users if they exist
    await User.deleteMany({ email: { $in: ['test1@test.com', 'test2@test.com', 'admin@test.com'] } });
    
    // 1. Create Users
    console.log('--- Testing User Creation ---');
    const { user: user1, accessToken: token1 } = await authService.registerUser({
      firstName: 'Test', lastName: 'One', email: 'test1@test.com', password: 'password123'
    }, 'test-agent');
    const { user: user2, accessToken: token2 } = await authService.registerUser({
      firstName: 'Test', lastName: 'Two', email: 'test2@test.com', password: 'password123'
    }, 'test-agent');
    const { user: admin, accessToken: adminToken } = await authService.registerUser({
      firstName: 'Admin', lastName: 'User', email: 'admin@test.com', password: 'password123'
    }, 'test-agent');
    
    // Set admin role manually since mass assignment blocks it
    await User.findByIdAndUpdate(admin._id, { role: 'admin' });
    console.log('Users created successfully.');

    // 2. Test Bookmarks
    console.log('\n--- Testing Bookmarks ---');
    const post = await postService.createPost(user2._id, 'Hello world', '');
    await postService.toggleBookmark(user1._id, post._id);
    const bookmarkedPosts = await postService.getBookmarkedPosts(user1._id);
    if (bookmarkedPosts.length !== 1 || bookmarkedPosts[0]._id.toString() !== post._id.toString()) {
      throw new Error('Bookmark toggle failed');
    }
    console.log('Bookmarks tested successfully.');

    // 3. Test Admin Endpoints (via controller mock)
    console.log('\n--- Testing Admin Services ---');
    await adminController.disableUser({ params: { id: user2._id } }, mockRes, mockNext);
    let disabledUser = await User.findById(user2._id);
    if (!disabledUser.isDisabled) throw new Error('User was not disabled');
    await adminController.enableUser({ params: { id: user2._id } }, mockRes, mockNext);
    disabledUser = await User.findById(user2._id);
    if (disabledUser.isDisabled) throw new Error('User was not enabled');
    console.log('Admin services tested successfully.');

    // 4. Test Password Reset
    console.log('\n--- Testing Password Reset ---');
    await authService.forgotPassword('test1@test.com');
    const userForReset = await User.findOne({ email: 'test1@test.com' });
    if (!userForReset.resetPasswordToken) throw new Error('Reset token not generated');
    console.log('Password reset initiated successfully (Check ethereal log above if any).');

    // 5. Test Cascading Delete
    console.log('\n--- Testing Cascading Delete ---');
    // Create a connection
    await Connection.create({ senderId: user1._id, receiverId: user2._id, status: 'accepted' });
    
    // Delete user1
    await userService.deleteUserAccount(user1._id);
    
    // Verify cascading deletes
    const connections = await Connection.find({ $or: [{ senderId: user1._id }, { receiverId: user1._id }] });
    if (connections.length > 0) throw new Error('Cascading delete failed for connections');
    
    const user1Posts = await Post.find({ authorId: user1._id });
    if (user1Posts.length > 0) throw new Error('Cascading delete failed for posts');
    
    console.log('Cascading deletes verified successfully.');
    
    console.log('\n✅ ALL TESTS PASSED SUCCESSFULLY ✅');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    // Clean up
    await User.deleteMany({ email: { $in: ['test1@test.com', 'test2@test.com', 'admin@test.com'] } });
    await mongoose.connection.close();
  }
}

runTests();
