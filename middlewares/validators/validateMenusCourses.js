export const menusCoursesValidation = (req, res, next) => {
    const {courses} = req.body;
    if (courses.length > 0) {
        let error = false;
        let param = '';
        for(let course of courses) {
            if (typeof course.courseName !== 'string') {
                error = true;
                param = 'courseName';
                break;
            }
            if (typeof course.courseType !== 'string') {
                error = true;
                param = 'courseType';
                break;
            }
        }
        if (error) {
            return res.status(400).send({
                message: `${param} can't be empty ad must be a string`,
                statusCode: 400
            });
        } else {
            next();
        }
        
    }
};