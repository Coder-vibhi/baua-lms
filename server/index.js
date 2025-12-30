const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const supabase = require('./supabaseClient');

// 🔥 SOCKET.IO IMPORTS
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 🔥 SOCKET.IO SERVER SETUP ---
// Express app ko HTTP Server me wrap kiya taaki Socket chal sake
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // Production me '*' hatakar apni Vercel link dalna better hoga security ke liye
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

// --- 🔥 CHAT ROOM LOGIC ---
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // 1. Join Specific Course Room (e.g., "dsa_course_101")
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // 2. Send Message to Specific Room Only
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// ==========================================
//              API ROUTES
// ==========================================

// 1. GET ALL COURSES
app.get('/courses', async (req, res) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('id', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. GET COURSE DETAILS + CHAPTERS
app.get('/courses/:id', async (req, res) => {
  const { id } = req.params;

  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .eq('course_id', id)
    .order('id', { ascending: true });

  if (courseError || chaptersError) {
    return res.status(500).json({ error: 'Data fetch error' });
  }
  res.json({ ...course, chapters });
});

// 3. GET VIDEOS OF A CHAPTER
app.get('/chapters/:id/videos', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('chapter_id', id)
    .order('sequence_number', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 4. MARK VIDEO COMPLETE & REWARD COINS
app.post('/mark-complete', async (req, res) => {
  const { userId, videoId, chapterId } = req.body;

  try {
    // A. Check if already watched
    const { data: existing } = await supabase
      .from('video_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .single();

    if (existing) {
      return res.json({ message: 'Already watched', coinsAdded: 0 });
    }

    // B. Create New Record
    await supabase.from('video_progress').insert({ user_id: userId, video_id: videoId });

    // C. Reward +1 Coin
    let coinsReward = 1;
    let message = "Video Completed! +1 Coin";

    // D. Update Profile Coins
    const { data: profile } = await supabase.from('profiles').select('coins').eq('id', userId).single();
    const newBalance = (profile?.coins || 0) + coinsReward;

    await supabase.from('profiles').update({ coins: newBalance }).eq('id', userId);

    res.json({ message, coinsAdded: coinsReward, newBalance });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. GET USER PROFILE & PROGRESS
app.get('/user-profile/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Get Profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // 2. Calculate Progress (Simplified for Speed)
    // Future: Add logic to filter by specific course IDs if needed
    
    // Total videos in entire DB (or specific course)
    // For now, let's assume DSA (course_id=1) logic or just global progress
    const { count: userCompleted } = await supabase
        .from('video_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    // Placeholder total (You can make this dynamic later)
    const totalEstimatedVideos = 100; 
    const percentage = Math.min(100, Math.round((userCompleted / totalEstimatedVideos) * 100));

    res.json({ ...profile, progress: percentage, completedCount: userCompleted });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. MARK ROADMAP VIEWED (Auto-Claim Coin)
app.post('/mark-roadmap-viewed', async (req, res) => {
  const { userId, chapterId } = req.body;

  try {
    const { data: existing } = await supabase
      .from('chapter_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)
      .single();

    if (existing) return res.json({ message: 'Already viewed', coinsAdded: 0 });

    await supabase.from('chapter_progress').insert({ user_id: userId, chapter_id: chapterId });

    const { data: profile } = await supabase.from('profiles').select('coins').eq('id', userId).single();
    const newBalance = (profile?.coins || 0) + 1;

    await supabase.from('profiles').update({ coins: newBalance }).eq('id', userId);

    res.json({ message: "Roadmap Unlocked! +1 Coin", coinsAdded: 1, newBalance });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
//              ADMIN ROUTES
// ==========================================

// 7. ADD COURSE
app.post('/admin/add-course', async (req, res) => {
  const { title, description, image_url, playlist_url } = req.body;
  const { data, error } = await supabase
    .from('courses')
    .insert({ title, description, image_url, playlist_url })
    .select();
  
  if(error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 8. ADD CHAPTER
app.post('/admin/add-chapter', async (req, res) => {
  const { course_id, title, description, roadmap_image_url } = req.body;
  const { data, error } = await supabase
    .from('chapters')
    .insert({ course_id, title, description, roadmap_image_url })
    .select();

  if(error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 9. ADD VIDEO
app.post('/admin/add-video', async (req, res) => {
  const { chapter_id, title, video_url, sequence_number } = req.body;
  const { data, error } = await supabase
    .from('videos')
    .insert({ chapter_id, title, video_url, sequence_number })
    .select();

  if(error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// --- TEST ROUTE ---
app.get('/', (req, res) => {
  res.send('LMS Server is Updated & Running with Chat! 🚀');
});

// --- 🔥 FINAL LISTENER (Use 'server.listen', not 'app.listen') ---
server.listen(PORT, () => {
  console.log(`✅ Server running with Socket.io on port ${PORT}`);
});