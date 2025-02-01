"use client"

import { useState } from "react"
import { Share2 } from 'lucide-react'
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { toast } from "../hooks/use-toast"

export function ShareButton({ productId }: { productId: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [customMessage, setCustomMessage] = useState("")

  const handleShare = (method: string) => {
    // Implement sharing logic here
    let shareUrl = `https://rizosfelices.com/products/${productId}`
    if (customMessage) {
      shareUrl += `?message=${encodeURIComponent(customMessage)}`
    }

    switch (method) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link Copied!",
          description: "The product link has been copied to your clipboard.",
        })
        break
      case "qr":
        // Implement QR code generation logic here
        toast({
          title: "QR Code Generated",
          description: "The QR code for this product has been generated.",
        })
        break
      default:
        console.error("Invalid sharing method")
    }

    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <Share2 className="mr-2 h-5 w-5" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Product</DialogTitle>
          <DialogDescription>
            Choose how you want to share this product with your clients.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="custom-message">Custom Message (Optional)</Label>
            <Input
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personal note..."
            />
          </div>
          <Button onClick={() => handleShare("whatsapp")}>Share via WhatsApp</Button>
          <Button onClick={() => handleShare("copy")}>Copy Link</Button>
          <Button onClick={() => handleShare("qr")}>Generate QR Code</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}