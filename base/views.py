from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder

# Create your views here.

def lobby(request):
    return render(request, 'base/lobby.html')

def room(request):
    return render(request, 'base/room.html')