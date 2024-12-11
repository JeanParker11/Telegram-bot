# config.py
from dotenv import load_dotenv
import os

# Charger le fichier .env
load_dotenv()

# Lire le token depuis la variable d'environnement
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

if not TELEGRAM_BOT_TOKEN:
    raise ValueError("Le token du bot est manquant. Vérifiez votre configuration.")
