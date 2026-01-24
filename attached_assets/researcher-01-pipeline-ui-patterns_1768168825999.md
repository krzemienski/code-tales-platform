# Pipeline Visualization UI Patterns Research
**Date:** January 7, 2026
**Focus:** Visual patterns for multi-step processes with configuration options

---

## 1. Core Stepper/Wizard Patterns

### Horizontal vs Vertical Orientation
- **Horizontal steppers**: Best when step contents depend on earlier steps; ideal for desktop with linear flow
- **Vertical steppers**: Preferred for mobile, configuration workflows, and when space is constrained; supports collapsed view
- **Mobile variant**: Use dots, text progress (e.g., "2 of 5"), or minimal progress bars instead of full stepper

### Key Stepper Features (React/MUI Standard)
```
- Step indicators with numbered icons (1, 2, 3...)
- Step labels with optional descriptions
- Active/completed/disabled/error/optional step states
- Step validation before progression
- Keyboard navigation support
- Both linear (must complete sequentially) and non-linear (can jump) modes
```

**When to use steppers:**
- Multi-step forms, onboarding flows, configuration tasks
- Processes with clear sequential logic
- Single question/focus per step (reduces cognitive load)
- NOT ideal for non-sequential workflows (use tabs/cards instead)

---

## 2. Configurable Pipeline UI Patterns

### GitHub Actions Model
**Visualization approach:**
- DAG (directed acyclic graph) showing job dependencies
- Jobs as boxes; lines between boxes show dependencies
- Color-coded status: completed (green), in-progress (blue), skipped, failed (red)
- Step-by-step breakdown within each job (expandable)
- Real-time progress indicator showing step count (e.g., "Step 6 of 8")

**Key elements:**
- Job names prominently displayed
- Status icons left of job name
- Expandable sections for full step logs
- Live log viewer for debugging
- Job dependencies visualized as connecting lines

### Vercel Deployment Pipeline Model
**Visualization approach:**
- Linear sequential pipeline: Install → Build → Deploy
- Progress tracking for each stage with status indicators
- Deployment status at-a-glance with colored circles
- Activity logs timestamped with sources
- Branch deployment status visible from dashboard
- Logs grouped by stage with expandable sections

**Key elements:**
- Branch status shown at top level
- Build/deployment logs organized by stage
- Resources tab showing artifacts (middleware, static assets, functions)
- Redeploy/inspect/promote actions available per deployment

---

## 3. ML/LLM Pipeline Visualization Patterns

### Weights & Biases (W&B) Model
**Pipeline visualization:**
- Artifact lineage graph showing data flow through stages
- Tables view for structured dataset visualization
- Version tracking with artifact history
- Metrics and charts at each pipeline stage
- Custom dashboards for monitoring runs/experiments

**Stage display:**
- Component-based: separate stages for data download, cleaning, feature engineering, training
- Each component independently executable with status
- Artifacts versioned at each step
- Metrics logged for comparison across runs
- Hyperparameter visualization using parallel coordinates

### MLflow Approach
**Pipeline visualization:**
- Directed flow showing data/model transformations
- Manual promotion steps (e.g., promote model to production)
- Graph view and table view for pipeline overview
- Run comparison with sortable metrics
- Artifact dependencies tracked through pipeline

### LangSmith/LangFuse (LLM-focused)
**Trace visualization:**
- Hierarchical "run trees" showing function calls and their outputs
- Each node shows: inputs, outputs, latency, token usage
- Drill-down capability for debugging individual traces
- Real-time dashboards for cost, latency, performance
- Error tracking and custom alerts

---

## 4. Best Practices for Configuration & Expansion

### Expandable/Collapsible Sections
- **Default state**: Show summary, hide details (basic settings visible, advanced collapsed)
- **Click to expand**: Reveals full configuration, logs, parameters for each stage
- **Nested collapsibles**: Support multi-level hierarchy (job → step → log lines)
- **Visual indicators**: Chevron icons, subtle color changes on hover

### Configuration UI Patterns
- **Per-step options**: Form fields/dropdowns for configuring each pipeline stage
- **Live preview/validation**: Show errors before execution
- **Parameter inheritance**: Allow passing outputs from earlier stages as inputs to later stages
- **Disable/skip logic**: Mark stages as optional or conditionally execute based on earlier results

### Progress & Status Display
- **Status badges**: Pending → Running → Complete/Failed with appropriate colors
- **Progress bars**: For individual stages, overall completion percentage
- **Timestamp tracking**: Show start time, duration, end time for each stage
- **Live streaming logs**: Tail logs as pipeline executes
- **Error highlighting**: Distinguish failures with alerts, error codes, suggestion links

---

## 5. Component Architecture Patterns

### Recommended Structure
```
Pipeline Container (parent)
├── StepperIndicator (horizontal/vertical with state icons)
├── ConfigPanel
│   ├── StageForm (inputs specific to current stage)
│   ├── ValidationDisplay (inline errors)
│   └── ActionButtons (next, back, skip, execute)
├── StageDetails (expandable)
│   ├── StageConfig (what ran, with what params)
│   ├── StageMetrics (duration, tokens used, etc.)
│   └── StageOutput (logs, artifacts, results)
└── ProgressTracker (timeline of what ran when)
```

### Interactive Features
- **Hover states**: Show stage details on hover without expanding
- **Click actions**: Expand for full view, click badges for drill-down
- **Keyboard shortcuts**: Arrow keys to navigate, Enter to expand/collapse
- **Responsive collapse**: Auto-collapse other sections when one expands (optional)
- **Rerun/resume**: Allow re-executing individual stages without full restart

---

## 6. Visual Design Patterns

### Color Coding
- **Green**: Completed, success
- **Blue**: In-progress, active step
- **Gray**: Not yet started, skipped, disabled
- **Orange/Yellow**: Warning, partial completion
- **Red**: Failed, error state
- **Neutral**: Pending user action

### Typography & Spacing
- **Stage names**: Bold, 14-16px, distinct from descriptions
- **Status text**: Smaller, secondary color, below stage name
- **Connectors**: Thin lines (1-2px) between stages, subtle colors
- **Padding**: Generous spacing within expandable sections (prevent clutter)

### Micro-interactions
- **Smooth transitions**: Expand/collapse animations (200-300ms)
- **Hover feedback**: Subtle background color or border change
- **Loading states**: Pulse/spinner animations while executing
- **Toast notifications**: For stage completion, errors, user actions

---

## 7. Real-World Implementation Examples

### React Flow (Node-based)
- For complex, non-linear pipelines (DAGs with multiple paths)
- Custom node components for visual representation
- Drag-and-drop configuration
- Suitable for: workflow builders, no-code tools, complex transformations

### Material-UI Stepper
- Best for linear, form-based processes
- Built-in support for vertical/horizontal, mobile variants
- Easy integration with form validation libraries
- Suitable for: onboarding, multi-step forms, simple sequential pipelines

### Custom Implementation Approach
- Base component: Progress indicator (stepper or timeline)
- Configurable stages: Passed as data structure (name, description, optional flag)
- Expandable details: Use collapsible library (react-collapsed, MUI Accordion)
- Status display: Icon + text badge per stage
- Action buttons: Context-dependent (Execute, Skip, Rerun, etc.)

---

## 8. Patterns for AI/ML Pipeline-Specific Needs

### Stage Monitoring Features
- **Metrics dashboard**: Show KPIs at each stage (throughput, accuracy, latency)
- **Data statistics**: Row counts, distribution plots, drift detection
- **Model comparison**: Side-by-side metrics across pipeline runs
- **Artifact lineage**: Visual tree showing data transformation flow

### Configuration for AI Pipelines
- **Hyperparameter selectors**: Dropdown/slider for tuning at each stage
- **Model selection**: Choose model version, framework (TensorFlow vs PyTorch)
- **Data versioning**: Select which dataset version to use at load stage
- **Checkpoint management**: Restart from earlier stage if needed

### Error Recovery Patterns
- **Partial replay**: Re-run failed stage with same inputs
- **Manual intervention**: Pause for user review before continuing
- **Rollback suggestions**: Show previous successful run, offer to copy configs
- **Debugging mode**: Enable verbose logging, intermediate output export

---

## 9. Mobile-Responsive Considerations

- **Vertical stepper by default** on mobile (matches natural scroll direction)
- **Collapsed stage details** initially; swipe/tap to expand
- **Full-width cards** for each stage, avoid horizontal scroll
- **Touch-friendly buttons**: 44px+ tap targets
- **Simplified progress**: Use progress bar + text ("Step 2 of 5") instead of detailed icons

---

## 10. Accessibility Best Practices

- **ARIA labels**: Stage names, statuses, progress
- **Keyboard navigation**: Tab through stages, arrow keys for navigation
- **Color + icons**: Don't rely on color alone for status
- **Live regions**: Announce stage changes and progress updates
- **Focus management**: Clear focus indicators, logical tab order
- **Error messages**: In-line and associated with correct form field

---

## Summary: Recommended Architecture for Code Story Platform

For a **story generation pipeline with multiple stages** (content fetch → processing → generation → audio), consider:

1. **Horizontal stepper** at top showing: Fetch → Process → Generate → Audio (with status icons)
2. **Expandable stage cards** below, one per stage:
   - Stage title, status badge, duration
   - Hover to preview; click to expand details
   - Show configuration used, parameters, any errors
3. **Live progress within active stage**: Line-by-line logs, real-time metrics
4. **Rerun/configuration buttons** at bottom of each stage
5. **Overall progress bar** showing % complete

**Key differentiator**: Allow users to configure/customize each stage's parameters before execution, with live validation and preview.

---

## Unresolved Questions

- Should pipeline support conditional branching (e.g., skip audio generation if user opts out)?
- Do you want users to manually trigger each stage or auto-execute the pipeline?
- Should we show historical runs/logs for comparison across multiple story generations?
- What's the preferred layout: fixed/sticky stepper at top, or integrated with stage cards?
