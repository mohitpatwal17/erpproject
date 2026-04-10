/**
 * @typedef {('ADMIN' | 'FACULTY' | 'STUDENT')} Role
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {Role} role
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} Student
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} rollNumber
 * @property {string} course
 * @property {number} semester
 * @property {string} phone
 * @property {string} address
 * @property {string} dob
 * @property {string} guardianName
 * @property {string} guardianPhone
 * @property {number} attendancePercentage
 * @property {('PAID' | 'DUE' | 'OVERDUE')} feeStatus
 * @property {number} totalFees
 * @property {number} paidFees
 */

/**
 * @typedef {Object} Faculty
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} department
 * @property {string} designation
 * @property {string} qualification
 * @property {string} joiningDate
 * @property {string[]} subjects
 */

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {string} description
 * @property {number} credits
 * @property {string} department
 * @property {number} semester
 */

/**
 * @typedef {Object} Announcement
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} date
 * @property {string} author
 * @property {Role | 'ALL'} targetAudience
 * @property {('HIGH' | 'MEDIUM' | 'LOW')} priority
 */

// Export empty objects if any code imports them as values
export const Role = {};
export const Student = {};
export const Faculty = {};
export const Course = {};
export const Announcement = {};
