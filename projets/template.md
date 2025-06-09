```python
# Exemple simplifié du code principal

import requests
from bs4 import BeautifulSoup
import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Configuration de l'authentification Spotify
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    redirect_uri="http://localhost:8888/callback",
    scope="playlist-modify-public"
))

# Récupération des titres de l'émission BBC
def get_bbc_tracks(episode_url):
    response = requests.get(episode_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    tracks = []
    
    for item in soup.select('.segment__track'):
        artist = item.select_one('.segment__artist').text.strip()
        title = item.select_one('.segment__title').text.strip()
        tracks.append({"artist": artist, "title": title})
    
    return tracks

# Recherche des titres sur Spotify et création de la playlist
def create_spotify_playlist(tracks, playlist_name):
    # Création ou récupération de la playlist
    user_id = sp.me()["id"]
    playlists = sp.user_playlists(user_id)
    playlist_id = None
    
    for playlist in playlists["items"]:
        if playlist["name"] == playlist_name:
            playlist_id = playlist["id"]
            break
    
    if not playlist_id:
        playlist = sp.user_playlist_create(user_id, playlist_name)
        playlist_id = playlist["id"]
    
    # Recherche et ajout des titres
    track_ids = []
    for track in tracks:
        query = f"track:{track['title']} artist:{track['artist']}"
        results = sp.search(q=query, type="track", limit=1)
        
        if results["tracks"]["items"]:
            track_id = results["tracks"]["items"][0]["id"]
            track_ids.append(track_id)
    
    if track_ids:
        sp.playlist_add_items(playlist_id, track_ids)
        print(f"Ajout de {len(track_ids)} titres à la playlist {playlist_name}")

# Utilisation du script
bbc_url = "https://www.bbc.co.uk/sounds/play/m001p8t7"  # URL de l'émission
playlist_name = "BBC 6 Music - Gilles Peterson (22/08/2023)"

tracks = get_bbc_tracks(bbc_url)
print(f"Titres trouvés : {len(tracks)}")
create_spotify_playlist(tracks, playlist_name)
```
# Utilisation du script
bbc_url = "https://www.bbc.co.uk/sounds/play/m001p8t7"  # URL de l'émission
playlist_name = "BBC 6 Music - Gilles Peterson (22/08/2023)"

tracks = get_bbc_tracks(bbc_url)
print(f"Titres trouvés : {len(tracks)}")
create_spotify_playlist(tracks, playlist_name)
```
