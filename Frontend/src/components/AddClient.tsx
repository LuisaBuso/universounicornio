import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { UserPlus } from 'lucide-react'

interface AddClientProps {
  onClose: () => void;
}

export function AddClient({ onClose }: AddClientProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [hairType, setHairType] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('New client:', { name, email, phone, address, hairType })
    alert('New client added successfully')
    onClose()
  }

  return (
    <Card className="bg-[#2C2C2C] border-0">
      <CardHeader>
        <CardTitle>Add New Client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter client's name"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter client's email"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter client's phone number"
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter client's address"
            />
          </div>
          <div>
            <Label htmlFor="hairType">Hair Type</Label>
            <Input
              id="hairType"
              value={hairType}
              onChange={(e) => setHairType(e.target.value)}
              placeholder="Enter client's hair type"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}