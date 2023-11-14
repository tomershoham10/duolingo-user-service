import axios from "axios";
import { Request, Response, NextFunction } from "express";

async function getFirstLessonFromCourse(req: Request, res: Response, next: NextFunction) {
    const userPermission = req.body.permission as Permission;
    if (userPermission === Permission.ADMIN) next();
    console.log("userPermission", userPermission);
    if (userPermission) {
        const courseResponse = await axios.get(
            `http://classes-service:8080/api/courses/getByType/${userPermission}`,
        );
        if (courseResponse.status === 200) {
            const courseUnits = courseResponse.data.course.units;
            const firstUnitId = courseUnits[0];
            console.log("firstUnitId", firstUnitId);
            const unitResponse = await axios.get(
                `http://classes-service:8080/api/units/getLevelsById/${firstUnitId}`,
            );
            if (unitResponse.status === 200) {
                console.log("unitResponse", unitResponse, unitResponse.data);
            }
        }
    }
}
export default getFirstLessonFromCourse

