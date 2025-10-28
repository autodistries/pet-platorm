"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Clock, User, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  is_read: boolean
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/contact")
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string, is_read: boolean) => {
    try {
      const response = await fetch("/api/contact", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, is_read }),
      })

      if (response.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, is_read } : msg))
        )
        toast({
          title: "Succès",
          description: `Message marqué comme ${is_read ? "lu" : "non lu"}`,
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le message",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const unreadCount = messages.filter((msg) => !msg.is_read).length

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Messages de Contact</h1>
        <p className="text-muted-foreground">
          {messages.length} message(s) au total · {unreadCount} non lu(s)
        </p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucun message reçu pour le moment
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className={message.is_read ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {message.subject}
                      {!message.is_read && (
                        <Badge variant="default" className="ml-2">
                          Nouveau
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1">
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {message.name}
                      </span>
                      <span className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {message.email}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {new Date(message.created_at).toLocaleString("fr-FR")}
                      </span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead(message.id, !message.is_read)}
                  >
                    {message.is_read ? "Marquer comme non lu" : "Marquer comme lu"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{message.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
