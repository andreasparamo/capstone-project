# Operational System Logic

## Architecture: Modular & Deterministic

This document outlines the specifications for **Autonomous Logic Modules** within the system. These modules are designed to execute specific logical tasks with strictly defined inputs, outputs, and side effects.

### Core Principles

1.  **Scoped Responsibility**: Each module executes a single, well-defined function.
2.  **Stateless Execution**: Modules should rely primarily on the `Inputs` provided at runtime, rather than internal persistent state.
3.  **Verifiable Output**: All module operations must result in a structured Data Object (JSON) that can be validated against a schema before persistence.

---

## Module Definitions

### 1. Typing Efficiency Coach

**Objective:** Analyze user performance metrics to generate targeted practice recommendations.

**Execution Triggers:**
- `Event: TestCompleted`
- `Event: SessionStarted` (Conditional: if `lastRecommendation` > 24h old)

**Data Inputs (Read Context):**
- `performanceLog`: Last 20 test entries (Speed, Accuracy, Consistency).
- `curriculumStatus`: Map of completed modules and mastery scores.
- `userMetrics`: Rolling averages for WPM and Error Rate.
- `configuration`: Current difficulty setting ('Beginner', 'Intermediate', 'Advanced').

**Operational Constraints:**
- **Immutable History**: Cannot modify or delete existing `performanceLog` entries.
- **Difficulty Floor**: Cannot downgrade difficulty below 'Beginner' without explicit user reset.
- **Progression Gating**: Must enforce accuracy thresholds (e.g., >95%) before recommending speed-focused drills.

**Write Permissions (Output Scope):**
- `Target`: `users/{uid}/coach/activeRecommendation`
- `Metadata`: `users/{uid}/stats/lastAnalysisTimestamp`

**Output Schema:**
```json
{
  "nextLessonId": "string (UUID)",
  "skillFocus": "string (e.g., 'pinky-reach', 'rhythm')",
  "difficultyAction": "MAINTAIN" | "INCREASE" | "DECREASE",
  "userMessage": "string (Contextual feedback text)",
  "practiceMode": "standard" | "speed_drill" | "accuracy_drill"
}
```

### 2. Session Integrity Monitor

**Objective:** Validate session data and detect anomalies in typing patterns.

**Execution Triggers:**
- `Event: TestCompleted`

**Data Inputs:**
- `currentTest`: Keystroke timings, raw wpm, adjusted wpm.
- `historicalBaseline`: Standard deviation of user's past performance.

**Output Schema:**
```json
{
  "isValid": "boolean",
  "anomalyDetected": "boolean",
  "flagReason": "string | null" // e.g., "Impossible WPM", "Script Usage Suspected"
}
```

---

## Implementation Guidelines

### Isolation
Logic modules should be implemented as pure functions where possible:
`Recommendation = F(PerformanceLog, CurriculumStatus, Configuration)`

### Error Handling
If a module encounters a processing error or insufficient data:
1.  **Fail Safe**: Return a `null` or `default` recommendation.
2.  **Log**: Record the specific input vector that caused the failure for debugging.
3.  **Fallback**: The UI should display the "Next Sequential Lesson" if the dynamic recommendation engine is unavailable.

### Data Privacy
Input vectors should be sanitized. Modules do not require PII (Personally Identifiable Information) to function—only performance metrics and identifiers.
