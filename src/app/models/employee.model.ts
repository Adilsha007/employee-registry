export interface Employee {
    id: number;
    name: string;
    role: string;
    startDate: Date;
    endDate: Date;
    employmentStatus: boolean;
}

export interface FormUpdate {
    controlName: string;
    value: Date | null;
}

export const Employee_Roles = [
    'Product Designer',
    'Flutter Developer',
    'QA Tester',
    'Product Owner',
    'Full-stack Developer',
    'Senior Software Developer'
]