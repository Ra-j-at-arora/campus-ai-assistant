# Career Prep & Handoff Guide

## 📄 Resume Content

**Project Title**: Unified Campus Intelligence Platform
**Role**: Full-Stack AI Engineer
**Tech Stack**: Next.js, React, Node.js, Express, MongoDB, Tailwind CSS, Google Gemini AI SDK, Recharts.

**Resume Bullet Points (SDE Focused):**
- Architected a scalable, microservice-inspired university platform using Node.js and Express, securely integrating MongoDB and JWT role-based access control for students and administrators.
- Engineered a contextual AI Orchestrator leveraging the Google Gen AI SDK, implementing advanced "Tool Calling" to allow the LLM to autonomously fetch and aggregate live internal database records (events, menus, academics) with zero hallucinations.
- Developed a highly performant Next.js frontend with Tailwind CSS v4 featuring persistent dark mode, and an Admin observability dashboard using Recharts to visualize system health, sub-component latencies, and AI usage metrics via optimized MongoDB aggregation pipelines.

---

## 🎤 Interview Q&A

**1. Explain your project.**
*Answer:* I built a centralized SaaS platform for university operations. Instead of students navigating separate portals for library books, cafeteria menus, and academic deadlines, they log into a single dashboard. The core feature is a Gemini-powered AI assistant that understands natural language queries, identifies the user's intent, and autonomously triggers backend API tools to fetch real-time data from MongoDB to formulate accurate answers.

**2. Why did you use Gemini?**
*Answer:* I chose Google's Gemini-2.5-Flash because of its native, highly efficient support for "Function Calling" (Tool Calling) and its massive context window. It's exceptionally fast at deciding which internal backend tools to execute based on a user's prompt, making it perfect for real-time chat orchestration.

**3. How does tool calling work?**
*Answer:* I defined my backend services (Library, Events, etc.) as JSON Schema function declarations and passed them to the Gemini SDK. When a user asks a question, the model returns a `functionCall` object instead of text. My backend `ToolExecutor` intercepts this, runs the actual MongoDB database queries, and feeds the raw JSON results back into the model to generate a conversational response.

**4. How does the AI avoid hallucinations?**
*Answer:* The AI is strictly tethered to the database. By utilizing Tool Calling and a strict System Prompt, the model does not rely on its internal training data to answer university-specific questions. It waits for my backend to supply the precise data (e.g., today's menu) and simply formats that raw data into a human-readable sentence.

**5. How does context management work?**
*Answer:* I implemented a `ContextManager` class in the backend that intercepts every interaction and saves the `role` (user or model) and `parts` (text) to a MongoDB `ChatHistory` collection. Before querying Gemini, the server retrieves the user's past messages, ensuring the LLM understands follow-up questions like "Where is that located?"

**6. How is the system scalable?**
*Answer:* The backend is architected to be modular. Each campus service has its own discrete controller and route, mimicking a microservice architecture. The AI Orchestrator acts as an API gateway. To handle high volume, I implemented `express-rate-limit`, NoSQL sanitization, payload size limits, and asynchronous "fire-and-forget" logging that records analytics without blocking the main event loop.

**7. What challenges did you face?**
*Answer:* A major challenge was managing the asynchronous flow of Tool Calling. The LLM would request a tool, I had to pause the AI generation, execute the local DB query, and reconstruct the conversation history perfectly so the LLM knew it was receiving a `functionResponse`. I solved this by building a dedicated `ChatOrchestrator` that manages the multi-turn state cleanly.

---

## 🎬 Recruiter Demo Script (5 Minutes)

**Setup:** Ensure both the backend and frontend are running locally, and the database is seeded.

**Step 1: The Hook (0:00 - 1:00)**
- *Action*: Open the browser to the login screen.
- *Script*: "Hi, I'm excited to show you the Unified Campus Platform. Universities struggle with fragmented systems—separate apps for libraries, food, and academics. I built a centralized SaaS solution to fix that."
- *Action*: Log in as a Student. Show the beautiful Light/Dark mode toggle (click it a few times to show the smooth Tailwind v4 transition).

**Step 2: The Core Services (1:00 - 2:00)**
- *Action*: Navigate to the Dashboard. Point out the widgets.
- *Script*: "Here is the main dashboard pulling live data from my Node.js backend. We have discrete micro-services for Events, Academics, and Cafeteria menus running off a MongoDB cluster."

**Step 3: The AI Orchestrator "Wow" Moment (2:00 - 3:30)**
- *Action*: Navigate to the AI Chat.
- *Script*: "But the real power is the AI integration. I used Google Gemini not just as a chatbot, but as an Orchestrator."
- *Action*: Type: *"I have to study for exams. What is the library capacity, and what's for dinner tonight?"*
- *Script*: "Notice what happens here. The AI realizes it needs data it doesn't have. It autonomously decides to call *two* separate backend tools simultaneously—the Library tool and the Cafeteria tool—fetches the live JSON from MongoDB, and synthesizes this response. Zero hallucinations."

**Step 4: The Admin Analytics (3:30 - 5:00)**
- *Action*: Log out, and log back in with your `ADMIN` account. (Or just show the Admin button appearing in the sidebar). Click Analytics.
- *Script*: "Finally, I built a complete observability platform for administrators. Because I implemented asynchronous background logging in the AI Orchestrator, we can track exactly what the AI is doing."
- *Action*: Hover over the Recharts graphs and scroll through the Query Explorer table.
- *Script*: "We can see the average latency of the LLM tokens, track service health, and see exactly which tools users are requesting most frequently. And all of these endpoints are securely protected by JWT role-based middleware."

**Closing**: "It's a complete, production-ready full-stack application. Thank you for your time!"
