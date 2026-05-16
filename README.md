# CorAI

CorAI is a local-first AI course builder for students. A learner can type a topic or upload class materials, and CorAI turns that input into a structured course with lectures, explanations, key concepts, examples, practice tasks, embedded quizzes, YouTube video lectures, progress tracking, study plans, and AI lecture chat.

The current version is designed for fast product validation. It runs as a frontend-only Vite app and stores learning data in the browser with `localStorage`. It does not currently require Supabase, Vercel, auth, serverless functions, or a database.

## Current Status

- Frontend-only React/Vite app.
- Local browser persistence through `localStorage`.
- User-facing terminology is `lecture` / `lectures`.
- Internal code and routes still use `module` names in places for compatibility with saved data and existing route paths.
- `.env.local`, `dist/`, `.vercel/`, and `node_modules/` are ignored and should not be pushed.
- Production hardening still needs a backend for private API keys.

## Features

- Create a course from either uploaded materials or a topic.
- Upload TXT, Markdown, DOCX, and PPTX materials for browser-side text extraction.
- Choose shared course settings:
  - Course Level: Beginner, Intermediate, Advanced
  - Study Duration: 1 Week, 1 Month, 3 Months
  - Goal: Exam Preparation, Full Course, Quick Revision
- Generate structured lectures with:
  - Short explanation
  - Key concepts
  - Examples
  - Practice tasks
  - Lecture-specific quizzes
  - YouTube video search queries
- Recommend YouTube videos per lecture, not one broad full-course video.
- Filter and rank YouTube results to avoid Shorts, playlists, broad crash courses, and very long videos.
- Cache video results per lecture search signature so stale broad matches are refreshed.
- Take quizzes inside the lecture page after practice is complete.
- Show quiz score, correct count, explanations, weak topics, retake, and review actions inline.
- Navigate to previous and next lectures from the lecture page.
- Ask CorAI directly under the Short Explanation section for lecture-specific help.
- Render AI replies with readable paragraphs, bullet lists, dark text, and bold markdown like `**important text**`.
- Strip chatty AI greetings such as `Hey there` so replies jump straight into the answer.
- Repair older localStorage quiz questions that look like placeholders.
- Track progress, quiz attempts, weak topics, and study plan items locally.

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Lucide icons
- Gemini API for AI course generation and lecture chat
- YouTube Data API v3 for video recommendations
- `localStorage` for local persistence
- `mammoth` for DOCX extraction
- `jszip` for PPTX extraction

## Running Locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

Build:

```bash
npm run build
```

## Environment Variables

Create `.env.local` in the project root. This file is ignored by Git.

For Gemini course generation and lecture chat:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

The app also accepts the older backend-style name:

```env
GEMINI_API_KEY=your_gemini_api_key
```

For YouTube lecture recommendations:

```env
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

or:

```env
YOUTUBE_API_KEY=your_youtube_api_key
```

After changing `.env.local`, restart `npm run dev`.

Important: this is a local test setup. Vite exposes client-side environment variables in the browser bundle, and this project maps the non-`VITE_` local key names into the browser for testing convenience. Do not deploy this local-key version publicly.

## API Key And Git Safety

- Do not commit `.env.local`.
- Do not commit `dist/`.
- Do not push built assets that may contain bundled API keys.
- Keep real keys out of screenshots, logs, commits, and zipped project folders.
- If a real key was ever pushed or shared, rotate it in the provider dashboard.

Useful checks before pushing:

```bash
git status --short --ignored
git check-ignore -v .env.local dist/
```

Expected ignored local items include:

```text
.env.local
dist/
node_modules/
.vercel/
```

## Project Structure

```text
src/
  App.jsx                         Routes and local shell wiring
  main.jsx                        React entrypoint
  index.css                       Tailwind layers and shared visual classes

  contexts/
    LearningDataContext.jsx       Local data store, persistence, app actions

  lib/
    localAi.js                    Gemini calls, YouTube search, file extraction, fallback generation
    learningTransforms.js         Converts stored rows into UI-friendly course/progress data
    navItems.js                   Sidebar/mobile navigation config
    classNames.js                 CSS class join helper

  pages/
    DashboardPage.jsx             Overview, stats, recommended tasks
    CreateCoursePage.jsx          Upload/topic course creation flow
    MyCoursesPage.jsx             Course list, search, filter
    CourseDetailsPage.jsx         Course overview, outcomes, roadmap, lecture cards
    ModuleLessonPage.jsx          Lecture page, video, explanation chat, practice, embedded quiz
    QuizPage.jsx                  Compatibility redirect to embedded lecture quiz
    QuizResultPage.jsx            Compatibility redirect to embedded lecture result
    ProgressTrackingPage.jsx      Progress overview and table
    StudyPlanPage.jsx             Local generated study schedule
    AskAIPage.jsx                 Course-scoped AI chat page
    SettingsPage.jsx              Settings cards

  components/
    layout/                       Sidebar, top bar, mobile nav, app shell
    ui/                           Shared buttons, cards, headers, progress/status components
    dashboard/                    Dashboard cards
    createCourse/                 Upload/topic/settings components
    course/                       Course header, roadmap, outcomes, lecture cards
    module/                       Lecture video, explanation chat, examples, practice, quiz
    quiz/                         Quiz question/result cards
    progress/                     Progress overview/table/charts
```

## Data Model

The app keeps normalized local records in `localStorage` under:

```text
corai.local.v1
```

Stored record groups include:

- `courses`
- `sources`
- `modules`
- `lessons`
- `videos`
- `quizzes`
- `questions`
- `attempts`
- `progress`
- `studyPlan`
- `messages`

Note: the UI says "lecture", but some internal storage keys are still named `modules` and `lessons`. This is intentional for compatibility with the existing app logic and saved local data.

## Course Generation Flow

1. `CreateCoursePage` collects topic/materials, level, duration, and goal.
2. `LearningDataContext.createCourse()` calls `generateLocalCourse()` from `localAi.js`.
3. `localAi.js` extracts supported file text in the browser.
4. If Gemini is configured, the app asks Gemini for structured course JSON.
5. If Gemini is missing or fails, the app generates local fallback content.
6. The course is normalized into local rows for courses, lectures/modules, quizzes, questions, and study plan items.
7. Records are saved in `localStorage`.
8. Pages read from `LearningDataContext` and decorate rows for display.

## YouTube Video Behavior

YouTube search is lazy: it runs when a learner opens a lecture, not during course creation.

Each lecture stores or derives:

- `video_search_query`
- `video_keywords`
- a query signature used for cache freshness

The app searches more candidates, loads durations, ranks locally, and prefers:

- lecture-title matches
- key-concept matches
- beginner/introduction videos for the first lecture
- medium-length embeddable videos

The app penalizes or filters:

- Shorts
- playlists
- full course / complete course / crash course
- bootcamp / masterclass / all-in-one
- very short videos
- very long videos

If no YouTube key exists, the lecture page shows the setup message instead of crashing.

## Quiz Behavior

- Quizzes are embedded inside each lecture page.
- The learner finishes practice, then presses `Take Quiz`.
- Questions appear one at a time.
- `Submit Quiz` appears only on the last question.
- `Next` disappears on the last question.
- Submitting stays on the same lecture page.
- The result shows score, correct count, weak topics, explanations, retake, and review actions.
- Passing attempts update lecture progress to complete.
- Old placeholder-looking questions are repaired automatically on state load.
- Old quiz routes are kept as redirects/fallbacks so older links do not crash.

## Lecture Chat Behavior

The Short Explanation card includes an inline chat for questions about the current lecture.

Quick actions:

- Explain simpler
- Give example
- Summarize

Chat rendering supports:

- paragraphs
- bullet lists
- bold markdown with `**text**` and `__text__`
- darker assistant reply text for readability

The tutor prompt tells Gemini to:

- answer only about the current lecture
- start directly with the answer
- avoid greetings like `Hey there`
- avoid full-course explanations
- use short paragraphs and bullets

If Gemini is missing, expired, or invalid, CorAI falls back to saved lecture content instead of showing raw API errors.

## Local Limitations

- PDF text extraction is not enabled in browser-only mode.
- There is no real user account system yet.
- Data is saved only in the current browser.
- API keys used in this local mode are exposed to the browser.
- The main bundle currently triggers Vite's non-blocking `chunk size` warning.

## Validation

Current checks used before this handoff:

```bash
npm run build
```

Rendered smoke test coverage:

- Dashboard loads.
- Course details page loads.
- Lecture labels render correctly.
- Lecture page loads.
- YouTube video path works with a mocked non-Shorts video.
- Lecture chat strips greetings and renders bold markdown.
- Practice completion unlocks quiz.
- Embedded quiz flow works.
- `Submit Quiz` is hidden before the final question.
- `Next` is hidden on the final question.
- Inline quiz result displays the score.
- Next Lecture navigation appears.

## Future Backend Direction

When the product flow is stable, the next production stage should move sensitive work to a backend:

- Supabase auth and private user data.
- Supabase Storage for uploaded files.
- Server-side Gemini calls so API keys are private.
- Server-side YouTube lookup and caching.
- Postgres tables for courses, lectures/modules, quizzes, progress, chat history, and uploaded material chunks.
- Optional vector search/RAG for Ask CorAI over uploaded documents.
- Optional code-splitting to reduce the frontend bundle size.

This local version is the fast product-validation layer before backend hardening.
