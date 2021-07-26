from django.shortcuts import render
from django.http import HttpResponse

def api(request):
    return HttpResponse("received")

# Create your views here.
