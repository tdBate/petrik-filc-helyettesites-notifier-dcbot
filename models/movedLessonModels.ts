export interface RootMovedLesson {
    classroom: MovedClassroom
    dayDefinition: DayDefinition
    lessons: Lesson[]
    movedLesson: MovedLesson
    period: Period2
}

export interface MovedClassroom {
    building_id: string
    capacity: any
    description: string
    id: string
    mapped: boolean
    name: string
    rotation: number
    short: string
    size_x: number
    size_y: number
    size_z: number
    storey: number
    type_id: any
    x: number
    y: number
}

export interface DayDefinition {
    createdAt: string
    days: string[]
    id: string
    name: string
    short: string
    updatedAt: string
}

export interface Lesson {
    classrooms: Classroom2[]
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

export interface Classroom2 {
    id: string
    name: string
    short: string
}

export interface Cohort {
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
    divisionTag?: string
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

export interface MovedLesson {
    comment: string
    date: string
    id: string
    room: string
    startingDay: string
    startingPeriod: string
}

export interface Period2 {
    createdAt: string
    endTime: string
    id: string
    period: number
    startTime: string
    updatedAt: string
}
