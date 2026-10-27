export interface RootSubstitution {
    lessons: Lesson[];
    substitution: Substitution;
    teacher: Teacher2;
}

export interface Lesson {
    classrooms: Classroom[]
    cohorts: Cohort[]
    day: Day
    groups: Group[]
    groupsIds: string[]
    id: string
    period: Period
    periodsPerWeek: number
    subject: Subject
    teachers: Teacher[]
    termDefinitionId: string
    weekDefinition: WeekDefinition
    weeksDefinitionId: string
}

export interface Cohort {
    id: string;
    name: string;
    short: string;
}

export interface Classroom {
    id: string
    name: string
    short: string
}

export interface Day {
    createdAt: string
    days: string[]
    id: string
    name: string
    short: string
    updatedAt: string
}

export interface Group {
    divisionTag: string
    entireClass: boolean
    id: string
    name: string
}

export interface Period {
    endTime: string
    id: string
    period: number
    startTime: string
}

export interface Subject {
    id: string
    name: string
    short: string
}

export interface Teacher {
    id: string
    name: string
    short: string
}

export interface WeekDefinition {
    id: string
    name: string
    short: string
    weeks: string[]
}

export interface Substitution {
    comment: string
    date: string
    id: string
    substituter: string
}

export interface Teacher2 {
    email: string
    firstName: string
    gender: any
    id: string
    lastName: string
    short: string
    userId: string
}
