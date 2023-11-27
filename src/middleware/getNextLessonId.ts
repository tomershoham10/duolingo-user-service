import axios from "axios";

enum Permission {
    ADMIN = "admin",
    SEARIDER = "searider", //S.R.
    SENIOR = "senior", //bachir
    TEACHER = "teacher",
    CREW = "crew",
}

async function getNextLessonId(permission: Permission, pervLessonId?: string) {
    if (pervLessonId) {
        const nextLessonResponse = await axios.get(
            `http://classes-service:8080/api/levels/getNextLessonId/${pervLessonId}`,
        );
        const nextLessonId = nextLessonResponse.data.nextLessonId;
        console.log("getNextLessonId - nextLessonId", nextLessonId);
        return nextLessonId;
    }
    if (permission === Permission.ADMIN) return;
    const courseResponse = await axios.get(
        `http://classes-service:8080/api/courses/getByType/${permission}`,
    );
    if (courseResponse.status === 200) {
        const courseUnitsIds = courseResponse.data.course.units;
        const firstUnitId = courseUnitsIds[0];
        console.log("firstUnitId", firstUnitId);
        const unitResponse = await axios.get(
            `http://classes-service:8080/api/units/getLevelsById/${firstUnitId}`,
        );
        if (unitResponse.status === 200) {
            console.log("unitResponse", unitResponse, unitResponse.data);
            const unitsData = unitResponse.data;
            if (unitsData) {
                const firstLevelId = unitsData[0].levels[0];
                const levelResponse = await axios.get(
                    `http://classes-service:8080/api/levels/getById/${firstLevelId}`,
                );
                if (levelResponse) {
                    const firstLevel = levelResponse.data;
                    return firstLevel.lesssons[0];
                }
            }
        }
    };
}
export default getNextLessonId;

