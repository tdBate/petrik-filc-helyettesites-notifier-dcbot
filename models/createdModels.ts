
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
