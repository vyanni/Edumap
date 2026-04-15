import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const idToLabelMap: Record<string, string> = {
//   "009341": "SYDE 101", "012857": "SYDE 101L", "009342": "SYDE 102",
//   "008925": "SYDE 111", "008926": "SYDE 112", "013144": "SYDE 113",
//   "008928": "SYDE 114", "008929": "SYDE 121", "008933": "SYDE 161",
//   "008932": "SYDE 162", "008934": "SYDE 181", "008935": "SYDE 182",
//   "008938": "SYDE 192", "012858": "SYDE 192L", "009343": "SYDE 201",
//   "009344": "SYDE 202", "008939": "SYDE 211", "013145": "SYDE 212",
//   "008957": "SYDE 223", "008945": "SYDE 252", "012861": "SYDE 261",
//   "008958": "SYDE 262", "015792": "SYDE 263", "008950": "SYDE 283",
//   "008936": "SYDE 285", "008948": "SYDE 286", "008952": "SYDE 292",
//   "012859": "SYDE 292L", "009345": "SYDE 301", "009346": "SYDE 302",
//   "008954": "SYDE 312", "008943": "SYDE 322", "008961": "SYDE 334",
//   "008964": "SYDE 351", "008965": "SYDE 352", "012860": "SYDE 352L",
//   "008968": "SYDE 361", "008969": "SYDE 362", "008973": "SYDE 381",
//   "008949": "SYDE 383", "009347": "SYDE 401", "009348": "SYDE 402",
//   "013146": "SYDE 411", "008993": "SYDE 461", "008994": "SYDE 462",
//   "008981": "SYDE 522", "013383": "SYDE 531", "013382": "SYDE 532",
//   "009003": "SYDE 533", "010067": "SYDE 542", "009006": "SYDE 543",
//   "008988": "SYDE 544", "010066": "SYDE 548", "014290": "SYDE 552",
//   "009010": "SYDE 553", "012084": "SYDE 556", "008972": "SYDE 572",
//   "009016": "SYDE 575", "013384": "SYDE 584", "016273": "SYDE 599"
// };

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use Service Role to bypass RLS
);

// Helper to load JSON
const loadJSON = (fileName: string) => {
  const filePath = path.join(__dirname, '..', '..', 'data', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

async function seedDatabase() {
  console.log('🚀 Starting seed with exact JSON mapping...');

  try {
    // 1. CLEAR EXISTING
    await supabase.from('courses').delete().neq('id', '');
    await supabase.from('terms').delete().neq('id', '');
    await supabase.from('programs').delete().neq('label', '');

    // 2. SEED TERMS
    const termNodes = loadJSON('TermNodes.json');
    
    // Map directly to preserve JSON structure
    const { error: termError } = await supabase.from('terms').insert(termNodes);
    if (termError) throw termError;
    console.log('✅ Terms seeded');

    // 3. SEED COURSES
    const courseNodes = loadJSON('CourseNodes.json');
    const { error: courseError } = await supabase.from('courses').insert(courseNodes);
    if (termError) throw termError;
    if (courseError) throw courseError;
    console.log('✅ Courses seeded');

    // 4. SEED PROGRAMS
    const programsData = loadJSON('Major&Programs.json');
    const { error: progError } = await supabase.from('programs').insert(programsData);
    if (progError) throw progError;
    console.log('✅ Programs seeded');

  } catch (err) {
    console.error('❌ Seed failed:', err);
  }
}

seedDatabase();