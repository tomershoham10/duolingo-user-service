enum Permission {
    ADMIN = "admin",
    SENIOR = "senior", //S.R.
    MEDIUM = "medium", //bachir
    CREW = "crew",
}

interface UserType {
    userName: string;
    permission: Permission;
    password: string;
}
