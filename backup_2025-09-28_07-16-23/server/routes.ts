import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact messages routes
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Create contact message
      const message = await storage.createContactMessage(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Message envoyé avec succès",
        data: { id: message.id }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Données invalides", 
          errors: error.errors 
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Erreur serveur lors de l'envoi du message" 
        });
      }
    }
  });

  // Note: GET /api/contact endpoint removed for security reasons
  // In production, access to messages should be restricted to authenticated admins only

  const httpServer = createServer(app);

  return httpServer;
}
