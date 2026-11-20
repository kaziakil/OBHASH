# OBHASH User Experience Specification

**Phase:** 2 of 8 (User Experience & Onboarding)  
**Philosophy:** Human-Centered Intelligence  
**Design Baseline:** Calm, purposeful, accessible, high-contrast, responsive  

---

## 1. Design Philosophy

OBHASH rejects conventional AI application aesthetics:
- No generic chatbot floating avatars.
- No overloaded data metrics or artificial "gamification" streaks.
- No task outsourcing mechanisms.
- Clean typography with a bold typographic wordmark: **OBHASH**.
- Restrained color system: deep neutrals (`zinc-900`/`zinc-50`), purposeful indigo brand accent (`#4f46e5`), and distinct capability indicator accents.
- Responsive design tailored for mobile phones, tablets, laptops, and desktop screens.

---

## 2. Public Landing Page (`/`)

### 2.1 Navigation Bar
- **Brand Wordmark**: `OBHASH` with tagline `Human-Centered Intelligence`.
- **Anchor Navigation**: Philosophy, Approach, Capabilities, 7-Stage Journey.
- **CTAs**: Sign In (`/login`), Get Started (`/signup`).

### 2.2 Hero Section
- **Headline**: *Become more capable. Not more dependent.*
- **Subheadline**: An AI-powered personal growth platform that helps you strengthen your thinking, creativity, curiosity, and independence.
- **Primary CTA**: Get Started (`/signup`).
- **Secondary CTA**: Explore OBHASH (`#approach`).
- **Target Audience Indicator**: Ages 18–30.

### 2.3 The Problem: Cognitive Outsourcing
- Highlights the emerging risk of cognitive atrophy when users rely on generative AI to perform core thinking and decision-making for them.
- Positions OBHASH as a cognitive gym and sparring partner rather than an automated answering machine.

### 2.4 The OBHASH Approach
Presents five foundational pillars of Human-Centered Intelligence:
1. **Guided Development**: Frameworks prompting independent reasoning.
2. **Independent Thinking**: Grappling with ambiguity and questioning assumptions.
3. **Practical Challenges**: Applied micro-challenges expanding mental agility.
4. **Active Reflection**: Structured self-examination to consolidate lessons.
5. **Demonstrated Growth**: Independent capability measurement without AI assistance.

### 2.5 Focus Capabilities
1. **Critical Thinking**: Evaluating arguments, identifying cognitive biases, and formulating sound judgments.
2. **Creative Problem-Solving**: Divergent reasoning, unconventional framing, and inventive synthesis.
3. **Curiosity**: Active inquiry depth, open exploration, and cross-domain questioning.

### 2.6 The Seven-Stage Development Framework
1. **01 Assess**: Baseline strengths and frontiers.
2. **02 Explore**: Core multi-disciplinary concepts.
3. **03 Guide**: Socratic AI dialogue prioritizing questions over answers.
4. **04 Create**: Tackling open-ended challenges requiring original work.
5. **05 Reflect**: Articulating mental models and insights.
6. **06 Demonstrate**: Solo application without AI scaffolding.
7. **07 Track**: Verified growth consolidated into personal portfolio.

### 2.7 Closing CTA & Footer
- Re-emphasizes human agency: *"Your growth should be your own."*
- Footer contains navigation, copyright, and platform metadata.

---

## 3. Authentication Experience

- **Sign In (`/login`)**: Email, password with toggle, link to recovery, direct link to sign up.
- **Sign Up (`/signup`)**: Display name, email, password (minimum 8 characters), confirmation, and agreement to active thinking.
- **Password Recovery (`/forgot-password`)**: Clean email submission triggering recovery workflow.
- **Password Reset (`/reset-password`)**: Secured form for authenticated recovery sessions.
- **Graceful Unconfigured Mode**: In development environments without live Supabase credentials, forms display clear diagnostic instructions rather than crashing.

---

## 4. Onboarding Flow (`/onboarding`)

A 5-step conversational wizard designed to take under 3 minutes without intrusive personal data requests:
- **Step 1: Welcome**: Introduces Human-Centered Intelligence and expectations.
- **Step 2: Personal Introduction**: Captures preferred name and optional short bio.
- **Step 3: Exploration Interests**: Multi-select across 9 broad domains (Technology, Science, Arts, Entrepreneurship, Society, Education, Environment, Personal Development, Other).
- **Step 4: Growth Intentions**: Multi-select goals (Critical Thinking, Creative Problem-Solving, Curiosity, Self-Understanding, Independence, Possibilities) with an optional custom focus.
- **Step 5: Completion & Confirmation**: Summary review and single-click entry into the dashboard (`Enter OBHASH`).
- **Resilience**: State is mirrored in `sessionStorage` to prevent data loss on page refreshes or accidental backward navigation.

---

## 5. User Dashboard (`/dashboard`)

The authenticated home for users:
- **Welcome Banner**: Displays personalized greeting using preferred name and daily reflection prompt.
- **Next Step Card**: Directly prompts the user toward the upcoming Capability Assessment (Stage 01).
- **Phase 3 Preview Modal**: Controlled, accessible modal explaining assessment architecture without fabricating fake test questions or scores.
- **Capabilities Preview**: Real preview of Critical Thinking, Creative Problem-Solving, and Curiosity.
- **Journey Roadmap**: Visual timeline of all 7 stages with Stage 01 marked as active.
- **Profile Snapshot**: Displays account email, chosen interests, and growth intentions.
- **Sub-navigation**: Overview (live), My Journey (Coming Soon state), Growth Profile (Coming Soon state), Portfolio (Coming Soon state).

---

## 6. User Settings (`/settings`)

- **Profile Editing**: Editable display name, bio, and interface language (English default, Bangla preview).
- **Preference Management**: Interactive toggles to adjust interests and growth intentions.
- **Account Safeguards**: Read-only display of primary account email.
- **Account Actions**: One-click Sign Out invalidating session cookies.

---

## 7. Responsive Behavior

- **Mobile (<640px)**: Single-column flows, stacked buttons, full-width inputs, touch-friendly hit areas (minimum 44x44px).
- **Tablet (640px–1024px)**: 2-column grid cards, condensed navigation.
- **Desktop (>1024px)**: Full multi-column capabilities grid, expanded 7-stage horizontal journey view.
