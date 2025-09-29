import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Target, Rocket } from "lucide-react";

export default function AboutSection() {
  // TODO: Remove mock data when integrating with real data
  const motivations = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Passion pour la Tech",
      description: "Une fascination constante pour les nouvelles technologies et leur impact sur notre quotidien."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Excellence Technique",
      description: "La recherche de la perfection dans chaque ligne de code et chaque projet réalisé."
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Innovation Continue",
      description: "L'envie de créer des solutions qui transforment les idées en réalités numériques."
    }
  ];

  const experiences = [
    "Autoformation en développement web moderne",
    "Projets personnels avec React, Node.js et TypeScript",
    "Participation à des hackathons et événements tech",
    "Contribution à des projets open source"
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">À Propos</h2>
            <p className="text-xl text-muted-foreground">
              Mon parcours et ma motivation pour rejoindre Alegria
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Story */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Mon Histoire</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Passionné par la technologie depuis mon plus jeune âge, j'ai découvert 
                  le développement web en autodidacte. Cette passion m'a mené à explorer 
                  différents langages et frameworks, toujours avec l'envie d'apprendre 
                  et de créer.
                </p>
                <p>
                  Aujourd'hui, je souhaite transformer cette passion en expertise 
                  professionnelle grâce à la formation Alegria. Je suis convaincu que 
                  cette opportunité m'apportera les compétences techniques et la 
                  méthodologie nécessaires pour exceller dans ce domaine.
                </p>
                <p>
                  Mon objectif est de devenir un développeur full-stack capable de 
                  concevoir et réaliser des applications web modernes, robustes et 
                  centrées sur l'expérience utilisateur.
                </p>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Mon Parcours</h3>
              <div className="space-y-4">
                {experiences.map((experience, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3"
                    data-testid={`experience-${index}`}
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{experience}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Motivations */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center">Pourquoi Alegria ?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {motivations.map((motivation, index) => (
                <Card key={index} className="hover-elevate" data-testid={`motivation-${index}`}>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mx-auto">
                      {motivation.icon}
                    </div>
                    <h4 className="font-semibold">{motivation.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {motivation.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Badge variant="secondary" className="px-6 py-2 text-base">
              Prêt à transformer ma passion en profession
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}