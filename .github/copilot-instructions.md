# Copilot instructions

## Project workflow

- The app is self-contained in `index.html` and has no build step or external dependencies. Open that file directly in a browser; no server is required.
- There is no configured automated test, single-test, or lint command. For a manual smoke test, open `index.html`, start the quiz, try both a correct and incorrect answer, verify the score and feedback, complete all questions, and check the results screen. Scores of 8 or more show the laser celebration; a perfect score also shows the disco ball.

## Architecture

- `index.html` contains the document structure, all styling in one `<style>` block, the question bank, and all quiz behavior in one inline `<script>`.
- The `questions` array is the source of truth for quiz content. `renderWelcome`, `renderQuestion`, and `renderResults` replace the contents of `#app` to move between screens; `chooseAnswer` updates score, feedback, and answer state.
- Quiz state (`currentQuestion`, `score`, `answered`) is held in script-level variables. Event handlers are attached after each screen is rendered.
- CSS custom properties in `:root` define the light palette; `prefers-color-scheme: dark` overrides them. Responsive layout and animation/accessibility preferences are handled in CSS media queries.

## Codebase conventions

- Each question's `correct` value is a zero-based index into its `answers` array. Keep the answer order, index, and fact consistent when editing question data.
- Derive counts and progress from `questions.length`; result tiers and celebrations are score-based (8+ for lasers, all correct for the disco ball).
- Keep screen-specific markup in the existing render functions and bind its handlers after updating `#app`. The rendered quiz uses native buttons, a progress bar with ARIA values, live feedback, and explicit focus on the next action.
- Preserve the light/dark CSS variable scheme and `prefers-reduced-motion` behavior when adding visual changes. Decorative effects should not add noise to the accessible name or reading order.
