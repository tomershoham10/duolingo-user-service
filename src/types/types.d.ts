enum Permission {
    ADMIN = "admin",
    SEARIDER = "searider", //S.R.
    SENIOR = "senior", //bachir
    TEACHER = "teacher",
    CREW = "crew",
}

interface UserType {
    id: string;
    tId?: string;
    userName: string;
    permission: Permission;
    password: string;
    nextLessonId: string;
}
