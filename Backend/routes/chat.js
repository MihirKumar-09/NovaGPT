import express from "express";
const router = express.Router();
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

// Test route to test the API endpoints
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abz",
      title: "tesing new thread2",
    });
    const response = await thread.save();
    console.log(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

// Get All Threads;
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 }); // Descending order of updatedAt...most recent data on top;

    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch Thread" });
  }
});

// Get specific Thread;
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// Delete specific Thread;
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      res.status(404).json({ error: "Thread not  found" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

// Generate msg route;
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    res.status(400).json({ error: "Missing required field" });
  }
  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }
    const assistantReplay = await getOpenAIAPIResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReplay });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({ reply: assistantReplay });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong!" });
  }
});

export default router;
