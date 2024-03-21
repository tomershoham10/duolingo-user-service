import axios from "axios";

const getFirstLessonId = async (courseId: string): Promise<string> => {
    const res = await axios.get(`http://classes-service:8080/api/courses/getFirstLessonId/${courseId}`);
    return res.data;
}

export default getFirstLessonId;