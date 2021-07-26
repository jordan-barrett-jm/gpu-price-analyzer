from django.shortcuts import render
from django.http import HttpResponse
import json
from .price_search import priceSearch
from rest_framework.decorators import api_view
from rest_framework.response import Response
from price_analyzer.serializers import RequestSerializer

@api_view(['POST'])
def api(request):
    if request.method == "POST":
        serializer = RequestSerializer(data=request.data)
        if serializer.is_valid():
            print (serializer)
            price_data = priceSearch(serializer.data["gpu_name"])
            print (price_data)
            return Response(price_data)

# Create your views here.
