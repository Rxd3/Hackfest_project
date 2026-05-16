const cardColors = ["lavender", "peach", "lime"];

export function decorateCourse(course, state) {
  const modules = state.modules.filter((module) => module.course_id === course.id);
  const quizzes = state.quizzes.filter((quiz) => quiz.course_id === course.id);
  const progress = courseProgress(course.id, state);
  const lastAttempt = state.attempts
    .filter((attempt) => attempt.course_id === course.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

  return {
    ...course,
    number: String(state.courses.findIndex((item) => item.id === course.id) + 1).padStart(2, "0"),
    source: course.source_type === "file" ? "Generated from materials" : "Created from topic",
    sourceFile: course.source_file || course.source_label || "Topic prompt",
    progress,
    modules: modules.length,
    quizzes: quizzes.length,
    duration: course.estimated_time || course.duration,
    weakTopics: normalizeArray(course.weak_topics),
    cardColor: course.card_color || cardColors[state.courses.findIndex((item) => item.id === course.id) % cardColors.length],
    lastStudied: lastAttempt ? relativeDay(lastAttempt.created_at) : "Not started",
  };
}

export function decorateModule(module, state) {
  const questions = state.questions.filter((question) => question.module_id === module.id);
  const progress = state.progress.find((item) => item.module_id === module.id);
  const latestAttempt = latestAttemptForModule(module.id, state);
  const percent = progress?.percent || (latestAttempt ? latestAttempt.score : 0);

  return {
    ...module,
    number: module.position,
    status: moduleStatus(percent, latestAttempt),
    quizScore: latestAttempt ? `${latestAttempt.score}%` : "-",
    progress: percent,
    concepts: normalizeArray(module.key_concepts).length,
    questions: questions.length,
    time: `${module.estimated_minutes || 30} min`,
  };
}

export function courseProgress(courseId, state) {
  const modules = state.modules.filter((module) => module.course_id === courseId);
  if (!modules.length) {
    return 0;
  }

  const total = modules.reduce((sum, module) => {
    const progress = state.progress.find((item) => item.module_id === module.id);
    const latestAttempt = latestAttemptForModule(module.id, state);
    return sum + Math.max(progress?.percent || 0, latestAttempt?.score || 0);
  }, 0);

  return Math.round(total / modules.length);
}

export function latestAttemptForModule(moduleId, state) {
  return state.attempts
    .filter((attempt) => attempt.module_id === moduleId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
}

export function latestAttemptForQuiz(quizId, state) {
  return state.attempts
    .filter((attempt) => attempt.quiz_id === quizId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
}

export function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function moduleStatus(percent, latestAttempt) {
  if (percent >= 100 || latestAttempt?.score >= 80) {
    return "completed";
  }

  if (latestAttempt && latestAttempt.score < 60) {
    return "needs review";
  }

  if (percent > 0 || latestAttempt) {
    return "in progress";
  }

  return "not started";
}

export function relativeDay(value) {
  const date = new Date(value);
  const now = new Date();
  const diffDays = Math.floor((startOfDay(now) - startOfDay(date)) / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
