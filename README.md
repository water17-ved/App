JEE Tracker — Architecture Step 1

Mission Centre is the activity-entry layer. Main Hub remains the information/storage and viewing layer.

Step 1 behavior:
- Mission Centre's Log Today can record structured activities (subject, chapter/topic, type, questions, optional minutes).
- Saving the daily log automatically writes question activity into jee-daily-questions, which Main Hub already renders.
- If per-subject activity minutes are supplied, they are also added to jee-study-hours without inventing a subject allocation.
- The complete daily Mission Centre log remains in jee-ai-daily-logs for AI/history use.
- Main Hub listens for jee-daily-questions and jee-study-hours changes and refreshes its visible data automatically.
- No sample student/test data is added.
