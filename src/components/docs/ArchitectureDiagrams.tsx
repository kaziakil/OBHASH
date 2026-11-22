"use client";

import React, { useState } from "react";

interface DiagramItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  category: "Ecosystem" | "Engines" | "Flows" | "Infrastructure";
  description: string;
  svgContent: React.ReactNode;
}

export function ArchitectureDiagrams() {
  const [activeDiagramId, setActiveDiagramId] = useState<string>("diag-01-ecosystem");

  const diagrams: DiagramItem[] = [
    {
      id: "diag-01-ecosystem",
      number: "01",
      title: "Overall OBHASH v2.0.0 Ecosystem",
      tagline: "One platform, five applications, six shared engines",
      category: "Ecosystem",
      description: "Visualizes the holistic OBHASH v2.0.0 ecosystem uniting 5 client-facing applications across 6 reusable foundational engines.",
      svgContent: (
        <svg viewBox="0 0 900 480" className="w-full h-auto text-xs font-mono select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Canvas */}
          <rect width="900" height="480" rx="16" fill="#111019" />
          
          {/* Outer Boundary: Five Applications */}
          <rect x="40" y="40" width="820" height="150" rx="12" fill="#171524" stroke="#5B3BFF" strokeWidth="2" strokeDasharray="4 4" />
          <text x="60" y="70" fill="#A594FD" fontWeight="bold" fontSize="13">LAYER 1: FIVE INTEGRATED APPLICATIONS (Simultaneous Development)</text>
          
          {/* App Cards */}
          <g>
            {/* App 1 */}
            <rect x="60" y="90" width="140" height="80" rx="8" fill="#201C30" stroke="#5B3BFF" strokeWidth="1" />
            <text x="75" y="115" fill="#FFFFFF" fontWeight="bold" fontSize="11">APP-01</text>
            <text x="75" y="132" fill="#D4D0EC" fontSize="10">Career</text>
            <text x="75" y="146" fill="#D4D0EC" fontSize="10">Readiness</text>
            <circle cx="185" cy="105" r="4" fill="#10B981" />

            {/* App 2 */}
            <rect x="220" y="90" width="140" height="80" rx="8" fill="#201C30" stroke="#5B3BFF" strokeWidth="1" />
            <text x="235" y="115" fill="#FFFFFF" fontWeight="bold" fontSize="11">APP-02</text>
            <text x="235" y="132" fill="#D4D0EC" fontSize="10">Creative</text>
            <text x="235" y="146" fill="#D4D0EC" fontSize="10">Development</text>
            <circle cx="345" cy="105" r="4" fill="#10B981" />

            {/* App 3 */}
            <rect x="380" y="90" width="140" height="80" rx="8" fill="#201C30" stroke="#5B3BFF" strokeWidth="1" />
            <text x="395" y="115" fill="#FFFFFF" fontWeight="bold" fontSize="11">APP-03</text>
            <text x="395" y="132" fill="#D4D0EC" fontSize="10">Critical</text>
            <text x="395" y="146" fill="#D4D0EC" fontSize="10">Thinking</text>
            <circle cx="505" cy="105" r="4" fill="#10B981" />

            {/* App 4 */}
            <rect x="540" y="90" width="140" height="80" rx="8" fill="#201C30" stroke="#5B3BFF" strokeWidth="1" />
            <text x="555" y="115" fill="#FFFFFF" fontWeight="bold" fontSize="11">APP-04</text>
            <text x="555" y="132" fill="#D4D0EC" fontSize="10">Lifelong</text>
            <text x="555" y="146" fill="#D4D0EC" fontSize="10">Learning</text>
            <circle cx="665" cy="105" r="4" fill="#10B981" />

            {/* App 5 */}
            <rect x="700" y="90" width="140" height="80" rx="8" fill="#201C30" stroke="#5B3BFF" strokeWidth="1" />
            <text x="715" y="115" fill="#FFFFFF" fontWeight="bold" fontSize="11">APP-05</text>
            <text x="715" y="132" fill="#D4D0EC" fontSize="10">Personal</text>
            <text x="715" y="146" fill="#D4D0EC" fontSize="10">Development</text>
            <circle cx="825" cy="105" r="4" fill="#10B981" />
          </g>

          {/* Inter-layer Connecting Lines */}
          <path d="M 450 190 L 450 240" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3 3" />
          <polygon points="445,235 450,245 455,235" fill="#8B5CF6" />

          {/* Lower Boundary: Six Shared Engines */}
          <rect x="40" y="245" width="820" height="190" rx="12" fill="#171524" stroke="#10B981" strokeWidth="2" />
          <text x="60" y="275" fill="#6EE7B7" fontWeight="bold" fontSize="13">LAYER 2: SIX REUSABLE OBHASH CORE ENGINES</text>

          {/* 6 Engine Cards */}
          <g>
            {/* Eng 1 */}
            <rect x="60" y="295" width="120" height="115" rx="8" fill="#1C2422" stroke="#10B981" strokeWidth="1" />
            <text x="70" y="320" fill="#FFFFFF" fontWeight="bold" fontSize="10">ENG-01</text>
            <text x="70" y="338" fill="#A7F3D0" fontSize="10">Human</text>
            <text x="70" y="352" fill="#A7F3D0" fontSize="10">Capability</text>
            <text x="70" y="380" fill="#6EE7B7" fontSize="9">Taxonomies</text>

            {/* Eng 2 */}
            <rect x="195" y="295" width="120" height="115" rx="8" fill="#1C2422" stroke="#10B981" strokeWidth="1" />
            <text x="205" y="320" fill="#FFFFFF" fontWeight="bold" fontSize="10">ENG-02</text>
            <text x="205" y="338" fill="#A7F3D0" fontSize="10">AI</text>
            <text x="205" y="352" fill="#A7F3D0" fontSize="10">Intelligence</text>
            <text x="205" y="380" fill="#6EE7B7" fontSize="9">Socratic L1-L3</text>

            {/* Eng 3 */}
            <rect x="330" y="295" width="120" height="115" rx="8" fill="#1C2422" stroke="#10B981" strokeWidth="1" />
            <text x="340" y="320" fill="#FFFFFF" fontWeight="bold" fontSize="10">ENG-03</text>
            <text x="340" y="338" fill="#A7F3D0" fontSize="10">Assessment</text>
            <text x="340" y="352" fill="#A7F3D0" fontSize="10">Engine</text>
            <text x="340" y="380" fill="#6EE7B7" fontSize="9">Verbatim Citations</text>

            {/* Eng 4 */}
            <rect x="465" y="295" width="120" height="115" rx="8" fill="#1C2422" stroke="#10B981" strokeWidth="1" />
            <text x="475" y="320" fill="#FFFFFF" fontWeight="bold" fontSize="10">ENG-04</text>
            <text x="475" y="338" fill="#A7F3D0" fontSize="10">Personal-</text>
            <text x="475" y="352" fill="#A7F3D0" fontSize="10">ization</text>
            <text x="475" y="380" fill="#6EE7B7" fontSize="9">Roadmaps</text>

            {/* Eng 5 */}
            <rect x="600" y="295" width="120" height="115" rx="8" fill="#1C2422" stroke="#10B981" strokeWidth="1" />
            <text x="610" y="320" fill="#FFFFFF" fontWeight="bold" fontSize="10">ENG-05</text>
            <text x="610" y="338" fill="#A7F3D0" fontSize="10">Learning &</text>
            <text x="610" y="352" fill="#A7F3D0" fontSize="10">Growth</text>
            <text x="610" y="380" fill="#6EE7B7" fontSize="9">Workspace</text>

            {/* Eng 6 */}
            <rect x="735" y="295" width="110" height="115" rx="8" fill="#1C2422" stroke="#10B981" strokeWidth="1" />
            <text x="745" y="320" fill="#FFFFFF" fontWeight="bold" fontSize="10">ENG-06</text>
            <text x="745" y="338" fill="#A7F3D0" fontSize="10">Evidence &</text>
            <text x="745" y="352" fill="#A7F3D0" fontSize="10">Analytics</text>
            <text x="745" y="380" fill="#6EE7B7" fontSize="9">5 Dimensions</text>
          </g>
        </svg>
      ),
    },
    {
      id: "diag-02-five-apps",
      number: "02",
      title: "Five-Application Architecture",
      tagline: "Specialized human capability development domains",
      category: "Ecosystem",
      description: "Illustrates the five application modules, their primary capability targets, and their shared connection to student profiles.",
      svgContent: (
        <svg viewBox="0 0 900 420" className="w-full h-auto text-xs font-mono select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="420" rx="16" fill="#111019" />
          
          {/* Center Hub */}
          <circle cx="450" cy="210" r="70" fill="#1F1B33" stroke="#5B3BFF" strokeWidth="3" />
          <text x="450" y="195" fill="#FFFFFF" fontWeight="bold" fontSize="12" textAnchor="middle">LEARNER</text>
          <text x="450" y="210" fill="#A594FD" fontSize="10" textAnchor="middle">Capability</text>
          <text x="450" y="225" fill="#A594FD" fontSize="10" textAnchor="middle">Identity</text>

          {/* Node 1: Career */}
          <rect x="80" y="60" width="180" height="80" rx="10" fill="#1F1C2E" stroke="#8B5CF6" strokeWidth="1.5" />
          <text x="95" y="85" fill="#FFFFFF" fontWeight="bold" fontSize="11">APP-01: Career Readiness</text>
          <text x="95" y="105" fill="#9CA3AF" fontSize="9">• Strategic workplace memos</text>
          <text x="95" y="120" fill="#9CA3AF" fontSize="9">• Stakeholder persuasion</text>
          <line x1="260" y1="120" x2="390" y2="175" stroke="#5B3BFF" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Node 2: Creative */}
          <rect x="640" y="60" width="180" height="80" rx="10" fill="#1F1C2E" stroke="#8B5CF6" strokeWidth="1.5" />
          <text x="655" y="85" fill="#FFFFFF" fontWeight="bold" fontSize="11">APP-02: Creative Dev</text>
          <text x="655" y="105" fill="#9CA3AF" fontSize="9">• Lateral constraint inversion</text>
          <text x="655" y="120" fill="#9CA3AF" fontSize="9">• Cross-domain biomimicry</text>
          <line x1="640" y1="120" x2="510" y2="175" stroke="#5B3BFF" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Node 3: Critical Thinking */}
          <rect x="40" y="270" width="200" height="80" rx="10" fill="#1F1C2E" stroke="#8B5CF6" strokeWidth="1.5" />
          <text x="55" y="295" fill="#FFFFFF" fontWeight="bold" fontSize="11">APP-03: Critical Thinking</text>
          <text x="55" y="315" fill="#9CA3AF" fontSize="9">• Advertorial claim dissection</text>
          <text x="55" y="330" fill="#9CA3AF" fontSize="9">• Confounding variable isolation</text>
          <line x1="240" y1="290" x2="390" y2="245" stroke="#5B3BFF" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Node 4: Lifelong Learning */}
          <rect x="660" y="270" width="200" height="80" rx="10" fill="#1F1C2E" stroke="#8B5CF6" strokeWidth="1.5" />
          <text x="675" y="295" fill="#FFFFFF" fontWeight="bold" fontSize="11">APP-04: Lifelong Learning</text>
          <text x="675" y="315" fill="#9CA3AF" fontSize="9">• Second-order inquiry trees</text>
          <text x="675" y="330" fill="#9CA3AF" fontSize="9">• Autonomous learning agility</text>
          <line x1="660" y1="290" x2="510" y2="245" stroke="#5B3BFF" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Node 5: Personal Dev (Bottom Center) */}
          <rect x="340" y="325" width="220" height="70" rx="10" fill="#1F1C2E" stroke="#8B5CF6" strokeWidth="1.5" />
          <text x="355" y="350" fill="#FFFFFF" fontWeight="bold" fontSize="11">APP-05: Personal Development</text>
          <text x="355" y="368" fill="#9CA3AF" fontSize="9">• Empathetic perspective-taking</text>
          <text x="355" y="382" fill="#9CA3AF" fontSize="9">• Metacognitive prior auditing</text>
          <line x1="450" y1="325" x2="450" y2="280" stroke="#5B3BFF" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      ),
    },
    {
      id: "diag-03-six-engines",
      number: "03",
      title: "Six-Engine Architecture",
      tagline: "The decoupled core infrastructure layer",
      category: "Engines",
      description: "Maps the internal subcomponents, inputs, and outputs of each of the six shared foundational engines.",
      svgContent: (
        <svg viewBox="0 0 900 450" className="w-full h-auto text-xs font-mono select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="450" rx="16" fill="#111019" />
          
          <rect x="40" y="30" width="250" height="175" rx="10" fill="#1A1828" stroke="#5B3BFF" strokeWidth="1.5" />
          <text x="55" y="55" fill="#A594FD" fontWeight="bold" fontSize="11">ENG-01: Human Capability</text>
          <text x="55" y="75" fill="#9CA3AF" fontSize="9">• Competency Ontology Registry</text>
          <text x="55" y="90" fill="#9CA3AF" fontSize="9">• Standardized 4-Tier Rubrics</text>
          <text x="55" y="105" fill="#9CA3AF" fontSize="9">• Prerequisite Graph Resolver</text>
          <text x="55" y="130" fill="#6EE7B7" fontSize="9">In: Pedagogical Definitions</text>
          <text x="55" y="145" fill="#6EE7B7" fontSize="9">Out: Indicator Schemas</text>

          <rect x="325" y="30" width="250" height="175" rx="10" fill="#1A1828" stroke="#5B3BFF" strokeWidth="1.5" />
          <text x="340" y="55" fill="#A594FD" fontWeight="bold" fontSize="11">ENG-02: AI Intelligence</text>
          <text x="340" y="75" fill="#9CA3AF" fontSize="9">• Socratic Orchestrator</text>
          <text x="340" y="90" fill="#9CA3AF" fontSize="9">• Progressive Hint Scaffolder (L1-L3)</text>
          <text x="340" y="105" fill="#9CA3AF" fontSize="9">• &lt;learner_context&gt; Envelope</text>
          <text x="340" y="130" fill="#6EE7B7" fontSize="9">In: Workspace Text + Hint Level</text>
          <text x="340" y="145" fill="#6EE7B7" fontSize="9">Out: Socratic Inquiry Questions</text>

          <rect x="610" y="30" width="250" height="175" rx="10" fill="#1A1828" stroke="#5B3BFF" strokeWidth="1.5" />
          <text x="625" y="55" fill="#A594FD" fontWeight="bold" fontSize="11">ENG-03: Assessment Engine</text>
          <text x="625" y="75" fill="#9CA3AF" fontSize="9">• Scenario Runner</text>
          <text x="625" y="90" fill="#9CA3AF" fontSize="9">• Automated Rubric Evaluator</text>
          <text x="625" y="105" fill="#9CA3AF" fontSize="9">• Verbatim Quote Extractor</text>
          <text x="625" y="130" fill="#6EE7B7" fontSize="9">In: Open-ended Deliverables</text>
          <text x="625" y="145" fill="#6EE7B7" fontSize="9">Out: Rubric Scores + Citations</text>

          <rect x="40" y="240" width="250" height="175" rx="10" fill="#1A1828" stroke="#10B981" strokeWidth="1.5" />
          <text x="55" y="265" fill="#6EE7B7" fontWeight="bold" fontSize="11">ENG-04: Personalization</text>
          <text x="55" y="285" fill="#9CA3AF" fontSize="9">• Journey Synthesizer</text>
          <text x="55" y="300" fill="#9CA3AF" fontSize="9">• Recommendation Algorithm</text>
          <text x="55" y="315" fill="#9CA3AF" fontSize="9">• Dynamic Pacing Manager</text>
          <text x="55" y="340" fill="#A594FD" fontSize="9">In: Baseline Gaps + Availability</text>
          <text x="55" y="355" fill="#A594FD" fontSize="9">Out: Multi-Week Roadmaps</text>

          <rect x="325" y="240" width="250" height="175" rx="10" fill="#1A1828" stroke="#10B981" strokeWidth="1.5" />
          <text x="340" y="265" fill="#6EE7B7" fontWeight="bold" fontSize="11">ENG-05: Learning & Growth</text>
          <text x="340" y="285" fill="#9CA3AF" fontSize="9">• 1500ms Autosave Synchronizer</text>
          <text x="340" y="300" fill="#9CA3AF" fontSize="9">• AI Telemetry Logger (A-E)</text>
          <text x="340" y="315" fill="#9CA3AF" fontSize="9">• Metacognitive Reflection Step</text>
          <text x="340" y="340" fill="#A594FD" fontSize="9">In: Keystrokes & Prompts</text>
          <text x="340" y="355" fill="#A594FD" fontSize="9">Out: Immutable Frozen Snapshots</text>

          <rect x="610" y="240" width="250" height="175" rx="10" fill="#1A1828" stroke="#10B981" strokeWidth="1.5" />
          <text x="625" y="265" fill="#6EE7B7" fontWeight="bold" fontSize="11">ENG-06: Evidence & Analytics</text>
          <text x="625" y="285" fill="#9CA3AF" fontSize="9">• 5 Independence Dimensions</text>
          <text x="625" y="300" fill="#9CA3AF" fontSize="9">• Level A/B Classifier</text>
          <text x="625" y="315" fill="#9CA3AF" fontSize="9">• Public Portfolio Server (/p/)</text>
          <text x="625" y="340" fill="#A594FD" fontSize="9">In: Submissions + Hint Telemetry</text>
          <text x="625" y="355" fill="#A594FD" fontSize="9">Out: Verifiable Public Portfolios</text>
        </svg>
      ),
    },
    {
      id: "diag-04-interoperability",
      number: "04",
      title: "Engine Interoperability Matrix",
      tagline: "Cross-engine data exchange & event coordination",
      category: "Engines",
      description: "Demonstrates how the six shared engines continuously exchange events and telemetry to maintain state synchronization.",
      svgContent: (
        <svg viewBox="0 0 900 400" className="w-full h-auto text-xs font-mono select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="400" rx="16" fill="#111019" />
          <text x="450" y="45" fill="#A594FD" fontWeight="bold" fontSize="13" textAnchor="middle">CROSS-ENGINE INTEROPERABILITY BUS</text>

          {/* Engine Nodes in Hexagonal Arrangement */}
          <rect x="100" y="80" width="180" height="60" rx="8" fill="#1F1C2E" stroke="#5B3BFF" strokeWidth="1.5" />
          <text x="190" y="115" fill="#FFFFFF" fontWeight="bold" fontSize="11" textAnchor="middle">ENG-01: Capability</text>

          <rect x="620" y="80" width="180" height="60" rx="8" fill="#1F1C2E" stroke="#5B3BFF" strokeWidth="1.5" />
          <text x="710" y="115" fill="#FFFFFF" fontWeight="bold" fontSize="11" textAnchor="middle">ENG-02: AI Intelligence</text>

          <rect x="50" y="220" width="180" height="60" rx="8" fill="#1F1C2E" stroke="#10B981" strokeWidth="1.5" />
          <text x="140" y="255" fill="#FFFFFF" fontWeight="bold" fontSize="11" textAnchor="middle">ENG-03: Assessment</text>

          <rect x="670" y="220" width="180" height="60" rx="8" fill="#1F1C2E" stroke="#10B981" strokeWidth="1.5" />
          <text x="760" y="255" fill="#FFFFFF" fontWeight="bold" fontSize="11" textAnchor="middle">ENG-04: Personalization</text>

          <rect x="180" y="320" width="180" height="60" rx="8" fill="#1F1C2E" stroke="#5B3BFF" strokeWidth="1.5" />
          <text x="270" y="355" fill="#FFFFFF" fontWeight="bold" fontSize="11" textAnchor="middle">ENG-05: Learning/Growth</text>

          <rect x="540" y="320" width="180" height="60" rx="8" fill="#1F1C2E" stroke="#10B981" strokeWidth="1.5" />
          <text x="630" y="355" fill="#FFFFFF" fontWeight="bold" fontSize="11" textAnchor="middle">ENG-06: Evidence/Analytics</text>

          {/* Central Connecting Bus Lines */}
          <line x1="280" y1="110" x2="620" y2="110" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="190" y1="140" x2="140" y2="220" stroke="#8B5CF6" strokeWidth="1.5" />
          <line x1="710" y1="140" x2="760" y2="220" stroke="#8B5CF6" strokeWidth="1.5" />
          <line x1="140" y1="280" x2="270" y2="320" stroke="#10B981" strokeWidth="1.5" />
          <line x1="760" y1="280" x2="630" y2="320" stroke="#10B981" strokeWidth="1.5" />
          <line x1="360" y1="350" x2="540" y2="350" stroke="#10B981" strokeWidth="2" />

          {/* Central Event Label */}
          <circle cx="450" cy="230" r="45" fill="#161421" stroke="#8B5CF6" strokeWidth="1.5" />
          <text x="450" y="225" fill="#E9D5FF" fontSize="9" textAnchor="middle">EVENT BUS</text>
          <text x="450" y="240" fill="#9CA3AF" fontSize="8" textAnchor="middle">Telemetry & State</text>
        </svg>
      ),
    },
    {
      id: "diag-05-app-dependencies",
      number: "05",
      title: "Application-to-Engine Dependencies",
      tagline: "Mapping how each app consumes the shared core",
      category: "Engines",
      description: "Trace matrix showing direct architectural dependencies from each of the five applications down into the six core engines.",
      svgContent: (
        <svg viewBox="0 0 900 380" className="w-full h-auto text-xs font-mono select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="380" rx="16" fill="#111019" />
          <text x="50" y="40" fill="#FFFFFF" fontWeight="bold" fontSize="12">APPLICATION &rarr; ENGINE CONSUMPTION MATRIX</text>
          
          {/* Header Row */}
          <text x="240" y="70" fill="#6EE7B7" fontSize="10">ENG-01 Cap</text>
          <text x="350" y="70" fill="#6EE7B7" fontSize="10">ENG-02 AI</text>
          <text x="460" y="70" fill="#6EE7B7" fontSize="10">ENG-03 Assess</text>
          <text x="570" y="70" fill="#6EE7B7" fontSize="10">ENG-04 Pers</text>
          <text x="680" y="70" fill="#6EE7B7" fontSize="10">ENG-05 Learn</text>
          <text x="790" y="70" fill="#6EE7B7" fontSize="10">ENG-06 Evid</text>

          {/* App Rows */}
          {/* Row 1: Career */}
          <text x="50" y="110" fill="#D4D0EC" fontSize="11">APP-01: Career Ready</text>
          <circle cx="265" cy="107" r="6" fill="#5B3BFF" />
          <circle cx="375" cy="107" r="6" fill="#5B3BFF" />
          <circle cx="485" cy="107" r="6" fill="#5B3BFF" />
          <circle cx="595" cy="107" r="6" fill="#5B3BFF" />
          <circle cx="705" cy="107" r="6" fill="#5B3BFF" />
          <circle cx="815" cy="107" r="6" fill="#5B3BFF" />

          {/* Row 2: Creative */}
          <text x="50" y="160" fill="#D4D0EC" fontSize="11">APP-02: Creative Dev</text>
          <circle cx="265" cy="157" r="6" fill="#5B3BFF" />
          <circle cx="375" cy="157" r="6" fill="#5B3BFF" />
          <circle cx="485" cy="157" r="6" fill="#5B3BFF" />
          <circle cx="595" cy="157" r="6" fill="#5B3BFF" />
          <circle cx="705" cy="157" r="6" fill="#5B3BFF" />
          <circle cx="815" cy="157" r="6" fill="#5B3BFF" />

          {/* Row 3: Critical Thinking */}
          <text x="50" y="210" fill="#D4D0EC" fontSize="11">APP-03: Critical Think</text>
          <circle cx="265" cy="207" r="6" fill="#5B3BFF" />
          <circle cx="375" cy="207" r="6" fill="#5B3BFF" />
          <circle cx="485" cy="207" r="6" fill="#5B3BFF" />
          <circle cx="595" cy="207" r="6" fill="#5B3BFF" />
          <circle cx="705" cy="207" r="6" fill="#5B3BFF" />
          <circle cx="815" cy="207" r="6" fill="#5B3BFF" />

          {/* Row 4: Lifelong Learning */}
          <text x="50" y="260" fill="#D4D0EC" fontSize="11">APP-04: Lifelong Learn</text>
          <circle cx="265" cy="257" r="6" fill="#5B3BFF" />
          <circle cx="375" cy="257" r="6" fill="#5B3BFF" />
          <circle cx="485" cy="257" r="6" fill="#5B3BFF" />
          <circle cx="595" cy="257" r="6" fill="#5B3BFF" />
          <circle cx="705" cy="257" r="6" fill="#5B3BFF" />
          <circle cx="815" cy="257" r="6" fill="#5B3BFF" />

          {/* Row 5: Personal Dev */}
          <text x="50" y="310" fill="#D4D0EC" fontSize="11">APP-05: Personal Dev</text>
          <circle cx="265" cy="307" r="6" fill="#5B3BFF" />
          <circle cx="375" cy="307" r="6" fill="#5B3BFF" />
          <circle cx="485" cy="307" r="6" fill="#5B3BFF" />
          <circle cx="595" cy="307" r="6" fill="#5B3BFF" />
          <circle cx="705" cy="307" r="6" fill="#5B3BFF" />
          <circle cx="815" cy="307" r="6" fill="#5B3BFF" />

          <text x="50" y="355" fill="#9CA3AF" fontSize="10">● All 5 applications simultaneously leverage all 6 shared engines through unified contracts.</text>
        </svg>
      ),
    },
    {
      id: "diag-06-system-layers",
      number: "06",
      title: "System Architecture (UI &rarr; API &rarr; Engines &rarr; DB)",
      tagline: "End-to-end layered runtime topology",
      category: "Infrastructure",
      description: "Visualizes the full-stack flow: Next.js 16 App Router UI &rarr; Server Actions & Zod API &rarr; Core TypeScript Engines &rarr; PostgreSQL RLS.",
      svgContent: (
        <svg viewBox="0 0 900 420" className="w-full h-auto text-xs font-mono select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="420" rx="16" fill="#111019" />
          
          {/* Layer 1: Browser */}
          <rect x="60" y="40" width="780" height="65" rx="8" fill="#1E1B2E" stroke="#5B3BFF" strokeWidth="1.5" />
          <text x="80" y="65" fill="#FFFFFF" fontWeight="bold" fontSize="11">CLIENT RUNTIME: Next.js 16 App Router (Turbopack) & React 19</text>
          <text x="80" y="85" fill="#A594FD" fontSize="9">Pages: /assessment/[slug], /journey, /coach/[sessionId], /workspace/[id], /growth/independence, /docs, /p/[slug]</text>

          <line x1="450" y1="105" x2="450" y2="135" stroke="#8B5CF6" strokeWidth="2" />

          {/* Layer 2: API & Actions */}
          <rect x="60" y="135" width="780" height="65" rx="8" fill="#1E1B2E" stroke="#5B3BFF" strokeWidth="1.5" />
          <text x="80" y="160" fill="#FFFFFF" fontWeight="bold" fontSize="11">APPLICATION & ACTION LAYER: Server Actions, RPC & API Routes</text>
          <text x="80" y="180" fill="#A594FD" fontSize="9">Zod Schema Validation, Cookie Session Auth (@supabase/ssr), /api/health, /api/docs/access</text>

          <line x1="450" y1="200" x2="450" y2="230" stroke="#8B5CF6" strokeWidth="2" />

          {/* Layer 3: Core Engines */}
          <rect x="60" y="230" width="780" height="65" rx="8" fill="#1B2421" stroke="#10B981" strokeWidth="1.5" />
          <text x="80" y="255" fill="#FFFFFF" fontWeight="bold" fontSize="11">ENGINE LAYER: Six Reusable TypeScript Core Engines</text>
          <text x="80" y="275" fill="#6EE7B7" fontSize="9">Human Capability, Socratic AI Intelligence, Rubric Evaluator, Personalization, Workspace, Independence</text>

          <line x1="450" y1="295" x2="450" y2="325" stroke="#10B981" strokeWidth="2" />

          {/* Layer 4: DB & AI */}
          <rect x="60" y="325" width="375" height="65" rx="8" fill="#1C1B24" stroke="#8B5CF6" strokeWidth="1.5" />
          <text x="75" y="350" fill="#FFFFFF" fontWeight="bold" fontSize="10">PERSISTENCE: Supabase PostgreSQL 15+</text>
          <text x="75" y="370" fill="#D4D0EC" fontSize="9">7 Migrations + Row Level Security + Fallback Store</text>

          <rect x="465" y="325" width="375" height="65" rx="8" fill="#1C1B24" stroke="#8B5CF6" strokeWidth="1.5" />
          <text x="480" y="350" fill="#FFFFFF" fontWeight="bold" fontSize="10">AI GATEWAY: Google Gemini 2.5 Flash</text>
          <text x="480" y="370" fill="#D4D0EC" fontSize="9">&lt;learner_context&gt; Envelope + Deterministic Engine</text>
        </svg>
      ),
    },
    {
      id: "diag-07-ai-flow",
      number: "07",
      title: "AI Processing & Intelligence Flow",
      tagline: "Prompt containment, Socratic refusal & hint tiers",
      category: "Flows",
      description: "Traces how student requests are sanitized, quarantined in prompt envelopes, evaluated by the Socratic rule engine, and delivered with progressive hints.",
      svgContent: (
        <svg viewBox="0 0 900 380" className="w-full h-auto text-xs font-mono select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="380" rx="16" fill="#111019" />
          <text x="50" y="40" fill="#A594FD" fontWeight="bold" fontSize="12">AI INTELLIGENCE ENGINE &amp; SOCRATIC SCAFFOLDING FLOW</text>

          {/* Step 1 */}
          <rect x="50" y="70" width="160" height="110" rx="8" fill="#1E1B2E" stroke="#5B3BFF" strokeWidth="1" />
          <text x="65" y="95" fill="#FFFFFF" fontWeight="bold" fontSize="10">1. Student Query</text>
          <text x="65" y="115" fill="#9CA3AF" fontSize="9">e.g. &ldquo;Give me the</text>
          <text x="65" y="130" fill="#9CA3AF" fontSize="9">answer to bias #2&rdquo;</text>
          <text x="65" y="155" fill="#A594FD" fontSize="8">From Workspace</text>

          <line x1="210" y1="125" x2="260" y2="125" stroke="#8B5CF6" strokeWidth="2" />

          {/* Step 2 */}
          <rect x="260" y="70" width="180" height="110" rx="8" fill="#1E1B2E" stroke="#5B3BFF" strokeWidth="1" />
          <text x="275" y="95" fill="#FFFFFF" fontWeight="bold" fontSize="10">2. Prompt Sanitizer</text>
          <text x="275" y="115" fill="#F87171" fontSize="9">Envelopes Input in</text>
          <text x="275" y="130" fill="#F87171" fontSize="9">&lt;learner_context&gt;</text>
          <text x="275" y="155" fill="#9CA3AF" fontSize="8">Blocks Jailbreaks</text>

          <line x1="440" y1="125" x2="490" y2="125" stroke="#8B5CF6" strokeWidth="2" />

          {/* Step 3 */}
          <rect x="490" y="70" width="180" height="110" rx="8" fill="#1B2421" stroke="#10B981" strokeWidth="1" />
          <text x="505" y="95" fill="#6EE7B7" fontWeight="bold" fontSize="10">3. Socratic Evaluator</text>
          <text x="505" y="115" fill="#9CA3AF" fontSize="9">Declines Direct Ans</text>
          <text x="505" y="130" fill="#9CA3AF" fontSize="9">Formulates Counter-</text>
          <text x="505" y="145" fill="#9CA3AF" fontSize="9">Question / Inquiry</text>

          <line x1="670" y1="125" x2="720" y2="125" stroke="#10B981" strokeWidth="2" />

          {/* Step 4 */}
          <rect x="720" y="70" width="140" height="110" rx="8" fill="#1B2421" stroke="#10B981" strokeWidth="1" />
          <text x="735" y="95" fill="#6EE7B7" fontWeight="bold" fontSize="10">4. Hint Tiering</text>
          <text x="735" y="115" fill="#A7F3D0" fontSize="9">L1: Nudge</text>
          <text x="735" y="130" fill="#A7F3D0" fontSize="9">L2: Structure</text>
          <text x="735" y="145" fill="#A7F3D0" fontSize="9">L3: Strategy</text>

          {/* Bottom Telemetry Loop */}
          <path d="M 790 180 L 790 280 L 130 280 L 130 180" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="4 4" />
          <rect x="350" y="255" width="220" height="50" rx="8" fill="#171524" stroke="#8B5CF6" strokeWidth="1" />
          <text x="460" y="278" fill="#FFFFFF" fontSize="10" textAnchor="middle">5. Telemetry Capture</text>
          <text x="460" y="295" fill="#D4D0EC" fontSize="8" textAnchor="middle">Logs Hint Level &rarr; Feeds Independence Engine</text>
        </svg>
      ),
    },
    {
      id: "diag-08-assessment-flow",
      number: "08",
      title: "Assessment & Personalization Flow",
      tagline: "Diagnostic evidence &rarr; dynamic roadmap synthesis",
      category: "Flows",
      description: "Shows how initial diagnostic baseline scores feed the Personalization Engine to generate adaptive multi-week journeys and milestone schedules.",
      svgContent: (
        <svg viewBox="0 0 900 360" className="w-full h-auto text-xs font-mono select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="360" rx="16" fill="#111019" />
          <text x="50" y="40" fill="#6EE7B7" fontWeight="bold" fontSize="12">DIAGNOSTIC ASSESSMENT &rarr; PERSONALIZED ROADMAP SYNTHESIS</text>

          {/* Step 1 */}
          <rect x="60" y="75" width="180" height="100" rx="8" fill="#1A1828" stroke="#5B3BFF" strokeWidth="1" />
          <text x="75" y="105" fill="#FFFFFF" fontWeight="bold" fontSize="10">1. Diagnostic Scenarios</text>
          <text x="75" y="125" fill="#9CA3AF" fontSize="9">Critical, Creative,</text>
          <text x="75" y="140" fill="#9CA3AF" fontSize="9">Curiosity Modules</text>

          <line x1="240" y1="125" x2="310" y2="125" stroke="#5B3BFF" strokeWidth="2" />

          {/* Step 2 */}
          <rect x="310" y="75" width="180" height="100" rx="8" fill="#1A1828" stroke="#5B3BFF" strokeWidth="1" />
          <text x="325" y="105" fill="#FFFFFF" fontWeight="bold" fontSize="10">2. Rubric Evaluation</text>
          <text x="325" y="125" fill="#9CA3AF" fontSize="9">Scores (1–4) +</text>
          <text x="325" y="140" fill="#9CA3AF" fontSize="9">Verbatim Citations</text>

          <line x1="490" y1="125" x2="560" y2="125" stroke="#5B3BFF" strokeWidth="2" />

          {/* Step 3 */}
          <rect x="560" y="75" width="280" height="100" rx="8" fill="#1B2421" stroke="#10B981" strokeWidth="1" />
          <text x="575" y="105" fill="#6EE7B7" fontWeight="bold" fontSize="10">3. Baseline Profile Aggregator</text>
          <text x="575" y="125" fill="#A7F3D0" fontSize="9">Maps Strengths &amp; Development Frontiers</text>
          <text x="575" y="140" fill="#A7F3D0" fontSize="9">Calculates Overall Capability Tier</text>

          {/* Step 4 Down */}
          <line x1="700" y1="175" x2="700" y2="230" stroke="#10B981" strokeWidth="2" />
          <polygon points="695,225 700,235 705,225" fill="#10B981" />

          <rect x="420" y="235" width="420" height="90" rx="8" fill="#1B2421" stroke="#10B981" strokeWidth="1" />
          <text x="435" y="260" fill="#6EE7B7" fontWeight="bold" fontSize="10">4. Personalization Engine (Roadmap Generator)</text>
          <text x="435" y="280" fill="#A7F3D0" fontSize="9">• Focus Areas &rarr; Goals &rarr; Milestones &rarr; Challenges</text>
          <text x="435" y="295" fill="#A7F3D0" fontSize="9">• Adapts target duration &amp; weekly commitment pacing</text>
        </svg>
      ),
    },
    {
      id: "diag-09-data-architecture",
      number: "09",
      title: "Data Architecture & Entity Streams",
      tagline: "PostgreSQL schemas, multi-tenant tables & immutable vaults",
      category: "Infrastructure",
      description: "Visualizes the relational entity relationships across profiles, assessments, journeys, coaching sessions, challenges, and portfolios.",
      svgContent: (
        <svg viewBox="0 0 900 420" className="w-full h-auto text-xs font-mono select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="420" rx="16" fill="#111019" />
          <text x="50" y="40" fill="#D4D0EC" fontWeight="bold" fontSize="12">POSTGRESQL RELATIONAL SCHEMA &amp; ROW LEVEL SECURITY</text>

          {/* Profiles */}
          <rect x="50" y="70" width="170" height="120" rx="8" fill="#1C1A2E" stroke="#5B3BFF" strokeWidth="1.5" />
          <text x="65" y="95" fill="#FFFFFF" fontWeight="bold" fontSize="10">profiles</text>
          <text x="65" y="115" fill="#9CA3AF" fontSize="8">id (UUID, PK, FK auth)</text>
          <text x="65" y="130" fill="#9CA3AF" fontSize="8">interests (TEXT[])</text>
          <text x="65" y="145" fill="#9CA3AF" fontSize="8">growth_intentions</text>
          <text x="65" y="160" fill="#9CA3AF" fontSize="8">age_bracket (18-30)</text>

          {/* Assessments */}
          <rect x="250" y="70" width="190" height="120" rx="8" fill="#1C1A2E" stroke="#5B3BFF" strokeWidth="1" />
          <text x="265" y="95" fill="#FFFFFF" fontWeight="bold" fontSize="10">assessment_evaluations</text>
          <text x="265" y="115" fill="#9CA3AF" fontSize="8">attempt_id (UUID)</text>
          <text x="265" y="130" fill="#9CA3AF" fontSize="8">dimension_scores (JSONB)</text>
          <text x="265" y="145" fill="#9CA3AF" fontSize="8">verbatim_citations</text>
          <text x="265" y="160" fill="#9CA3AF" fontSize="8">is_comparable (FALSE)</text>

          {/* Journeys */}
          <rect x="470" y="70" width="180" height="120" rx="8" fill="#1C1A2E" stroke="#5B3BFF" strokeWidth="1" />
          <text x="485" y="95" fill="#FFFFFF" fontWeight="bold" fontSize="10">growth_journeys</text>
          <text x="485" y="115" fill="#9CA3AF" fontSize="8">id (UUID, PK)</text>
          <text x="485" y="130" fill="#9CA3AF" fontSize="8">focus_areas (JSONB)</text>
          <text x="485" y="145" fill="#9CA3AF" fontSize="8">status (active/done)</text>
          <text x="485" y="160" fill="#9CA3AF" fontSize="8">target_duration</text>

          {/* Challenges */}
          <rect x="50" y="230" width="190" height="140" rx="8" fill="#1B2421" stroke="#10B981" strokeWidth="1" />
          <text x="65" y="255" fill="#6EE7B7" fontWeight="bold" fontSize="10">challenge_submissions</text>
          <text x="65" y="275" fill="#9CA3AF" fontSize="8">attempt_id (UUID)</text>
          <text x="65" y="290" fill="#9CA3AF" fontSize="8">deliverables (FROZEN)</text>
          <text x="65" y="305" fill="#9CA3AF" fontSize="8">sha256_checksum</text>
          <text x="65" y="320" fill="#9CA3AF" fontSize="8">word_count (INT)</text>

          {/* AI Assistance */}
          <rect x="270" y="230" width="200" height="140" rx="8" fill="#1B2421" stroke="#10B981" strokeWidth="1" />
          <text x="285" y="255" fill="#6EE7B7" fontWeight="bold" fontSize="10">ai_assistance_records</text>
          <text x="285" y="275" fill="#9CA3AF" fontSize="8">attempt_id (FK)</text>
          <text x="285" y="290" fill="#9CA3AF" fontSize="8">assistance_level (A-E)</text>
          <text x="285" y="305" fill="#9CA3AF" fontSize="8">hint_requests (INT)</text>
          <text x="285" y="320" fill="#9CA3AF" fontSize="8">user_refinement_ratio</text>

          {/* Portfolios */}
          <rect x="500" y="230" width="200" height="140" rx="8" fill="#1F1B33" stroke="#8B5CF6" strokeWidth="1.5" />
          <text x="515" y="255" fill="#E9D5FF" fontWeight="bold" fontSize="10">portfolios &amp; items</text>
          <text x="515" y="275" fill="#D4D0EC" fontSize="8">public_slug (/p/[slug])</text>
          <text x="515" y="290" fill="#D4D0EC" fontSize="8">is_published (BOOLEAN)</text>
          <text x="515" y="305" fill="#D4D0EC" fontSize="8">featured_items (JSONB)</text>
          <text x="515" y="320" fill="#D4D0EC" fontSize="8">ai_disclosures (TEXT)</text>
        </svg>
      ),
    },
    {
      id: "diag-10-deployment-cloud",
      number: "10",
      title: "Deployment & Cloud Architecture",
      tagline: "Vercel edge runtime, Supabase cluster & offline resilience",
      category: "Infrastructure",
      description: "Illustrates production hosting on Vercel Edge / Google Cloud Run, backed by Supabase PostgreSQL and automated offline fallbacks.",
      svgContent: (
        <svg viewBox="0 0 900 380" className="w-full h-auto text-xs font-mono select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="380" rx="16" fill="#111019" />
          <text x="50" y="40" fill="#FFFFFF" fontWeight="bold" fontSize="12">PRODUCTION DEPLOYMENT &amp; RUNTIME TOPOLOGY</text>

          {/* Cloud Boundary */}
          <rect x="50" y="70" width="480" height="260" rx="12" fill="#171524" stroke="#5B3BFF" strokeWidth="2" strokeDasharray="4 4" />
          <text x="70" y="95" fill="#A594FD" fontWeight="bold" fontSize="11">PRODUCTION CLOUD (Vercel / Cloud Run)</text>

          {/* Next.js Nodes */}
          <rect x="75" y="115" width="200" height="90" rx="8" fill="#1E1B2E" stroke="#5B3BFF" strokeWidth="1" />
          <text x="90" y="140" fill="#FFFFFF" fontWeight="bold" fontSize="10">Next.js 16.4 Engine</text>
          <text x="90" y="158" fill="#9CA3AF" fontSize="8">• SSR &amp; Partial Prefetching</text>
          <text x="90" y="172" fill="#9CA3AF" fontSize="8">• Edge Middleware Guard</text>

          <rect x="300" y="115" width="210" height="90" rx="8" fill="#1E1B2E" stroke="#5B3BFF" strokeWidth="1" />
          <text x="315" y="140" fill="#FFFFFF" fontWeight="bold" fontSize="10">AI Gateway Adapter</text>
          <text x="315" y="158" fill="#9CA3AF" fontSize="8">• Gemini 2.5 Flash API</text>
          <text x="315" y="172" fill="#9CA3AF" fontSize="8">• 25s AbortSignal Timeout</text>

          {/* Supabase DB */}
          <rect x="75" y="225" width="435" height="85" rx="8" fill="#1C2422" stroke="#10B981" strokeWidth="1.5" />
          <text x="90" y="250" fill="#6EE7B7" fontWeight="bold" fontSize="10">Supabase Managed PostgreSQL Cluster</text>
          <text x="90" y="268" fill="#A7F3D0" fontSize="8">• Multi-Tenant Row Level Security (RLS) Enforced</text>
          <text x="90" y="282" fill="#A7F3D0" fontSize="8">• Automated Daily Backups &amp; Point-in-Time Recovery</text>

          {/* Standby Node: Offline Continuity */}
          <rect x="560" y="70" width="290" height="260" rx="12" fill="#1B1926" stroke="#10B981" strokeWidth="2" />
          <text x="580" y="95" fill="#6EE7B7" fontWeight="bold" fontSize="11">OFFLINE / STANDBY RUNTIME</text>
          <text x="580" y="125" fill="#FFFFFF" fontSize="10">• In-Memory Local Stores</text>
          <text x="580" y="145" fill="#9CA3AF" fontSize="8">assessmentStore, journeyStore, coachStore</text>
          <text x="580" y="175" fill="#FFFFFF" fontSize="10">• Deterministic Rule Engine</text>
          <text x="580" y="195" fill="#9CA3AF" fontSize="8">Generates Socratic coaching &amp; evaluations</text>
          <text x="580" y="210" fill="#9CA3AF" fontSize="8">without commercial AI credentials</text>
          <text x="580" y="240" fill="#6EE7B7" fontSize="10">✓ 100% Zero-Crash Continuity</text>
          <text x="580" y="255" fill="#9CA3AF" fontSize="8">Guaranteed during live competition judging</text>
        </svg>
      ),
    },
  ];

  const activeDiag = diagrams.find((d) => d.id === activeDiagramId) || diagrams[0];

  return (
    <div className="space-y-6">
      {/* Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 print:hidden">
        {diagrams.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setActiveDiagramId(d.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeDiagramId === d.id
                ? "bg-[#5B3BFF] text-white shadow-sm shadow-[#5B3BFF]/20"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            <span className="font-mono text-[10px] opacity-70 mr-1.5">{d.number}</span>
            <span>{d.title.split("(")[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Diagram Viewer Card */}
      <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#161421] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#5B3BFF]">DIAGRAM {activeDiag.number}</span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <h4 className="font-extrabold text-base text-[#17151F] dark:text-white">{activeDiag.title}</h4>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{activeDiag.tagline}</p>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
            {activeDiag.category}
          </span>
        </div>

        {/* Render Scalable SVG */}
        <div className="rounded-2xl overflow-hidden border border-zinc-800/60 bg-[#111019] shadow-inner">
          {activeDiag.svgContent}
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed italic bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
          {activeDiag.description}
        </p>
      </div>
    </div>
  );
}
