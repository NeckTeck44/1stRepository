import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Code, Palette, Server, Database, Smartphone, Globe } from "lucide-react";

export default function SkillsSection() {
  // TODO: Remove mock data when integrating with real skills data
  const skillCategories = [
    {
      title: "Frontend",
      icon: <Globe className="h-5 w-5" />,
      skills: [
        { name: "React", level: 85 },
        { name: "TypeScript", level: 80 },
        { name: "JavaScript", level: 90 },
        { name: "HTML/CSS", level: 95 },
        { name: "Tailwind CSS", level: 88 }
      ]
    },
    {
      title: "Backend",
      icon: <Server className="h-5 w-5" />,
      skills: [
        { name: "Node.js", level: 75 },
        { name: "Express", level: 70 },
        { name: "Python", level: 65 },
        { name: "API REST", level: 80 }
      ]
    },
    {
      title: "Base de données",
      icon: <Database className="h-5 w-5" />,
      skills: [
        { name: "MongoDB", level: 70 },
        { name: "PostgreSQL", level: 60 },
        { name: "Firebase", level: 75 }
      ]
    },
    {
      title: "Mobile",
      icon: <Smartphone className="h-5 w-5" />,
      skills: [
        { name: "React Native", level: 70 },
        { name: "Expo", level: 75 }
      ]
    },
    {
      title: "Design",
      icon: <Palette className="h-5 w-5" />,
      skills: [
        { name: "Figma", level: 85 },
        { name: "UI/UX Design", level: 78 },
        { name: "Design Systems", level: 80 }
      ]
    },
    {
      title: "Outils",
      icon: <Code className="h-5 w-5" />,
      skills: [
        { name: "Git/GitHub", level: 90 },
        { name: "VS Code", level: 95 },
        { name: "Docker", level: 60 },
        { name: "Webpack", level: 65 }
      ]
    }
  ];

  const softSkills = [
    "Résolution de problèmes",
    "Apprentissage autonome",
    "Travail en équipe",
    "Communication",
    "Créativité",
    "Adaptabilité",
    "Gestion du temps",
    "Esprit critique"
  ];

  const getSkillColor = (level: number) => {
    if (level >= 80) return "bg-green-500";
    if (level >= 60) return "bg-blue-500";
    return "bg-yellow-500";
  };

  return (
    <section id="skills" className="py-24 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Compétences</h2>
            <p className="text-xl text-muted-foreground">
              Mes compétences techniques et humaines
            </p>
          </div>

          {/* Technical Skills */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {skillCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="hover-elevate" data-testid={`skill-category-${categoryIndex}`}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="text-primary">{category.icon}</div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2" data-testid={`skill-${categoryIndex}-${skillIndex}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getSkillColor(skill.level)}`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Soft Skills */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center">Compétences Transversales</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {softSkills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-4 py-2 text-sm hover-elevate cursor-default"
                  data-testid={`soft-skill-${index}`}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Learning Goals */}
          <div className="mt-16 text-center space-y-4">
            <h3 className="text-2xl font-semibold">Objectifs d'apprentissage avec Alegria</h3>
            <div className="max-w-3xl mx-auto">
              <p className="text-muted-foreground leading-relaxed">
                Je souhaite approfondir mes connaissances en architecture logicielle, 
                découvrir les frameworks modernes, maîtriser les bonnes pratiques de développement 
                et acquérir une méthodologie professionnelle pour devenir un développeur accompli.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}