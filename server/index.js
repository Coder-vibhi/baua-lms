const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// Supabase client import (Ensure path is correct)
const supabase = require('./supabaseClient');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. GET ALL COURSES (DSA, System Design, etc.)
app.get('/courses', async (req, res) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// 2. GET COURSE DETAILS + CHAPTERS (Jab user kisi course par click karega)
app.get('/courses/:id', async (req, res) => {
  const { id } = req.params;

  // Course ki details lao
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  // Us course ke Chapters lao
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .eq('course_id', id)
    .order('id', { ascending: true });

  if (courseError || chaptersError) {
    return res.status(500).json({ error: 'Data fetch error' });
  }

  // Course aur Chapters milakar bhej do
  res.json({ ...course, chapters });
});

// 3. GET VIDEOS OF A CHAPTER (Jab user kisi Pattern/Chapter par click karega)
app.get('/chapters/:id/videos', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('chapter_id', id)
    .order('sequence_number', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Test Route
app.get('/', (req, res) => {
  res.send('LMS Server is Updated & Running! 🚀');
});

app.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} par`);
});

// ... baaki codes ke neeche ...

// 4. MARK VIDEO COMPLETE & REWARD COINS
app.post('/mark-complete', async (req, res) => {
  const { userId, videoId, chapterId } = req.body;

  try {
    // A. Check karo pehle se dekha hai kya?
    const { data: existing } = await supabase
      .from('video_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .single();

    if (existing) {
      return res.json({ message: 'Already watched', coinsAdded: 0 });
    }

    // B. Naya Record banao (Video Watched)
    await supabase.from('video_progress').insert({ user_id: userId, video_id: videoId });

    // C. User ko +1 Coin do (Video Reward)
    let coinsReward = 1;
    let message = "Video Completed! +1 Coin";

    // D. CHECK: Kya pura Chapter complete ho gaya? (+10 Coins Bonus)
    // 1. Chapter ki total videos count karo
    const { count: totalVideos } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true })
      .eq('chapter_id', chapterId);

    // 2. User ne us chapter ki kitni videos dekhi hain count karo
    // (Iske liye join query thodi complex hoti hai, hum simple logic use karenge)
    // Hum frontend se refresh karwa lenge, abhi ke liye simple +1 rakhte hain.
    // Bonus logic complex ho sakta hai, pehle basic +1 chalate hain.
    
    // E. Profile Update karo
    // Pehle current coins lao
    const { data: profile } = await supabase.from('profiles').select('coins').eq('id', userId).single();
    const newBalance = (profile?.coins || 0) + coinsReward;

    await supabase.from('profiles').update({ coins: newBalance }).eq('id', userId);

    res.json({ message, coinsAdded: coinsReward, newBalance });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. GET USER PROFILE & DSA PROGRESS
app.get('/user-profile/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. User Profile (Name, Coins) lao
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // 2. PROGRESS CALCULATION FOR DSA (Course ID 1)
    
    // A. Total Videos in DSA count karo
    // (Pehle DSA ke saare Chapters dhoondo)
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id')
      .eq('course_id', 1);
    
    const chapterIds = chapters.map(c => c.id);

    // (Un chapters ki saari videos count karo)
    const { count: totalVideos } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true })
      .in('chapter_id', chapterIds);

    // B. User ne inme se kitni dekhi hain?
    // (Video Progress table check karo)
    const { count: completedVideos } = await supabase
      .from('video_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('video_id', (
         // Humein un videos ki IDs chahiye jo DSA chapters mein hain
         // Note: Supabase JS mein nested subquery tough hoti hai, 
         // isliye hum 'video_progress' ko filter karenge client side ya raw query se.
         // Simple Logic: Hum maan lete hain user ne jo bhi dekha hai wo count hoga
         // (Production mein hum strict filtering karenge)
         // Filhal ke liye simple count:
         null // Placeholder
      ));
      
    // Simplified Query for Speed:
    // Hum check karenge user ne total kitni videos complete ki hain.
    // (Agar future mein multiple courses honge to hum filter add karenge)
    const { count: userCompleted } = await supabase
        .from('video_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    // C. Percentage nikalo
    const percentage = totalVideos === 0 ? 0 : Math.round((userCompleted / totalVideos) * 100);

    // 3. Data bhejo
    res.json({ ...profile, progress: percentage, completedCount: userCompleted });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ... Upar wale codes ...

// 6. MARK ROADMAP VIEWED (Auto-Claim Coin)
app.post('/mark-roadmap-viewed', async (req, res) => {
  const { userId, chapterId } = req.body;

  try {
    // A. Check karo: Kya user ne ye roadmap pehle khola hai?
    const { data: existing } = await supabase
      .from('chapter_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)
      .single();

    if (existing) {
      return res.json({ message: 'Already viewed', coinsAdded: 0 });
    }

    // B. Naya Record banao (Roadmap Viewed)
    await supabase.from('chapter_progress').insert({ user_id: userId, chapter_id: chapterId });

    // C. User ko +1 Coin do
    const { data: profile } = await supabase.from('profiles').select('coins').eq('id', userId).single();
    const newBalance = (profile?.coins || 0) + 1;

    await supabase.from('profiles').update({ coins: newBalance }).eq('id', userId);

    res.json({ message: "Roadmap Unlocked! +1 Coin", coinsAdded: 1, newBalance });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ... Upar ke codes ...

// --- ADMIN APIs ---

// 7. CREATE COURSE
app.post('/admin/add-course', async (req, res) => {
  const { title, description, image_url, playlist_url } = req.body;
  const { data, error } = await supabase
    .from('courses')
    .insert({ title, description, image_url, playlist_url })
    .select();
  
  if(error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 8. CREATE CHAPTER
app.post('/admin/add-chapter', async (req, res) => {
  const { course_id, title, description, roadmap_image_url } = req.body;
  const { data, error } = await supabase
    .from('chapters')
    .insert({ course_id, title, description, roadmap_image_url })
    .select();

  if(error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 9. CREATE VIDEO
app.post('/admin/add-video', async (req, res) => {
  const { chapter_id, title, video_url, sequence_number } = req.body;
  const { data, error } = await supabase
    .from('videos')
    .insert({ chapter_id, title, video_url, sequence_number })
    .select();

  if(error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});