import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const courses = [
  { id: 1, title: "Curso Basico", progress: 100, duration: "2 hours", link: "https://youtube.com/course1" },
  { id: 2, title: "Curso Avanzado", progress: 60, duration: "3 hours", link: "https://youtube.com/course2" },
  { id: 3, title: "Ebook Autocuidado Rizos", progress: 30, duration: "4 hours", link: "https://youtube.com/course3" },
  { id: 4, title: "Paquete Master Cortes y Tendencias", progress: 0, duration: "2 hours", link: "https://youtube.com/course4" },
];

export function CourseList() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Available Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {courses.map((course) => (
            <li key={course.id} className="border-t pt-4 first:border-t-0 first:pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">{course.duration}</p>
                </div>
                <a href={course.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="sm">
                    Start
                  </Button>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
