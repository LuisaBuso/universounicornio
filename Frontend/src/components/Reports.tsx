import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

const reports = [
  { id: 1, name: "Monthly Sales Report", date: "2023-06-01", downloads: 45 },
  { id: 2, name: "Customer Satisfaction Survey", date: "2023-05-15", downloads: 32 },
  { id: 3, name: "Product Performance Analysis", date: "2023-05-01", downloads: 28 },
  { id: 4, name: "Marketing Campaign Results", date: "2023-04-15", downloads: 37 },
]

export function Reports() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Reports</CardTitle>
        <CardDescription>Download and view your latest reports</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.downloads}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Download</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}