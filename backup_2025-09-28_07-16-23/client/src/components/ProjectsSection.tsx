import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

export default function ProjectsSection() {
  // TODO: Remove mock data when integrating with real projects
  const projects = [
    {
      id: 1,
      title: "Application Web E-commerce",
      description:
        "Une boutique en ligne moderne avec panier, paiements sécurisés et interface administrateur. Développée avec React, Node.js et MongoDB.",
      image: "/assets/generated_images/Web_development_project_mockup_64ff6a15.png",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
      githubUrl: "https://github.com/username/ecommerce-app",
      demoUrl: "https://ecommerce-demo.example.com",
      category: "Web Development",
    },
    {
      id: 2,
      title: "App Mobile de Productivité",
      description:
        "Application mobile de gestion de tâches avec synchronisation cloud, notifications push et interface intuitive.",
      image: "/assets/generated_images/Mobile_app_project_mockup_1b8e6eb1.png",
      technologies: ["React Native", "Firebase", "Redux", "Expo"],
      githubUrl: "https://github.com/username/productivity-app",
      demoUrl: "https://productivity-app.example.com",
      category: "Mobile Development",
    },
    {
      id: 3,
      title: "Système de Design",
      description:
        "Création d'un système de design complet avec composants réutilisables, guide de style et documentation interactive.",
      image: "/assets/generated_images/Design_project_showcase_11df9141.png",
      technologies: ["Figma", "Storybook", "React", "TypeScript"],
      githubUrl: "https://github.com/username/design-system",
      demoUrl: "https://design-system.example.com",
      category: "UI/UX Design",
    },
  ];

  const openGithub = (url: string) => {
    console.log("Opening GitHub:", url);
    // window.open(url, '_blank');
  };

  const openDemo = (url: string) => {
    console.log("Opening demo:", url);
    // window.open(url, '_blank');
  };

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Mes Projets</h2>
            <p className="text-xl text-muted-foreground">
              Une sélection de mes réalisations récentes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group hover-elevate overflow-hidden"
                data-testid={`project-${project.id}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    data-testid={`img-project-${project.id}`}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop&auto=format";
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="text-xs">
                      {project.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle
                    className="text-lg font-semibold"
                    data-testid={`title-project-${project.id}`}
                  >
                    {project.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="outline"
                        className="text-xs"
                        data-testid={`tech-${project.id}-${techIndex}`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openGithub(project.githubUrl)}
                      className="flex-1"
                      data-testid={`button-github-${project.id}`}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => openDemo(project.demoUrl)}
                      className="flex-1"
                      data-testid={`button-demo-${project.id}`}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => console.log("View all projects")}
              data-testid="button-view-all-projects"
            >
              Voir tous mes projets
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
