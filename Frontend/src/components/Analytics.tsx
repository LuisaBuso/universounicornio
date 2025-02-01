import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

const data = [
  { name: "Jan", visits: 2000, sales: 1500 },
  { name: "Feb", visits: 2200, sales: 1700 },
  { name: "Mar", visits: 2500, sales: 2000 },
  { name: "Apr", visits: 2800, sales: 2300 },
  { name: "May", visits: 3000, sales: 2500 },
  { name: "Jun", visits: 3200, sales: 2800 },
]

export function Analytics() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Website Traffic</CardTitle>
          <CardDescription>Number of visits vs sales over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="visits" fill="#8884d8" name="Visits" />
              <Bar dataKey="sales" fill="#82ca9d" name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>Percentage of visitors who made a purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
            <CardDescription>Average amount spent per transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$75.50</div>
            <p className="text-xs text-muted-foreground">+$2.40 from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}