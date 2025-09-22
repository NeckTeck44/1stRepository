import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
// Use a direct public path under /attached_assets so you can drop in your own image file without changing code
const profileImage = "/attached_assets/generated_images/Professional_portrait_photo_dd714e73.png";

export default function HeroSection() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openGithub = () => {
    console.log('GitHub profile opened');
    // window.open('https://github.com/username', '_blank');
  };

  const openLinkedin = () => {
    console.log('LinkedIn profile opened');
    // window.open('https://linkedin.com/in/username', '_blank');
  };

  const openEmail = () => {
    console.log('Email client opened');
    // window.location.href = 'mailto:contact@example.com';
  };

  return (
    <section id="hero" className="min-h-screen flex items-center py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-5">
                <h1 className="text-6xl md:text-7xl font-serif font-extrabold leading-tight tracking-tight">
                  Bonjour, je suis
                  <span className="block text-primary">Candidat Alegria</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Développeur passionné par la création d'expériences numériques innovantes, 
                  candidat motivé pour rejoindre la formation Alegria et développer mes compétences 
                  en développement moderne.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={scrollToAbout} data-testid="button-discover-more">
                  Découvrir mon parcours
                  <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={openEmail} data-testid="button-contact">
                  Me contacter
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-4">
                <Button variant="ghost" size="icon" onClick={openGithub} data-testid="button-github">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={openLinkedin} data-testid="button-linkedin">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="flex justify-center lg:justify-end">
              <Card className="p-8 max-w-sm hover-elevate border shadow-xl">
                <div className="space-y-4">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden">
                    <img
                      src={profileImage}
                      alt="Portrait professionnel"
                      className="w-full h-full object-cover"
                      data-testid="img-profile"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=512&h=512&fit=crop&auto=format";
                      }}
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">Candidat Formation</h3>
                    <p className="text-muted-foreground">Alegria - Promotion 2025</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}