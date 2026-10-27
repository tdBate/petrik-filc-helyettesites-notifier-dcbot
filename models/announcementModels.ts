
export interface RootNews {
    author: Author;
    authorId: string;
    content: Content[];
    createdAt: string;
    id: string;
    title: string;
    updatedAt: string;
    validFrom: string;
    validUntil: string;
    cohortIds: any[];
}

export interface Author {
    id: string;
    image: any;
    name: string;
}

export interface Content {
    type: string;
    content: string;
}
