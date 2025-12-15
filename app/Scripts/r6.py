import sys
import json
import asyncio
import os
from siegeapi import Auth

async def main():
    try:
        # Arguments envoyés par Next.js
        # sys.argv[1] = username
        # sys.argv[2] = platform (uplay, psn, xbl)
        if len(sys.argv) < 2:
            print(json.dumps({"error": "Missing username"}))
            return

        username = sys.argv[1]
        platform = sys.argv[2] if len(sys.argv) > 2 else "uplay"

        # Sécurité : On récupère les identifiants depuis l'environnement Next.js
        email = os.environ.get("UBI_EMAIL")
        password = os.environ.get("UBI_PASSWORD")

        if not email or not password:
            print(json.dumps({"error": "Missing Ubisoft credentials in .env.local"}))
            return

        # Connexion
        auth = Auth(email, password)
        player = await auth.get_player(name=username, platform=platform)

        if not player:
            print(json.dumps({"error": "Player not found"}))
            await auth.close()
            return

        # Chargement des données lourdes (Ranked V2, Progression)
        await player.load_ranked_v2()
        await player.load_progress()
        
        # On calcule le Winrate proprement
        wr = 0
        if player.ranked_profile.wins + player.ranked_profile.losses > 0:
            wr = (player.ranked_profile.wins / (player.ranked_profile.wins + player.ranked_profile.losses)) * 100

        # Construction du JSON final pour le Frontend
        data = {
            "profile": {
                "username": player.name,
                "id": player.profile_id,
                "avatar": player.profile_pic_url_500,
                "level": player.level,
                "platform": platform
            },
            "rank_info": {
                "rank": {
                    "name": player.ranked_profile.rank,
                    "icon": player.ranked_profile.icon_url,
                    "mmr": player.ranked_profile.rank_points,
                    "max_rank": player.ranked_profile.max_rank,
                    "max_mmr": player.ranked_profile.max_rank_points
                },
                "kd": player.ranked_profile.kd,
                "winRate": f"{wr:.1f}%",
                "kills": player.ranked_profile.kills,
                "deaths": player.ranked_profile.deaths
            },
            "stats_general": {
                "kd": player.ranked_profile.kd, # On utilise le K/D ranked par défaut car plus pertinent
                "matches": player.ranked_profile.wins + player.ranked_profile.losses + player.ranked_profile.abandons,
                "winRate": f"{wr:.1f}%"
            }
        }
        
        # SORTIE STANDARD (C'est ça que Next.js va lire)
        print(json.dumps(data))
        
        await auth.close()

    except Exception as e:
        # En cas d'erreur Python, on renvoie un JSON d'erreur
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    asyncio.run(main())