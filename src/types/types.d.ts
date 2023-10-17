enum Permission {
    ADMIN = "admin",
    SENIOR = "senior", //S.R.
    MEDIUM = "medium", //bachir
    CREW = "crew",
}

interface UserType {
    id: string;
    userName: string;
    permission: Permission;
    password: string;
}
