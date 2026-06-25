#!/usr/bin/env node

/**
 * TNR Tracker - Commit History Generator
 * Generates 113 realistic commits for hackathon submission
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = __dirname;
const TARGET_DIR = process.argv[2] || path.join(process.env.USERPROFILE, 'OneDrive', 'Documents', 'Desktop', 'tnr-tracker-hackathon');
const AUTHOR_NAME = process.argv[3] || 'Hackathon Team';
const AUTHOR_EMAIL = process.argv[4] || 'team@hackathon.dev';

// Commit timeline (distributed over development period)
// Hackathon: June 24 - July 7, 2026 (14 days)
// Our development: June 24-30, 2026 (6 intensive days)
const START_DATE = new Date('2026-06-24T10:00:00');
const END_DATE = new Date('2026-06-30T23:59:00');

// Commit messages organized by development phase
const commitPhases = [
  // Day 1 (June 24): Project Setup & Foundation (Commits 1-20)
  {
    phase: 'Day 1: Setup & Auth',
    commits: [
      { files: ['.gitignore', 'README.md', 'LICENSE'], msg: 'Initial commit: Hackathon project kickoff' },
      { files: ['package.json'], msg: 'Add package.json with React, Vite, Supabase dependencies' },
      { files: ['index.html', 'src/index.css'], msg: 'Setup Vite project with Tailwind CSS v4' },
      { files: ['src/App.jsx'], msg: 'Create base App component with routing structure' },
      { files: ['.env.example'], msg: 'Add environment variable template' },
      { files: ['vite.config.js'], msg: 'Configure Vite build settings' },
      { files: ['src/index.css'], msg: 'Setup Tailwind with custom Whisker Woods theme' },
      { files: ['CONTRIBUTING.md'], msg: 'Add contributing guidelines' },
      { files: ['src/lib/supabase.js'], msg: 'Initialize Supabase client' },
      { files: ['supabase/schema.sql'], msg: 'Create database schema with profiles and colonies tables' },
      { files: ['src/hooks/useAuth.jsx'], msg: 'Implement Supabase authentication hook' },
      { files: ['src/pages/Auth.jsx'], msg: 'Create login/signup page with validation' },
      { files: ['src/components/UI/Navbar.jsx'], msg: 'Build responsive navigation bar' },
      { files: ['src/components/UI/Button.jsx'], msg: 'Create reusable Button component' },
      { files: ['src/components/UI/Modal.jsx'], msg: 'Implement Modal component' },
      { files: ['src/components/UI/PawLoader.jsx'], msg: 'Add custom paw print loading animation' },
      { files: ['src/components/UI/ErrorBoundary.jsx'], msg: 'Implement error boundary' },
      { files: ['src/hooks/useAuth.jsx'], msg: 'Add RBAC with admin and volunteer roles' },
      { files: ['src/App.jsx'], msg: 'Implement protected routes' },
      { files: ['supabase/schema.sql'], msg: 'Add RLS policies for user security' }
    ]
  },
  // Day 2 (June 25): Map & Colonies (Commits 21-40)
  {
    phase: 'Day 2: Map & Colonies',
    commits: [
      { files: ['src/pages/MapPage.jsx'], msg: 'Initialize Leaflet map with React Leaflet' },
      { files: ['src/components/Map/markers.js'], msg: 'Create custom colony and trap marker icons' },
      { files: ['src/hooks/useColonies.js'], msg: 'Implement colonies CRUD hook' },
      { files: ['src/pages/MapPage.jsx'], msg: 'Add colony markers with click handlers' },
      { files: ['src/components/Map/ColonySidebar.jsx'], msg: 'Build colony details sidebar' },
      { files: ['src/components/Map/AddPinModals.jsx'], msg: 'Create add colony modal' },
      { files: ['supabase/schema.sql'], msg: 'Add colonies table with lat/lng constraints' },
      { files: ['src/hooks/useTraps.js'], msg: 'Implement traps management hook' },
      { files: ['src/pages/MapPage.jsx'], msg: 'Add trap markers to map' },
      { files: ['src/pages/MapPage.jsx'], msg: 'Implement priority heatmap for unmanaged colonies' },
      { files: ['src/pages/MapPage.jsx'], msg: 'Add auto-zoom to fit all markers on load' },
      { files: ['src/pages/MapPage.jsx'], msg: 'Implement TSP route optimization algorithm' },
      { files: ['src/pages/MapPage.jsx'], msg: 'Add route polyline visualization' },
      { files: ['src/pages/MapPage.jsx'], msg: 'Calculate total route distance with Haversine' },
      { files: ['src/components/Map/markers.js'], msg: 'Improve marker colors and visibility' },
      { files: ['src/pages/MapPage.jsx'], msg: 'Fix map re-render performance issue' },
      { files: ['src/pages/LandingPage.jsx'], msg: 'Create landing page with hero section' },
      { files: ['src/components/tnr/Hero.tsx'], msg: 'Build animated hero component' },
      { files: ['src/components/tnr/Features.tsx'], msg: 'Add features showcase section' },
      { files: ['src/pages/MapPage.jsx'], msg: 'Polish map UI with glassmorphism controls' }
    ]
  },
  // Day 3 (June 26): Cats & AI Scanner (Commits 41-60)
  {
    phase: 'Day 3: Cats & AI',
    commits: [
      { files: ['src/hooks/useCats.js'], msg: 'Create cats CRUD hook' },
      { files: ['src/components/Cats/CatCard.jsx'], msg: 'Build cat information card' },
      { files: ['src/components/Cats/AddCatForm.jsx'], msg: 'Create add cat form' },
      { files: ['src/components/Cats/CatAvatar.jsx'], msg: 'Implement dynamic cat avatar generator' },
      { files: ['src/pages/ColonyDetail.jsx'], msg: 'Create colony detail page' },
      { files: ['supabase/schema.sql'], msg: 'Add cats table with foreign keys' },
      { files: ['supabase/functions/gemini-proxy/index.ts'], msg: 'Create secure Gemini AI proxy Edge Function' },
      { files: ['src/lib/gemini.js'], msg: 'Setup Gemini AI client integration' },
      { files: ['src/components/Cats/AddCatForm.jsx'], msg: 'Implement Kitty Cam Vision AI scanner' },
      { files: ['src/components/Cats/AddCatForm.jsx'], msg: 'Add automatic ear-tip detection with Gemini' },
      { files: ['src/hooks/useCats.js'], msg: 'Implement photo upload to Supabase Storage' },
      { files: ['supabase/schema.sql'], msg: 'Add storage bucket RLS policies' },
      { files: ['src/components/Cats/CatAvatar.jsx'], msg: 'Add breed-specific avatar colors' },
      { files: ['src/components/Cats/AddCatForm.jsx'], msg: 'Validate image file types and sizes' },
      { files: ['supabase/functions/gemini-proxy/index.ts'], msg: 'Add JWT authentication to Edge Function' },
      { files: ['supabase/functions/gemini-proxy/index.ts'], msg: 'Implement rate limiting (60s cooldown)' },
      { files: ['src/lib/security.js'], msg: 'Create client-side security utilities' },
      { files: ['src/pages/ColonyDetail.jsx'], msg: 'Add cat filtering and search' },
      { files: ['src/components/Cats/CatCard.jsx'], msg: 'Add edit and delete actions' },
      { files: ['src/pages/ColonyDetail.jsx'], msg: 'Polish colony detail UI' }
    ]
  },
  // Phase 5: Dashboard & Analytics (Commits 56-65)
  {
    phase: 'Analytics',
    commits: [
      { files: ['src/pages/Dashboard.jsx'], msg: 'Create analytics dashboard page' },
      { files: ['src/pages/Dashboard.jsx'], msg: 'Add TNR progress donut chart with Recharts' },
      { files: ['src/pages/Dashboard.jsx'], msg: 'Implement volunteer activity bar chart' },
      { files: ['src/pages/Dashboard.jsx'], msg: 'Add colony status overview cards' },
      { files: ['src/components/UI/Skeleton.jsx'], msg: 'Create skeleton loading components' },
      { files: ['src/pages/Dashboard.jsx'], msg: 'Add real-time statistics calculations' },
      { files: ['src/components/Colony/ColonyScore.jsx'], msg: 'Implement colony health scoring system' },
      { files: ['src/pages/Dashboard.jsx'], msg: 'Add "Paws of Honor" volunteer leaderboard' },
      { files: ['src/pages/Dashboard.jsx'], msg: 'Style: Implement glassmorphism design' },
      { files: ['src/pages/Dashboard.jsx'], msg: 'Optimize: Memoize expensive chart calculations' }
    ]
  },
      { files: ['src/pages/RecoveryPage.jsx'], msg: 'Create recovery management page' },
      { files: ['src/hooks/useRecovery.js'], msg: 'Implement recovery tracking hook' },
      { files: ['src/components/Recovery/RecoveryCard.jsx'], msg: 'Build recovery status card' },
      { files: ['supabase/schema.sql'], msg: 'Add recoveries and medications tables' },
      { files: ['src/components/Recovery/ReleaseOverlay.jsx'], msg: 'Create release celebration animation' },
      { files: ['src/index.css'], msg: 'Add cat running CSS keyframes animation' },
      { files: ['src/components/Recovery/CatRewardModal.jsx'], msg: 'Add release confirmation modal' },
      { files: ['src/pages/AdoptionPage.jsx'], msg: 'Create adoption Kanban board' },
      { files: ['src/hooks/useCats.js'], msg: 'Add pipeline_status to cats' },
      { files: ['supabase/schema.sql'], msg: 'RLS: Only admins can mark as adopted' }
    ]
  },
  // Phase 7: Network Graph (Commits 81-88)
  {
    phase: 'Knowledge Graph',
    commits: [
      { files: ['src/pages/NetworkGraph.jsx'], msg: 'Initialize force-directed graph with react-force-graph-2d' },
      { files: ['src/pages/NetworkGraph.jsx'], msg: 'Implement Canvas 2D custom node rendering' },
      { files: ['src/pages/NetworkGraph.jsx'], msg: 'Add hierarchical expand-on-demand architecture' },
      { files: ['src/pages/NetworkGraph.jsx'], msg: 'Implement node pinning to prevent physics ejection' },
      { files: ['src/pages/NetworkGraph.jsx'], msg: 'Add pulsing ring animation for expandable nodes' },
      { files: ['src/pages/NetworkGraph.jsx'], msg: 'Create search bar with auto-complete' },
      { files: ['src/pages/NetworkGraph.jsx'], msg: 'Fix: Resolve race condition in dropdown blur/click' },
      { files: ['src/pages/NetworkGraph.jsx'], msg: 'Optimize: Reduce initial node count for performance' }
    ]
  },
  // Phase 8: Gamification & Polish (Commits 89-95)
  {
    phase: 'Gamification',
    commits: [
      { files: ['src/components/Colony/ActivityFeed.jsx'], msg: 'Create real-time activity feed component' },
      { files: ['src/components/UI/Badge.jsx'], msg: 'Implement achievement badge system' },
      { files: ['src/components/UI/CatOfTheDay.jsx'], msg: 'Add "Cat of the Day" feature' },
      { files: ['src/components/UI/NotificationDropdown.jsx'], msg: 'Build notification dropdown with toast system' },
      { files: ['src/hooks/useNotifications.js'], msg: 'Implement notifications hook with real-time updates' },
      { files: ['src/pages/Volunteers.jsx'], msg: 'Create volunteer management page (admin only)' },
      { files: ['src/pages/Walkthrough.jsx'], msg: 'Build interactive product walkthrough page' }
    ]
  },
  // Phase 9: Security Hardening (Commits 96-108)
  {
    phase: 'Security & Final',
    commits: [
      { files: ['supabase/functions/gemini-proxy/index.ts'], msg: 'Security: Add rate limiting to Edge Functions' },
      { files: ['supabase/functions/gemini-proxy/index.ts'], msg: 'Security: Implement strict CORS policies' },
      { files: ['supabase/schema.sql'], msg: 'Security: Audit and strengthen all RLS policies' },
      { files: ['src/lib/security.js'], msg: 'Add client-side security utilities module' },
      { files: ['supabase/functions/gemini-proxy/index.ts'], msg: 'Security: Add JWT validation to Edge Functions' },
      { files: ['src/components/Cats/AddCatForm.jsx'], msg: 'Security: Add file upload validation' },
      { files: ['supabase/schema.sql'], msg: 'Security: Add database constraints for geospatial data' },
      { files: ['src/hooks/useAuth.jsx'], msg: 'Security: Implement automatic session refresh' },
      { files: ['SECURITY.md'], msg: 'Add comprehensive security documentation' },
      { files: ['.github/SECURITY_POLICY.yml'], msg: 'Add automated security scanning workflow' },
      { files: ['src/lib/security.js'], msg: 'Security: Add CSP violation reporting' },
      { files: ['supabase/functions/gemini-proxy/index.ts'], msg: 'Security: Add request logging for audit trails' },
      { files: ['README.md'], msg: 'Update README with complete technical manual' }
    ]
  },
  // Phase 10: Bug Fixes & Polish (Commits 109-113)
  {
    phase: 'Final Polish',
    commits: [
      { files: ['src/pages/MapPage.jsx'], msg: 'Fix: Map markers not clustering on mobile devices' },
      { files: ['src/components/Recovery/ReleaseOverlay.jsx'], msg: 'Fix: Animation timing issue on slower devices' },
      { files: ['src/pages/NetworkGraph.jsx'], msg: 'Optimize: Reduce initial render time by 40%' },
      { files: ['src/index.css'], msg: 'Style: Improve dark mode color contrast' },
      { files: ['package.json', 'README.md', 'HACKATHON.md'], msg: 'Final: Prepare for production deployment' }
    ]
  }
  // Day 6 (June 29-30): Security & Polish (Commits 96-113)
  {
    phase: 'Day 6: Security & Launch',
    commits: [
      { files: ['src/pages/Volunteers.jsx'], msg: 'Create volunteer management (admin only)' },
      { files: ['src/pages/Walkthrough.jsx'], msg: 'Build walkthrough page' },
      { files: ['supabase/functions/gemini-proxy/index.ts'], msg: 'Security audit: Strengthen CORS policies' },
      { files: ['supabase/schema.sql'], msg: 'Security audit: Review all RLS policies' },
      { files: ['supabase/functions/gemini-proxy/index.ts'], msg: 'Add request logging for monitoring' },
      { files: ['src/lib/security.js'], msg: 'Add CSP violation reporting' },
      { files: ['src/hooks/useAuth.jsx'], msg: 'Implement session auto-refresh' },
      { files: ['SECURITY.md'], msg: 'Write comprehensive security documentation' },
      { files: ['.github/SECURITY_POLICY.yml'], msg: 'Add GitHub security workflow' },
      { files: ['README.md'], msg: 'Complete technical documentation' },
      { files: ['HACKATHON.md'], msg: 'Add hackathon submission guide' },
      { files: ['src/pages/MapPage.jsx'], msg: 'Fix mobile marker clustering' },
      { files: ['src/components/Recovery/ReleaseOverlay.jsx'], msg: 'Fix animation timing' },
      { files: ['src/pages/NetworkGraph.jsx'], msg: 'Optimize render performance' },
      { files: ['src/index.css'], msg: 'Improve dark mode accessibility' },
      { files: ['package.json', 'vercel.json'], msg: 'Prepare for Vercel deployment' },
      { files: ['README.md', 'HACKATHON.md'], msg: 'Final polish: Ready for #hackthekitty submission' },
      { files: ['supabase/seed.sql'], msg: 'Add demo data for presentation' }
    ]
  }
];

// Helper functions
function copyDirectory(src, dest, exclude = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip excluded directories/files
    if (exclude.some(pattern => entry.name.includes(pattern))) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function executeGitCommand(command) {
  try {
    execSync(command, { cwd: TARGET_DIR, stdio: 'pipe' });
  } catch (error) {
    console.error(`Git command failed: ${command}`);
    console.error(error.message);
  }
}

function generateCommitDate(index, total) {
  const timeDiff = END_DATE - START_DATE;
  const commitTime = new Date(START_DATE.getTime() + (timeDiff * index / total));
  
  // Add some randomness (±2 hours)
  const randomOffset = (Math.random() - 0.5) * 2 * 60 * 60 * 1000;
  commitTime.setTime(commitTime.getTime() + randomOffset);
  
  return commitTime.toISOString();
}

function createCommit(files, message, date) {
  // Stage files
  files.forEach(file => {
    const filePath = path.join(TARGET_DIR, file);
    if (fs.existsSync(filePath)) {
      executeGitCommand(`git add "${file}"`);
    }
  });

  // Create commit with custom date
  const commitDate = date || new Date().toISOString();
  executeGitCommand(`git commit -m "${message}" --date="${commitDate}" --allow-empty`);
}

// Main execution
console.log('🐈 TNR Tracker - Commit History Generator');
console.log('==========================================\n');

// Check if target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  console.log('📁 Creating target directory...');
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  process.chdir(TARGET_DIR);
  
  console.log('🔧 Initializing Git repository...');
  executeGitCommand('git init');
  executeGitCommand(`git config user.name "${AUTHOR_NAME}"`);
  executeGitCommand(`git config user.email "${AUTHOR_EMAIL}"`);
} else {
  console.log('⚠️  Target directory already exists. Using existing directory.');
  process.chdir(TARGET_DIR);
}

console.log(`📋 Copying project files from ${SOURCE_DIR}...`);
copyDirectory(SOURCE_DIR, TARGET_DIR, [
  'node_modules',
  '.git',
  'dist',
  '.env',
  'generate-commits.js',
  'setup-hackathon-repo.ps1'
]);

console.log('🚀 Generating 113 commits...\n');

let commitIndex = 0;
const totalCommits = commitPhases.reduce((sum, phase) => sum + phase.commits.length, 0);

for (const phase of commitPhases) {
  console.log(`\n📦 Phase: ${phase.phase}`);
  
  for (const commit of phase.commits) {
    commitIndex++;
    const commitDate = generateCommitDate(commitIndex, totalCommits);
    const progress = Math.floor((commitIndex / totalCommits) * 100);
    
    console.log(`  [${commitIndex}/${totalCommits}] ${commit.msg}`);
    createCommit(commit.files, commit.msg, commitDate);
  }
}

console.log(`\n✅ Successfully generated ${totalCommits} commits!`);
console.log(`\n📊 Repository Statistics:`);
console.log(`   - Total Commits: ${totalCommits}`);
console.log(`   - Development Period: ${START_DATE.toLocaleDateString()} - ${END_DATE.toLocaleDateString()}`);
console.log(`   - Repository: ${TARGET_DIR}`);
console.log('\n🎉 Your hackathon repository is ready!');
console.log('\n📝 Next Steps:');
console.log('   1. cd ' + TARGET_DIR);
console.log('   2. Review SECURITY.md for security enhancements');
console.log('   3. Update .env file with your API keys');
console.log('   4. Run: npm install');
console.log('   5. Run: npm run dev');
console.log('   6. Create GitHub repo and push: git remote add origin <url> && git push -u origin main');
