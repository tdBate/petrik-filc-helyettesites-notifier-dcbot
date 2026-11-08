
export interface ShortSubstitution {
    lessons: string;
    cohorts: string;
    date: string;
    time: string;
    classroom: string;
    teacher: string;
    subteacher: string;
    comment: string;
    group: string;
}

export interface ServerData {
    server_id: string;
    channel_id: string;
    cohort: string;
}

export interface ShortNews {
    title: string;
    content: string;
    time: Date;
}

export interface ShortMovedLesson {
    lessons: string;
    cohorts: string;
    group: string;
    date: Date;
    time: string;
    originalClassroom: string;
    newClassroom: string;
    teacher: string;
    comment: string;
}