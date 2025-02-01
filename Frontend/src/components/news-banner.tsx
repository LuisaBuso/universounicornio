import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

export function NewsBanner() {
  return (
    <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <CardHeader>
        <CardTitle>New Bonus Program!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Earn extra commissions on our new summer collection. Limited time offer!</p>
        <Button variant="secondary">Learn More</Button>
      </CardContent>
    </Card>
  )
}

