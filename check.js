// File: check.js
const apiKey = "AIzaSyCsHSpkCYFszduzmMgEFO27OcKHAJTV9w8"; 

async function checkModels() {
  console.log("🔍 Connecting to Google...");
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (data.models) {
      console.log("\n✅ AVAILABLE FREE MODELS:");
      console.log("-------------------------");
      
      // Sirf Chat wale models filter karke dikhayega
      const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
      
      chatModels.forEach(model => {
        console.log(`🚀 ${model.name}`);
      });
      
      console.log("-------------------------\n");
      console.log("TIP: Inme se koi bhi naam 'AIChatbot.jsx' mein use karein.");
      
    } else {
      console.log("❌ Error:", data);
    }
  } catch (error) {
    console.error("❌ Network Error. Internet check karein.");
  }
}

checkModels();