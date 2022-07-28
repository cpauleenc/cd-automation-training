const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    projectId: "",
    specPattern: "**/*.cy.js",
    env: {
      devKumuApi: "https://dev-api.kumuapi.com",
      devKumuLiveApi: "https://dev-liveapi-v8.kumu.live",
      PREFLIGHT_API_KEY:
        "NjU2NjJkNjItYTEyMi00NzU0LTk4MzUtM2Q1YjQ5MzE4YTE0OmI2NzU4NTNkLTk5ZWYtNDJlZC05ZjBjLWQ4MjI2NjMxYjlmOQ==",
      allureResultsPath: "allure-results",
      tmsPrefix: "https://url-to-bug-tracking-system/task-",
      issuePrefix: "https://url-to-tms/tests/caseId-",
    },
  },
});
