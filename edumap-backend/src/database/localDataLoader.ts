import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedTerms: any[] | null = null;
let cachedCourses: any[] | null = null;
let cachedPrograms: any[] | null = null;

const loadJSON = (fileName: string): any[] => {
  const filePath = path.join(__dirname, '..', '..', 'data', fileName);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data;
  } catch (error) {
    console.warn(`Failed to load ${fileName}:`, error);
    return [];
  }
};

export const loadTermsData = (): any[] => {
  if (!cachedTerms) {
    cachedTerms = loadJSON('TermNodes.json');
  }
  return cachedTerms;
};

export const loadCoursesData = (): any[] => {
  if (!cachedCourses) {
    cachedCourses = loadJSON('CourseNodes.json');
  }
  return cachedCourses;
};

export const loadProgramsData = (): any[] => {
  if (!cachedPrograms) {
    cachedPrograms = loadJSON('Major&Programs.json');
  }
  return cachedPrograms;
};

export const getCourseById = (id: string): any | null => {
  const courses = loadCoursesData();
  return courses.find(course => course.id === id) || null;
};

export const getProgramByLabel = (label: string): any | null => {
  const programs = loadProgramsData();
  return programs.find(prog => prog.label === label) || null;
};

export const filterCoursesByList = (list: string): any[] => {
  const courses = loadCoursesData();
  return courses.filter(course => 
    course.data?.eligibleLists?.includes(list)
  );
};
