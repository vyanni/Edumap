export function MajorRequirements(){

}

/**
 * Major Requirements Format
 * "totalUnits": 21.63,
 * "CSE-C": 1,
 * "CSE": 2,
 * "SYDE-TE": 6,
 * "requiredCourses": [...allRequiredCourses]
 * 
 * OR for Science for example
 * "totalUnits": XYZ,
 * "HUMANITIES": D,
 * "SOCIAL-SCIENCE": C,
 * "PURE-SCIENCE": A,
 * "PURE-&-APPLIED-SCIENCE": B
 * "requiredCourses": [...allRequiredCourses]
 * 
 * Then merged with an option, specialization, minor...
 * "totalUnits": 21.63 (The extra modifiers shouldn't change total credits),
 * "CSE-C": 1,
 * "CSE": 2,
 * "SYDE-TE": 6,
 * "requiredCourses": [...allRequiredCourses + ...allExtraRequiredCourses]
 * 
 * Then added a variation of Honours, Joint Major, Double Degree, Co-op...
 * "totalUnits": ABC + (Honours Extra Credits Needed),
 * "CSE-C": 1,
 * "CSE": 2,
 * "SYDE-TE": 6,
 * "SECOND-DEGREE-LIST": Y
 * "PD": Z
 * "requiredCourses": [...allRequiredCourses + ...allExtraRequiredCourses + ...allSecondDegreeCourses]
 */