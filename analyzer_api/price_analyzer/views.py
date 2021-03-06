from django.shortcuts import render
from django.http import HttpResponse
import json
from .price_search import priceSearch
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from price_analyzer.serializers import RequestSerializer

@api_view(['POST'])
def api(request):
    if request.method == "POST":
        serializer = RequestSerializer(data=request.data)
        print (serializer)
        if serializer.is_valid():
            price_data = priceSearch(serializer.data["gpu_name"])
            print (price_data)
            if not price_data:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(price_data)

# Create your views here.
