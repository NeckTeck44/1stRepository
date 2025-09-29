// Test simple pour vérifier si la clé API Google Gemini fonctionne
const testGeminiAPI = async () => {
  const API_KEY = 'AIzaSyDj5qAn4i7k3y9NdALFGJWzztsl91TkvY8';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  const testRequest = {
    contents: [{
      role: "user",
      parts: [{
        text: "Bonjour, réponds simplement 'test OK'"
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 10,
    }
  };

  try {
    console.log('Test de la clé API Google Gemini...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest)
    });

    console.log('Statut HTTP:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erreur API:', response.status, errorData);
      return false;
    }

    const data = await response.json();
    console.log('Réponse API:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0]) {
      console.log('✅ La clé API fonctionne!');
      console.log('Réponse test:', data.candidates[0].content.parts[0].text);
      return true;
    } else {
      console.log('❌ Format de réponse inattendu');
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur réseau ou autre:', error);
    return false;
  }
};

testGeminiAPI();
