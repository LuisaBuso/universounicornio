import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"

const notifications = [
  { id: 1, title: "New Order Received", description: "Order #1234 has been placed", time: "2 minutes ago" },
  { id: 2, title: "Low Stock Alert", description: "Product XYZ is running low on stock", time: "1 hour ago" },
  { id: 3, title: "Customer Review", description: "New 5-star review for Product ABC", time: "3 hours ago" },
  { id: 4, title: "Payment Processed", description: "Payment for Order #5678 has been processed", time: "Yesterday" },
]

export function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
        <CardDescription>Stay updated with the latest activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-4">
              <div className="bg-blue-500 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                <p className="text-sm text-gray-500">{notification.description}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}