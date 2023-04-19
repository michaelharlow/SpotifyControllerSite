from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
from os import getenv
from dotenv import load_dotenv

#loads .env file
load_dotenv()
CLIENT_ID = getenv('CLIENT_ID')
CLIENT_SECRET = getenv('CLIENT_SECRET')
REDIRECT_URI = getenv('REDIRECT_URI')

BASE_URL = 'https://api.spotify.com/v1/me/'

def get_user_token(session_id):
  user_tokens = SpotifyToken.objects.filter(user=session_id)
  if user_tokens.exists():
    return user_tokens[0]
  else:
    return None

def update_or_create_user_token(session_id, access_token, token_type, expires_in, refresh):
  token = get_user_token(session_id)
  expires_in = timezone.now() + timedelta(seconds=expires_in)

  if token:
    token.token = access_token
    token.token_type = token_type
    token.expires_in = expires_in
    token.refresh = refresh
    token.save(update_fields=['access_token', 'token_type', 'expires_in', 'refresh'])
  else:
    token = SpotifyToken(user=session_id, token=access_token, token_type=token_type, expires_in=expires_in, refresh=refresh)
    token.save()

def is_spotify_authenticated(session_id):
  token = get_user_token(session_id)
  if token:
    if token.expires_in <= timezone.now():
      refresh_spotify_token(session_id)
    return True
  return False

def refresh_spotify_token(session_id):
  refresh_token = get_user_token(session_id).refresh
  response = post('https://accounts.spotify.com/api/token', data={
    'grant_type': 'refresh_token',
    'refresh_token': refresh_token,
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
  }).json()

  access_token = response.get('access_token')
  token_type = response.get('token_type')
  expires_in = response.get('expires_in')
  refresh_token = response.get('refresh_token')

  update_or_create_user_token(session_id, access_token, token_type, expires_in, refresh_token)

def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
  token = get_user_token(session_id)
  header = {'Content-Type': 'application/json', 'Authorization': "Bearer " + token.token}

  if post_:
    post(BASE_URL + endpoint, headers=header)
  elif put_:
    put(BASE_URL + endpoint, headers=header)
  else:
    response = get(BASE_URL + endpoint, {}, headers=header)
    try:
      return response.json()
    except:
      return {'Error': 'Issue with request'}