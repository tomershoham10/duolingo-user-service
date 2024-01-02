enum PermissionsTypes {
    ADMIN = "admin",
    TEACHER = "teacher",
    CREW = "crew",
    STUDENT = "student"
}

interface UserType {
    _id: string;
    tId?: string;
    userName: string;
    permission: PermissionsTypes;
    password: string;
    courseId?: string;
    nextLessonId?: string;
}
