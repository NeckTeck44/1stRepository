# Script pour ajouter une nouvelle carte projet avec vidéo
$content = Get-Content 'client\index.html' -Raw

$replacement = @"
        </article>
        <article class="project" onclick="window.open('https://github.com', '_blank')" style="cursor: pointer;">
          <div class="project-thumb">
            <iframe 
              src="https://www.youtube.com/embed/N3jkWM5zpN0?autoplay=1&mute=1&loop=1&playlist=N3jkWM5zpN0&controls=0&showinfo=0&rel=0&modestbranding=1" 
              style="width: 250%; height: 100%; object-fit: cover; border-radius: 8px;" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
          <div class="project-body">
            <h3 class="project-title">Application de Gestion de Tâches</h3>
            <p class="project-desc">Application web moderne de gestion de tâches avec drag & drop, notifications en temps réel,
              synchronisation cloud et interface utilisateur intuitive. Fonctionnalités avancées de productivité.</p>
            <div class="project-meta">
              <span>React</span><span>Node.js</span><span>MongoDB</span>
              <span>WebSocket</span><span>PWA</span>
              <span>Drag & Drop</span>
            </div>
          </div>
        </article>
      </div>
"@

$content = $content -replace '        </article>\s*      </div>', $replacement

$content | Set-Content 'client\index.html' -NoNewline

Write-Host "Nouvelle carte projet avec vidéo ajoutée avec succès!"
