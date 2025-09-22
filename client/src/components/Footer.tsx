import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">Portfolio Alegria</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Candidature pour la formation Alegria - Développement web moderne 
                et création d'expériences numériques innovantes.
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <h4 className="font-semibold">Navigation</h4>
              <nav className="space-y-2">
                {[
                  { id: 'hero', label: 'Accueil' },
                  { id: 'about', label: 'À Propos' },
                  { id: 'projects', label: 'Projets' },
                  { id: 'skills', label: 'Compétences' },
                  { id: 'contact', label: 'Contact' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const element = document.getElementById(item.id);
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
                    data-testid={`footer-link-${item.id}`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <h4 className="font-semibold">Me suivre</h4>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={openGithub} data-testid="footer-github">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={openLinkedin} data-testid="footer-linkedin">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={openEmail} data-testid="footer-email">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground text-sm">
                Disponible pour échanger sur ma candidature
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              © {currentYear} Portfolio Alegria. Fait avec <Heart className="h-3 w-3 text-red-500" /> pour la tech
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              data-testid="button-scroll-top"
            >
              Retour en haut ↑
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}