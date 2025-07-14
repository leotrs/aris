---
description: "Generate a Product Requirements Document (PRD) for a feature"
allowed-tools: Read(*:*), Glob(*:*), Grep(*:*), Task(*:*), Write(*:*), Bash(*:*)
thinking-mode: ultra-hard
---

# PRD Generator

Generate a comprehensive Product Requirements Document for a new feature and save it to a markdown file.

**Usage:**
- `/prd <feature-name>` - Generate PRD for the specified feature

Please analyze the current codebase structure and create a PRD for the feature: **$ARGUMENTS**

The PRD will be saved to `.claude/prds/prd-$ARGUMENTS.md` (with spaces replaced by hyphens).

Use this format:

# Product Requirements Document: $ARGUMENTS

## 1. Executive Summary
**Feature Name:** $ARGUMENTS
**Priority:** [High/Medium/Low]
**Effort Estimate:** [X days/weeks]
**Developer:** [Individual]

Brief 2-3 sentence description of what this feature does and why it's important.

## 2. Problem & Solution
### Current State
- What is the current situation?
- What pain points exist?
- What limitations do users face?

### Desired State
- What should the experience be like after this feature?
- How will this solve the identified problems?
- What assumptions are we making?

## 3. User Analysis
### Assumed Personas
- **Primary User Type:** [Description of main user]
  - Goals: What they want to accomplish
  - Pain Points: Current frustrations
  - Context: When/where they use the feature

- **Secondary User Type:** [If applicable]
  - Goals, pain points, context

### User Scenarios
- **Scenario 1:** [Primary use case walkthrough]
- **Scenario 2:** [Secondary or edge case]

## 4. Scope Definition
### Features Included
- **Core Feature 1:** Brief description
- **Core Feature 2:** Brief description
- **Supporting Feature:** Brief description

### Features Explicitly Excluded
- **Out of Scope 1:** What we're NOT building and why
- **Out of Scope 2:** Future consideration items

### User Stories
- **As a [user type], I want [goal] so that [benefit]**
- **As a [user type], I want [goal] so that [benefit]**
- **As a [user type], I want [goal] so that [benefit]**

## 5. Technical Requirements
### Frontend Requirements
- Component changes needed
- New UI elements
- State management considerations
- Routing changes

### Backend Requirements
- API endpoints needed
- Database schema changes
- Business logic requirements
- Performance considerations

### System Component Impact Analysis
#### Database (Critical)
- Schema changes required?
- New tables or columns needed?
- Migration strategy
- Performance impact on queries

#### Marketing Website (High)
- Feature announcements needed?
- Documentation updates required?
- Landing page modifications?

#### Dev Container (Medium)
- New dependencies to install?
- Environment variable changes?
- Docker configuration updates?

#### CI Configuration (Medium)
- New test suites required?
- Build process modifications?
- Deployment pipeline changes?

#### Infrastructure (Low-Medium)
- Server resource requirements?
- Monitoring/alerting updates?
- Security configuration changes?

### Integration Points
- How does this feature connect with existing systems?
- Any third-party services needed?

## 6. Acceptance Criteria
### Functional Requirements
- [ ] Feature performs core functionality as specified
- [ ] All user stories are implementable and testable
- [ ] Error handling works for invalid inputs
- [ ] Data validation prevents incorrect submissions

### User Experience Requirements
- [ ] Interface is intuitive and follows existing design patterns
- [ ] Loading states provide clear feedback to users
- [ ] Responsive design works on desktop and mobile
- [ ] Navigation flows are logical and efficient

### Technical Requirements
- [ ] Performance meets acceptable standards (load times, response times)
- [ ] Security requirements are implemented
- [ ] Database queries are optimized
- [ ] Code follows existing project conventions

### Test Scenarios
- [ ] **Happy Path:** [Primary user flow works end-to-end]
- [ ] **Edge Case 1:** [Specific boundary condition testing]
- [ ] **Edge Case 2:** [Error condition handling]
- [ ] **Integration:** [Feature works with existing systems]

### Manual Validation Steps
- [ ] User can complete primary task without confusion
- [ ] Feature feels integrated with existing application
- [ ] No broken functionality in related features

## 7. Implementation Plan
### Phase 1 (MVP)
- Core functionality
- Basic user experience
- Essential technical requirements

### Phase 2 (Enhancements)
- Additional features
- Polish and optimization
- Advanced user experience

### Dependencies
- Other features or systems that must be completed first
- Third-party services or infrastructure requirements
- External blockers or decisions needed

### Technical Risks
- Implementation challenges
- Performance concerns
- Integration complexity
- Mitigation strategies for each risk

### Testing Strategy
- Unit tests for core logic
- Integration tests for API endpoints
- E2E tests for user workflows
- Manual testing checklist

## 8. Open Questions
### Design Decisions
- [ ] Question 1: [Specific decision needed]
- [ ] Question 2: [Alternative approaches to consider]

### Technical Decisions
- [ ] Question 3: [Implementation approach uncertainty]
- [ ] Question 4: [Technology or library choices]

### User Experience Decisions
- [ ] Question 5: [User flow or interaction uncertainty]
- [ ] Question 6: [Edge case handling approach]

---

**Next Steps:**
1. Review and refine this PRD with stakeholders
2. Break down implementation into specific tasks
3. Estimate effort and timeline
4. Begin development phase

**Instructions:**
1. Use ultra hard thinking mode throughout the entire execution
2. Analyze the codebase thoroughly using available tools
3. Generate the complete PRD following the template above
4. Create the `.claude/prds/` directory if it doesn't exist
5. Write the final PRD to `.claude/prds/prd-[feature-name-with-hyphens].md`
6. Confirm the file was written successfully